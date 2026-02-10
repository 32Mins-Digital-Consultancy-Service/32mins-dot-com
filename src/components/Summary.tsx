export const Summary = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={ref}
      className="absolute -bottom-3 w-fit bg-gradient-to-r from-[#1D1D1B]/10 via-white/10 to-[#1D1D1B]/10"
      style={{
        borderRadius: "clamp(1rem, 2vw + 0.5rem, 2rem)",
      }}
    >
      <div
        className="backdrop-blur-xs border border-[#1B1B1B] flex items-center justify-center"
        style={{
          gap: "clamp(1rem, 2vw + 0.5rem, 2rem)",
          padding: "clamp(1.5rem, 3vw + 0.5rem, 2.625rem)",
          borderRadius: "clamp(1rem, 2vw + 0.5rem, 2rem)",
        }}
      >
        <div className="flex flex-col font-extrabold text-center">
          <h2
            className="text-white leading-[125%]"
            style={{ fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.875rem)" }}
          >
            32Mins
          </h2>
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tigher font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            of Impactfull Videos
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <h2
            className="text-white leading-[125%]"
            style={{ fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.875rem)" }}
          >
            1200+
          </h2>
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tighe font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            hours of content
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <h2
            className="text-white leading-[125%]"
            style={{ fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.875rem)" }}
          >
            15+
          </h2>
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tigher font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            happy clients
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <h2
            className="text-white leading-[125%]"
            style={{ fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.875rem)" }}
          >
            03+
          </h2>
          <h3
            className="text-[#8E8E8E] leading-[150%] tracking-tigher font-normal"
            style={{ fontSize: "clamp(0.625rem, 1vw + 0.4rem, 1rem)" }}
          >
            researches
          </h3>
        </div>
      </div>
    </div>
  );
};
