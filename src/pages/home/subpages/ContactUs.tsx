export const ContactUsPage = () => {
  return (
    <div className="relative bg-linear-to-b from-[#0A1953] to-[#2842F7] w-[1112px] h-[360px] rounded-2xl p-7.5 flex flex-col gap-6 items-center justify-center ">
      <h1 className="font-bold text-[320px] tracking-tigher text-white/16 text-center whitespace-nowrap absolute mix-blend-soft-light z-0">
        Reach Us
      </h1>
      <div className="flex flex-col gap-4 items-center justify-center max-w-3xl z-10">
        <h2 className="font-bold text-3xl tracking-tigher text-white">
          Reach Us
        </h2>
        <div className="flex flex-col ">
          <p className="font-normal text-lg tracking-tigher text-white">
            Do you want to create interactive video content for your students or
            employees?
          </p>
          <p className="font-normal text-lg tracking-tigher text-white">
            Please share your email, and we will connect with you in 2-3 working
            days.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center w-[320px] h-[48px] z-10">
        <input
          type="email"
          placeholder="Enter your email id here"
          className="w-full h-full rounded-3xl py-4 px-6 text-white text-lg tracking-tigher font normal placeholder:text-[#8E8E8E] bg-[#202020]"
        />
      </div>
    </div>
  );
};

export default ContactUsPage;
