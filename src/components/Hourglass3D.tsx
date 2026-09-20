import { useEffect, useRef } from "react";
import { HourglassView } from "./hourglass/HourglassView";

const MODEL_URL = "/hourglass/hourglass.glb";
/** Active flow time for one metered pass of every grain through the neck. */
const CYCLE_SECONDS = 32;
/**
 * The engine itself never forces a turn while grains remain upstream; this
 * long safety only guards against a permanently wedged grain on a live page.
 */
const SETTLE_TIMEOUT_SECONDS = 45;

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
 * The Why-Us hourglass: GLB vessel plus a live granular simulation of 3,200
 * small metallic grains. Runs a 32-second metered cycle, waits until every
 * grain is through and still, turns itself over and repeats. Loaded via
 * React.lazy so three.js and the simulation ship in their own chunk.
 */
export default function Hourglass3D({
  active,
  onReady,
  onFail,
  onOutline,
}: Hourglass3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const grabRef = useRef<HTMLDivElement>(null);
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
    view.onContextLost = () =>
      callbacks.current.onFail(new Error("WebGL context lost"));
    view.onOutline = (points) => {
      // Only the vessel itself takes the pointer; the rest of the canvas box
      // lets clicks through to the copy and the call-to-action beneath it.
      const grab = grabRef.current;
      if (grab && points.length >= 4) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 0; i < points.length; i += 2) {
          minX = Math.min(minX, points[i]); maxX = Math.max(maxX, points[i]);
          minY = Math.min(minY, points[i + 1]); maxY = Math.max(maxY, points[i + 1]);
        }
        const pad = 10;
        grab.style.left = `${minX - pad}px`;
        grab.style.top = `${minY - pad}px`;
        grab.style.width = `${maxX - minX + pad * 2}px`;
        grab.style.height = `${maxY - minY + pad * 2}px`;
      }
      callbacks.current.onOutline?.(points);
    };

    const loop = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(loop);
      if (!activeRef.current || document.hidden) {
        previous = 0;
        return;
      }
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;

      // The clock only runs while the receiving side is downhill and no
      // flip is in progress — it pauses while the user holds it sideways.
      if (view.canFlow) {
        session.elapsed = Math.min(CYCLE_SECONDS, session.elapsed + delta);
      }
      view.setProgress(session.elapsed / CYCLE_SECONDS, true);
      view.render(delta);

      if (session.elapsed >= CYCLE_SECONDS && !session.flipped && !view.flipping) {
        session.overtime += delta;
        if (view.readyToFlip || session.overtime > SETTLE_TIMEOUT_SECONDS) {
          view.flip();
          session.flipped = true;
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
      role="group"
      tabIndex={0}
      aria-label="Interactive 3D hourglass: grains flow from one chamber to the other, then it turns over. Drag sideways to roll it, drag up or down to tilt it in depth, shift-drag to lift it. Arrow keys do the same."
      className="relative h-full w-full select-none pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 rounded-xl"
    >
      <div
        ref={grabRef}
        aria-hidden="true"
        className="absolute pointer-events-auto touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ left: "25%", top: "12%", width: "50%", height: "76%" }}
      />
    </div>
  );
}
