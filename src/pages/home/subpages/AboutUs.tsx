import CtaButton from "../../../components/CtaButton";
import { SubpageHeader } from "../../../components/SubpageHeader";

export const AboutUsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl gap-26 px-10">
      <div className="flex items-center justify-center gap-24 ">
        <div className="flex flex-col gap-9 max-w-xl">
          <div className="flex flex-col gap-3">
            <SubpageHeader title="About Us" />
            <h1 className="font-bold text-3xl tracking-tighter text-white">
              Who we are
            </h1>
          </div>
          <p className="text-lg font-normal tracking-tigher text-[#8E8E8E]">
            32Mins is an organisation established with a vision to transform
            conventional learning into interactive digital content. We want to
            make educational equality in rural India by offering high-quality
            digital learning content in vernacular languages and eradicate the
            barriers to learning by creating engaging education materials
            available to everyone.
          </p>
          <CtaButton variant="tertiary" onClick={() => {}}>
            Know More →
          </CtaButton>
        </div>
        <div className="flex items-center justify-center gap-6">
          <img
            src="/image1.png"
            alt="image1"
            className="w-[232px] h-[321px] mb-10 rounded-lg"
          />
          <img
            src="/image2.png"
            alt="image2"
            className="w-[232px] h-[321px] mt-10 rounded-lg"
          />
        </div>
      </div>
      <div className="rounded-4xl  bg-gradient-to-r from-[#1D1D1B]/30 via-white/30 to-[#1D1D1B]/30  max-w-4xl h-fit">
        <div className="backdrop-blur-3xl  border border-[#1B1B1B] flex  gap-[clamp(0.5rem,2vw,1rem)] p-[clamp(1rem,3vw,1rem)] rounded-4xl items-center justify-center">
          <div className="text-[#8E8E8E] text-[clamp(2.5rem,8vw,6.25rem)] tracking-tigher font-extrabold leading-[clamp(3rem,10vw,7.5rem)]">
            🙶
          </div>
          <div className="text-white text-[clamp(0.875rem,1.5vw,1.125rem)] tracking-tigher text-center ">
            <span className="font-bold">32Mins</span> was founded in the year
            2023, to
            <span className="font-bold">
              &nbsp;create interactive and visually engaging content
            </span>
            &nbsp;that helps academics, corporates, and subject matter experts.
          </div>
          <div className="text-[#8E8E8E] text-[clamp(2.5rem,8vw,6.25rem)] tracking-tigher font-extrabold leading-[clamp(3rem,10vw,7.5rem)]">
            🙷
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
