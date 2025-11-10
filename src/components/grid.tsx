import { useRef, useEffect, useState } from "react";
import VerticalCarousel from "./VerticalCarousel";

interface ServiceCard {
  title: string;
  description: string;
  size: "small" | "medium" | "large" | "tall";
}

interface ServiceCardContentProps {
  title: string;
  description: string;
}

const ServiceCardContent = ({
  title,
  description,
}: ServiceCardContentProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const updateWidth = () => {
      if (titleRef.current) {
        setTitleWidth(titleRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Use ResizeObserver for more accurate tracking
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(titleRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [title]);

  return (
    <div className="flex flex-col gap-4">
      <h3
        ref={titleRef}
        className="text-white text-2xl font-semibold leading-tighter w-fit"
      >
        {title}
      </h3>
      <p
        className="text-[#8E8E8E] text-lg font-normal"
        style={{
          width: titleWidth ? `${titleWidth}px` : "fit-content",
          maxWidth: "100%",
        }}
      >
        {description}
      </p>
    </div>
  );
};

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
    <div className="w-full px-20">
      <div className="grid grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-3 items-start ">
          <ServiceCardContent
            title={services[0].title}
            description={services[0].description}
          />
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-3 items-start ">
          <ServiceCardContent
            title={services[1].title}
            description={services[1].description}
          />
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-center row-span-1 col-span-4 gap-4">
          <VerticalCarousel />
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-2 col-span-2 items-start ">
          <ServiceCardContent
            title={services[3].title}
            description={services[3].description}
          />
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-2 items-start ">
          <ServiceCardContent
            title={services[4].title}
            description={services[4].description}
          />
        </div>

        <div className="bg-[#0A0A0A] border border-[#1B1B1B] rounded-2xl p-7.5 flex flex-col justify-start row-span-1 col-span-2 items-start ">
          <ServiceCardContent
            title={services[5].title}
            description={services[5].description}
          />
        </div>
      </div>
    </div>
  );
};

export default Grid;
