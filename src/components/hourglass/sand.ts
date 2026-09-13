/**
 * Inner wall profile of the glass vessel: radius as a function of height along
 * the hourglass axis, in the GLB's unscaled model units (the vessel node then
 * applies a 0.82 Y scale — see `GranularSand.heightScale`). Cubic Hermite
 * interpolation through the knots that the Blender source used.
 */
const PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0, 0.082],
  [0.15, 0.102],
  [0.4, 0.22],
  [0.7, 0.46],
  [1, 0.64],
  [1.3, 0.71],
  [1.52, 0.71],
  [1.63, 0.62],
  [1.68, 0.001],
];

export function vesselRadius(z: number): number {
  z = Math.abs(z);
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [a, r] = PROFILE[i];
    const [b, s] = PROFILE[i + 1];
    if (z > b) continue;
    const t = Math.max(0, (z - a) / (b - a));
    const prev = PROFILE[Math.max(0, i - 1)];
    const next = PROFILE[Math.min(PROFILE.length - 1, i + 2)];
    const m0 = (s - prev[1]) / (b - prev[0]);
    const m1 = (next[1] - r) / (next[0] - a);
    const t2 = t * t;
    const t3 = t2 * t;
    return Math.max(
      0.001,
      (2 * t3 - 3 * t2 + 1) * r +
        (t3 - 2 * t2 + t) * (b - a) * m0 +
        (-2 * t3 + 3 * t2) * s +
        (t3 - t2) * (b - a) * m1,
    );
  }
  return 0.001;
}
