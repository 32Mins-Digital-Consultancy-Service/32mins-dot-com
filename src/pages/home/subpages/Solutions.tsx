import Grid from "../../../components/grid";

export const SolutionsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen ">
      <div className="bg-[url('/earth.jpg')]  bg-cover min-h-screen w-full mix-blend-lighten"></div>
      <div className=" w-full flex  bg-linear-to-b from-[#000016] to-[#000016]/0 items-center justify-center">
        <div className=" w-fit flex gap-8 p-10.5 rounded-4xl items-center justify-center   bg-gradient-to-r from-[#1D1D1B]/50 via-white/50 to-[#1D1D1B]/50 drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)]">
          <div className="flex flex-col font-extrabold text-center">
            <h2 className="text-white text-3xl leading-[125%]">32Mins</h2>
            <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher">
              of Impactfull Videos
            </h3>
          </div>
          <div className="flex flex-col font-extrabold text-center">
            <h2 className="text-white text-3xl leading-[125%]">1200+</h2>
            <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher">
              houes of content
            </h3>
          </div>
          <div className="flex flex-col font-extrabold text-center">
            <h2 className="text-white text-3xl leading-[125%]">15+</h2>
            <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher">
              happy clients
            </h3>
          </div>
          <div className="flex flex-col font-extrabold text-center">
            <h2 className="text-white text-3xl leading-[125%]">03+</h2>
            <h3 className="text-[#8E8E8E] text-base leading-[150%] tracking-tigher">
              researches
            </h3>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <div className="w-fit border border-[#1B1B1B] bg-gradient-to-r from-[#1D1D1B]/50 via-white/50 to-[#1D1D1B]/50 backdrop-blur-md px-4 py-2 rounded-lg font-normal text-white text-lg  tracking-tigher">
          Our services
        </div>
        <div className="font-bold text-3xl tracking-tigher text-white">
          Solutions that take your business to the next level
        </div>
      </div>
      <div className="text-[#8E8E8E] text-lg tracking-tigher text-center">
        We specialise in educational video production, offering tailored content
        for course lectures, online learning, coaching, and industry-focused
        training programs that enhance knowledge delivery and learner
        engagement.
      </div>
      <Grid />
    </div>
  );
};

export default SolutionsPage;
