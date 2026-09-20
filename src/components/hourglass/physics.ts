import { vesselRadius } from "./sand";

export type Vec3 = readonly [number, number, number];

/**
 * Position-based granular approximation: sphere contacts, wall constraints
 * and a transformed gravity vector; no rigid-body solver. Local Y is the
 * hourglass axis. The outlet reserves individual grains before they cross
 * ("metering") so the backlog never escapes as a burst.
 */
export class GranularSand {
  readonly count: number;
  /** The vessel node applies this Y scale to the wall profile. */
  readonly heightScale = 0.82;
  readonly r: number;
  readonly d: number;
  readonly p: Float32Array;
  readonly v: Float32Array;
  private readonly old: Float32Array;
  private readonly passed: Uint8Array;
  private readonly admitted: Uint8Array;
  private readonly contacts: Uint8Array;
  private readonly next: Int32Array;
  private readonly grid: Int32Array;
  private readonly cell: number;
  private readonly gridWidth: number;
  private readonly gridHeight: number;
  private pending = 0;
  private metering = false;
  private sourceSign = 1;
  transferred = 0;
  transferTotal = 0;
  private transferLimit = 0;

  constructor(count = 2400, { radius: grainRadius = 0.029 } = {}) {
    this.count = count;
    this.r = grainRadius;
    this.d = this.r * 2;
    this.cell = this.d * 1.05;
    this.p = new Float32Array(count * 3);
    this.old = new Float32Array(count * 3);
    this.v = new Float32Array(count * 3);
    this.passed = new Uint8Array(count);
    this.admitted = new Uint8Array(count);
    this.contacts = new Uint8Array(count);
    this.next = new Int32Array(count);
    this.gridWidth = Math.ceil(1.8 / this.cell) + 4;
    this.gridHeight = Math.ceil(3 / this.cell) + 4;
    this.grid = new Int32Array(this.gridWidth * this.gridHeight * this.gridWidth);
    this.reset();
  }

  /** Pack every grain into the upper chamber. */
  reset() {
    let n = 0;
    const s = this.d * 0.98;
    for (let y = 0.16 * this.heightScale; y < 1.49 * this.heightScale && n < this.count; y += s * 0.88) {
      const row = Math.round(y / (s * 0.84));
      for (let x = -0.67; x <= 0.67 && n < this.count; x += s) {
        for (let z = -0.67; z <= 0.67 && n < this.count; z += s) {
          const xx = x + (row % 2) * s * 0.5;
          const zz = z + (row % 2) * s * 0.5;
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

  beginTransfer(sign = 1) {
    this.sourceSign = sign;
    this.admitted.fill(0);
    this.pending = 0;
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

  setTransferProgress(progress: number) {
    this.transferLimit = Math.min(
      this.transferTotal,
      Math.floor(Math.max(0, progress) * this.transferTotal),
    );
  }

  private admitGrains(dt: number) {
    if (!this.metering) return;
    let slots = Math.min(Math.ceil(dt * 120), this.transferLimit - this.transferred - this.pending);
    while (slots-- > 0) {
      let best = -1;
      let score = Infinity;
      for (let i = 0; i < this.count; i++) {
        if (this.passed[i] || this.admitted[i]) continue;
        const k = i * 3;
        const y = this.p[k + 1] * this.sourceSign;
        if (y > 0.16) continue;
        const distance = y + Math.hypot(this.p[k], this.p[k + 2]) * 0.25;
        if (distance < score) {
          score = distance;
          best = i;
        }
      }
      if (best < 0) break;
      this.admitted[best] = 1;
      this.pending++;
    }
  }

  private enforceMeter(i: number) {
    if (!this.metering || this.passed[i]) return;
    const k = i * 3;
    const side = this.p[k + 1] * this.sourceSign;
    if (this.admitted[i]) {
      if (side < 0) {
        this.passed[i] = 1;
        this.transferred++;
        this.pending--;
      }
    } else if (side < this.r + 0.003) {
      this.p[k + 1] = this.sourceSign * (this.r + 0.003);
      this.v[k + 1] = 0;
    }
  }

  wallRadius(y: number) {
    return vesselRadius(y / this.heightScale);
  }

  private boundary(i: number) {
    this.enforceMeter(i);
    const p = this.p;
    const k = i * 3;
    const yMax = 1.62 * this.heightScale - this.r;
    for (let pass = 0; pass < 2; pass++) {
      p[k + 1] = Math.max(-yMax, Math.min(yMax, p[k + 1]));
      const y = p[k + 1];
      const r = Math.hypot(p[k], p[k + 2]);
      const allowed = Math.max(0.003, this.wallRadius(y) - 0.02 - this.r);
      const over = r - allowed;
      if (over > 0 && r > 0) {
        const slope = (this.wallRadius(y + 0.002) - this.wallRadius(y - 0.002)) / 0.004;
        const scale = over / (1 + slope * slope);
        p[k] -= (p[k] / r) * scale;
        p[k + 2] -= (p[k + 2] / r) * scale;
        p[k + 1] += slope * scale;
      }
    }
    // Final radial containment against large user-driven impulses at the neck.
    const r = Math.hypot(p[k], p[k + 2]);
    const a = Math.max(0.003, this.wallRadius(p[k + 1]) - 0.02 - this.r);
    if (r > a) {
      p[k] *= a / r;
      p[k + 2] *= a / r;
    }
    this.enforceMeter(i);
  }

  step(dt: number, gravity: Vec3 = [0, -9.81, 0]) {
    dt = Math.min(dt, 1 / 60);
    const p = this.p;
    const v = this.v;
    this.old.set(p);
    this.contacts.fill(0);
    this.admitGrains(dt);

    const drag = Math.pow(0.998, dt * 60);
    for (let i = 0; i < this.count; i++) {
      const k = i * 3;
      for (let c = 0; c < 3; c++) {
        v[k + c] = (v[k + c] + gravity[c] * dt) * drag;
        p[k + c] += v[k + c] * dt;
      }
      this.boundary(i);
    }

    const iterations = dt <= 1 / 120 ? 1 : 2;
    const c = this.cell;
    const w = this.gridWidth;
    const h = this.gridHeight;
    const ox = Math.floor(w / 2);
    const oy = Math.floor(h / 2);
    const d2 = this.d * this.d;
    for (let iteration = 0; iteration < iterations; iteration++) {
      this.grid.fill(-1);
      for (let i = 0; i < this.count; i++) {
        const k = i * 3;
        const key =
          Math.floor(p[k] / c) + ox + w * (Math.floor(p[k + 1] / c) + oy) + w * h * (Math.floor(p[k + 2] / c) + ox);
        this.next[i] = this.grid[key];
        this.grid[key] = i;
      }
      const last = iteration === iterations - 1;
      for (let i = 0; i < this.count; i++) {
        const a = i * 3;
        const cx = Math.floor(p[a] / c) + ox;
        const cy = Math.floor(p[a + 1] / c) + oy;
        const cz = Math.floor(p[a + 2] / c) + ox;
        for (let x = -1; x <= 1; x++)
          for (let y = -1; y <= 1; y++)
            for (let z = -1; z <= 1; z++) {
              let j = this.grid[cx + x + w * (cy + y) + w * h * (cz + z)];
              while (j !== -1) {
                if (j > i) {
                  const b = j * 3;
                  const dx = p[b] - p[a];
                  const dy = p[b + 1] - p[a + 1];
                  const dz = p[b + 2] - p[a + 2];
                  const sq = dx * dx + dy * dy + dz * dz;
                  if (last && sq < d2 * 1.8) {
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
      for (let i = 0; i < this.count; i++) this.boundary(i);
    }

    // Dissipate contact energy while preserving gravity-driven free fall.
    const gLength = Math.hypot(gravity[0], gravity[1], gravity[2]);
    const gx = gLength ? gravity[0] / gLength : 0;
    const gy = gLength ? gravity[1] / gLength : 0;
    const gz = gLength ? gravity[2] / gLength : 0;
    const damp = Math.pow(0.92, dt * 60);
    for (let i = 0; i < this.count; i++) {
      const k = i * 3;
      for (let c2 = 0; c2 < 3; c2++) {
        v[k + c2] = Math.max(-4, Math.min(4, (p[k + c2] - this.old[k + c2]) / dt)) * damp;
      }
      if (this.contacts[i] && gLength) {
        // Inelastic contact: remove upward bounce and damp sideways chatter,
        // retaining downward motion so friction cannot plug the throat.
        const along = v[k] * gx + v[k + 1] * gy + v[k + 2] * gz;
        const normal = along < 0 ? along * 0.15 : along;
        v[k] = (v[k] - along * gx) * 0.72 + normal * gx;
        v[k + 1] = (v[k + 1] - along * gy) * 0.72 + normal * gy;
        v[k + 2] = (v[k + 2] - along * gz) * 0.72 + normal * gz;
      }
    }
  }

  /** Every grain is below the neck on the receiving side and nearly still. */
  get allSettled(): boolean {
    const sign = this.sourceSign;
    for (let i = 0; i < this.count; i++) {
      const k = i * 3;
      if (this.p[k + 1] * sign > -0.25 || Math.hypot(this.v[k], this.v[k + 1], this.v[k + 2]) > 0.18) return false;
    }
    return true;
  }
}
