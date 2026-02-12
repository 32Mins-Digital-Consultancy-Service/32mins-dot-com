import { useCallback } from "react";
import CtaButton from "../../../components/CtaButton";
import Down from "../../../assets/down.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const scrollOneScreen = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl h-screen w-full min-w-0 overflow-x-hidden px-4 box-border">
      <div
        className="flex flex-col items-center justify-center font-extrabold"
        style={{ gap: "clamp(2rem, 1.5vw, 2rem)" }}
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
          <h1
            className="tracking-tighter leading-none text-center relative"
            style={{ fontSize: "clamp(1.5rem, 7vw, 6rem)" }}
          >
            {/* Base white text - always visible underneath */}
            <span className="text-white">
              Meaningful Knowledge Impactful Digital Content
            </span>
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
          </h1>
          <h3
            className="text-[#8E8E8E] text-center leading-[150%] tracking-[0.32em] typewriter"
            style={{ fontSize: "clamp(0.625rem, 2vw, 1.5rem)" }}
          >
            FOR EVERYONE
          </h3>
        </div>
        <div className="flex" style={{ gap: "clamp(0.5rem, 1vw, 0.75rem)" }}>
          <CtaButton variant="secondary" onClick={() => {}}>
            Consume
          </CtaButton>
          <CtaButton
            variant="primary"
            onClick={() => {
              navigate("/#contactus");
            }}
          >
            Get in touch →
          </CtaButton>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollOneScreen}
        className="flex flex-col items-center justify-center absolute bottom-14 arrowFromTop-effect cursor-pointer bg-transparent border-none outline-none"
        aria-label="Scroll down"
      >
        <Down />
        <Down />
      </button>
    </div>
  );
};

export default HeroSection;
