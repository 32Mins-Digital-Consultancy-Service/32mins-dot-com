import { SubpageHeader } from "../../../components/SubpageHeader";
import Marquee from "../../../components/marquee";

export const ClientsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-10.5 ">
      <div className="flex flex-col items-center justify-center gap-3">
        <SubpageHeader title="Our Clients" />
        <div className="font-bold text-3xl tracking-tigher text-white">
          Helping businesses grow
        </div>
      </div>
      <Marquee />
      <div className="flex flex-col items-center justify-center gap-10.5 px-10 w-full ">
        <h3 className="font-normal text-lg tracking-tigher text-[#8E8E8E]">
          Here’s what our &nbsp;
          <span className="text-white">satisfied clients</span>&nbsp;say
        </h3>
        <div className="flex  items-center justify-center gap-6">
          <div className="bg-linear-to-r from-[#0A0A0A]/20 via-[#707070]/20 to-[#0A0A0A]/20 p-9 rounded-2xl max-w-2xl flex flex-col gap-4 border border-[#1B1B1B]">
            <h3 className="font-bold text-lg tracking-tigher text-white">
              A Testament to the Strength of Our Incubation Programs
            </h3>
            <p className="font-normal text-lg tracking-tigher text-[#8E8E8E]">
              “Witnessing the success of our incubated start-ups, like 32Mins,
              fills us with immense pride. Their rapid growth and innovation is
              a testament to the power of our vibrant innovation ecosystem—a
              dynamic space where academia and industry collide to spark
              transformative ideas.”
            </p>
            <h4 className="font-normal text-lg tracking-tigher text-white">
              IITM Pravartak
            </h4>
          </div>
          <div className="bg-linear-to-r from-[#0A0A0A]/20 via-[#707070]/20 to-[#0A0A0A]/20 p-9 rounded-2xl max-w-2xl flex flex-col gap-4 border border-[#1B1B1B]">
            <h3 className="font-bold text-lg tracking-tigher text-white">
              Truly Transformational
            </h3>
            <p className="font-normal text-lg tracking-tigher text-[#8E8E8E]">
              “The team recently edited my 41-hour 4-module video Course in
              Global English for workers of multi-national companies, etc. I
              found in the team a matchless degree of enthusiasm to create new
              ways to add value to products and to help in all possible ways.”
            </p>
            <h4 className="font-normal text-lg tracking-tigher text-white">
              Shreesh Chaudhary Prof (Retd.), DHSS, IIT Madras
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
