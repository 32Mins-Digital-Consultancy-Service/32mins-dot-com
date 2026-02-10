import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export const Summary = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
      if (!ref.current || !inView) return;

      const step = to > 100 ? 100 : 1;

      const controls = animate(0, to, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          const stepped = Math.round(value / step) * step;
          ref.current!.textContent = `${Math.min(stepped, to)}${suffix}`;
        },
      });

      return () => controls.stop();
    }, [inView, to, suffix]);

    return (
      <span
        ref={ref}
        className="text-white leading-[125%]"
        style={{ fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.875rem)" }}
      >
        0{suffix}
      </span>
    );
  };
  return (
    <div
      ref={ref}
      className="absolute -bottom-3  w-fit  rounded-4xl   bg-gradient-to-r from-[#1D1D1B]/20 via-white/20 to-[#1D1D1B]/20 max-w-4xl h-fit   "
    >
      <div className="backdrop-blur-xs  border border-[#1B1B1B]/20   flex items-center justify-center  gap-8 p-10.5 rounded-4xl">
        <div className="flex flex-col font-extrabold text-center">
          <h2
            className="text-white leading-[125%]"
            style={{ fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.875rem)" }}
          >
            32Mins
          </h2>
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tigher font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            of Impactfull Videos
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={1200} suffix="+" />
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tighe font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            hours of content
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={15} suffix="+" />
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tigher font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            happy clients
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={3} suffix="+" />
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tigher font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            researches
          </h3>
        </div>
      </div>
    </div>
  );
};
