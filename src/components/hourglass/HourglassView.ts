import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GranularSand } from "./physics";
import { SandVisual } from "./sandVisual";
import { Transformation } from "./transformation";

const GRAIN_COUNT = 3200;
const GRAIN_RADIUS = 0.02288;
const FLIP_SECONDS = 2.2;
const PHYSICS_STEP = 1 / 120;
const MAX_STEPS_PER_FRAME = 6;
const LIFT_MIN = -0.45;
const LIFT_MAX = 0.7;
/** Radians of roll per horizontal drag pixel; radians of pitch / lift units per vertical pixel. */
const DRAG_TILT = 0.009;
const DRAG_PITCH = 0.006;
const DRAG_LIFT = 0.006;
const BASE_FOV = 34;

interface HourglassViewOptions {
  assetUrl: string;
}

interface PointerDrag {
  id: number;
  x: number;
  y: number;
  tilt: number;
  pitch: number;
  lift: number;
  shift: boolean;
}

/**
 * Owns the WebGL renderer, scene, GLB vessel and the 3,200-grain granular
 * simulation for the Why-Us hourglass. No shadow maps or shadow floor: the
 * stage is transparent over the page gradient, so a cast shadow would read as
 * a dark smear behind the copy. It never owns the clock: the caller
 * advances the metered cycle via `setProgress()` and drives frames with
 * `render(delta)`.
 *
 * Interaction (object mode): drag sideways to roll about Z, drag vertically to
 * pitch into/out of the screen, shift-drag vertically to lift (grains get a
 * kick). Arrow keys do the same; Home resets the camera. Gravity follows the
 * full 3D orientation; the vessel stays where it is released, and resting it
 * inverted swaps the chamber roles.
 */
export class HourglassView {
  /** Resolves once the GLB is in the scene and a first frame has rendered. */
  readonly ready: Promise<void>;
  /** A flip came to rest and the chambers swapped roles. */
  onCycle?: () => void;
  /** The GPU dropped the context; the caller should fall back. */
  onContextLost?: () => void;
  /**
   * The vessel's screen-space outline changed (it moved, or the camera did).
   * Points are a convex hull in canvas CSS pixels, flattened as x0, y0, x1, y1, …
   */
  onOutline?: (points: Float32Array) => void;

  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly environment: THREE.WebGLRenderTarget;
  private readonly object = new THREE.Group();
  private readonly physics: GranularSand;
  private readonly sand: SandVisual;
  private readonly roles = new Transformation();
  private readonly gravity = new THREE.Vector3();
  private readonly inverse = new THREE.Quaternion();
  private readonly resizeObserver: ResizeObserver;
  private model: THREE.Object3D | null = null;
  private outlineSamples: THREE.Vector3[] = [];
  private readonly outlinePoint = new THREE.Vector3();
  private lastOutlineKey = "";

  private disposed = false;
  private flowing = false;
  private tilt = 0;
  private pitch = 0.12;
  private yaw = 0.32;
  private lift = 0;
  private accumulator = 0;
  private settledFor = 0;
  private flipFrom = 0;
  private flipTo: number | null = null;
  private flipElapsed = 0;
  private flipYaw = 0;
  private pointer: PointerDrag | null = null;

  constructor(container: HTMLElement, { assetUrl }: HourglassViewOptions) {
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x080d22, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.renderer.domElement.addEventListener("webglcontextlost", this.handleContextLost);
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 60);
    this.camera.position.set(3.3, 1.9, 8.6);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, -0.05, 0);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 6.8;
    this.controls.maxDistance = 11;
    this.controls.minPolarAngle = 0.35;
    this.controls.maxPolarAngle = Math.PI * 0.78;
    this.controls.enabled = false; // object mode: drags move the vessel, not the camera
    this.controls.saveState();

    // Studio environment: three soft panels the metal frame and grains reflect.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0x363636);
    const panels: Array<[number, number, number, number, number, number]> = [
      [-3, 1, 2, 1, 5, 3],
      [3, 2, -2, 0.65, 4, 2],
      [0, 5, 0, 3, 2, 1],
    ];
    for (const [x, y, z, w, h, power] of panels) {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.97, 0.9).multiplyScalar(power), side: THREE.DoubleSide }),
      );
      panel.position.set(x, y, z);
      panel.lookAt(0, 0, 0);
      studio.add(panel);
    }
    this.environment = pmrem.fromScene(studio, 0.03);
    this.scene.environment = this.environment.texture;
    this.release(studio);
    pmrem.dispose();

    this.scene.add(new THREE.HemisphereLight(0xb9cdfb, 0x282238, 1));
    const key = new THREE.DirectionalLight(0xe4edff, 2.5);
    key.position.set(-3, 5, 4);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x839dff, 1.5);
    rim.position.set(3, 2, -2);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffd398, 0.8);
    fill.position.set(1, 1, 4);
    this.scene.add(fill);

    this.scene.add(this.object);
    this.physics = new GranularSand(GRAIN_COUNT, { radius: GRAIN_RADIUS });
    this.applyOrientation();
    for (let i = 0; i < 25; i++) this.physics.step(1 / 60, [0, 0, 0]);
    this.physics.v.fill(0);
    this.sand = new SandVisual(this.physics);
    this.object.add(this.sand);
    this.sand.update(0, this.roles, true);
    this.physics.beginTransfer(1);

    container.addEventListener("pointerdown", this.handlePointerDown);
    container.addEventListener("pointermove", this.handlePointerMove);
    container.addEventListener("pointerup", this.handlePointerUp);
    container.addEventListener("pointercancel", this.handlePointerUp);
    container.addEventListener("keydown", this.handleKey);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    this.ready = loader.loadAsync(assetUrl).then((gltf) => {
      if (this.disposed) {
        this.release(gltf.scene);
        return;
      }
      const remove: THREE.Mesh[] = [];
      gltf.scene.traverse((o) => {
        if (!(o as THREE.Mesh).isMesh) return;
        const mesh = o as THREE.Mesh;
        if (mesh.name.startsWith("Sand_")) {
          remove.push(mesh);
          return;
        }
        if (mesh.name === "Glass_vessel") {
          const old = mesh.material;
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.06,
            transmission: 0,
            transparent: true,
            opacity: 0.12,
            depthWrite: false,
            envMapIntensity: 0.5,
            specularIntensity: 0.6,
          });
          for (const m of Array.isArray(old) ? old : [old]) m.dispose();
        } else {
          for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            (m as THREE.MeshStandardMaterial).envMapIntensity = 0.85;
          }
        }
      });
      for (const mesh of remove) {
        mesh.removeFromParent();
        mesh.geometry.dispose();
      }
      // Outline samples: the vessel's bounding cylinder in object space.
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const radius = Math.max(Math.abs(box.min.x), box.max.x, Math.abs(box.min.z), box.max.z);
      this.outlineSamples = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;
        this.outlineSamples.push(new THREE.Vector3(x, box.max.y, z), new THREE.Vector3(x, box.min.y, z));
      }
      this.object.add(gltf.scene);
      this.model = gltf.scene;
      this.render(0);
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
  }

  /** True while the vessel is tilted enough for the receiving side to be downhill and no flip is running. */
  get canFlow(): boolean {
    return this.flipTo == null && this.axisVertical * this.roles.inputSign > 0.08;
  }

  /** Every grain is through the neck and has been still for 0.75 s. */
  get readyToFlip(): boolean {
    return this.settledFor >= 0.75;
  }

  get flipping(): boolean {
    return this.flipTo != null;
  }

  /** Metered release: `progress` in 0..1 of the cycle; `flowing` gates physics. */
  setProgress(progress: number, flowing = true) {
    this.flowing = flowing;
    this.physics.setTransferProgress(progress);
  }

  /** Start the 2.2 s automatic turn (with a gentle yaw sweep). */
  flip() {
    this.flipFrom = this.tilt;
    this.flipTo = this.tilt + Math.PI;
    this.flipElapsed = 0;
    this.flipYaw = this.yaw;
  }

  render(rawDelta: number) {
    if (this.disposed) return;
    this.controls.update();
    const delta = Math.min(rawDelta, 0.05);

    if (this.flipTo != null && this.flowing) {
      this.flipElapsed += delta;
      const t = Math.min(1, this.flipElapsed / FLIP_SECONDS);
      const e = t * t * (3 - 2 * t);
      this.yaw = this.flipYaw + Math.sin(Math.PI * e) * 0.38;
      this.setTilt(this.flipFrom + (this.flipTo - this.flipFrom) * e);
      if (t === 1) this.flipTo = null;
    }

    if (this.flowing) {
      this.accumulator += delta;
      let steps = 0;
      this.inverse.copy(this.object.quaternion).invert();
      this.gravity.set(0, -9.81, 0).applyQuaternion(this.inverse);
      while (this.accumulator >= PHYSICS_STEP && steps < MAX_STEPS_PER_FRAME) {
        this.physics.step(PHYSICS_STEP, [this.gravity.x, this.gravity.y, this.gravity.z]);
        this.accumulator -= PHYSICS_STEP;
        steps++;
      }
      if (steps === MAX_STEPS_PER_FRAME) this.accumulator = 0;
    }

    this.settledFor = this.flowing && this.canFlow && this.physics.allSettled ? this.settledFor + delta : 0;

    const swapped = this.roles.update(Math.acos(THREE.MathUtils.clamp(this.axisVertical, -1, 1)), delta);
    if (swapped) {
      this.settledFor = 0;
      this.physics.beginTransfer(this.roles.inputSign);
      this.onCycle?.();
    }
    this.sand.update(this.flowing ? delta : 0, this.roles);

    this.renderer.render(this.scene, this.camera);
    this.reportOutline();
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
    c.removeEventListener("keydown", this.handleKey);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.handleContextLost);
    this.controls.dispose();
    this.sand.dispose();
    this.release(this.scene);
    this.environment.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ---- orientation -------------------------------------------------------

  private get axisVertical(): number {
    return new THREE.Vector3(0, 1, 0).applyQuaternion(this.object.quaternion).y;
  }

  private applyOrientation() {
    this.object.rotation.set(this.pitch, this.yaw, this.tilt, "YXZ");
  }

  private setTilt(radians: number) {
    this.tilt = radians;
    this.applyOrientation();
  }

  private setDepthRotation(pitch: number, yaw = this.yaw) {
    this.pitch = THREE.MathUtils.clamp(pitch, -1.2, 1.2);
    this.yaw = yaw;
    this.applyOrientation();
  }

  private setLift(value: number) {
    const old = this.lift;
    this.lift = THREE.MathUtils.clamp(value, LIFT_MIN, LIFT_MAX);
    this.object.position.y = this.lift;
    if (this.flowing) {
      const impulse = THREE.MathUtils.clamp((old - this.lift) * 1.6, -0.2, 0.2);
      const local = new THREE.Vector3(0, impulse, 0).applyQuaternion(this.object.quaternion.clone().invert());
      const v = this.physics.v;
      for (let i = 0; i < v.length; i += 3) {
        v[i] += local.x;
        v[i + 1] += local.y;
      }
    }
  }

  // ---- interaction -------------------------------------------------------

  private handlePointerDown = (e: PointerEvent) => {
    this.pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, tilt: this.tilt, pitch: this.pitch, lift: this.lift, shift: e.shiftKey };
    this.container.setPointerCapture(e.pointerId);
  };

  private handlePointerMove = (e: PointerEvent) => {
    const p = this.pointer;
    if (!p || e.pointerId !== p.id) return;
    this.setTilt(p.tilt + (e.clientX - p.x) * DRAG_TILT);
    if (p.shift) this.setLift(p.lift - (e.clientY - p.y) * DRAG_LIFT);
    else this.setDepthRotation(p.pitch + (e.clientY - p.y) * DRAG_PITCH, this.yaw);
  };

  private handlePointerUp = () => {
    this.pointer = null;
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      this.setTilt(this.tilt + (e.key === "ArrowLeft" ? -0.12 : 0.12));
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (e.shiftKey) this.setLift(this.lift + (e.key === "ArrowUp" ? 0.1 : -0.1));
      else this.setDepthRotation(this.pitch + (e.key === "ArrowUp" ? -0.1 : 0.1));
    } else if (e.key === "Home") {
      e.preventDefault();
      this.controls.reset();
    }
  };

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.onContextLost?.();
  };

  // ---- sizing & outline -------------------------------------------------

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    // Widen the view for narrow boxes so rotations stay framed.
    const base = Math.tan(THREE.MathUtils.degToRad(BASE_FOV) / 2);
    this.camera.fov = Math.max(BASE_FOV, THREE.MathUtils.radToDeg(2 * Math.atan(base / Math.min(1, w / h))));
    this.camera.updateProjectionMatrix();
    this.lastOutlineKey = "";
    this.render(0);
  }

  private reportOutline() {
    if (!this.onOutline || !this.model || this.outlineSamples.length === 0) return;
    const c = this.camera.position;
    const key = [this.tilt, this.pitch, this.yaw, this.lift, c.x, c.y, c.z].map((v) => v.toFixed(3)).join(",");
    if (key === this.lastOutlineKey) return;
    this.lastOutlineKey = key;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.object.updateMatrixWorld();
    const points: Array<[number, number]> = [];
    for (const sample of this.outlineSamples) {
      const v = this.outlinePoint.copy(sample).applyMatrix4(this.object.matrixWorld).project(this.camera);
      points.push([((v.x + 1) / 2) * w, ((1 - v.y) / 2) * h]);
    }
    this.onOutline(convexHull(points));
  }

  private release(root: THREE.Object3D) {
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      if (mesh.material) {
        for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) m.dispose();
      }
    });
  }
}

/** Andrew's monotone chain; returns the hull flattened as x, y pairs. */
function convexHull(input: Array<[number, number]>): Float32Array {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Array<[number, number]> = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Array<[number, number]> = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
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
