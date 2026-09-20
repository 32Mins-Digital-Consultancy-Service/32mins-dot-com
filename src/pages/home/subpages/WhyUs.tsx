import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearCache,
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import { SectionHeader } from "../../../components/SectionHeader";
import CtaButton from "../../../components/CtaButton";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Rightarro from "../../../assets/Rightarro.svg";
import {
  outlineExtent,
  silhouettePoints,
} from "../../../lib/hourglassSilhouette";

// three.js + the granular simulation ship in their own chunk and load only
// once the Why-Us visual approaches the viewport; the canvas fades in when
// the first WebGL frame is ready. There is no static stand-in.
const Hourglass3D = lazy(() => import("../../../components/Hourglass3D"));

/** Canvas box at lg and up; the copy columns wrap around it. */
const CANVAS_W = 320;
const CANVAS_H = 400;
/**
 * The canvas has empty margin above and below the vessel, so it is allowed to
 * overhang the copy row by this much on each side. That keeps the section
 * short without shrinking the hourglass.
 */
const CANVAS_OVERHANG = 60;
const ROW_H = CANVAS_H - CANVAS_OVERHANG * 2;
/** Tailwind `gap-x-8` between the two copy columns. */
const COLUMN_GAP = 32;
/** Breathing room between the vessel's outline and the copy. */
const SHAPE_MARGIN = 18;
/** Left copy sits this much above the vessel's centre line... */
const LEFT_RISE = 28;
/** ...and the right copy starts this far below the left. */
const RIGHT_STAGGER = 44;
/** A line narrower than this is skipped rather than squeezed. */
const MIN_LINE_W = 48;
/** `mt-8` above the call-to-action and the button's rendered height. */
const CTA_GAP = 32;
const CTA_H = 48;

const LEFT_COPY =
  "We focus on creating compelling, engaging, high-quality digital education and corporate training video content that is tailor-made according to the needs of your learner or the end listener.";
const RIGHT_COPY =
  "Our team of experts understand and deliver highly complex and informative materials converted into innovative, watchable, and captivating learning videos through online or offline mediums.";

type Side = "left" | "right";

interface WrapLine {
  text: string;
  /** Pixels this line gives up on the vessel side. */
  inset: number;
}

interface TextMetrics {
  /** Canvas-style font string matching the column's computed CSS. */
  font: string;
  lineHeight: number;
  width: number;
}

/**
 * How far the vessel pushes into a column for one line band. `y0..y1` is the
 * band in canvas coordinates (canvas top = row top − CANVAS_OVERHANG). Each
 * column's inner edge sits half the column gap from the canvas centre line.
 */
function intrusion(points: Float32Array, side: Side, y0: number, y1: number) {
  const extent = outlineExtent(points, y0, y1);
  if (!extent) return 0;
  const edge =
    side === "left" ? CANVAS_W / 2 - COLUMN_GAP / 2 : CANVAS_W / 2 + COLUMN_GAP / 2;
  return side === "left"
    ? Math.max(0, edge - (extent[0] - SHAPE_MARGIN))
    : Math.max(0, extent[1] + SHAPE_MARGIN - edge);
}

/**
 * Flow a paragraph down a column one line at a time with pretext, giving each
 * line only the width the vessel leaves free at that height. Pure arithmetic
 * over pretext's cached measurements — no DOM reads.
 */
function layoutColumn(
  prepared: PreparedTextWithSegments,
  side: Side,
  points: Float32Array,
  metrics: TextMetrics,
  pad: number,
): WrapLine[] {
  const lines: WrapLine[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = 0;
  for (let guard = 0; guard < 80; guard++) {
    const top = pad + y + CANVAS_OVERHANG;
    const inset = Math.min(
      metrics.width,
      intrusion(points, side, top, top + metrics.lineHeight),
    );
    const available = metrics.width - inset;
    y += metrics.lineHeight;
    if (available < MIN_LINE_W) {
      lines.push({ text: "", inset });
      continue;
    }
    const range = layoutNextLineRange(prepared, cursor, available);
    if (range === null) break;
    lines.push({ text: materializeLineRange(prepared, range).text, inset });
    cursor = range.end;
  }
  return lines;
}

/**
 * Reads the font and line height the column actually renders with (the size
 * is a viewport clamp) plus its width, and refreshes them on resize and once
 * web fonts finish loading so pretext measures with the real face.
 */
function useTextMetrics(
  ref: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
): TextMetrics | null {
  const [metrics, setMetrics] = useState<TextMetrics | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) {
      setMetrics(null);
      return;
    }
    const read = () => {
      const cs = getComputedStyle(el);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.625;
      const width = el.clientWidth;
      setMetrics((current) =>
        current &&
        current.font === font &&
        current.lineHeight === lineHeight &&
        current.width === width
          ? current
          : { font, lineHeight, width },
      );
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      // Widths measured before the web font arrived are stale.
      clearCache();
      setMetrics(null);
      read();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [ref, enabled]);
  return metrics;
}

/** Prepare a paragraph for pretext once per font string. */
function usePrepared(text: string, font: string | undefined) {
  const [prepared, setPrepared] = useState<{
    font: string;
    value: PreparedTextWithSegments;
  } | null>(null);
  useEffect(() => {
    if (!font) return;
    setPrepared({ font, value: prepareWithSegments(text, font) });
  }, [text, font]);
  return prepared && prepared.font === font ? prepared.value : null;
}

/** Render pretext's lines as fixed-height rows; the whole copy stays readable. */
const WrappedLines = ({
  lines,
  side,
  lineHeight,
  text,
}: {
  lines: WrapLine[];
  side: Side;
  lineHeight: number;
  text: string;
}) => (
  <>
    <div aria-hidden="true">
      {lines.map((line, i) => (
        <div
          key={i}
          className="whitespace-nowrap"
          style={{
            height: lineHeight,
            paddingRight: side === "left" ? line.inset : 0,
            paddingLeft: side === "right" ? line.inset : 0,
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
    <p className="sr-only">{text}</p>
  </>
);

/** True at Tailwind's `lg` breakpoint and up, tracking viewport changes. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

function canUseWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * If the lazy chunk or the WebGL hourglass throws during render, swallow it
 * and tell the parent to fall back to plain copy — never blank the section.
 */
class HourglassBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D hourglass failed — falling back to plain copy.", error);
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const REVEAL = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  viewport: { once: true, amount: 0.2 },
};

const UPRIGHT = silhouettePoints({ tilt: 0, lift: 0 }, CANVAS_W, CANVAS_H);

export const WhyUsPage = () => {
  const navigate = useNavigate();
  const visualRef = useRef<HTMLDivElement>(null);
  // Start downloading the chunk + model well before the visual scrolls in.
  const isNear = useInView(visualRef, { once: true, margin: "600px 0px" });
  // Physics only steps while the hourglass is actually on screen.
  const isActive = useInView(visualRef, { amount: 0.05 });
  const [use3D] = useState(
    () =>
      canUseWebGL2() &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  // Live projected outline of the vessel; the copy reflows as it tilts or
  // lifts. Null until the first WebGL frame.
  const [outline, setOutline] = useState<Float32Array | null>(null);
  // The 3D vessel is desktop-only; below lg the copy is plain stacked text.
  const isDesktop = useIsDesktop();
  const show3D = use3D && !failed && isDesktop;

  const leftCol = useRef<HTMLDivElement>(null);
  const rightCol = useRef<HTMLDivElement>(null);
  const leftMetrics = useTextMetrics(leftCol, show3D);
  const rightMetrics = useTextMetrics(rightCol, show3D);
  const leftPrepared = usePrepared(LEFT_COPY, leftMetrics?.font);
  const rightPrepared = usePrepared(RIGHT_COPY, rightMetrics?.font);

  const points = outline ?? UPRIGHT;

  // Left column: its midpoint sits LEFT_RISE above the neck. The wrap depends
  // on the top padding and the padding on the wrapped height, so iterate a few
  // times; it converges immediately in practice.
  let leftPad = 0;
  let leftLines: WrapLine[] = [];
  if (leftPrepared && leftMetrics) {
    for (let i = 0; i < 4; i++) {
      leftLines = layoutColumn(leftPrepared, "left", points, leftMetrics, leftPad);
      const height = leftLines.length * leftMetrics.lineHeight;
      const next = Math.max(0, Math.round(ROW_H / 2 - height / 2 - LEFT_RISE));
      if (next === leftPad) break;
      leftPad = next;
    }
  }
  const rightPad = leftPad + RIGHT_STAGGER;
  const rightLines =
    rightPrepared && rightMetrics
      ? layoutColumn(rightPrepared, "right", points, rightMetrics, rightPad)
      : [];
  // The call-to-action under the right copy steps aside for the vessel too.
  const ctaTop =
    rightPad +
    (rightMetrics ? rightLines.length * rightMetrics.lineHeight : 0) +
    CTA_GAP +
    CANVAS_OVERHANG;
  const ctaInset =
    show3D && rightMetrics
      ? Math.min(rightMetrics.width / 2, intrusion(points, "right", ctaTop, ctaTop + CTA_H))
      : 0;

  const copyClass =
    "text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-[#8E8E8E]";

  return (
    <div className="site-container flex flex-col items-center gap-[clamp(1.25rem,2.5vw,2rem)]">
      <SectionHeader pill="Why Us" title="What makes us stand out in the industry" />

      <div className="relative w-full">
        {/* Hourglass, centered in the row; desktop only. */}
        {show3D && (
          <motion.div
            ref={visualRef}
            {...REVEAL}
            className="absolute left-1/2 z-20 -translate-x-1/2"
            style={{ width: CANVAS_W, height: CANVAS_H, top: -CANVAS_OVERHANG }}
          >
            {isNear && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <HourglassBoundary onFail={() => setFailed(true)}>
                  <Suspense fallback={null}>
                    <Hourglass3D
                      active={isActive}
                      onReady={() => setReady(true)}
                      onOutline={setOutline}
                      onFail={(error) => {
                        console.warn("3D hourglass failed — hiding it.", error);
                        setFailed(true);
                      }}
                    />
                  </Suspense>
                </HourglassBoundary>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Copy in two columns around the vessel. With the vessel showing,
            each paragraph is laid out line by line with pretext and every
            line is given only the width the vessel's live outline leaves
            free, so the text hugs the hourglass and reflows as it tilts or
            lifts. Without the vessel (mobile, no WebGL, reduced motion) it is
            plain stacked copy. */}
        <div
          className={
            show3D
              ? "grid grid-cols-2 gap-x-8"
              : "mx-auto grid max-w-3xl grid-cols-1 gap-y-6"
          }
          style={show3D ? { minHeight: ROW_H } : undefined}
        >
          <motion.div
            ref={leftCol}
            {...REVEAL}
            className={`${copyClass} ${show3D ? "text-right" : ""}`}
            style={show3D ? { paddingTop: leftPad } : undefined}
          >
            {show3D && leftMetrics && leftLines.length > 0 ? (
              <WrappedLines
                lines={leftLines}
                side="left"
                lineHeight={leftMetrics.lineHeight}
                text={LEFT_COPY}
              />
            ) : (
              <p>{LEFT_COPY}</p>
            )}
          </motion.div>
          <motion.div
            ref={rightCol}
            {...REVEAL}
            className={copyClass}
            style={show3D ? { paddingTop: rightPad } : undefined}
          >
            {show3D && rightMetrics && rightLines.length > 0 ? (
              <WrappedLines
                lines={rightLines}
                side="right"
                lineHeight={rightMetrics.lineHeight}
                text={RIGHT_COPY}
              />
            ) : (
              <p>{RIGHT_COPY}</p>
            )}
            <div className="mt-8 flex" style={{ paddingLeft: ctaInset }}>
              <CtaButton
                variant="primary"
                onClick={() => {
                  navigate("/#contactus");
                }}
              >
                Get in touch
                <Rightarro className="w-4 -ml-1 -mr-2 pt-0.5" />
              </CtaButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhyUsPage;
