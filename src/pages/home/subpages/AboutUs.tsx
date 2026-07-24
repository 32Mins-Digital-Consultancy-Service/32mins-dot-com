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
              32Mins is an organisation established with a vision to transform
              conventional learning into interactive digital content. We want to
              make educational equality in rural India by offering high-quality
              digital learning content in vernacular languages and eradicate the
              barriers to learning by creating engaging education materials
              available to everyone.
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
            className="flex items-center justify-center gap-[clamp(0.5rem,2vw,1.25rem)] flex-shrink-0"
          >
            <img
              src="/image1.webp"
              alt="32Mins team collaborating on digital content production"
              loading="lazy"
              decoding="async"
              className="w-[clamp(140px,22vw,232px)] h-[clamp(193px,30.5vw,321px)] mb-[clamp(1rem,3vw,2.5rem)] rounded-lg object-cover"
            />
            <img
              src="/image2.webp"
              alt="32Mins workspace at IIT Madras Research Park"
              loading="lazy"
              decoding="async"
              className="w-[clamp(140px,22vw,232px)] h-[clamp(193px,30.5vw,321px)] mt-[clamp(1rem,3vw,2.5rem)] rounded-lg object-cover"
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
