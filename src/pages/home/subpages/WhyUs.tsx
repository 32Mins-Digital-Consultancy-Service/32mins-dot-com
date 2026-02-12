import { SubpageHeader } from "../../../components/SubpageHeader";
import CtaButton from "../../../components/CtaButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const WhyUsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col max-w-6xl gap-4 px-[clamp(1rem,4vw,2.5rem)]">
      <SubpageHeader title="Why Us" />
      <div className="flex flex-col lg:flex-row items-center justify-center gap-[clamp(2rem,5vw,6rem)] w-full max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col gap-[clamp(1.5rem,3vw,2.25rem)] max-w-xl w-full lg:w-auto"
        >
          <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.75rem)] ">
            <h2 className="font-bold text-[clamp(1.25rem,4vw,1.875rem)] tracking-tigher text-white">
              What makes us stand out in the industry
            </h2>
          </div>
          <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tigher text-[#8E8E8E]">
            We focus on creating compelling, engaging, high-quality digital
            education and corporate training video content that is tailor-made
            according to the needs of your learner or the end listener. Our team
            of experts understand and deliver highly complex and informative
            materials converted into innovative, watchable, and captivating
            learning videos through online or offline mediums.
          </p>
          <CtaButton
            variant="tertiary"
            onClick={() => {
              navigate("/#contactus");
            }}
          >
            Get in touch →
          </CtaButton>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="hidden lg:flex max-w-xl h-full relative"
        >
          <img
            src="./hourglass.webp"
            alt="Why Us"
            className="absolute right-1/2 bottom-1/6"
          />
          <div className="rounded-xl bg-gradient-to-r from-[#2943FC] to-[#09174B] w-[240px] h-[320px] flex items-center justify-center"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyUsPage;
