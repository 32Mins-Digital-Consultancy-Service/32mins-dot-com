import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import Tilt3D from "./Tilt3D";
import { PILLARS, SERVICES } from "./servicesData";

/**
 * Services switcher: a row of four pills (one per competency from the 2030
 * vision document) selects a pillar; its services appear below as standard
 * cards. Everything here reuses the site's existing surfaces — the section
 * pill, the dark card, tilt, spotlight and the fade-up easing.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// Column count per number of services so no row is left with an orphan.
const COLS: Record<number, string> = {
  1: "md:max-w-3xl md:mx-auto",
  2: "md:grid-cols-2 md:max-w-5xl md:mx-auto",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

const Grid = () => {
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];

  return (
    <div className="w-full mx-auto max-w-[1700px] px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="flex flex-col items-center gap-6 sm:gap-8">
        <div
          role="tablist"
          aria-label="Service areas"
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {PILLARS.map((p, i) => (
            <button
              key={p.title}
              type="button"
              role="tab"
              id={`services-tab-${i}`}
              aria-selected={i === active}
              aria-controls="services-panel"
              onClick={() => setActive(i)}
              className={`rounded-lg border px-4 py-2 text-sm sm:text-base tracking-tighter cursor-pointer transition-colors duration-300 ${
                i === active
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-white/5 border-[#1B1B1B] text-[#8E8E8E] hover:text-white"
              }`}
            >
              {p.short}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pillar.title}
            id="services-panel"
            role="tabpanel"
            aria-labelledby={`services-tab-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex w-full flex-col items-center gap-5 sm:gap-6"
          >
            <div className="flex max-w-3xl flex-col items-center gap-2 text-center">
              <h3 className="text-white text-base sm:text-lg md:text-2xl font-semibold tracking-tigher">
                {pillar.title}
              </h3>
              <p className="text-[#8E8E8E] text-sm sm:text-base tracking-tigher">
                {pillar.description}
              </p>
            </div>

            <div
              className={`grid w-full gap-2.5 sm:gap-4 lg:gap-5 grid-cols-1 ${
                COLS[pillar.services.length] ?? "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {pillar.services.map((idx) => {
                const s = SERVICES[idx];
                return (
                  <Tilt3D
                    key={s.title}
                    className="h-full"
                    innerClassName="h-full"
                    maxTilt={4}
                  >
                    <SpotlightCard className="bg-[#06041A] border border-white/10 rounded-[15px] p-3.5 sm:p-5 md:p-6 lg:p-7.5 flex flex-col h-full justify-start items-start">
                      <div className="flex flex-col gap-1.5 sm:gap-2.5 md:gap-4">
                        <h4 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl font-semibold leading-snug w-fit">
                          {s.title}
                        </h4>
                        <p className="text-[#8E8E8E] text-[11px] leading-snug sm:text-xs sm:leading-normal md:text-sm md:leading-relaxed lg:text-lg font-normal">
                          {s.description} {s.detail}
                        </p>
                      </div>
                    </SpotlightCard>
                  </Tilt3D>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Grid;
