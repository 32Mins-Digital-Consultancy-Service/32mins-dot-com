import Message from "../assets/Message.svg";
import RightArrow from "../assets/rightarrow.svg";

export const ContactUsPage = () => {
  return (
    <section className="relative bg-linear-to-b from-[#0A1953] to-[#2842F7] w-9/10 h-[360px] rounded-2xl p-7.5 flex flex-col gap-6 items-center justify-center ">
      <h1 className="font-bold text-[clamp(16px,25vw,320px)] tracking-tigher text-white/16 text-center whitespace-nowrap absolute mix-blend-soft-light z-0">
        Reach Us
      </h1>
      <header className="flex flex-col gap-4 items-center justify-center max-w-3xl z-10">
        <h2 className="font-bold text-[clamp(1.5rem,4vw,3rem)] tracking-tigher text-white">
          Reach Us
        </h2>
        <div className="flex flex-col ">
          <p className="font-normal text-[clamp(1rem,2vw,1.25rem)] tracking-tigher text-white text-center">
            Do you want to create interactive video content for your students or
            employees?
          </p>
          <p className="font-normal text-[clamp(1rem,2vw,1.25rem)] tracking-tigher text-white text-center">
            Please share your email, and we will connect with you in 2-3 working
            days.
          </p>
        </div>
      </header>
      <form className="relative w-[320px] h-[48px] z-10">
        <input
          type="email"
          placeholder="Enter your email id here"
          className="w-full h-full rounded-3xl py-4 pl-14 pr-11 text-white text-[clamp(0.875rem,1.5vw,1.125rem)] tracking-tigher font normal placeholder:text-[#8E8E8E] bg-[#202020]"
        />
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
          <Message />
        </div>
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
          <RightArrow />
        </div>
      </form>
    </section>
  );
};

export default ContactUsPage;
