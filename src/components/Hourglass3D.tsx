import { useEffect, useRef } from "react";
import { HourglassView } from "./hourglass/HourglassView";

const MODEL_URL = "/hourglass/hourglass.glb";
/** Active upright time for one metered pass of every numeral through the neck. */
const CYCLE_SECONDS = 32;
/** If a grain wedges and the pile never "settles", flip anyway after this long. */
const SETTLE_TIMEOUT_SECONDS = 10;

interface Hourglass3DProps {
  /** Step physics and draw frames only while true (section in view). */
  active: boolean;
  /** First frame with the model is on screen — crossfade the placeholder out. */
  onReady: () => void;
  /** WebGL or asset failure — show the static hourglass instead. */
  onFail: (error: unknown) => void;
  /** Screen-space outline of the vessel (canvas px, x/y pairs) when it changes. */
  onOutline?: (points: Float32Array) => void;
}

/**
 * The Why-Us hourglass: GLB vessel plus a live granular simulation of 1,000
 * camera-facing "32" numerals. Runs a 32-second metered cycle, waits for the
 * pile to settle, turns itself over and repeats. Loaded via React.lazy so
 * three.js and the simulation ship in their own chunk (see WhyUs.tsx).
 */
export default function Hourglass3D({
  active,
  onReady,
  onFail,
  onOutline,
}: Hourglass3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const callbacks = useRef({ onReady, onFail, onOutline });
  useEffect(() => {
    activeRef.current = active;
    callbacks.current = { onReady, onFail, onOutline };
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let view: HourglassView;
    try {
      view = new HourglassView(el, { assetUrl: MODEL_URL });
    } catch (error) {
      callbacks.current.onFail(error);
      return;
    }

    let disposed = false;
    let frame = 0;
    let previous = 0;
    const session = { elapsed: 0, flipped: false, overtime: 0 };

    view.onCycle = () => {
      session.elapsed = 0;
      session.flipped = false;
      session.overtime = 0;
    };
    view.onFlipInterrupted = () => {
      session.flipped = false;
    };
    view.onContextLost = () =>
      callbacks.current.onFail(new Error("WebGL context lost"));
    view.onOutline = (points) => callbacks.current.onOutline?.(points);

    const loop = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(loop);
      if (!activeRef.current || document.hidden) {
        previous = 0;
        return;
      }
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;

      // The clock only runs while the vessel is upright (or inverted) enough
      // to flow — it pauses while the user holds it sideways or mid-flip.
      if (view.canFlow) {
        session.elapsed = Math.min(CYCLE_SECONDS, session.elapsed + delta);
      }
      view.setProgress(session.elapsed / CYCLE_SECONDS);
      view.render(delta);

      if (session.elapsed >= CYCLE_SECONDS && !session.flipped) {
        session.overtime += delta;
        if (view.readyToFlip || session.overtime > SETTLE_TIMEOUT_SECONDS) {
          session.flipped = view.flip();
        }
      }
    };

    view.ready
      .then(() => {
        if (disposed) return;
        callbacks.current.onReady();
        frame = requestAnimationFrame(loop);
      })
      .catch((error: unknown) => {
        if (!disposed) callbacks.current.onFail(error);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      view.dispose();
    };
  }, []);

  return (
    <div
      ref={host}
      role="img"
      aria-label="Interactive 3D hourglass: numerals flow from one chamber to the other, then it turns over. Drag sideways to tilt it, drag up or down to lift it."
      className="h-full w-full touch-pan-y select-none cursor-grab active:cursor-grabbing"
    />
  );
}
