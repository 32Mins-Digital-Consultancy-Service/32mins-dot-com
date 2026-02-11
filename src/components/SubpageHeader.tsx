import { motion } from "framer-motion";

export const SubpageHeader = ({ title }: { title: string }) => {
  return (
    <div className="  bg-linear-to-r from-[#1D1D1B]/10 via-[#FFFFFF]/10 to-[#1D1D1B]/10  rounded-lg w-fit">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.2, duration: 0.5 },
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-white text-lg font-normal tracking-tighter text-center backdrop-blur-sm  py-2 px-4  border border-[#1B1B1B] rounded-lg w-fit"
      >
        {title}
      </motion.h1>
    </div>
  );
};
