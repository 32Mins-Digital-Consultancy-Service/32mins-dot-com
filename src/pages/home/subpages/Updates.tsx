import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Summary } from "../../../components/Summary";

const UpdatePage = () => {
  const earthRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(earthRef, { once: true, amount: 0.15 });
  const summaryRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="z-10 relative scroll-mt-20 w-full max-w-full min-w-0 flex flex-col items-center justify-center overflow-hidden min-h-[var(--viewport-height)] h-[var(--viewport-height)]">
      <div ref={earthRef} className="relative w-full h-full overflow-hidden">
        <motion.img
          src="/earth2.webp"
          alt="earth"
          initial={{ y: "40%", rotate: 180 }}
          animate={isInView ? { rotate: 270 } : { rotate: 300 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[max(100%,100vh)]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent w-full flex justify-center items-end h-20" />
      </div>
      <Summary ref={summaryRef} />
    </section>
  );
};

export default UpdatePage;
