import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useInView } from "framer-motion";
import { Summary } from "../../../components/Summary";
import { GlobeCard } from "../../../components/GlobeCards";
import {
  cardData,
  type CardType,
} from "../../../components/globeCardData";

// three.js + react-three-fiber load in their own chunk, only when the globe
// section approaches the viewport. The flat earth image paints immediately
// and crossfades out once the first WebGL frame is ready.
const Globe3D = lazy(() => import("../../../components/Globe3D"));

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * If the WebGL globe throws (texture 404, driver issue, context loss during
 * init), swallow the error and tell the parent to fall back to the static
 * earth — a missing texture must never blank the whole page.
 */
class GlobeBoundary extends Component<
  { onFail: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D globe failed — falling back to static earth.", error);
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const UpdatePage = () => {
  const earthRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(earthRef, { once: true, amount: 0.15 });
  const isActive = useInView(earthRef, { amount: 0.02 });
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const markerPortalRef = useRef<HTMLDivElement>(null);
  const [showCard, setShowCard] = useState<CardType>("");
  const [globeReady, setGlobeReady] = useState(false);
  const [placeholderGone, setPlaceholderGone] = useState(false);

  const use3D = useMemo(
    () =>
      canUseWebGL() &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const [globeFailed, setGlobeFailed] = useState(false);
  const show3D = use3D && !globeFailed;

  // Warm up the globe right after load (idle time): download the three.js
  // chunk + textures and render the first frames off-screen, so the real
  // earth is already in place when the user scrolls down to it.
  const [globeMounted, setGlobeMounted] = useState(false);
  useEffect(() => {
    if (!use3D) return;
    const idle =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({} as IdleDeadline), 400));
    const cancel =
      window.cancelIdleCallback ?? ((id: number) => window.clearTimeout(id));
    const handle = idle(() => setGlobeMounted(true));
    return () => cancel(handle);
  }, [use3D]);

  // Free the placeholder image once the crossfade to WebGL has finished.
  useEffect(() => {
    if (!globeReady) return;
    const t = setTimeout(() => setPlaceholderGone(true), 1000);
    return () => clearTimeout(t);
  }, [globeReady]);

  return (
    <section className="z-10 relative scroll-mt-20 w-full max-w-full min-w-0 flex flex-col items-center justify-center overflow-hidden min-h-[var(--viewport-height)] h-[var(--viewport-height)]">
      <div
        ref={earthRef}
        className="globe-section relative w-full h-full overflow-hidden"
      >
        {/* The earth (placeholder image + WebGL canvas) dissolves toward the
            section's bottom edge via an alpha mask — the page background
            shows through, so there is no seam to color-match. The marker
            layer lives outside this wrapper and stays at full opacity. */}
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_38%,rgba(0,0,0,0.35)_72%,transparent_96%)]">
          {!(show3D && placeholderGone) && (
            <motion.img
              src="/earth2.webp"
              alt="earth"
              initial={{ rotate: show3D ? 0 : 180, opacity: 1 }}
              animate={
                isInView
                  ? {
                      rotate: !show3D
                        ? showCard === "card1"
                          ? 45
                          : showCard === "card2"
                            ? -45
                            : 0
                        : 0,
                      opacity: show3D && globeReady ? 0 : 1,
                    }
                  : { rotate: show3D ? 0 : 210 }
              }
              transition={{
                rotate: { duration: 1, ease: "easeOut" },
                opacity: { duration: 0.9, ease: "easeInOut" },
              }}
              className="absolute bottom-10 sm:bottom-5 md:-bottom-15 left-1/2 -translate-x-1/2 translate-y-[40%] w-[min(max(100%,100vh),150vh)] aspect-square"
            />
          )}

          {show3D && (globeMounted || isInView) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: globeReady ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="globe-canvas absolute bottom-10 sm:bottom-5 md:-bottom-15 left-1/2 -translate-x-1/2 translate-y-[40%] w-[min(max(100%,100vh),150vh)] aspect-square"
              aria-label="Interactive 3D globe — drag to spin"
            >
              <GlobeBoundary onFail={() => setGlobeFailed(true)}>
                <Suspense fallback={null}>
                  <Globe3D
                    activeCard={showCard}
                    setActiveCard={setShowCard}
                    onReady={() => setGlobeReady(true)}
                    active={isActive || !globeReady}
                    markerPortal={markerPortalRef}
                    entered={isInView}
                  />
                </Suspense>
              </GlobeBoundary>
            </motion.div>
          )}
        </div>

        {/* Flat fallback keeps the clickable info points when WebGL is
            unavailable, the globe failed, or reduced motion is preferred. */}
        {!show3D && (
          <div
            className="absolute top-[86%] lg:top-5/7 left-1/2 -translate-x-1/2 flex justify-between items-center w-[50%] sm:w-[45%] md:w-[40%] lg:w-[50%] "
            style={{ zIndex: 2 }}
          >
            {cardData.map((card) => (
              <GlobeCard
                key={card.id}
                data={card}
                isActive={showCard === card.id}
                onToggle={() =>
                  setShowCard(showCard === card.id ? "" : card.id)
                }
                onClose={() => setShowCard("")}
              />
            ))}
          </div>
        )}

        {/* Marker layer: mirrors the canvas geometry exactly but sits outside
            the masked earth wrapper, so the pinned info points stay bright. */}
        {show3D && (
          <div
            ref={markerPortalRef}
            className="pointer-events-none absolute bottom-10 sm:bottom-5 md:-bottom-15 left-1/2 -translate-x-1/2 translate-y-[40%] w-[min(max(100%,100vh),150vh)] aspect-square z-20"
          />
        )}
      </div>
      <Summary ref={summaryRef} />
    </section>
  );
};

export default UpdatePage;
