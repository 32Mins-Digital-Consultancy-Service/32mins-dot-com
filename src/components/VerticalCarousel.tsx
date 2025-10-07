import { useState, useEffect } from "react";

interface CarouselItem {
  title: string;
  description: string;
}

const carouselContent: CarouselItem[] = [
  {
    title: "SMEs Video Production (Offline / Remote)",
    description:
      "We create expert-led videos featuring subject specialists sharing insights. These are crafted using various production techniques for use in training, education, thought leadership, or promotional purposes.",
  },
  {
    title: "Lab & Industry Learning Video Production",
    description:
      "industry settings, simulating real-world scenarios through precise planning, filming, and editing to improve hands-on learning and professional skill development.",
  },
  {
    title: "Case Study Video Production",
    description:
      "We produce narrative-driven videos showcasing customer experiences and product impact, using interviews and storytelling to enhance brand credibility, connect emotionally, and boost audience trust and engagement.",
  },
];

const VerticalCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % carouselContent.length
        );
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    if (index !== currentIndex && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="flex h-full gap-6">
        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <div className="relative flex-1 overflow-hidden min-h-[150px]">
            <div
              className={`transition-all duration-500 ease-in-out ${
                isAnimating
                  ? "opacity-0 transform translate-y-8"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              <div>
                <h4 className="text-white text-2xl font-semibold leading-tighter">
                  {carouselContent[currentIndex].title}
                </h4>
                <p className="text-[#8E8E8E] text-lg font-normal">
                  {carouselContent[currentIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Dots Navigation */}
        <div className="flex flex-col gap-3 justify-center items-center">
          {carouselContent.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "h-3 w-1 bg-white"
                  : "h-1 w-1 bg-[#8E8E8E] "
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalCarousel;
