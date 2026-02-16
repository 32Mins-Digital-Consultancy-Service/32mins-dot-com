import { motion } from "framer-motion";

const CLIENT_LOGOS: { src: string; alt: string }[] = [
  { src: "./chai.webp", alt: "Chai logo" },
  { src: "./digivisicom.webp", alt: "Digivisicom logo" },
  { src: "./fundaspring.webp", alt: "Fundaspring logo" },
  { src: "./iitmadras.webp", alt: "IIT Madras logo" },
  { src: "./iitmpravartak.webp", alt: "IITM Pravartak logo" },
  { src: "./rajendental.webp", alt: "Rajen Dental logo" },
  { src: "./shaktidb.webp", alt: "Shakti DB logo" },
  { src: "./swayam.webp", alt: "Swayam logo" },
  { src: "./thsti.webp", alt: "THSTI logo" },
  { src: "./virginiatech.webp", alt: "Virginia Tech logo" },
];

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden" role="marquee" aria-label="Our client logos">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className={`object-contain pr-8 ${
              logo.src.includes("thsti") || logo.src.includes("iitmadras")
                ? "h-[80px] w-[150px]"
                : "h-[50px] w-[150px]"
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
