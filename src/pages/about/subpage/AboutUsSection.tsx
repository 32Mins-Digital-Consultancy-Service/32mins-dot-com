import CtaButton from "../../../components/CtaButton";
import TriangleWithLine from "../../../assets/TriangleWithLine.svg";
import { SubpageHeader } from "../../../components/SubpageHeader";

const AboutUsSection = () => {
  return (
    <article className="text-white  flex items-center justify-center gap-4 flex-col px-27 max-w-3xl">
      <header className="text-[96px] font-extrabold text-center bg-gradient-to-r from-[#000000] via-[#FFFFFF] to-[#000000] bg-clip-text text-transparent  tracking-tightest leading-[90px]  max-w-xl">
        Empower Learning
      </header>
      <section className="flex items-center justify-center gap-4 flex-col ">
        <p className="text-lg font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center">
          Education serves as the foundation for human intellectual growth,
          fostering lifelong learning and equipping individuals to adapt to the
          accelerating digital revolution. As technology reshapes our world,
          seamless integration of digital tools into education becomes critical
          to prepare learners for the future.
        </p>
        <TriangleWithLine className="rotate-180" />
      </section>
      <figure>
        <img src="ape.png" alt="ape" className="w-[556px] h-[400px]" />
      </figure>
      <section className="flex items-center justify-center gap-4 flex-col">
        <TriangleWithLine />
        <p className="text-lg font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center">
          Sustainable development in digital education requires AI to
          personalise learning, guided by human expertise. At 32Mins, we harness
          Artificial Intelligence to design dynamic eLearning platforms that
          empower both learners and educators. By merging cutting-edge
          technology with human expertise, we cultivate a collaborative
          ecosystem where innovation and pedagogy thrive together.
        </p>
      </section>
      <section className="flex items-center justify-center gap-9 flex-col">
        <header className="flex items-center justify-center gap-3 flex-col px-15 py-6">
          <SubpageHeader title="Our Mission" />
          <h2 className="text-white text-3xl font-bold tracking-tighter text-center">
            Building the future of India with every line of code
          </h2>
        </header>
        <p className="text-lg font-normal tracking-tight text-[#8E8E8E] max-w-lg text-center">
          We aim to support education & skill development by creating engaging
          e-learning courses in science, medicine, engineering, culture, and
          livelihood to improve learning outcomes and empower learners with
          valuable skills.
        </p>
        <CtaButton variant="tertiary" onClick={() => {}}>
          Get in touch →
        </CtaButton>
      </section>
    </article>
  );
};

export default AboutUsSection;
