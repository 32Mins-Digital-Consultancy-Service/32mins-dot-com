import * as THREE from "three";
import type { GranularSand } from "./physics";
import type { Transformation } from "./transformation";

/**
 * Small lit 3D grains: one instanced sphere per physical particle. Bronze in
 * the source chamber, brightening to metallic gold once refined into the
 * receiving chamber. A short position interpolation smooths solver jitter.
 */
export class SandVisual extends THREE.Group {
  private readonly physics: GranularSand;
  private readonly displayPosition: Float32Array;
  readonly refinement: Float32Array;
  private readonly seeds: Float32Array;
  private readonly grains: THREE.InstancedMesh;
  private readonly transform = new THREE.Matrix4();
  private readonly color = new THREE.Color();
  private readonly bronze = new THREE.Color("#88602d");
  private readonly gold = new THREE.Color("#edc46e");

  constructor(physics: GranularSand) {
    super();
    this.physics = physics;
    this.displayPosition = new Float32Array(physics.p);
    this.refinement = new Float32Array(physics.count);
    this.seeds = Float32Array.from({ length: physics.count }, (_, i) => ((i * 2654435761) >>> 0) / 4294967296);
    const geometry = new THREE.SphereGeometry(physics.r * 0.91, 8, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.62,
      roughness: 0.34,
      envMapIntensity: 1.15,
    });
    this.grains = new THREE.InstancedMesh(geometry, material, physics.count);
    this.grains.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.grains.frustumCulled = false;
    this.add(this.grains);
  }

  reset() {
    this.refinement.fill(0);
    this.displayPosition.set(this.physics.p);
  }

  update(dt: number, roles: Transformation, snap = false) {
    const p = this.physics.p;
    const blend = dt > 0 && !snap ? 1 - Math.exp(-dt / 0.035) : 1;
    for (let i = 0; i < this.physics.count; i++) {
      const k = i * 3;
      const target = roles.targetRefinement(p[k + 1]);
      if (target !== null) this.refinement[i] += (target - this.refinement[i]) * Math.min(1, dt * 3);
      for (let c = 0; c < 3; c++) {
        this.displayPosition[k + c] += (p[k + c] - this.displayPosition[k + c]) * blend;
      }
      this.transform.makeTranslation(this.displayPosition[k], this.displayPosition[k + 1], this.displayPosition[k + 2]);
      this.grains.setMatrixAt(i, this.transform);
      this.color.copy(this.bronze).lerp(this.gold, this.refinement[i]).multiplyScalar(0.9 + this.seeds[i] * 0.2);
      this.grains.setColorAt(i, this.color);
    }
    this.grains.instanceMatrix.needsUpdate = true;
    if (this.grains.instanceColor) this.grains.instanceColor.needsUpdate = true;
  }

  dispose() {
    this.grains.geometry.dispose();
    (this.grains.material as THREE.Material).dispose();
    this.grains.dispose();
  }
}
