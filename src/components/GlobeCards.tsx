import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlobeCardData } from "./globeCardData";

/**
 * The globe's info-point popovers, shared by the 3D globe (markers pinned to
 * the sphere) and the static-image fallback (flat row of dots).
 */

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

export const GlobeCard = ({
  data,
  isActive,
  onToggle,
  onClose,
}: GlobeCardProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on any click/tap outside this dot + its popover (and on Escape).
  useEffect(() => {
    if (!isActive) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, onClose]);

  const positionClasses = {
    left: "left-1/2 -translate-x-1/3",
    center: "left-1/2 -translate-x-1/2",
    right: "left-1/2 -translate-x-2/3",
  };

  return (
    <div ref={rootRef} className="relative flex items-center justify-center ">
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
            className={`absolute z-50 backdrop-blur-md  bottom-full mb-3 w-[280px] sm:w-[300px] md:min-w-[400px] md:max-w-lg p-4 sm:p-5 md:p-6 border border-white/10 rounded-lg shadow bg-[#050B26]/70 ${
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
