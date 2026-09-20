/**
 * Chamber-role state machine. A flip that comes to rest (the axis pointing
 * the other way for 0.3 s, not still swinging) swaps which chamber feeds the
 * neck. Camera orbit never enters this state.
 */
export class Transformation {
  /** +1: the upper chamber (local +Y) is the source; -1: the lower one. */
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

  /** `tilt` is the angle between the vessel axis and world up. Returns true when roles swapped. */
  update(tilt: number, dt: number): boolean {
    if (dt <= 0) return false;
    const speed = Math.abs(tilt - this.previousTilt) / dt;
    this.previousTilt = tilt;
    const c = Math.cos(tilt);
    const candidate = c > 0.2 ? 1 : c < -0.2 ? -1 : 0;
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

  /** 1 in the receiving chamber, 0 in the source, null in the neck band. */
  targetRefinement(y: number): number | null {
    const s = y * this.inputSign;
    return s < -0.035 ? 1 : s > 0.035 ? 0 : null;
  }
}
