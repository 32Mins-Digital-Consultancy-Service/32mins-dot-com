import { useState, useRef, useEffect } from "react";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal = ({ isOpen, onClose }: BrochureModalProps) => {
  const [pageCount, setPageCount] = useState(0);
  const [backOpen, setBackOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close share popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShare(false);
      }
    };
    if (showShare) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showShare]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close share popup when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowShare(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex flex-col gap-4 sm:gap-6 shadow-xl bg-slate-700 py-5 sm:py-7 px-4 sm:px-8 md:px-12 rounded-2xl max-w-[95vw] max-h-[95vh]">
        {/* Header */}
        <div className="flex justify-between items-center gap-2 sm:gap-4">
          <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">
            32Mins Digital Consultancy Services - Marketing Brochure
          </h4>
          <div className="flex items-center flex-shrink-0">
            {/* Share Button */}
            <div className="relative" ref={shareRef}></div>

            {/* Download Button */}
            <a
              className="h-8 w-8 p-0.5 bg-gray-500 hover:bg-gray-400 mx-1 sm:mx-2 text-white rounded-lg flex items-center justify-center transition-colors"
              href="/32Mins_Brochure.pdf"
              download
              title="Download"
            >
              <img
                src="/download-icon.svg"
                alt="Download"
                className="w-full h-full object-contain"
              />
            </a>

            {/* Close Button */}
            <button
              className="h-8 w-8 bg-gray-500 hover:bg-gray-400 mx-1 sm:mx-2 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              onClick={onClose}
              title="Close"
            >
              <img
                src="/Cross.svg"
                alt="Close"
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>

        {/* Tri-fold Brochure with Jaffee Fold Animation */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 justify-end overflow-hidden">
          <div className="jaffee-scene">
            <span
              className={`jaffee${backOpen ? " open" : ""}`}
              style={
                { "--bg": "url('/Inner_Spread.png')" } as React.CSSProperties
              }
            >
              <span className="bc">
                <span className="b" />
                <span className={`c${pageCount === 2 ? " open" : ""}`} />
              </span>
              <span className={`a${pageCount >= 1 ? " open" : ""}`} />
              <img
                src="/Inner_Spread.png"
                alt="Brochure"
                draggable={false}
                loading="eager"
              />
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Previous Button */}
            <button
              className="p-2.5 sm:p-3 rounded-lg bg-[#202020] hover:bg-[#303030] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPageCount((p) => Math.max(0, p - 1))}
              disabled={pageCount <= 0}
              title="Previous"
            >
              <img
                src="/previous.svg"
                alt="Previous"
                className="w-4 h-4 object-contain"
              />
            </button>

            {/* Flip Button */}
            <button
              className="p-2.5 sm:p-3 rounded-full cursor-pointer hover:brightness-110 transition-all"
              style={{
                background: "linear-gradient(180deg, #122B8A 0%, #193CC7 100%)",
              }}
              onClick={() => setBackOpen((b) => !b)}
              title="Flip"
            >
              <img
                src="/flip.svg"
                alt="Flip"
                className="w-4 h-4 object-contain"
              />
            </button>

            {/* Next Button */}
            <button
              className="p-2.5 sm:p-3 rounded-lg bg-[#202020] hover:bg-[#303030] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPageCount((p) => Math.min(2, p + 1))}
              disabled={pageCount >= 2}
              title="Next"
            >
              <img
                src="/next.svg"
                alt="Next"
                className="w-4 h-4 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
