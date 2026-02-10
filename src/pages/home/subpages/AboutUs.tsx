import CtaButton from "../../../components/CtaButton";
import { SectionRevealItem } from "../../../components/SectionReveal";
import { SubpageHeader } from "../../../components/SubpageHeader";
import { useNavigate } from "react-router-dom";

interface AboutUsPageProps {
  isVisible?: boolean;
}

export const AboutUsPage = ({ isVisible = false }: AboutUsPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl gap-[clamp(4rem,8vw,5rem)] px-[clamp(1rem,5vw,3rem)]">
      <div className="flex flex-col gap-[clamp(1rem,4vw,2rem)]">
        <SectionRevealItem isVisible={isVisible} index={0}>
          <SubpageHeader title="About Us" />
        </SectionRevealItem>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-[clamp(1.5rem,6vw,4rem)] px-8">
          <SectionRevealItem isVisible={isVisible} index={1}>
            <div className="flex flex-col gap-[clamp(1rem,4vw,2.5rem)] max-w-xl w-full lg:w-auto">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold text-[clamp(1.25rem,4vw,1.875rem)] tracking-tighter text-white">
                  Who we are
                </h1>
              </div>
              <p className="text-[clamp(0.875rem,2vw,1.125rem)] font-normal tracking-tigher text-[#8E8E8E] leading-relaxed">
                32Mins is an organisation established with a vision to transform
                conventional learning into interactive digital content. We want to
                make educational equality in rural India by offering high-quality
                digital learning content in vernacular languages and eradicate the
                barriers to learning by creating engaging education materials
                available to everyone.
              </p>
              <CtaButton variant="tertiary" onClick={() => navigate("/about")}>
                Know More →
              </CtaButton>
            </div>
          </SectionRevealItem>
          <SectionRevealItem isVisible={isVisible} index={2}>
            <div className="flex items-center justify-center gap-[clamp(0.5rem,2vw,1.25rem)] flex-shrink-0">
              <img
                src="/image1.png"
                alt="image1"
                className="w-[clamp(140px,22vw,232px)] h-[clamp(193px,30.5vw,321px)] mb-[clamp(1rem,3vw,2.5rem)] rounded-lg object-cover"
              />
              <img
                src="/image2.png"
                alt="image2"
                className="w-[clamp(140px,22vw,232px)] h-[clamp(193px,30.5vw,321px)] mt-[clamp(1rem,3vw,2.5rem)] rounded-lg object-cover"
              />
            </div>
          </SectionRevealItem>
        </div>
      </div>
      <SectionRevealItem isVisible={isVisible} index={3}>
        <div className="rounded-4xl bg-gradient-to-r from-[#1D1D1B]/20 via-white/20 to-[#1D1D1B]/20 max-w-4xl h-fit w-full">
          <div className="backdrop-blur-3xl border border-[#1B1B1B] flex gap-[clamp(0.5rem,2vw,1rem)] p-[clamp(1rem,3vw,2rem)] rounded-4xl items-center justify-center">
            <div className="text-[#8E8E8E] text-[clamp(1.5rem,4vw,4rem)] tracking-tigher font-extrabold leading-[clamp(2rem,5vw,5rem)] flex-shrink-0">
              🙶
            </div>
            <div className="text-white text-[clamp(0.875rem,1.8vw,1.125rem)] tracking-tigher text-center">
              <span className="font-bold">32Mins</span> was founded in the year
              2023, to
              <span className="font-bold">
                &nbsp;create interactive and visually engaging content
              </span>
              &nbsp;that helps academics, corporates, and subject matter experts.
            </div>
            <div className="text-[#8E8E8E] text-[clamp(1.5rem,4vw,4rem)] tracking-tigher font-extrabold leading-[clamp(2rem,5vw,5rem)] flex-shrink-0">
              🙷
            </div>
          </div>
        </div>
      </SectionRevealItem>
    </div>
  );
};

export default AboutUsPage;
