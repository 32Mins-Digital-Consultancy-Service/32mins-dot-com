import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Summary } from "../../../components/Summary";

type CardType = "" | "card1" | "card2" | "card3";

interface GlobeCardData {
  id: CardType;
  ariaLabel: string;
  cardPosition: "left" | "center" | "right";
  content: React.ReactNode;
}

interface GlobeCardProps {
  data: GlobeCardData;
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    type="button"
    className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-200 bg-transparent   rounded-lg text-sm w-7 h-7 sm:w-8 sm:h-8 inline-flex justify-center items-center  cursor-pointer"
    aria-label="Close modal"
  >
    <svg
      className="w-3 h-3 sm:w-[14px] sm:h-[14px]"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
      />
    </svg>
  </button>
);

const GlobeCard = ({ data, isActive, onToggle, onClose }: GlobeCardProps) => {
  const positionClasses = {
    left: "left-1/2 -translate-x-1/3",
    center: "left-1/2 -translate-x-1/2",
    right: "left-1/2 -translate-x-2/3",
  };

  return (
    <div className="relative flex items-center justify-center ">
      <button
        className="bg-white rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 border p-0.5 sm:p-1 bg-clip-content hover:scale-110 transition-transform cursor-pointer shadow-lg"
        style={{
          transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
        }}
        onClick={onToggle}
        aria-label={data.ariaLabel}
      />
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 backdrop-blur-md  bottom-full mb-3 w-[280px] sm:w-[300px] md:min-w-[400px] md:max-w-lg p-4 sm:p-5 md:p-6 border border-gray-200 rounded-lg shadow dark:border-gray-500 border-opacity-20 bg-black/10 ${
              positionClasses[data.cardPosition]
            }`}
          >
            <CloseButton onClick={onClose} />
            {data.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const cardData: GlobeCardData[] = [
  {
    id: "card1",
    ariaLabel: "Show SDG4 info",
    cardPosition: "left",
    content: (
      <>
        <img
          src="/UN x SDG4.png"
          alt="UN SDG4"
          className="max-w-full sm:max-w-[280px] md:max-w-[300px]"
        />
        <p className="mb-3 mt-4 sm:mt-6 text-sm sm:text-base font-normal text-gray-200">
          Ensure inclusive and equitable quality education and promote lifelong
          learning opportunities for all.
        </p>
      </>
    ),
  },
  {
    id: "card3",
    ariaLabel: "Show GeM & Startup India info",
    cardPosition: "center",
    content: (
      <>
        <div className="flex gap-2 sm:gap-4 justify-start">
          <img
            src="/GeM.png"
            alt="GeM"
            className="max-w-[80px] sm:max-w-[100px] md:max-w-[120px]"
          />
          <img
            src="/SI.png"
            alt="Startup India"
            className="max-w-[80px] sm:max-w-[100px] md:max-w-[120px]"
          />
        </div>
        <p className="mb-3 mt-4 sm:mt-6 text-sm sm:text-base font-normal text-gray-200">
          Proud Part of Startup India and GeM
        </p>
      </>
    ),
  },
  {
    id: "card2",
    ariaLabel: "Show IITM Pravartak info",
    cardPosition: "right",
    content: (
      <>
        <img
          src="/IITM PIS.png"
          alt="IITM Pravartak"
          className="max-w-[120px] sm:max-w-[150px] md:max-w-[175px]"
        />
        <p className="mb-3 mt-4 sm:mt-6 text-sm sm:text-base font-normal text-gray-200">
          We're proud to share that 32Mins Digital Consultancy Services is now
          incubated under the esteemed wing of the IITM Pravartak Technologies
          Foundation
        </p>
      </>
    ),
  },
];

const UpdatePage = () => {
  const earthRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(earthRef, { once: true, amount: 0.15 });
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const [showCard, setShowCard] = useState<CardType>("card3");

  return (
    <section className="z-10 relative scroll-mt-20 w-full max-w-full min-w-0 flex flex-col items-center justify-center overflow-hidden min-h-[var(--viewport-height)] h-[var(--viewport-height)]">
      <div
        ref={earthRef}
        className="globe-section relative w-full h-full overflow-hidden"
      >
        <motion.img
          src="/earth2.webp"
          alt="earth"
          initial={{ y: "40%", rotate: 180 }}
          animate={
            isInView
              ? {
                  rotate:
                    showCard === "card1"
                      ? 270 + 45
                      : showCard === "card2"
                      ? 270 - 45
                      : 270,
                }
              : { rotate: 300 }
          }
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-10 sm:bottom-5 md:-bottom-15 left-1/2 -translate-x-1/2 w-[max(100%,100vh)]"
        />

        <div
          className="absolute top-[86%] lg:top-5/7 left-1/2 -translate-x-1/2 flex justify-between items-center w-[50%] sm:w-[45%] md:w-[40%] lg:w-[50%] "
          style={{ zIndex: 2 }}
        >
          {cardData.map((card) => (
            <GlobeCard
              key={card.id}
              data={card}
              isActive={showCard === card.id}
              onToggle={() => setShowCard(showCard === card.id ? "" : card.id)}
              onClose={() => setShowCard("")}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent w-full flex justify-center items-end h-20" />
      </div>
      <Summary ref={summaryRef} />
    </section>
  );
};

export default UpdatePage;
