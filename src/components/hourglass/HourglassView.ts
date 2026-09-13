import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GranularSand } from "./physics";
import { SandVisual } from "./sandVisual";
import { Transformation } from "./transformation";

const STEP = 1 / 60;
const FLIP_SECONDS = 2.2;
/** Idle spin about the hourglass's own axis, radians per second. */
const IDLE_SPIN = 0.2;
/** Fine sand: many small grains (step cost grows roughly linearly). */
const GRAIN_COUNT = 3000;
const GRAIN_RADIUS = 0.028;
/**
 * Gravity in scene units. The vessel is ~2.7 units for roughly 30 cm of
 * hourglass, so 9.81 would read as slow motion; this keeps the fall snappy.
 */
const GRAVITY = 20;
/**
 * Solver sub-steps per 60 Hz frame. At this gravity a single step lets grains
 * sink deep enough into each other that the projections eject them; two
 * half-steps keep the piles calm.
 */
const SUBSTEPS = 2;
const LIFT_MIN = -0.45;
const LIFT_MAX = 0.7;
/** Radians of tilt per pixel of horizontal drag; lift units per vertical pixel. */
const DRAG_TILT = 0.009;
const DRAG_LIFT = 0.006;

interface HourglassViewOptions {
  assetUrl: string;
}

interface PointerDrag {
  id: number;
  x: number;
  y: number;
  tilt: number;
  lift: number;
}

/**
 * Owns the WebGL renderer, scene, GLB model and granular simulation for the
 * Why-Us hourglass. No shadow maps: the vessel floats on the page gradient. It never owns the clock: the caller advances the cycle
 * via `setProgress()` and drives frames with `render(delta)`.
 *
 * Interaction: drag sideways to tilt (gravity follows), drag up/down to lift
 * (the grains get a kick). The vessel stays where it is released; the clock
 * only runs while it is near upright or inverted, and resting it inverted
 * swaps the chamber roles.
 */
export class HourglassView {
  /** Resolves once the GLB is in the scene and the first frame has rendered. */
  readonly ready: Promise<void>;
  /** A flip came to rest and the chambers swapped roles. */
  onCycle?: () => void;
  /** The user grabbed the vessel mid-flip; the caller may re-arm its flip. */
  onFlipInterrupted?: () => void;
  /** The browser dropped the WebGL context; the caller should fall back. */
  onContextLost?: () => void;
  /**
   * The vessel's screen-space outline changed (it tilted or lifted). Points
   * are a convex hull in canvas CSS pixels, flattened as x0, y0, x1, y1, ...
   * Used by the page to wrap copy around the hourglass.
   */
  onOutline?: (points: Float32Array) => void;

  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly environment: THREE.WebGLRenderTarget;
  /** Outer rig: sideways tilt (Z) and lift (Y). */
  private readonly rig = new THREE.Group();
  /** Inner rig: slow spin about the vessel's own axis; holds model and sand. */
  private readonly spin = new THREE.Group();
  private readonly physics: GranularSand;
  private readonly sand: SandVisual;
  private readonly roles = new Transformation();
  private readonly gravity = new THREE.Vector3();
  private readonly impulse = new THREE.Vector3();
  private readonly sandRotation = new THREE.Quaternion();
  private readonly resizeObserver: ResizeObserver;

  private disposed = false;
  private tilt = 0;
  private lift = 0;
  private yaw = 0;
  private accumulator = 0;
  private settledFor = 0;
  private flipFrom = 0;
  private flipTo: number | null = null;
  private flipElapsed = 0;
  private drag: PointerDrag | null = null;
  private reportedTilt = Number.POSITIVE_INFINITY;
  private reportedLift = Number.POSITIVE_INFINITY;
  /** Rim samples of the frame's bounding cylinder, in rig space. */
  private readonly outlineSamples = HourglassView.buildOutlineSamples();
  private readonly outlinePoint = new THREE.Vector3();

  constructor(container: HTMLElement, { assetUrl }: HourglassViewOptions) {
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.addEventListener(
      "webglcontextlost",
      this.handleContextLost,
    );
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    this.camera.position.set(3.75, 1.8, 7.2);
    this.camera.lookAt(0, -0.05, 0);

    // Studio environment baked to a PMREM map: a big soft top light, a tall
    // cool-blue strip on one side and a warm gold strip on the other, plus a
    // thin bright bar behind the camera. The metal frame reflects these as
    // crisp two-tone streaks, which is what makes it read as polished.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0x3a4052);
    const panels: ReadonlyArray<
      readonly [number, number, number, number, number, THREE.ColorRepresentation, number]
    > = [
      [0, 6, 1, 5, 3, 0xffffff, 2.2], // top softbox
      [-4, 1, 1.5, 0.8, 6, 0x6f8cff, 4], // cool strip, left
      [4, 0.5, -1, 0.7, 6, 0xffb454, 2.6], // warm strip, right/back
      [0, 0.5, 7, 6, 0.35, 0xffffff, 3], // thin highlight bar behind camera
      [0, -4, 0, 6, 6, 0x2a3566, 1.6], // blue floor bounce
    ];
    for (const [x, y, z, w, h, color, power] of panels) {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(color).multiplyScalar(power),
          side: THREE.DoubleSide,
        }),
      );
      panel.position.set(x, y, z);
      panel.lookAt(0, 0, 0);
      studio.add(panel);
    }
    this.environment = pmrem.fromScene(studio, 0.02);
    this.scene.environment = this.environment.texture;
    this.release(studio);
    pmrem.dispose();

    this.scene.add(new THREE.HemisphereLight(0xb9cdfb, 0x1a1830, 0.9));
    const key = new THREE.DirectionalLight(0xfff1dc, 2.2);
    key.position.set(-3, 5, 4);
    this.scene.add(key);
    // Cool rim from behind-right picks out the pillars and the glass edge...
    const rim = new THREE.DirectionalLight(0x6f8cff, 3);
    rim.position.set(3, 2.5, -2.5);
    this.scene.add(rim);
    // ...and a low warm kicker from behind-left gives the metal a second edge.
    const kicker = new THREE.DirectionalLight(0xffb454, 1.2);
    kicker.position.set(-3, -1, -3);
    this.scene.add(kicker);
    const fill = new THREE.DirectionalLight(0xffd398, 0.5);
    fill.position.set(1, 1, 4);
    this.scene.add(fill);

    this.rig.add(this.spin);
    this.scene.add(this.rig);

    this.physics = new GranularSand(GRAIN_COUNT, { radius: GRAIN_RADIUS });
    this.relaxGrains();
    this.sand = new SandVisual(this.physics);
    this.spin.add(this.sand);
    this.sand.update();
    this.physics.beginTransfer(1);

    container.addEventListener("pointerdown", this.handlePointerDown);
    container.addEventListener("pointermove", this.handlePointerMove);
    container.addEventListener("pointerup", this.handlePointerUp);
    container.addEventListener("pointercancel", this.handlePointerUp);
    container.addEventListener("lostpointercapture", this.handlePointerUp);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    this.ready = loader.loadAsync(assetUrl).then((gltf) => {
      if (this.disposed) {
        this.release(gltf.scene);
        return;
      }
      const remove: THREE.Mesh[] = [];
      gltf.scene.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        // Baked sand meshes are replaced by the live simulation.
        if (o.name.startsWith("Sand_")) {
          remove.push(o);
          return;
        }
        if (o.name === "Glass_vessel") {
          for (const m of this.materialsOf(o)) m.dispose();
          o.material = this.makeGlass();
          return;
        }
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => this.polish(m))
          : this.polish(o.material);
      });
      for (const o of remove) {
        o.removeFromParent();
        o.geometry.dispose();
        for (const m of this.materialsOf(o)) m.dispose();
      }
      this.spin.add(gltf.scene);
      this.render(0);
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  /** Upright or inverted enough for grains to flow, and not mid-flip. */
  get canFlow(): boolean {
    return this.flipTo == null && Math.abs(Math.cos(this.tilt)) > 0.68;
  }

  /** Every grain has landed in the receiving chamber and been still a moment. */
  get readyToFlip(): boolean {
    return this.settledFor >= 0.75;
  }

  get flipping(): boolean {
    return this.flipTo != null;
  }

  /** progress 0..1 of the current cycle → metered release through the neck. */
  setProgress(progress: number) {
    this.physics.setTransferProgress(progress);
  }

  /** Turn the vessel over; returns false if the user is holding it. */
  flip(): boolean {
    if (this.drag || this.flipTo != null) return false;
    this.flipFrom = this.tilt;
    this.flipTo = this.tilt + Math.PI;
    this.flipElapsed = 0;
    return true;
  }

  render(delta: number) {
    if (this.disposed) return;
    delta = Math.min(Math.max(0, delta), 0.05);

    if (this.flipTo != null) {
      this.flipElapsed += delta;
      const t = Math.min(1, this.flipElapsed / FLIP_SECONDS);
      const eased = t * t * (3 - 2 * t);
      this.setTilt(this.flipFrom + (this.flipTo - this.flipFrom) * eased);
      if (t === 1) this.flipTo = null;
    }
    if (!this.drag) {
      this.yaw += delta * IDLE_SPIN;
      this.spin.rotation.y = this.yaw;
    }

    // Fixed-step physics under gravity expressed in the sand's local frame.
    this.accumulator += delta;
    if (this.accumulator >= STEP) {
      this.gravity.set(0, -GRAVITY, 0).applyQuaternion(this.sandRotationInverse());
      const g: [number, number, number] = [
        this.gravity.x,
        this.gravity.y,
        this.gravity.z,
      ];
      let steps = 0;
      while (this.accumulator >= STEP && steps < 2) {
        for (let i = 0; i < SUBSTEPS; i++) this.physics.step(STEP / SUBSTEPS, g);
        this.accumulator -= STEP;
        steps++;
      }
      if (steps === 2) this.accumulator = 0;
    }

    this.settledFor =
      this.canFlow && this.physics.allSettled ? this.settledFor + delta : 0;
    if (this.roles.update(this.tilt, delta)) {
      this.physics.beginTransfer(this.roles.inputSign);
      this.onCycle?.();
    }
    this.sand.update();
    this.renderer.render(this.scene, this.camera);

    if (
      this.onOutline &&
      (Math.abs(this.tilt - this.reportedTilt) > 0.002 ||
        Math.abs(this.lift - this.reportedLift) > 0.002)
    ) {
      this.reportedTilt = this.tilt;
      this.reportedLift = this.lift;
      this.onOutline(this.projectOutline());
    }
  }

  /** Project the bounding cylinder through the camera and hull the result. */
  private projectOutline(): Float32Array {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const points: Array<[number, number]> = [];
    for (const sample of this.outlineSamples) {
      const v = this.outlinePoint
        .copy(sample)
        .applyQuaternion(this.rig.quaternion)
        .add(this.rig.position)
        .project(this.camera);
      points.push([((v.x + 1) / 2) * w, ((1 - v.y) / 2) * h]);
    }
    return convexHull(points);
  }

  private static buildOutlineSamples(): THREE.Vector3[] {
    // Cap rims: radius just past the caps, height just past the cap faces.
    const radius = 1.0;
    const height = 1.38;
    const samples: THREE.Vector3[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      samples.push(new THREE.Vector3(x, height, z), new THREE.Vector3(x, -height, z));
    }
    return samples;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.resizeObserver.disconnect();
    const c = this.container;
    c.removeEventListener("pointerdown", this.handlePointerDown);
    c.removeEventListener("pointermove", this.handlePointerMove);
    c.removeEventListener("pointerup", this.handlePointerUp);
    c.removeEventListener("pointercancel", this.handlePointerUp);
    c.removeEventListener("lostpointercapture", this.handlePointerUp);
    this.renderer.domElement.removeEventListener(
      "webglcontextlost",
      this.handleContextLost,
    );
    this.sand.dispose();
    this.release(this.scene);
    this.environment.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private setTilt(radians: number) {
    this.tilt = radians;
    this.rig.rotation.z = radians;
  }

  private setLift(value: number) {
    const previous = this.lift;
    this.lift = THREE.MathUtils.clamp(value, LIFT_MIN, LIFT_MAX);
    this.rig.position.y = this.lift;
    // Jolting the vessel kicks the grains: a world-Y impulse in sand space.
    const kick = THREE.MathUtils.clamp((previous - this.lift) * 1.6, -0.2, 0.2);
    if (kick === 0) return;
    const local = this.impulse
      .set(0, kick, 0)
      .applyQuaternion(this.sandRotationInverse());
    const v = this.physics.v;
    for (let i = 0; i < v.length; i += 3) {
      v[i] += local.x;
      v[i + 1] += local.y;
      v[i + 2] += local.z;
    }
  }

  /** Inverse of the sand group's world rotation (tilt rig × idle spin). */
  private sandRotationInverse() {
    return this.sandRotation
      .multiplyQuaternions(this.rig.quaternion, this.spin.quaternion)
      .invert();
  }

  /** Let the packed lattice settle under zero gravity so it starts at rest. */
  private relaxGrains() {
    for (let i = 0; i < 25; i++) this.physics.step(STEP, [0, 0, 0]);
    this.physics.v.fill(0);
  }

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.render(0);
  }

  /**
   * Cheap glass: no transmission pass. A Fresnel term makes the shell nearly
   * clear face-on and bright at grazing angles, so the vessel's silhouette
   * reads against the page without hiding the sand.
   */
  private makeGlass(): THREE.MeshPhysicalMaterial {
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xd6e4ff,
      metalness: 0,
      roughness: 0.03,
      transmission: 0,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      envMapIntensity: 1.5,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      // Faint thin-film sheen at grazing angles, like coated optical glass.
      iridescence: 0.35,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [120, 420],
    });
    glass.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float fresnel = pow(1.0 - saturate(dot(normalize(vViewPosition), normal)), 2.4);
        diffuseColor.a = mix(0.06, 0.7, fresnel);`,
      );
    };
    return glass;
  }

  /**
   * Swap the GLB's flat PBR materials for polished physical ones: the frame
   * becomes lacquered dark metal under a clearcoat, the trim bright chrome.
   */
  private polish(source: THREE.Material): THREE.Material {
    if (!(source instanceof THREE.MeshStandardMaterial)) return source;
    const trim = /titanium|trim/i.test(source.name);
    const polished = new THREE.MeshPhysicalMaterial({
      color: trim ? 0xc9d3ea : source.color.clone().offsetHSL(0, 0.05, 0.02),
      metalness: trim ? 1 : 0.88,
      roughness: trim ? 0.16 : 0.34,
      clearcoat: trim ? 0 : 0.7,
      clearcoatRoughness: 0.12,
      envMapIntensity: trim ? 1.6 : 1.4,
    });
    polished.name = source.name;
    source.dispose();
    return polished;
  }

  private materialsOf(mesh: THREE.Mesh): THREE.Material[] {
    return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  }

  private release(root: THREE.Object3D) {
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.geometry.dispose();
      for (const m of this.materialsOf(o)) m.dispose();
    });
  }

  private handlePointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.drag = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      tilt: this.tilt,
      lift: this.lift,
    };
    this.container.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.drag || e.pointerId !== this.drag.id) return;
    if (this.flipTo != null) {
      this.flipTo = null;
      this.onFlipInterrupted?.();
    }
    this.setTilt(this.drag.tilt + (e.clientX - this.drag.x) * DRAG_TILT);
    this.setLift(this.drag.lift - (e.clientY - this.drag.y) * DRAG_LIFT);
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (this.drag && e.pointerId === this.drag.id) this.drag = null;
  };

  private handleContextLost = (e: Event) => {
    e.preventDefault();
    this.onContextLost?.();
  };
}

/** Andrew's monotone chain; returns the hull flattened as x, y pairs. */
function convexHull(points: Array<[number, number]>): Float32Array {
  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Array<[number, number]> = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Array<[number, number]> = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  const out = new Float32Array(hull.length * 2);
  hull.forEach(([x, y], i) => {
    out[i * 2] = x;
    out[i * 2 + 1] = y;
  });
  return out;
}
