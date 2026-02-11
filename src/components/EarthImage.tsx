import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EarthImage = () => {
  const earthRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(earthRef, { once: true, amount: 0.15 });

  return (
    <div ref={earthRef} className="relative h-screen w-full overflow-hidden">
      <motion.img
        src="/earth2.png"
        alt="earth"
        initial={{ y: "40%", rotate: 120 }}
        animate={isInView ? { rotate: 270 } : { rotate: 300 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="w-full absolute bottom-0"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent w-full flex justify-center items-end h-20" />
    </div>
  );
};

export default EarthImage;
