import { motion } from "framer-motion";
import CtaButton from "../../../components/CtaButton";
import { SectionHeader } from "../../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import Rightarro from "../../../assets/Rightarro.svg";

export const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl gap-[clamp(2.5rem,6vw,4rem)] px-[clamp(1rem,5vw,3rem)]">
      <div className="flex w-full flex-col items-center gap-[clamp(2.5rem,6vw,4rem)]">
        <SectionHeader pill="About Us" title="Who we are" />
        <div className="flex flex-col lg:flex-row items-center justify-center gap-[clamp(1.5rem,6vw,4rem)] px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-[clamp(1rem,4vw,2.5rem)] max-w-xl w-full lg:w-auto"
          >
            <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tigher text-[#8E8E8E] leading-relaxed">
              32Mins is an IITM Pravartak-incubated EdTech consultancy at IIT
              Madras Research Park. We build AI-driven eLearning platforms,
              digital applications and media that scale education, including
              vernacular content for rural India.
            </p>
            <CtaButton variant="primary" onClick={() => navigate("/about")}>
              Know More
              <Rightarro className="w-4 -ml-1 -mr-2 pt-0.5" />
            </CtaButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex items-center justify-center flex-shrink-0 w-full lg:w-auto"
          >
            <img
              src="/team.webp"
              alt="The 32Mins team at IIT Madras Research Park"
              loading="lazy"
              decoding="async"
              width="1600"
              height="1026"
              className="w-full max-w-[min(100%,820px)] lg:w-[clamp(480px,46vw,820px)] h-auto"
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-4xl bg-[#050B26]/60 max-w-4xl h-fit w-full"
      >
        <blockquote className="backdrop-blur-2xl border border-[#1B1B1B] flex gap-[clamp(0.5rem,2vw,1rem)] p-[clamp(1rem,3vw,2rem)] rounded-2xl items-center justify-center">
          <span
            aria-hidden="true"
            className="text-[#8E8E8E]   font-extrabold leading-[clamp(2rem,5vw,5rem)] flex-shrink-0 manrope-font text-[120px]"
          >
            &ldquo;
          </span>
          <p className="text-white text-[clamp(0.875rem,1.8vw,1.125rem)] tracking-tigher text-center">
            <span className="font-bold">32Mins</span> was founded in the year
            2023, to
            <span className="font-bold">
              &nbsp;create interactive and visually engaging content
            </span>
            &nbsp;that helps academics, corporates, and subject matter experts.
          </p>
          <span
            aria-hidden="true"
            className="text-[#8E8E8E]  font-extrabold leading-[clamp(2rem,5vw,5rem)] flex-shrink-0 manrope-font text-[120px]"
          >
            &rdquo;
          </span>
        </blockquote>
      </motion.div>
    </div>
  );
};

export default AboutUsPage;
