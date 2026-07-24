import { useCallback, useRef } from "react";
import CtaButton from "../../../components/CtaButton";
import Down from "../../../assets/down.svg";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLenis } from "lenis/react";
import Rightarro from "../../../assets/Rightarro.svg";
import { smoothScrollTo } from "../../../lib/scroll";

export const HeroSection = () => {
  const navigate = useNavigate();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // A long, gentle glide down to the globe — no snap.
  const scrollOneScreen = useCallback(() => {
    smoothScrollTo(lenis, window.scrollY + window.innerHeight, {
      duration: 2.2,
      easing: (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
    });
  }, [lenis]);

  // Mouse-follow depth: headline and logo drift at different rates.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 55, damping: 16 });
  const springY = useSpring(pointerY, { stiffness: 55, damping: 16 });
  const headlineX = useTransform(springX, (v) => v * 14);
  const headlineY = useTransform(springY, (v) => v * 10);
  const logoX = useTransform(springX, (v) => v * 32);
  const logoY = useTransform(springY, (v) => v * 24);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  // Scroll melt: hero content drifts up and fades as the globe rises below,
  // so the hero -> globe handoff reads as one continuous motion.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const meltY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const meltOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="flex flex-col items-center justify-center max-w-6xl min-h-[var(--viewport-height)] h-[var(--viewport-height)] w-full min-w-0 overflow-x-hidden px-4 box-border"
    >
      <motion.div
        className="flex flex-col items-center justify-center font-extrabold"
        style={{
          gap: "clamp(2rem, 1.5vw, 2rem)",
          y: reduceMotion ? 0 : meltY,
          opacity: reduceMotion ? 1 : meltOpacity,
        }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{ gap: "clamp(1rem, 2vw, 2rem)" }}
        >
          <motion.h3
            className="text-[#8E8E8E] text-center leading-[150%] tracking-[0.32em] "
            style={{ fontSize: "clamp(0.625rem, 2vw, 1.5rem)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0, ease: "easeIn" }}
          >
            CONVERTING
          </motion.h3>
          <motion.h1
            className="tracking-tighter leading-none text-center relative"
            style={{
              // vh term keeps the headline from swallowing short laptops
              fontSize: "clamp(1.5rem, min(7vw, 11vh), 6rem)",
              x: headlineX,
              y: headlineY,
            }}
          >
            {/* Base white text - always visible underneath */}
            <span className="text-white">
              Meaningful Knowledge Impactful Digital Content
            </span>
            <motion.img
              src="/Sym.png"
              alt="32Mins logo symbol"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 md:w-40 lg:w-48 xl:w-[12.5rem] z-1000 max-w-[90vw]"
              initial={{ scale: 1, rotate: 0 }}
              animate={{
                scale: [1, 1.3, 1],
                rotate: 360,
              }}
              transition={{
                scale: { duration: 5, ease: "easeInOut" },
                rotate: { duration: 5, ease: "linear", repeat: Infinity },
              }}
              style={{ x: logoX, y: logoY }}
            />
            {/* Gradient overlay - fades out on first load to reveal white text */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#FFFFFF] to-[#000000] bg-clip-text text-transparent"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2, delay: 0, ease: "easeIn" }}
              aria-hidden="true"
            >
              Meaningful Knowledge Impactful Digital Content
            </motion.span>
          </motion.h1>
          <h3
            className="text-[#8E8E8E] text-center leading-[150%] tracking-[0.32em] typewriter"
            style={{ fontSize: "clamp(0.625rem, 2vw, 1.5rem)" }}
          >
            FOR EVERYONE
          </h3>
        </div>
        <div className="flex" style={{ gap: "clamp(0.5rem, 1vw, 0.75rem)" }}>
          <CtaButton
            variant="secondary"
            onClick={() => {
              navigate("/#solutions");
            }}
          >
            Consume
          </CtaButton>
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

      <motion.button
        type="button"
        onClick={scrollOneScreen}
        className="flex flex-col items-center justify-center absolute bottom-14 arrowFromTop-effect cursor-pointer bg-transparent border-none outline-none"
        aria-label="Scroll down"
        style={{ opacity: reduceMotion ? 1 : meltOpacity }}
      >
        <Down />
        <Down />
      </motion.button>
    </div>
  );
};

export default HeroSection;
