/**
 * Screen-space outline of the Why-Us hourglass for CSS `shape-outside`, so the
 * section copy wraps around the vessel and reflows as it tilts or lifts.
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
 * Outline in canvas pixels (origin top-left of the canvas, y down), shifted by
 * `offsetX`/`offsetY` into the coordinate space of the element that carries
 * the shape, and formatted as a CSS `polygon()`.
 */
export function silhouettePolygon(
  pose: HourglassPose,
  canvasWidth: number,
  canvasHeight: number,
  offsetX: number,
  offsetY: number,
): string {
  const scale = canvasHeight / VISIBLE_UNITS;
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2 + TARGET_Y * scale;
  const cos = Math.cos(pose.tilt);
  const sin = Math.sin(pose.tilt);
  const points = OUTLINE.map(([x, y]) => {
    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos + pose.lift;
    const px = cx + rx * FORESHORTEN * scale + offsetX;
    const py = cy - ry * scale + offsetY;
    return `${px.toFixed(1)}px ${py.toFixed(1)}px`;
  });
  return `polygon(${points.join(", ")})`;
}

/**
 * Format a projected outline (canvas px, flattened x/y pairs, as emitted by
 * HourglassView.onOutline) as a CSS `polygon()` in an element's coordinates.
 */
export function polygonFromPoints(
  points: Float32Array,
  offsetX: number,
  offsetY: number,
): string {
  const parts: string[] = [];
  for (let i = 0; i < points.length; i += 2) {
    parts.push(`${(points[i] + offsetX).toFixed(1)}px ${(points[i + 1] + offsetY).toFixed(1)}px`);
  }
  return `polygon(${parts.join(", ")})`;
}
