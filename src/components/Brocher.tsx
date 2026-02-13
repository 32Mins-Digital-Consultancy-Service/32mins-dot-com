import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureModal({ isOpen, onClose }: Props) {
  const [pageCount, setPageCount] = useState(0);
  const [backOpen, setBackOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText("./32Mins_Brochure.pdf");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    
    <div className="modal relative flex gap-6 flex-col justify-evenly shadow-xl py-7 px-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-white font-bold">
          32Mins Digital Consultancy Services - Marketing Brochure
        </h4>

        <div className="flex items-center gap-3">
          {/* Download */}
          <a
            className="btn-icon h-8 w-8 bg-[#202020] text-white flex items-center justify-center"
            href="./32Mins_Brochure.pdf"
            download
          >
            ⬇
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="btn-icon h-8 w-8 bg-[#202020] text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Book Preview */}
      <div className="flex gap-6 flex-col items-center justify-end h-full">
        <span
          className={`jaffee ${backOpen ? "open" : ""}`}
          style={{ ["--bg" as any]: "url('./Inner_Spread.png')" }}
        >
          <span className="bc">
            <span className="b" />
            <span className={`c ${pageCount === 2 ? "open" : ""}`} />
          </span>
          <span className={`a ${pageCount >= 1 ? "open" : ""}`} />
          <img src="./Inner_Spread.png" alt="" />
        </span>

        {/* Controls */}
        <div className="flex items-center">
          {/* Previous */}
          <button
            className="btn-lg rounded-lg bg-[#202020] mx-4"
            disabled={pageCount <= 0}
            onClick={() => setPageCount((prev) => (prev <= 0 ? 0 : prev - 1))}
          >
            ◀
          </button>

          {/* Flip */}
          <button
            className="btn-icon mx-4"
            style={{
              background: "linear-gradient(180deg, #122B8A 0%, #193CC7 100%)",
            }}
            onClick={() => setBackOpen((prev) => !prev)}
          >
            🔄
          </button>

          {/* Next */}
          <button
            className="btn-lg rounded-lg bg-[#202020] mx-4"
            disabled={pageCount >= 2}
            onClick={() => setPageCount((prev) => (prev >= 2 ? 2 : prev + 1))}
          >
            ▶
          </button>
        </div>

        {/* Share Section */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <input
            type="text"
            readOnly
            value="./32Mins_Brochure.pdf"
            className="input text-sm py-2 px-3"
          />

          <button
            onClick={handleCopy}
            disabled={copied}
            className="btn text-white btn-sm bg-[#1638b6]"
          >
            {copied ? "Copied 👍" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
