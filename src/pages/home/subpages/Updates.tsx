import CtaButton from "../../../components/CtaButton";
import Down from "../../../assets/Down.svg";

export const UpdatesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl h-screen w-full ">
      <div
        className="flex flex-col items-center justify-center font-extrabold"
        style={{ gap: "clamp(2rem, 1.5vw, 2rem)" }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{ gap: "clamp(1rem, 2vw, 2rem)" }}
        >
          <h3
            className="text-[#8E8E8E] text-center leading-[150%] tracking-[0.32em]"
            style={{ fontSize: "clamp(0.625rem, 2vw, 1.5rem)" }}
          >
            CONVERTING
          </h3>
          <h1
            className="text-white tracking-tigher leading-none text-center drop-shadow-[0_0_2px_rgba(255,255,255,0.16)]"
            style={{ fontSize: "clamp(1.5rem, 7vw, 6rem)" }}
          >
            Meaningful Knowledge Impactful Digital Content
          </h1>
          <h3
            className="text-[#8E8E8E] text-center leading-[150%] tracking-[0.32em]"
            style={{ fontSize: "clamp(0.625rem, 2vw, 1.5rem)" }}
          >
            FOR EVERYONE
          </h3>
        </div>
        <div className="flex" style={{ gap: "clamp(0.5rem, 1vw, 0.75rem)" }}>
          <CtaButton variant="secondary" onClick={() => {}}>
            Consume
          </CtaButton>
          <CtaButton variant="primary" onClick={() => {}}>
            Get in touch →
          </CtaButton>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center absolute bottom-14">
        <Down />
        <Down />
      </div>
    </div>
  );
};

export default UpdatesPage;
