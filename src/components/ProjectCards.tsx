import { useRef, useState } from "react";

import chaiVideo from "../assets/asset-video/chai_fast.mp4";
import iitmVideo from "../assets/asset-video/IITMPTF_fast.mp4";
import nmicpsVideo from "../assets/asset-video/nmicps_fast.mp4";
import rajenDentalVideo from "../assets/asset-video/rajen_dental_fast.mp4";

import chaiCover from "../assets/chai_cover.png";
import digiViscomCover from "../assets/DigiViscom_cover.png";
import deviceImage from "../assets/device.png";
import iitmCover from "../assets/IITMPTF_cover.png";
import nmicpsCover from "../assets/nmicps_cover.png";
import rajenDentalCover from "../assets/rajen_dental_cover.png";
import shaktiDbCover from "../assets/ShaktiDB_cover.png";
import sneakPeakImage1 from "../assets/SneakPeak_image1.png";
import sneakPeakImage2 from "../assets/SneakPeak_image2.png";
import sneakPeakImage3 from "../assets/SneakPeak_image3.png";
import sneakPeakImage4 from "../assets/SneakPeak_image4.png";

import { SubpageHeader } from "./SubpageHeader";

const sneakPeakData = {
  title: "Our Journey Ahead...",
  tags: ["UI/UX", "R&D", "32Mins  "],
};

const media_urls = [
  {
    id: 1,
    title: "NMICPS",
    video_url: nmicpsVideo,
    cover_image: nmicpsCover,
    tags: ["UI/UX", "Dashboard"],
  },
  {
    id: 2,
    title: "IITM Pravartak",
    video_url: iitmVideo,
    cover_image: iitmCover,
    tags: ["Graphic Design", "UI/UX"],
  },
  {
    id: 3,
    title: "Rajan Dental",
    video_url: rajenDentalVideo,
    cover_image: rajenDentalCover,
    tags: ["UI/UX", "LMS"],
  },
  {
    id: 4,
    title: "CHAI",
    video_url: chaiVideo,
    cover_image: chaiCover,
    tags: ["Branding", "UI/UX"],
  },
  {
    id: 5,
    title: "ShaktiDB",
    video_url: "",
    cover_image: shaktiDbCover,
    tags: ["Branding", "Newsletter"],
  },
  {
    id: 6,
    title: "DigiViscom",
    video_url: "",
    cover_image: digiViscomCover,
    tags: ["Branding", "UI/UX", "LMS"],
  },
] as const;

type MediaItem = (typeof media_urls)[number];

type ProjectCardMediaProps = {
  media: MediaItem;
  activeId: number | null;
  playVideo: (id: number, container: HTMLElement) => void;
  stopVideo: (container: HTMLElement) => void;
  handleTouch: (id: number, e: React.TouchEvent<HTMLDivElement>) => void;
};

const ProjectCardMedia = ({
  media,
  activeId,
  playVideo,
  stopVideo,
  handleTouch,
}: ProjectCardMediaProps) => {
  const isPlaying = activeId === media.id;
  const hasVideo = Boolean(media.video_url);

  if (!hasVideo) {
    return (
      <div className="w-full">
        <img
          src={media.cover_image}
          alt={media.title}
          className="w-full h-auto object-cover rounded-sm"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full cursor-pointer"
      onMouseEnter={(e) => playVideo(media.id, e.currentTarget)}
      onMouseLeave={(e) => stopVideo(e.currentTarget)}
      onTouchStart={(e) => handleTouch(media.id, e)}
    >
      <img
        src={media.cover_image}
        alt={media.title}
        className={`w-full h-auto object-cover rounded-sm ${isPlaying ? "hidden" : "block"}`}
      />
      <video
        className={`w-full h-auto object-cover rounded-sm ${isPlaying ? "block" : "hidden"}`}
        loop
        muted
        playsInline
      >
        <source src={media.video_url} type="video/mp4" />
      </video>
    </div>
  );
};

const ProjectCards = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const playVideo = (id: number, container: HTMLElement) => {
    const video = container.querySelector("video") as HTMLVideoElement | null;
    if (!video) return;
    if (activeVideoRef.current && activeVideoRef.current !== video) {
      activeVideoRef.current.pause();
      activeVideoRef.current.currentTime = 0;
    }
    activeVideoRef.current = video;
    setActiveId(id);
    video.muted = true;
    void video.play();
  };

  const stopVideo = (container: HTMLElement) => {
    const video = container.querySelector("video") as HTMLVideoElement | null;
    if (video) {
      video.pause();
      video.currentTime = 0;
      activeVideoRef.current = null;
    }
    setActiveId(null);
  };

  const handleTouch = (id: number, e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (activeId === id) {
      stopVideo(e.currentTarget);
    } else {
      playVideo(id, e.currentTarget);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-10 lg:px-16 xl:px-20">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5 lg:gap-6 max-w-6xl mx-auto">
        {media_urls.map((media) => (
          <div
            key={media.id}
            className="rounded-sm flex flex-col justify-between h-full gap-2 sm:gap-3 md:gap-4 min-w-0"
          >
            <div className="w-full">
              <ProjectCardMedia
                media={media}
                activeId={activeId}
                playVideo={playVideo}
                stopVideo={stopVideo}
                handleTouch={handleTouch}
              />
            </div>
            <div className="flex-col flex flex-wrap justify-between items-center lg:items-start lg:flex-row gap-1.5 sm:gap-2 min-w-0">
              <h3 className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-semibold leading-tight w-fit break-words min-w-0">
                {media.title}
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 min-w-0 shrink">
                {media.tags.map((tag) => (
                  <SubpageHeader key={tag} title={tag} variant="small" />
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full rounded-sm col-span-3 min-w-0 ">
          <section className="relative group  bg-[#000030] rounded-lg overflow-hidden w-full min-h-[100px] sm:min-h-[150px] md:min-h-[200px] lg:min-h-[250px] flex items-start justify-center hover:bg-gradient-to-t hover:from-[#0b1a5a00]/-70% hover:to-[#0B1A5A]">
            <h1 className="absolute -top-4 md:-top-8 lg:-top-12 font-bold text-[clamp(2rem,11vw,8.5rem)] tracking-[-0.05em] text-white text-center mix-blend-overlay z-0 whitespace-nowrap leading-none pt-3 sm:pt-4 md:pt-6 lg:pt-8 px-2 ">
              Take a sneak peek
            </h1>
            <div className="flex gap-2">
              <img
                src={sneakPeakImage1}
                alt="Device"
                className="absolute top-[80%] left-0  z-0  transition-all duration-300 group-hover:top-[30%] max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
              <img
                src={sneakPeakImage2}
                alt="Device"
                className="absolute top-[80%] left-1/4  z-0  transition-all duration-300 group-hover:top-[30%] max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
              <img
                src={sneakPeakImage3}
                alt="Device"
                className="absolute top-[80%] left-1/2  z-0  transition-all duration-300 group-hover:top-[30%] max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
              <img
                src={sneakPeakImage4}
                alt="Device"
                className="absolute top-[80%] left-3/4  z-0  transition-all duration-300 group-hover:top-[30%] max-w-3xs w-[25%] sm:w-[30%] md:w-[40%]"
              />
            </div>
            <img
              src={deviceImage}
              alt="Device"
              className="absolute top-[75%] left-1/2 -translate-x-1/2 z-0 w-[55%] sm:w-[45%] md:w-[40%] max-w-md transition-all duration-300 group-hover:top-[40%]"
            />
          </section>
          <div className="flex flex-wrap w-full justify-between items-center gap-1.5 sm:gap-2 min-w-0">
            <h3 className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-semibold leading-tight w-fit break-words min-w-0">
              {sneakPeakData.title}
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 min-w-0 shrink">
              {sneakPeakData.tags.map((tag) => (
                <SubpageHeader key={tag} title={tag} variant="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCards;
