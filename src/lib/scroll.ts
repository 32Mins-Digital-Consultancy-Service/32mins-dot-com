import type Lenis from "lenis";

/**
 * Smooth-scroll to a target through Lenis when it's active, falling back to
 * native smooth scrolling (reduced-motion users, or before Lenis mounts).
 * Element targets respect their CSS `scroll-margin-top` (Tailwind scroll-mt-*)
 * so the fixed header offset stays defined in one place.
 */
export function smoothScrollTo(
  lenis: Lenis | null | undefined,
  target: number | HTMLElement,
  options: {
    immediate?: boolean;
    duration?: number;
    easing?: (t: number) => number;
  } = {},
) {
  if (lenis) {
    const offset =
      typeof target === "number"
        ? 0
        : -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    lenis.scrollTo(target, {
      offset,
      immediate: options.immediate,
      duration: options.duration,
      easing: options.easing,
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({
      top: target,
      behavior: options.immediate ? "auto" : "smooth",
    });
  } else {
    target.scrollIntoView({
      behavior: options.immediate ? "auto" : "smooth",
      block: "start",
    });
  }
}
