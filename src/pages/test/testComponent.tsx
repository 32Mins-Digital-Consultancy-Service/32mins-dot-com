import { useState, useRef } from "react";

const TestComponent = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const media_urls = [
    {
      id: 1,
      title: "Video One",
      video_url: "src/assets/asset-video/nmicps_fast.mp4",
      cover_image: "src/assets/nmicps_cover.png",
    },
    {
      id: 2,
      title: "Video Two",
      video_url: "src/assets/asset-video/IITMPTF_fast.mp4",
      cover_image: "src/assets/IITMPTF_cover.png",
    },
    {
      id: 3,
      title: "Video Three",
      video_url: "src/assets/asset-video/rajen_dental_fast.mp4",
      cover_image: "src/assets/rajen_dental_cover.png",
    },
    {
      id: 4,
      title: "Video Four",
      video_url: "src/assets/asset-video/chai_fast.mp4",
      cover_image: "src/assets/chai_cover.png",
    },
  ];

  const playVideo = (id: number, container: HTMLElement) => {
    const video = container.querySelector("video") as HTMLVideoElement;
    if (!video) return;
    if (activeVideoRef.current && activeVideoRef.current !== video) {
      activeVideoRef.current.pause();
      activeVideoRef.current.currentTime = 0;
    }
    activeVideoRef.current = video;
    setActiveId(id);
    video.muted = true;
    video.play();
  };

  const stopVideo = (container: HTMLElement) => {
    const video = container.querySelector("video") as HTMLVideoElement;
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
    <>
      <h1 className="text-center">Cloudinary Video Show</h1>
      <div className="container">
        <div className="row flex flex-wrap justify-center">
          {media_urls.map((media) => (
            <div key={media.id} className="col-lg-4 col-sm-6 mb-4">
              <div className="card h-100">
                <div>
                  <h4>{media.title}</h4>
                  <div
                    className="position-relative"
                    style={{ width: 320, cursor: "pointer" }}
                    onMouseEnter={(e) => playVideo(media.id, e.currentTarget)}
                    onMouseLeave={(e) => stopVideo(e.currentTarget)}
                    onTouchStart={(e) => handleTouch(media.id, e)}
                  >
                    <img
                      src={media.cover_image}
                      alt={media.title}
                      width={320}
                      style={{
                        objectFit: "cover",
                        display: activeId === media.id ? "none" : "block",
                      }}
                    />
                    <video
                      width="320"
                      height="240"
                      style={{
                        display: activeId === media.id ? "block" : "none",
                        objectFit: "cover",
                      }}
                      loop
                      muted
                      playsInline
                    >
                      <source src={media.video_url} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TestComponent;
