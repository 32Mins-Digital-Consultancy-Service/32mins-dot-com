import { SectionRevealItem } from "../../../components/SectionReveal";
import { SubpageHeader } from "../../../components/SubpageHeader";
import Marquee from "../../../components/marquee";

interface ClientsPageProps {
  isVisible?: boolean;
}

export const ClientsPage = ({ isVisible = false }: ClientsPageProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        gap: "clamp(2em, 4vw, 3rem)",
        paddingLeft: "clamp(1rem, 5vw, 4rem)",
        paddingRight: "clamp(1rem, 5vw, 4rem)",
      }}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{ gap: "clamp(0.5rem, 2vw, 0.75rem)" }}
      >
        <SectionRevealItem isVisible={isVisible} index={0}>
          <SubpageHeader title="Our Clients" />
        </SectionRevealItem>
        <SectionRevealItem isVisible={isVisible} index={1}>
          <div
            className="font-bold tracking-tigher text-white"
            style={{ fontSize: "clamp(1.25rem, 4vw, 1.875rem)" }}
          >
            Helping businesses grow
          </div>
        </SectionRevealItem>
      </div>
      <SectionRevealItem isVisible={isVisible} index={2}>
        <Marquee />
      </SectionRevealItem>
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{
          gap: "clamp(2rem, 3vw, 1.5rem)",
          paddingLeft: "clamp(1rem, 4vw, 2.5rem)",
          paddingRight: "clamp(1rem, 4vw, 2.5rem)",
        }}
      >
        <SectionRevealItem isVisible={isVisible} index={3}>
          <h3
            className="font-normal tracking-tigher text-[#8E8E8E] text-center"
            style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
          >
            Here's what our &nbsp;
            <span className="text-white">satisfied clients</span>&nbsp;say
          </h3>
        </SectionRevealItem>
        <div
          className="flex flex-col md:flex-row items-center justify-center"
          style={{ gap: "clamp(1.5rem, 4vw, 2rem)" }}
        >
          <SectionRevealItem isVisible={isVisible} index={4}>
            <div
              className="bg-linear-to-r from-[#0A0A0A]/20 via-[#707070]/20 to-[#0A0A0A]/20 rounded-2xl max-w-2xl flex flex-col border border-[#1B1B1B]"
              style={{
                padding: "clamp(1rem, 3vw, 2.25rem)",
                gap: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              <h3
                className="font-bold tracking-tigher text-white"
                style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
              >
                A Testament to the Strength of Our Incubation Programs
              </h3>
              <p
                className="font-normal tracking-tigher text-[#8E8E8E]"
                style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
              >
                "Witnessing the success of our incubated start-ups, like 32Mins,
                fills us with immense pride. Their rapid growth and innovation is
                a testament to the power of our vibrant innovation ecosystem—a
                dynamic space where academia and industry collide to spark
                transformative ideas."
              </p>
              <h4
                className="font-normal tracking-tigher text-white"
                style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
              >
                IITM Pravartak
              </h4>
            </div>
          </SectionRevealItem>
          <SectionRevealItem isVisible={isVisible} index={5}>
            <div
              className="bg-linear-to-r from-[#0A0A0A]/20 via-[#707070]/20 to-[#0A0A0A]/20 rounded-2xl max-w-2xl flex flex-col border border-[#1B1B1B]"
              style={{
                padding: "clamp(1rem, 3vw, 2.25rem)",
                gap: "clamp(0.5rem, 1.5vw, 0.75rem)",
              }}
            >
              <h3
                className="font-bold tracking-tigher text-white"
                style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
              >
                Truly Transformational
              </h3>
              <p
                className="font-normal tracking-tigher text-[#8E8E8E]"
                style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
              >
                "The team recently edited my 41-hour 4-module video Course in
                Global English for workers of multi-national companies, etc. I
                found in the team a matchless degree of enthusiasm to create new
                ways to add value to products and to help in all possible ways."
              </p>
              <h4
                className="font-normal tracking-tigher text-white"
                style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
              >
                Shreesh Chaudhary Prof (Retd.), DHSS, IIT Madras
              </h4>
            </div>
          </SectionRevealItem>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
