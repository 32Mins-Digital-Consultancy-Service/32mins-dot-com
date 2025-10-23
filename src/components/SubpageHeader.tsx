export const SubpageHeader = ({ title }: { title: string }) => {
  return (
    <div className="  bg-linear-to-r from-[#1D1D1B]/10 via-[#FFFFFF]/10 to-[#1D1D1B]/10  rounded-lg">
      <div className="text-white text-lg font-normal tracking-tighter text-center backdrop-blur-sm  py-2 px-4  border border-[#1B1B1B] rounded-lg">
        {title}
      </div>
    </div>
  );
};
