import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import Tilt3D from "./Tilt3D";
import { SubpageHeader } from "./SubpageHeader";
import { PILLARS } from "./servicesData";

/**
 * Services grid: four pillar cards, one per competency from the 2030 vision
 * document, each carrying a short description and its sub-services as the
 * same small tag pills the project cards use. Reuses only existing surfaces.
 */

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  viewport: { once: true, amount: 0.2 },
};

const Grid = () => (
  <div className="w-full mx-auto max-w-[1700px] px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 lg:gap-5">
      {PILLARS.map((pillar) => (
        <motion.div key={pillar.title} {...cardAnimation}>
          <Tilt3D className="h-full" innerClassName="h-full" maxTilt={4}>
            <SpotlightCard className="bg-[#06041A] border border-white/10 rounded-[15px] p-3.5 sm:p-5 md:p-6 lg:p-7.5 flex flex-col h-full justify-start items-start gap-3 sm:gap-4 md:gap-5">
              <div className="flex flex-col gap-1.5 sm:gap-2.5 md:gap-4">
                <h3 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-semibold leading-snug w-fit">
                  {pillar.title}
                </h3>
                <p className="text-[#8E8E8E] text-[11px] leading-snug sm:text-xs sm:leading-normal md:text-sm md:leading-relaxed lg:text-lg font-normal">
                  {pillar.description}
                </p>
              </div>
              <ul className="mt-auto flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 pt-2 list-none p-0 m-0">
                {pillar.chips.map((chip) => (
                  <li key={chip} className="contents">
                    <SubpageHeader title={chip} variant="small" />
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Tilt3D>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Grid;
