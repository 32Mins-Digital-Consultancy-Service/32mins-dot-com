import Grid from "../../../components/grid";
import { SubpageHeader } from "../../../components/SubpageHeader";

export const SolutionsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <div className="flex flex-col items-center justify-center w-full gap-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-3 ">
          <SubpageHeader title="Our Services" />
          <div className="font-bold text-3xl tracking-tigher text-white">
            Solutions that take your business to the next level
          </div>
        </div>
        <div className="text-[#8E8E8E] text-lg tracking-tigher text-center">
          We specialise in educational video production, offering tailored
          content for course lectures, online learning, coaching, and
          industry-focused training programs that enhance knowledge delivery and
          learner engagement.
        </div>
      </div>
      <Grid />
    </div>
  );
};

export default SolutionsPage;
