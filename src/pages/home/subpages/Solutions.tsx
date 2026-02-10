import Grid from "../../../components/grid";
import { SectionRevealItem } from "../../../components/SectionReveal";
import { SubpageHeader } from "../../../components/SubpageHeader";

interface SolutionsPageProps {
  isVisible?: boolean;
}

export const SolutionsPage = ({ isVisible = false }: SolutionsPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 sm:gap-7 md:gap-9 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-6 max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-3">
          <SectionRevealItem isVisible={isVisible} index={0}>
            <SubpageHeader title="Our Services" />
          </SectionRevealItem>
          <SectionRevealItem isVisible={isVisible} index={1}>
            <div className="font-bold text-xl sm:text-2xl md:text-3xl tracking-tigher text-white text-center px-2">
              Solutions that take your business to the next level
            </div>
          </SectionRevealItem>
        </div>
        <SectionRevealItem isVisible={isVisible} index={2}>
          <div className="text-[#8E8E8E] text-base sm:text-lg tracking-tigher text-center px-2">
            We specialise in educational video production, offering tailored
            content for course lectures, online learning, coaching, and
            industry-focused training programs that enhance knowledge delivery and
            learner engagement.
          </div>
        </SectionRevealItem>
      </div>
      <Grid isVisible={isVisible} baseIndex={3} />
    </div>
  );
};

export default SolutionsPage;
