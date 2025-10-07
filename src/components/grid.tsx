import VerticalCarousel from "./VerticalCarousel";

interface ServiceCard {
  title: string;
  description: string;
  size: "small" | "medium" | "large" | "tall";
}

const services: ServiceCard[] = [
  {
    title: "Digital Media Production",
    description:
      "We produce videos, photos, and audio content through pre, post, and live production stages using advanced technologies to deliver compelling multimedia tailored for diverse audiences and digital platforms.",
    size: "small",
  },
  {
    title: "eLearning Production",
    description:
      "We design and develop media-rich, interactive online learning using instructional design, content analysis, and technology to create engaging educational experiences tailored to different audiences and academic or professional goals.",
    size: "small",
  },
  {
    title: "Lab & Industry Learning Video Production",
    description:
      "industry settings, simulating real-world scenarios through precise planning, filming, and editing to improve hands-on learning and professional skill development.",
    size: "large",
  },
  {
    title: "Media Content Marketing",
    description:
      "We build brand presence through high-quality media content, using strategy, storytelling, and distribution across platforms to attract, engage, and convert audiences with relevant, consistent messaging.",
    size: "tall",
  },
  {
    title: "eLearning Consulting",
    description:
      "We guide organisations in creating effective e-learning solutions, from analysing training needs to designing content strategies, selecting tools, and assessing outcomes for long-term impact and learner success.",
    size: "medium",
  },
  {
    title: "LMS Management",
    description:
      "We manage and maintain learning platforms, ensuring seamless content delivery, user organisation, performance tracking, and system reliability to support smooth educational experiences and learner progression.",
    size: "medium",
  },
];

const Grid = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-3">
          <h3 className="text-white text-2xl font-semibold leading-tighter">
            {services[0].title}
          </h3>
          <p className="text-[#8E8E8E] text-lg font-normal">
            {services[0].description}
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-3">
          <h3 className="text-white text-2xl font-semibold leading-tighter">
            {services[1].title}
          </h3>
          <p className="text-[#8E8E8E] text-lg font-normal">
            {services[1].description}
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-center row-span-1 col-span-4">
          <VerticalCarousel />
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-2 col-span-2">
          <h3 className="text-white text-2xl font-semibold leading-tighter">
            {services[3].title}
          </h3>
          <p className="text-[#8E8E8E] text-lg font-normal">
            {services[3].description}
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-2">
          <h3 className="text-white text-2xl font-semibold leading-tighter">
            {services[4].title}
          </h3>
          <p className="text-[#8E8E8E] text-lg font-normal">
            {services[4].description}
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-2">
          <h3 className="text-white text-2xl font-semibold leading-tighter">
            {services[5].title}
          </h3>
          <p className="text-[#8E8E8E] text-lg font-normal">
            {services[5].description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Grid;
