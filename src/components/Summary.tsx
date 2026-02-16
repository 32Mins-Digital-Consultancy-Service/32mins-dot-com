import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export const Summary = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(spanRef, { once: true });

    useEffect(() => {
      if (!inView || !spanRef.current) return;

      const step = to > 100 ? 100 : 1;

      const controls = animate(0, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          const stepped = Math.round(value / step) * step;
          spanRef.current!.textContent = Math.min(stepped, to) + suffix;
        },
      });

      return () => controls.stop();
    }, [inView, to, suffix]);

    return (
      <span
        ref={spanRef}
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
      className="absolute -bottom-3 w-fit rounded-4xl bg-gradient-to-r from-[#1D1D1B]/20 via-white/20 to-[#1D1D1B]/20 max-w-4xl"
    >
      <div className="backdrop-blur-xs border border-[#1B1B1B]/20 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 pb-6 pt-4 sm:p-6 md:p-8 lg:p-10 rounded-4xl">
        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={32} suffix="Mins" />
          <h3 className="text-[#8E8E8E] font-normal text-sm">
            of Impactful Videos
          </h3>
        </div>

        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={1200} suffix="+" />
          <h3 className="text-[#8E8E8E] font-normal text-sm">
            hours of content
          </h3>
        </div>

        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={15} suffix="+" />
          <h3 className="text-[#8E8E8E] font-normal text-sm">happy clients</h3>
        </div>

        <div className="flex flex-col font-extrabold text-center">
          <CountUp to={3} suffix="+" />
          <h3 className="text-[#8E8E8E] font-normal text-sm">researches</h3>
        </div>
      </div>
    </div>
  );
};
