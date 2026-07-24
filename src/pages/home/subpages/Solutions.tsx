import Grid from "../../../components/grid";
import { SectionHeader } from "../../../components/SectionHeader";

export const SolutionsPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[clamp(2.5rem,6vw,4rem)] px-[clamp(1rem,4vw,2rem)]">
      <SectionHeader
        pill="Our Services"
        title="Solutions that take your business to the next level"
        subtitle="We specialise in educational video production, offering tailored content for course lectures, online learning, coaching, and industry-focused training programs that enhance knowledge delivery and learner engagement."
      />
      <Grid />
    </div>
  );
};

export default SolutionsPage;
