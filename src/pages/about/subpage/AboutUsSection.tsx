import CtaButton from "../../../components/CtaButton";
import TriangleWithLine from "../../../assets/TriangleWithLine.svg";
import { SubpageHeader } from "../../../components/SubpageHeader";
import { SectionRevealItem } from "../../../components/SectionReveal";
import { motion } from "framer-motion";

interface AboutUsSectionProps {
  isVisible?: boolean;
}

const AboutUsSection = ({ isVisible = false }: AboutUsSectionProps) => {
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
        <SectionRevealItem isVisible={isVisible} index={1}>
          <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2">
            Education serves as the foundation for human intellectual growth,
            fostering lifelong learning and equipping individuals to adapt to
            the accelerating digital revolution. As technology reshapes our
            world, seamless integration of digital tools into education becomes
            critical to prepare learners for the future.
          </p>
        </SectionRevealItem>
        <SectionRevealItem isVisible={isVisible} index={2}>
          <TriangleWithLine className="rotate-180" />
        </SectionRevealItem>
      </section>
      <SectionRevealItem isVisible={isVisible} index={3}>
        <figure className="w-full flex items-center justify-center">
          <img
            src="ape.png"
            alt="ape"
            className="w-full max-w-[556px] h-auto object-contain rounded-lg"
          />
        </figure>
      </SectionRevealItem>
      <section className="flex items-center justify-center gap-4 flex-col">
        <SectionRevealItem isVisible={isVisible} index={4}>
          <TriangleWithLine />
        </SectionRevealItem>
        <SectionRevealItem isVisible={isVisible} index={5}>
          <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2">
            Sustainable development in digital education requires AI to
            personalise learning, guided by human expertise. At 32Mins, we
            harness Artificial Intelligence to design dynamic eLearning
            platforms that empower both learners and educators. By merging
            cutting-edge technology with human expertise, we cultivate a
            collaborative ecosystem where innovation and pedagogy thrive
            together.
          </p>
        </SectionRevealItem>
      </section>
      <section className="flex items-center justify-center gap-6 sm:gap-9 flex-col">
        <header className="flex items-center justify-center gap-3 flex-col px-4 sm:px-8 md:px-15 py-4 sm:py-6">
          <SectionRevealItem isVisible={isVisible} index={6}>
            <SubpageHeader title="Our Mission" />
          </SectionRevealItem>
          <SectionRevealItem isVisible={isVisible} index={7}>
            <h2 className="text-white text-[clamp(1.25rem,4vw,1.875rem)] font-bold tracking-tighter text-center">
              Building the future of India with every line of code
            </h2>
          </SectionRevealItem>
        </header>
        <SectionRevealItem isVisible={isVisible} index={8}>
          <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center px-2">
            We aim to support education & skill development by creating engaging
            e-learning courses in science, medicine, engineering, culture, and
            livelihood to improve learning outcomes and empower learners with
            valuable skills.
          </p>
        </SectionRevealItem>
        <SectionRevealItem isVisible={isVisible} index={9}>
          <CtaButton variant="tertiary" onClick={() => {}}>
            Get in touch →
          </CtaButton>
        </SectionRevealItem>
      </section>
    </article>
  );
};

export default AboutUsSection;
