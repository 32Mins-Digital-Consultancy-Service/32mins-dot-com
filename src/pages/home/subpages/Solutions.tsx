import Grid from "../../../components/grid";
import { SectionHeader } from "../../../components/SectionHeader";

export const SolutionsPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[clamp(2.5rem,6vw,4rem)] px-[clamp(1rem,4vw,2rem)]">
      <SectionHeader
        pill="Our Services"
        title="Solutions that take your business to the next level"
        subtitle="An IITM Pravartak-incubated EdTech consultancy building AI-driven eLearning platforms, digital applications and intelligent media that scale education globally."
      />
      <Grid />
    </div>
  );
};

export default SolutionsPage;
