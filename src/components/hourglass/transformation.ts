/**
 * Which chamber is currently the "input" (top) one. A flip that comes to rest
 * inverted swaps the roles and starts a new cycle.
 */
export class Transformation {
  inputSign = 1;
  cycle = 1;
  private candidate = 1;
  private stableFor = 0;
  private previousTilt = 0;

  reset() {
    this.inputSign = 1;
    this.cycle = 1;
    this.candidate = 1;
    this.stableFor = 0;
    this.previousTilt = 0;
  }

  /** Returns true on the frame the roles swap. */
  update(tilt: number, dt: number): boolean {
    if (dt <= 0) return false;
    const speed = Math.abs(tilt - this.previousTilt) / dt;
    this.previousTilt = tilt;
    const c = Math.cos(tilt);
    const candidate = c > 0.68 ? 1 : c < -0.68 ? -1 : 0;
    if (!candidate || candidate === this.inputSign || speed > 0.65) {
      this.stableFor = 0;
      this.candidate = candidate;
      return false;
    }
    if (candidate !== this.candidate) {
      this.candidate = candidate;
      this.stableFor = 0;
    }
    this.stableFor += dt;
    if (this.stableFor < 0.3) return false;
    this.inputSign = candidate;
    this.cycle++;
    this.stableFor = 0;
    return true;
  }
}
