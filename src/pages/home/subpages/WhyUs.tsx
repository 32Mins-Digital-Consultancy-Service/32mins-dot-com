import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SectionHeader } from "../../../components/SectionHeader";
import CtaButton from "../../../components/CtaButton";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Rightarro from "../../../assets/Rightarro.svg";
import {
  polygonFromPoints,
  silhouettePolygon,
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
/**
 * Vertically places a copy column against the vessel: measures the column's
 * text and returns the top padding that puts its midpoint `rise` px above the
 * canvas centre (where the neck is). Debounced so a drag-induced re-wrap does
 * not jitter.
 */
function useCenteredPad(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean, rise: number) {
  const [pad, setPad] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) {
      setPad(0);
      return;
    }
    let timer = 0;
    const measure = () => {
      const next = Math.max(
        0,
        Math.round(ROW_H / 2 - el.getBoundingClientRect().height / 2 - rise),
      );
      setPad((current) => (Math.abs(current - next) > 6 ? next : current));
    };
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, 150);
    });
    observer.observe(el);
    measure();
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [ref, enabled, rise]);
  return pad;
}
/**
 * Width of the invisible float in each column that carries the vessel's
 * silhouette. Wider than half the canvas so a tilted vessel can still push
 * text aside instead of overlapping it.
 */
const FLOAT_W = CANVAS_W / 2 + 96;
const SHAPE_MARGIN = 18;
/** Left copy sits this much above the vessel's centre line... */
const LEFT_RISE = 28;
/** ...and the right copy starts this far below the left. */
const RIGHT_STAGGER = 44;

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
 * and tell the parent to keep the static image — never blank the section.
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
    console.warn("3D hourglass failed — keeping the static image.", error);
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
  // Live projected outline of the vessel; the copy's wrap shapes follow it as
  // it tilts or lifts. Null until the first WebGL frame (or for the image).
  const [outline, setOutline] = useState<Float32Array | null>(null);
  // The 3D vessel is desktop-only; below lg the static image is the visual.
  const isDesktop = useIsDesktop();
  const show3D = use3D && !failed && isDesktop;
  const leftText = useRef<HTMLDivElement>(null);
  const leftPad = useCenteredPad(leftText, show3D, LEFT_RISE);
  const rightPad = leftPad + RIGHT_STAGGER;

  // The canvas is centered in the row; each column's float box ends 16px
  // (half the column gap) short of that center line, and starts at the
  // column's top padding, so the outline is shifted into each float's space.
  const leftOffset = FLOAT_W - CANVAS_W / 2 + 16;
  const rightOffset = -CANVAS_W / 2 - 16;
  const upright = { tilt: 0, lift: 0 };
  const leftShape = outline
    ? polygonFromPoints(outline, leftOffset, -CANVAS_OVERHANG - leftPad)
    : silhouettePolygon(upright, CANVAS_W, CANVAS_H, leftOffset, -CANVAS_OVERHANG - leftPad);
  const rightShape = outline
    ? polygonFromPoints(outline, rightOffset, -CANVAS_OVERHANG - rightPad)
    : silhouettePolygon(upright, CANVAS_W, CANVAS_H, rightOffset, -CANVAS_OVERHANG - rightPad);

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-[clamp(1.25rem,2.5vw,2rem)] px-[clamp(1rem,4vw,2.5rem)]">
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

        {/* Copy in two columns around the vessel. Each column carries an
            invisible float shaped like the vessel's outline, so the text wraps
            the hourglass and reflows live when it tilts or lifts. Without the
            vessel (mobile, no WebGL, reduced motion) it is plain stacked copy. */}
        <div
          className={
            show3D
              ? "grid grid-cols-2 gap-x-8"
              : "mx-auto grid max-w-3xl grid-cols-1 gap-y-6"
          }
          style={show3D ? { minHeight: ROW_H } : undefined}
        >
          <motion.div
            {...REVEAL}
            className={`text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-[#8E8E8E] ${show3D ? "text-right" : ""}`}
            style={show3D ? { paddingTop: leftPad } : undefined}
          >
            {show3D && (
              <div
                aria-hidden="true"
                className="float-right"
                style={{ width: FLOAT_W, height: Math.max(0, ROW_H + CANVAS_OVERHANG - leftPad), shapeOutside: leftShape, shapeMargin: SHAPE_MARGIN }}
              />
            )}
            <div ref={leftText}>
              <p>
                We focus on creating compelling, engaging, high-quality digital
                education and corporate training video content that is
                tailor-made according to the needs of your learner or the end
                listener.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...REVEAL}
            className="text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-[#8E8E8E]"
            style={show3D ? { paddingTop: rightPad } : undefined}
          >
            {show3D && (
              <div
                aria-hidden="true"
                className="float-left"
                style={{ width: FLOAT_W, height: Math.max(0, ROW_H + CANVAS_OVERHANG - rightPad), shapeOutside: rightShape, shapeMargin: SHAPE_MARGIN }}
              />
            )}
            <div>
              <p>
                Our team of experts understand and deliver highly complex and
                informative materials converted into innovative, watchable, and
                captivating learning videos through online or offline mediums.
              </p>
              <div className="mt-8 flex">
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhyUsPage;
