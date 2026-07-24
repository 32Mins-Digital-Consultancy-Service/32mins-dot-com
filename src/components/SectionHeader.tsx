import { motion } from "framer-motion";
import { SubpageHeader } from "./SubpageHeader";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  viewport: { once: true, amount: 0.2 },
};

interface SectionHeaderProps {
  pill: string;
  title?: string;
  subtitle?: string;
}

/**
 * The one section-header pattern: centered pill, optional title and subtitle,
 * with the site-wide type ramp and gaps. Every homepage section uses this so
 * the vertical rhythm stays identical from section to section.
 */
export const SectionHeader = ({ pill, title, subtitle }: SectionHeaderProps) => (
  <header className="flex w-full flex-col items-center justify-center gap-[clamp(0.875rem,2vw,1.25rem)] px-2 text-center">
    <SubpageHeader title={pill} />
    {title && (
      <motion.h2
        {...fadeUp}
        className="font-bold text-xl sm:text-2xl md:text-3xl tracking-tigher text-white"
      >
        {title}
      </motion.h2>
    )}
    {subtitle && (
      <motion.p
        {...fadeUp}
        className="max-w-3xl text-base sm:text-lg tracking-tigher text-[#8E8E8E]"
      >
        {subtitle}
      </motion.p>
    )}
  </header>
);

export default SectionHeader;
