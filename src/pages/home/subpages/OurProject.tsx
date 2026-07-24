import { SectionHeader } from "../../../components/SectionHeader";
import ProjectCards from "../../../components/ProjectCards";

export default function OurPerjectPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[clamp(2.5rem,6vw,4rem)] px-[clamp(1rem,4vw,2rem)]">
      <SectionHeader
        pill="Our Projects"
        title="A glimpse into our customized solutions"
        subtitle="Quick answers to your million dollar question"
      />
      <ProjectCards />
    </div>
  );
}
