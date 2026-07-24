import VerticalCarousel from "./VerticalCarousel";
import SpotlightCard from "./SpotlightCard";
import Tilt3D from "./Tilt3D";
import { motion } from "framer-motion";

interface ServiceCard {
  title: string;
  description: string;
}

const SERVICES: ServiceCard[] = [
  {
    title: "Digital Media Production",
    description:
      "We produce videos, photos, and audio content through pre, post, and live production stages using advanced technologies to deliver compelling multimedia tailored for diverse audiences and digital platforms.",
  },
  {
    title: "eLearning Production",
    description:
      "We design and develop media-rich, interactive online learning using instructional design, content analysis, and technology to create engaging educational experiences tailored to different audiences and academic or professional goals.",
  },
  {
    title: "Lab & Industry Learning Video Production",
    description:
      "industry settings, simulating real-world scenarios through precise planning, filming, and editing to improve hands-on learning and professional skill development.",
  },
  {
    title: "Media Content Marketing",
    description:
      "We build brand presence through high-quality media content, using strategy, storytelling, and distribution across platforms to attract, engage, and convert audiences with relevant, consistent messaging.",
  },
  {
    title: "eLearning Consulting",
    description:
      "We guide organisations in creating effective e-learning solutions, from analysing training needs to designing content strategies, selecting tools, and assessing outcomes for long-term impact and learner success.",
  },
  {
    title: "LMS Management",
    description:
      "We manage and maintain learning platforms, ensuring seamless content delivery, user organisation, performance tracking, and system reliability to support smooth educational experiences and learner progression.",
  },
];

// Base spans (no prefix) apply from the smallest phone upward, so the
// 2-column bento is preserved on mobile instead of collapsing to a stack.
const GRID_LAYOUT = [
  { service: 0, cols: "col-span-1 md:col-span-2 lg:col-span-3" },
  { service: 1, cols: "col-span-1 md:col-span-2 lg:col-span-3" },
  { carousel: true, cols: "col-span-2 md:col-span-4 lg:col-span-4" },
  {
    service: 3,
    cols: "col-span-1 md:col-span-2 lg:col-span-2",
    // Tall card only from md upward. At 2 cols a full-width
    // double-height card looks empty, so keep it single-row there.
    rows: "md:row-span-2",
  },
  { service: 4, cols: "col-span-1 md:col-span-2 lg:col-span-2" },
  { service: 5, cols: "col-span-2 md:col-span-2 lg:col-span-2" },
];

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  viewport: { once: true, amount: 0.2 },
};

const ServiceCard = ({ title, description }: ServiceCard) => (
  <div className="flex flex-col gap-1.5 sm:gap-2.5 md:gap-4">
    <h3 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-semibold leading-snug w-fit">
      {title}
    </h3>
    <p className="text-[#8E8E8E] text-[11px] leading-snug sm:text-xs sm:leading-normal md:text-sm md:leading-relaxed lg:text-lg font-normal">
      {description}
    </p>
  </div>
);

const Grid = () => {
  return (
    <div className="w-full mx-auto max-w-[1700px] px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 lg:gap-5 auto-rows-[minmax(130px,auto)] sm:auto-rows-[minmax(180px,auto)] md:auto-rows-[minmax(200px,auto)] lg:auto-rows-[minmax(210px,auto)] xl:auto-rows-[minmax(230px,auto)]">
        {GRID_LAYOUT.map((item, index) => (
          <motion.div
            key={index}
            {...cardAnimation}
            className={`${item.rows || "row-span-1"} ${item.cols}`}
          >
            <Tilt3D className="h-full" innerClassName="h-full" maxTilt={4}>
              <SpotlightCard
                className={`bg-[#06041A] border border-white/10 rounded-[15px] p-3.5 sm:p-5 md:p-6 lg:p-7.5 flex flex-col h-full ${
                  item.carousel
                    ? "justify-center gap-4"
                    : "justify-start items-start"
                }`}
              >
                {item.carousel ? (
                  <VerticalCarousel />
                ) : (
                  <ServiceCard {...SERVICES[item.service!]} />
                )}
              </SpotlightCard>
            </Tilt3D>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
