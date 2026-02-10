import { SectionRevealItem } from "../../../components/SectionReveal";
import { SubpageHeader } from "../../../components/SubpageHeader";
import CtaButton from "../../../components/CtaButton";

interface WhyUsPageProps {
  isVisible?: boolean;
}

export const WhyUsPage = ({ isVisible = false }: WhyUsPageProps) => {
  return (
    <div className="flex flex-col max-w-6xl gap-4 px-[clamp(1rem,4vw,2.5rem)]">
      <SectionRevealItem isVisible={isVisible} index={0}>
        <SubpageHeader title="Why Us" />
      </SectionRevealItem>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-[clamp(2rem,5vw,6rem)] w-full max-w-6xl px-8">
        <SectionRevealItem isVisible={isVisible} index={1}>
          <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.25rem)] max-w-xl w-full lg:w-auto">
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
            <CtaButton variant="tertiary" onClick={() => {}}>
              Get in touch →
            </CtaButton>
          </div>
        </SectionRevealItem>
        <SectionRevealItem isVisible={isVisible} index={2}>
          <div className="hidden lg:flex max-w-xl h-full relative">
            <img
              src="../src/images/hourglass.png"
              alt="Why Us"
              className="absolute right-1/2 bottom-1/6"
            />
            <div className="rounded-xl bg-gradient-to-r from-[#2943FC] to-[#09174B] w-[240px] h-[320px] flex items-center justify-center"></div>
          </div>
        </SectionRevealItem>
      </div>
    </div>
  );
};

export default WhyUsPage;
