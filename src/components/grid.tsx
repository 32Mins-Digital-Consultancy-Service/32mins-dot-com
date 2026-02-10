import { useRef, useEffect, useState } from "react";
import VerticalCarousel from "./VerticalCarousel";

interface ServiceCard {
  title: string;
  description: string;
  size: "small" | "medium" | "large" | "tall";
}

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  isVisible: boolean;
  baseIndex: number;
}

const CardWrapper = ({
  children,
  className = "",
  index,
  isVisible,
  baseIndex,
}: CardWrapperProps) => {
  const delay = (baseIndex + index) * 0.1;
  return (
    <div
      className={`rounded-2xl p-[1px] bg-[#1B1B1B] relative overflow-hidden group ${isVisible ? "card-fade-in" : "opacity-0"} ${className}`}
      style={isVisible ? { animationDelay: `${delay}s` } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#444] via-[#2a2a2a] to-[#444] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {children}
    </div>
  );
};

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
    <div className="flex flex-col gap-3 sm:gap-4">
      <h3
        ref={titleRef}
        className="text-white text-xl sm:text-2xl font-semibold leading-tighter w-fit"
      >
        {title}
      </h3>
      <p
        className="text-[#8E8E8E] text-base sm:text-lg font-normal"
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

interface GridProps {
  isVisible?: boolean;
  baseIndex?: number;
}

const Grid = ({ isVisible = true, baseIndex = 0 }: GridProps) => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 auto-rows-[minmax(180px,auto)] sm:auto-rows-[minmax(200px,auto)]">
        <CardWrapper
          index={0}
          isVisible={isVisible}
          baseIndex={baseIndex}
          className="row-span-1 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3"
        >
          <div className="relative bg-[#0A0A0A] rounded-[15px] p-5 sm:p-6 md:p-7.5 flex flex-col justify-start items-start h-full">
            <ServiceCardContent
              title={services[0].title}
              description={services[0].description}
            />
          </div>
        </CardWrapper>

        <CardWrapper
          index={1}
          isVisible={isVisible}
          baseIndex={baseIndex}
          className="row-span-1 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3"
        >
          <div className="relative bg-[#0A0A0A] rounded-[15px] p-5 sm:p-6 md:p-7.5 flex flex-col justify-start items-start h-full">
            <ServiceCardContent
              title={services[1].title}
              description={services[1].description}
            />
          </div>
        </CardWrapper>

        <CardWrapper
          index={2}
          isVisible={isVisible}
          baseIndex={baseIndex}
          className="row-span-1 col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4"
        >
          <div className="relative bg-[#0A0A0A] rounded-[15px] p-5 sm:p-6 md:p-7.5 flex flex-col justify-center gap-4 h-full">
            <VerticalCarousel />
          </div>
        </CardWrapper>

        <CardWrapper
          index={3}
          isVisible={isVisible}
          baseIndex={baseIndex}
          className="row-span-1 sm:row-span-2 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2"
        >
          <div className="relative bg-[#0A0A0A] rounded-[15px] p-5 sm:p-6 md:p-7.5 flex flex-col justify-start items-start h-full">
            <ServiceCardContent
              title={services[3].title}
              description={services[3].description}
            />
          </div>
        </CardWrapper>

        <CardWrapper
          index={4}
          isVisible={isVisible}
          baseIndex={baseIndex}
          className="row-span-1 col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2"
        >
          <div className="relative bg-[#0A0A0A] rounded-[15px] p-5 sm:p-6 md:p-7.5 flex flex-col justify-start items-start h-full">
            <ServiceCardContent
              title={services[4].title}
              description={services[4].description}
            />
          </div>
        </CardWrapper>

        <CardWrapper
          index={5}
          isVisible={isVisible}
          baseIndex={baseIndex}
          className="row-span-1 col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2"
        >
          <div className="relative bg-[#0A0A0A] rounded-[15px] p-5 sm:p-6 md:p-7.5 flex flex-col justify-start items-start h-full">
            <ServiceCardContent
              title={services[5].title}
              description={services[5].description}
            />
          </div>
        </CardWrapper>
      </div>
    </div>
  );
};

export default Grid;
