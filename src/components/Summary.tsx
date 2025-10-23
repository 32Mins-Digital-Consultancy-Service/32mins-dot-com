export const Summary = () => {
  return (
    <div className="absolute -bottom-5  w-fit  rounded-4xl   bg-gradient-to-r from-[#1D1D1B]/10 via-white/10 to-[#1D1D1B]/10  ">
      <div className="backdrop-blur-xs  border border-[#1B1B1B] flex items-center justify-center  gap-8 p-10.5 rounded-4xl">
        <div className="flex flex-col font-extrabold text-center">
          <h2 className="text-white text-3xl leading-[125%]">32Mins</h2>
          <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher font-normal">
            of Impactfull Videos
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <h2 className="text-white text-3xl leading-[125%]">1200+</h2>
          <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tighe font-normal">
            houes of content
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <h2 className="text-white text-3xl leading-[125%]">15+</h2>
          <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher font-normal">
            happy clients
          </h3>
        </div>
        <div className="flex flex-col font-extrabold text-center">
          <h2 className="text-white text-3xl leading-[125%]">03+</h2>
          <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher font-normal">
            researches
          </h3>
        </div>
      </div>
    </div>
  );
};
