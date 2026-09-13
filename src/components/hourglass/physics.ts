import { vesselRadius } from "./sand";

const STEP = 1 / 60;

/**
 * Position-based granular approximation: sphere contacts, wall constraints and
 * a transformed gravity vector, no rigid-body solver. Local Y is the hourglass
 * axis. A metered "virtual outlet" at the neck releases grains at the rate the
 * session duration asks for, so the flow lasts exactly as long as the cycle.
 */
export class GranularSand {
  readonly count: number;
  /** The GLB vessel is 82% of the profile's height; physics follows suit. */
  readonly heightScale = 0.82;
  readonly r: number;
  readonly d: number;
  readonly p: Float32Array;
  readonly v: Float32Array;
  private readonly old: Float32Array;
  private readonly cell: number;
  private readonly passed: Uint8Array;
  /** Neighbour count per grain from the last step (for damping and shading). */
  readonly contacts: Uint8Array;
  private readonly next: Int32Array;
  private readonly grid = new Map<number, number>();
  private metering = false;
  private sourceSign = 1;
  private transferred = 0;
  private transferTotal = 0;
  private transferLimit = 0;

  constructor(count = 1000, { radius = 0.036 } = {}) {
    this.count = count;
    this.r = radius;
    this.d = radius * 2;
    this.cell = this.d * 1.05;
    this.p = new Float32Array(count * 3);
    this.old = new Float32Array(count * 3);
    this.v = new Float32Array(count * 3);
    this.passed = new Uint8Array(count);
    this.contacts = new Uint8Array(count);
    this.next = new Int32Array(count);
    this.reset();
  }

  /** Pack every grain into a staggered lattice in the upper chamber. */
  reset() {
    let n = 0;
    const s = this.d * 0.98;
    for (
      let y = 0.16 * this.heightScale;
      y < 1.49 * this.heightScale && n < this.count;
      y += s * 0.88
    ) {
      const row = Math.round(y / (s * 0.84));
      const stagger = (row % 2) * s * 0.5;
      for (let x = -0.67; x <= 0.67 && n < this.count; x += s) {
        for (let z = -0.67; z <= 0.67 && n < this.count; z += s) {
          const xx = x + stagger;
          const zz = z + stagger;
          if (Math.hypot(xx, zz) < this.wallRadius(y) - this.r - 0.025) {
            const j = n++ * 3;
            this.p[j] = xx;
            this.p[j + 1] = y;
            this.p[j + 2] = zz;
          }
        }
      }
    }
    if (n < this.count) throw new Error("Particle reservoir capacity exceeded");
    this.v.fill(0);
    this.old.set(this.p);
    this.metering = false;
  }

  /** Every grain on the `sign` side of the neck becomes the new source. */
  beginTransfer(sign = 1) {
    this.sourceSign = sign;
    this.transferred = 0;
    this.transferTotal = 0;
    this.transferLimit = 0;
    this.metering = true;
    for (let i = 0; i < this.count; i++) {
      const source = this.p[i * 3 + 1] * sign >= 0;
      this.passed[i] = source ? 0 : 1;
      if (source) this.transferTotal++;
    }
  }

  /** progress 0..1 of the cycle → how many grains may have passed the neck. */
  setTransferProgress(progress: number) {
    this.transferLimit = Math.min(
      this.transferTotal,
      Math.floor(Math.max(0, progress) * this.transferTotal),
    );
  }

  wallRadius(y: number) {
    return vesselRadius(y / this.heightScale);
  }

  private enforceMeter(i: number) {
    if (!this.metering || this.passed[i]) return;
    const k = i * 3;
    if (this.p[k + 1] * this.sourceSign >= 0) return;
    if (this.transferred < this.transferLimit) {
      this.passed[i] = 1;
      this.transferred++;
    } else {
      // Hold the grain at the neck until the meter lets it through.
      this.p[k + 1] = this.sourceSign * 0.004;
      this.v[k + 1] = 0;
    }
  }

  private boundary(i: number) {
    this.enforceMeter(i);
    const p = this.p;
    const k = i * 3;
    const yLimit = 1.62 * this.heightScale - this.r;
    for (let pass = 0; pass < 2; pass++) {
      p[k + 1] = Math.max(-yLimit, Math.min(yLimit, p[k + 1]));
      const y = p[k + 1];
      const r = Math.hypot(p[k], p[k + 2]);
      const allowed = Math.max(0.003, this.wallRadius(y) - 0.02 - this.r);
      const over = r - allowed;
      if (over > 0 && r > 0) {
        const slope =
          (this.wallRadius(y + 0.002) - this.wallRadius(y - 0.002)) / 0.004;
        const scale = over / (1 + slope * slope);
        p[k] -= (p[k] / r) * scale;
        p[k + 2] -= (p[k + 2] / r) * scale;
        p[k + 1] += slope * scale;
      }
    }
    // Final radial containment guards against large user-driven impulses at the neck.
    const r = Math.hypot(p[k], p[k + 2]);
    const a = Math.max(0.003, this.wallRadius(p[k + 1]) - 0.02 - this.r);
    if (r > a) {
      p[k] *= a / r;
      p[k + 2] *= a / r;
    }
    this.enforceMeter(i);
  }

  step(dt: number, gravity: readonly [number, number, number]) {
    dt = Math.min(dt, STEP);
    const p = this.p;
    const v = this.v;
    const d2 = this.d * this.d;
    this.old.set(p);
    this.contacts.fill(0);

    for (let i = 0; i < this.count; i++) {
      const k = i * 3;
      for (let c = 0; c < 3; c++) {
        v[k + c] = (v[k + c] + gravity[c] * dt) * 0.998;
        p[k + c] += v[k + c] * dt;
      }
      this.boundary(i);
    }

    const c = this.cell;
    for (let iteration = 0; iteration < 2; iteration++) {
      // Hash every grain into a uniform grid so contacts are a 27-cell lookup.
      this.grid.clear();
      for (let i = 0; i < this.count; i++) {
        const k = i * 3;
        const key =
          Math.floor(p[k] / c) +
          64 +
          128 * (Math.floor(p[k + 1] / c) + 64) +
          16384 * (Math.floor(p[k + 2] / c) + 64);
        this.next[i] = this.grid.get(key) ?? -1;
        this.grid.set(key, i);
      }
      for (let i = 0; i < this.count; i++) {
        const a = i * 3;
        const cx = Math.floor(p[a] / c) + 64;
        const cy = Math.floor(p[a + 1] / c) + 64;
        const cz = Math.floor(p[a + 2] / c) + 64;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              let j =
                this.grid.get(cx + x + 128 * (cy + y) + 16384 * (cz + z)) ?? -1;
              while (j !== -1) {
                if (j > i) {
                  const b = j * 3;
                  const dx = p[b] - p[a];
                  const dy = p[b + 1] - p[a + 1];
                  const dz = p[b + 2] - p[a + 2];
                  const sq = dx * dx + dy * dy + dz * dz;
                  if (iteration === 1 && sq < d2 * 1.8) {
                    this.contacts[i]++;
                    this.contacts[j]++;
                  }
                  if (sq < d2 && sq > 1e-10) {
                    const len = Math.sqrt(sq);
                    const f = ((this.d - len) / len) * 0.46;
                    p[a] -= dx * f;
                    p[a + 1] -= dy * f;
                    p[a + 2] -= dz * f;
                    p[b] += dx * f;
                    p[b + 1] += dy * f;
                    p[b + 2] += dz * f;
                  }
                }
                j = this.next[j];
              }
            }
          }
        }
      }
      for (let i = 0; i < this.count; i++) this.boundary(i);
    }

    // Dissipate contact energy while preserving gravity-driven free fall.
    // Only grains buried deep in the pile are put to sleep; damping surface
    // or funnel grains harder makes them arch and jam above the neck.
    for (let i = 0; i < this.count; i++) {
      const k = i * 3;
      const contacts = this.contacts[i];
      const damping = contacts > 3 ? 0.88 : contacts > 0 ? 0.9 : 0.92;
      const vx = Math.max(-9, Math.min(9, (p[k] - this.old[k]) / dt)) * damping;
      const vy = Math.max(-9, Math.min(9, (p[k + 1] - this.old[k + 1]) / dt)) * damping;
      const vz = Math.max(-9, Math.min(9, (p[k + 2] - this.old[k + 2]) / dt)) * damping;
      const asleep = contacts >= 7 && vx * vx + vy * vy + vz * vz < 0.001;
      v[k] = asleep ? 0 : vx;
      v[k + 1] = asleep ? 0 : vy;
      v[k + 2] = asleep ? 0 : vz;
    }
  }

  /** Every grain is in the receiving chamber, touching the pile and slow. */
  get allSettled(): boolean {
    const sign = this.sourceSign;
    for (let i = 0; i < this.count; i++) {
      const k = i * 3;
      if (
        this.p[k + 1] * sign > -0.25 ||
        this.contacts[i] === 0 ||
        Math.hypot(this.v[k], this.v[k + 1], this.v[k + 2]) > 0.18
      ) {
        return false;
      }
    }
    return true;
  }
}
