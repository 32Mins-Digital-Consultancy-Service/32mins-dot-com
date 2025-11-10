import { SubpageHeader } from "../../../components/SubpageHeader";
import CtaButton from "../../../components/CtaButton";

export const WhyUsPage = () => {
  return (
    <div className="flex items-center justify-center gap-45 w-full px-50">
      <div className="flex flex-col  gap-9 max-w-xl h-full">
        <div className="flex flex-col  gap-3 w-3/5">
          <SubpageHeader title="Why Us" />
          <h2 className="font-bold text-3xl tracking-tigher text-white ">
            What makes us stand out in the industry
          </h2>
        </div>
        <p className="font-normal text-lg tracking-tigher text-[#8E8E8E]">
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
      <div className="max-w-xl h-full relative">
        <img
          src="../src/images/hourglass.png"
          alt="Why Us"
          className="absolute right-1/2 bottom-1/6"
        />
        <div className="rounded-xl bg-gradient-to-r from-[#2943FC] to-[#09174B] w-[240px] h-[320px] flex items-center justify-center"></div>
      </div>
    </div>
  );
};

export default WhyUsPage;
