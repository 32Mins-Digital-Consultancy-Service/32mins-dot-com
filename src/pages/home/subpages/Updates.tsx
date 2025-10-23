import CtaButton from "../../../components/CtaButton";
import Down from "../../../assets/Down.svg";

export const UpdatesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl h-screen w-full ">
      <div className="flex flex-col items-center justify-center gap-6 font-extrabold">
        <div className="flex flex-col items-center justify-center gap-4">
          <h3 className="text-[#8E8E8E] text-2xl  text-center leading-[150%] tracking-[0.32em]">
            CONVERTING
          </h3>
          <h1 className="text-white text-8xl tracking-tigher  text-center  drop-shadow-[0_0_2px_rgba(255,255,255,0.16)]">
            Meaningful Knowledge Impactful Digital Content
          </h1>
          <h3 className="text-[#8E8E8E] text-2xl  text-center leading-[150%] tracking-[0.32em] ">
            FOR EVERYONE
          </h3>
        </div>
        <div className="flex gap-4">
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
