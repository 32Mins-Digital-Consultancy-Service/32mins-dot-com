import Grid from "../../../components/grid";
import { SubpageHeader } from "../../../components/SubpageHeader";
import { motion } from "framer-motion";

export const SolutionsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 sm:gap-7 md:gap-9 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-6 max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-3">
          <SubpageHeader title="Our Services" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.5 },
            }}
            viewport={{ once: true, amount: 0.5 }}
            className="font-bold text-xl sm:text-2xl md:text-3xl tracking-tigher text-white text-center px-2"
          >
            Solutions that take your business to the next level
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[#8E8E8E] text-base sm:text-lg tracking-tigher text-center px-2"
        >
          We specialise in educational video production, offering tailored
          content for course lectures, online learning, coaching, and
          industry-focused training programs that enhance knowledge delivery and
          learner engagement.
        </motion.div>
      </div>
      <Grid />
    </div>
  );
};

export default SolutionsPage;
