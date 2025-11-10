import { motion } from "framer-motion";

function MarqueeItem({
  images,
  from,
  to,
}: {
  images: string[];
  from: number | string;
  to: number | string;
}) {
  return (
    <div className="flex  items-center justify-center w-full">
      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0"
      >
        {images.map((image: any, index: number) => {
          return (
            <img
              alt={`marqueImg${index}`}
              className="h-[50px] w-[200px] object-contain pr-8"
              src={image}
              key={index}
            />
          );
        })}
      </motion.div>

      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0"
      >
        {images.map((image: any, index: number) => {
          return (
            <img
              alt={`marqueImg${index}`}
              className="h-[50px] w-[200px] object-contain pr-8"
              src={image}
              key={index}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  const images = [
    "./chai.png",
    "./digivisicom.png",
    "./fundaspring.png",
    "./iitmadras.png",
    "./iitmpravartak.png",
    "./rajendental.png",
    "./shaktidb.png",
    "./swayam.png",
    "./thsti.png",
    "./virginiatech.png",
  ];

  return (
    <div className="container mx-auto overflow-hidden select-none w-full ">
      <MarqueeItem images={images} from={0} to={"-100%"} />
    </div>
  );
}
