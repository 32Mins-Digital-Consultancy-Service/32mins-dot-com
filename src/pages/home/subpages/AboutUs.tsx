import { SubpageHeader } from "../../../components/SubpageHeader";

export const AboutUsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-24 p-5 max-w-6xl">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <SubpageHeader>About Us</SubpageHeader>
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
          <button className="border border-[#8E8E8E] px-7.5 py-4 rounded-3xl text-[#8E8E8E] text-lg font-normal tracking-tigher ">
            Know More →
          </button>
        </div>
        <div className="flex items-center justify-center gap-6">
          <img src="/image1.png" alt="image1" className="pb-10" />
          <img src="/image2.png" alt="image2" className="pt-10" />
        </div>
      </div>
      <div className="max-w-3xl flex gap-4 p-3 rounded-4xl items-center justify-center   bg-gradient-to-r from-[#1D1D1B]/50 via-white/50 to-[#1D1D1B]/50  shadow-[0px_0px_0px_0px_rgba(255,255,255,0.25)]">
        <div className="text-lg font-normal tracking-tigher text-white text-center">
          <span className="font-bold">32Mins</span> was founded in the year
          2023, to
          <span className="font-bold">
            create interactive and visually engaging content
          </span>
          that helps academics, corporates, and subject matter experts.
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
