import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Site-wide inertia scrolling via Lenis. Touch scrolling stays native
 * (syncTouch off) and users who prefer reduced motion get the browser's
 * default scroll — components fall back to native APIs when `useLenis()`
 * returns undefined.
 */
export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
