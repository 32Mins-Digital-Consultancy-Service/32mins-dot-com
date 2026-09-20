/**
 * Screen-space outline of the Why-Us hourglass, used to flow the section
 * copy around the vessel (see WhyUs.tsx). While the WebGL view is live it
 * reports its own projected hull; this analytic version stands in for the
 * upright pose until the first frame arrives.
 *
 * The camera in HourglassView is fixed (fov 34°, ~8.3 units from the vessel),
 * so the projection reduces to a scale and a mild horizontal foreshortening.
 * The outline is the frame's bounding box (caps + pillars) with bevelled
 * corners; the glass waist is narrower but the pillars define what text must
 * avoid.
 */

export interface HourglassPose {
  /** Rotation about the view axis in radians (0 = upright). */
  tilt: number;
  /** Vertical offset in scene units. */
  lift: number;
}

/** Scene units spanned by the canvas height at the vessel's distance. */
const VISIBLE_UNITS = 5.08;
/**
 * Frame half extents as they project on screen, in scene units. Larger than
 * the model's true bounds because the camera looks slightly down at the
 * vessel (the top cap's face adds height) and the near side is closer.
 */
const HALF_W = 1.15;
const HALF_H = 1.76;
/** Corner bevel sizes. */
const BEVEL_X = 0.2;
const BEVEL_Y = 0.14;
/** The camera sits ~27° around from the front; x reads slightly compressed. */
const FORESHORTEN = 0.89;
/** Lookat target is 0.05 units below the origin, so the origin sits above center. */
const TARGET_Y = -0.05;

const OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [-HALF_W + BEVEL_X, HALF_H],
  [HALF_W - BEVEL_X, HALF_H],
  [HALF_W, HALF_H - BEVEL_Y],
  [HALF_W, -HALF_H + BEVEL_Y],
  [HALF_W - BEVEL_X, -HALF_H],
  [-HALF_W + BEVEL_X, -HALF_H],
  [-HALF_W, -HALF_H + BEVEL_Y],
  [-HALF_W, HALF_H - BEVEL_Y],
];

/**
 * Outline in canvas pixels (origin top-left of the canvas, y down), flattened
 * as x0, y0, x1, y1, … — the same format HourglassView.onOutline emits.
 */
export function silhouettePoints(
  pose: HourglassPose,
  canvasWidth: number,
  canvasHeight: number,
): Float32Array {
  const scale = canvasHeight / VISIBLE_UNITS;
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2 + TARGET_Y * scale;
  const cos = Math.cos(pose.tilt);
  const sin = Math.sin(pose.tilt);
  const out = new Float32Array(OUTLINE.length * 2);
  OUTLINE.forEach(([x, y], i) => {
    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos + pose.lift;
    out[i * 2] = cx + rx * FORESHORTEN * scale;
    out[i * 2 + 1] = cy - ry * scale;
  });
  return out;
}

/**
 * Horizontal extent [minX, maxX] of a closed polygon within the horizontal
 * band y0..y1, or null when the band misses it. Points are flattened x/y.
 */
export function outlineExtent(
  points: Float32Array,
  y0: number,
  y1: number,
): [number, number] | null {
  const n = points.length / 2;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    const ax = points[i * 2];
    const ay = points[i * 2 + 1];
    const j = (i + 1) % n;
    const bx = points[j * 2];
    const by = points[j * 2 + 1];
    if (ay >= y0 && ay <= y1) {
      if (ax < min) min = ax;
      if (ax > max) max = ax;
    }
    // Edge crossings of the band's two horizontals.
    for (const yy of [y0, y1]) {
      if ((ay - yy) * (by - yy) < 0) {
        const x = ax + ((bx - ax) * (yy - ay)) / (by - ay);
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
  }
  return min === Infinity ? null : [min, max];
}
