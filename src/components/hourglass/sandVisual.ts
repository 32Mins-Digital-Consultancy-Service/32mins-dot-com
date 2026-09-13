import * as THREE from "three";
import type { GranularSand } from "./physics";

/** Per-frame blend toward the solver position for grains at rest in a pile. */
const REST_SMOOTHING = 0.5;

/**
 * Fine sand: one small camera-facing sphere per physical grain, drawn in a
 * single instanced draw with positions streamed through an attribute. All
 * grains are golden sand; grains buried deep in a pile darken (contact AO).
 */
export class SandVisual extends THREE.Group {
  private readonly physics: GranularSand;
  private readonly texture: THREE.CanvasTexture;
  private readonly grains: THREE.InstancedMesh;
  private readonly positions: THREE.InstancedBufferAttribute;
  /** Exposure 0..1 per grain (1 = on the surface, 0 = buried). */
  private readonly exposureAttribute: THREE.InstancedBufferAttribute;
  private readonly smoothed: Float32Array;
  private primed = false;

  constructor(physics: GranularSand) {
    super();
    this.physics = physics;
    const count = physics.count;
    this.smoothed = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = ((i * 2654435761) >>> 0) / 4294967296;
    }

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("2D canvas unavailable");
    const disc = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    disc.addColorStop(0, "rgba(255,255,255,1)");
    disc.addColorStop(0.82, "rgba(255,255,255,1)");
    disc.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = disc;
    context.fillRect(0, 0, 64, 64);
    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    // Slightly over the collision diameter so resting piles close up solid.
    const size = physics.d * 1.12;
    const geometry = new THREE.PlaneGeometry(size, size);
    this.positions = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    this.positions.setUsage(THREE.DynamicDrawUsage);
    this.exposureAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count), 1);
    this.exposureAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("grainPos", this.positions);
    geometry.setAttribute("grainSeed", new THREE.InstancedBufferAttribute(seeds, 1));
    geometry.setAttribute("exposure", this.exposureAttribute);

    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      color: 0xffffff,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      depthWrite: true,
      toneMapped: false,
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader =
        "attribute vec3 grainPos; attribute float grainSeed; attribute float exposure; varying float vExposure; varying float vGrainSeed;\n" +
        shader.vertexShader
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
            vExposure = exposure;
            vGrainSeed = grainSeed;`,
          )
          .replace(
            "#include <project_vertex>",
            `// Billboard at the grain's position with a little size jitter.
            vec4 mvPosition = modelViewMatrix * vec4(grainPos, 1.0);
            mvPosition.xy += position.xy * (0.88 + grainSeed * 0.24);
            gl_Position = projectionMatrix * mvPosition;`,
          );
      shader.fragmentShader =
        "varying float vExposure; varying float vGrainSeed;\n" +
        shader.fragmentShader.replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          // Golden sand with per-grain tint jitter.
          vec3 sand = mix(vec3(0.90, 0.68, 0.24), vec3(1.0, 0.84, 0.40), vGrainSeed);
          // Lit-sphere shading: highlight upper-left, soft terminator lower-right.
          float d = distance(vMapUv, vec2(0.4, 0.62));
          float shade = mix(0.58, 1.1, smoothstep(0.72, 0.0, d));
          // Grains buried in the pile sit in shadow.
          float burial = mix(0.66, 1.0, vExposure);
          diffuseColor.rgb *= sand * shade * burial;`,
        );
    };

    this.grains = new THREE.InstancedMesh(geometry, material, count);
    this.grains.frustumCulled = false;
    this.add(this.grains);
  }

  update() {
    const p = this.physics.p;
    const contacts = this.physics.contacts;
    const sm = this.smoothed;
    const pos = this.positions.array as Float32Array;
    const exposure = this.exposureAttribute.array as Float32Array;
    const primed = this.primed;
    this.primed = true;
    for (let i = 0; i < this.physics.count; i++) {
      const k = i * 3;
      // Smooth only grains resting in a pile (hides solver jitter); grains in
      // free fall track the solver exactly so they never trail or streak.
      const follow = primed && contacts[i] >= 3 ? REST_SMOOTHING : 1;
      sm[k] += (p[k] - sm[k]) * follow;
      sm[k + 1] += (p[k + 1] - sm[k + 1]) * follow;
      sm[k + 2] += (p[k + 2] - sm[k + 2]) * follow;
      pos[k] = sm[k];
      pos[k + 1] = sm[k + 1];
      pos[k + 2] = sm[k + 2];
      exposure[i] = 1 - Math.min(contacts[i], 9) / 9;
    }
    this.positions.needsUpdate = true;
    this.exposureAttribute.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
    this.grains.geometry.dispose();
    (this.grains.material as THREE.Material).dispose();
  }
}
