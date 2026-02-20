import { useState, useEffect, useRef } from "react";
import Linkedin from "../assets/linkedin.svg";
import Facebook from "../assets/facebook.svg";
import Twitter from "../assets/twitter.svg";
import Whatsapp from "../assets/whatsapp.svg";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BROCHURE_URL = "https://32mins.com/32Mins_Brochure.pdf";

const shareLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: `https://www.facebook.com/sharer/sharer.php?u=${BROCHURE_URL}`,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: `https://www.linkedin.com/shareArticle?mini=true&url=${BROCHURE_URL}`,
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: `https://twitter.com/intent/tweet?url=${BROCHURE_URL}`,
  },
  {
    name: "WhatsApp",
    icon: Whatsapp,
    href: `https://wa.me/?text=${BROCHURE_URL}`,
  },
];

export const BrochureModal = ({ isOpen, onClose }: BrochureModalProps) => {
  const [pageCount, setPageCount] = useState(0);
  const [backOpen, setBackOpen] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close share dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShareDropdown(false);
      }
    };
    if (showShareDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showShareDropdown]);

  // Close dropdown when modal opens
  useEffect(() => {
    if (isOpen) setShowShareDropdown(false);
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex flex-col gap-4 sm:gap-6 shadow-xl bg-[#0A0A0A] py-5 sm:py-7 px-4 sm:px-8 md:px-12 rounded-2xl max-w-[95vw] max-h-[95vh]">
        {/* Header */}
        <header className="flex justify-between items-center gap-2 sm:gap-4">
          <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">
            32Mins Digital Consultancy Services - Marketing Brochure
          </h4>
          <div className="flex items-center flex-shrink-0 gap-0">
            {/* Share Button with Dropdown */}
            <div className="relative mx-1 sm:mx-2" ref={shareRef}>
              <button
                className="h-8 w-8 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:opacity-80"
                onClick={() => setShowShareDropdown((v) => !v)}
                title="Share"
                aria-label="Share"
                aria-expanded={showShareDropdown}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
              {showShareDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 flex flex-row items-center gap-1 rounded-lg bg-[#1a1a1a] border border-[#333] p-1.5 shadow-xl z-50"
                  role="menu"
                >
                  {shareLinks.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-md text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                      role="menuitem"
                      title={item.name}
                      onClick={() => setShowShareDropdown(false)}
                    >
                      <item.icon className="size-7 object-contain" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Download Button */}
            <a
              className="h-8 w-8 p-0.5  mx-1 sm:mx-2 text-white rounded-lg flex items-center justify-center transition-colors"
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
              className="h-8 w-8  mx-1 sm:mx-2 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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
        </header>

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
