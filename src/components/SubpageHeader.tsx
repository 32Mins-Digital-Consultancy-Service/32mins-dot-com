export const SubpageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-fit border border-[#1B1B1B] bg-gradient-to-r from-[#1D1D1B]/50 via-white/50 to-[#1D1D1B]/50 backdrop-blur-md px-4 py-2 rounded-lg font-normal text-white text-lg  tracking-tigher">
      {children}
    </div>
  );
};
