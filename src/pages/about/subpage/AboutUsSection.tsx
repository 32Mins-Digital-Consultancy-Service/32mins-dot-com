import CtaButton from "../../../components/CtaButton";
import TriangleWithLine from "../../../assets/TriangleWithLine.svg";
import { SubpageHeader } from "../../../components/SubpageHeader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AboutUsSection = () => {
  const navigate = useNavigate();
  return (
    <article className="text-white flex items-center justify-center gap-4 flex-col px-4 sm:px-8 md:px-12 lg:px-20 xl:px-27 max-w-3xl w-full">
      <h1
        className="tracking-tighter leading-none text-center relative"
        style={{ fontSize: "clamp(1.5rem, 7vw, 6rem)" }}
      >
        {/* Base white text - always visible underneath */}
        <span className="text-white">Empower Learning</span>
        {/* Gradient overlay - fades out on first load to reveal white text */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#FFFFFF] to-[#000000] bg-clip-text text-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, delay: 0, ease: "easeIn" }}
          aria-hidden="true"
        >
          Empower Learning
        </motion.span>
      </h1>
      <section className="flex items-center justify-center gap-4 flex-col">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2"
        >
          Education serves as the foundation for human intellectual growth,
          fostering lifelong learning and equipping individuals to adapt to the
          accelerating digital revolution. As technology reshapes our world,
          seamless integration of digital tools into education becomes critical
          to prepare learners for the future.
        </motion.p>
        <TriangleWithLine className="rotate-180" />
      </section>
      <motion.figure
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.2, duration: 0.5 },
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="w-full flex items-center justify-center"
      >
        <img
          src="ape.png"
          alt="ape"
          className="w-full max-w-[556px] h-auto object-contain rounded-lg"
        />
      </motion.figure>
      <section className="flex items-center justify-center gap-4 flex-col">
        <TriangleWithLine />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2"
        >
          Sustainable development in digital education requires AI to
          personalise learning, guided by human expertise. At 32Mins, we harness
          Artificial Intelligence to design dynamic eLearning platforms that
          empower both learners and educators. By merging cutting-edge
          technology with human expertise, we cultivate a collaborative
          ecosystem where innovation and pedagogy thrive together.
        </motion.p>
      </section>
      <section className="flex items-center justify-center gap-6 sm:gap-9 flex-col">
        <header className="flex items-center justify-center gap-3 flex-col px-4 sm:px-8 md:px-15 py-4 sm:py-6">
          <SubpageHeader title="Our Mission" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.5 },
            }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-white text-[clamp(1.25rem,4vw,1.875rem)] font-bold tracking-tighter text-center"
          >
            Building the future of India with every line of code
          </motion.h2>
        </header>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2"
        >
          We aim to support education & skill development by creating engaging
          e-learning courses in science, medicine, engineering, culture, and
          livelihood to improve learning outcomes and empower learners with
          valuable skills.
        </motion.p>
        <CtaButton
          variant="tertiary"
          onClick={() => {
            navigate("/#contactus");
          }}
        >
          Get in touch →
        </CtaButton>
      </section>
    </article>
  );
};

export default AboutUsSection;
