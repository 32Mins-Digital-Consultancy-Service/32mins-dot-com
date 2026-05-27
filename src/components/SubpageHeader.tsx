import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

const subpageHeaderTitleVariants = cva(
  "text-white font-normal tracking-tighter text-center backdrop-blur-sm border border-[#1B1B1B] rounded-lg w-fit",
  {
    variants: {
      variant: {
        default: "text-lg px-4 py-2",
        small:
          "max-w-full min-w-0 break-words text-[clamp(0.4375rem,0.28rem+0.75vw,0.75rem)] leading-[clamp(1.1,1.02+0.08vw,1.35)] px-[clamp(0.25rem,0.12rem+0.55vw,0.5rem)] py-[clamp(0.0625rem,0.04rem+0.25vw,0.25rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type SubpageHeaderProps = {
  title: string;
} & VariantProps<typeof subpageHeaderTitleVariants>;

export const SubpageHeader = ({
  title,
  variant = "default",
}: SubpageHeaderProps) => {
  const wrapClass =
    variant === "small"
      ? "bg-linear-to-r from-[#1D1D1B]/10 via-[#FFFFFF]/10 to-[#1D1D1B]/10 rounded-lg w-fit min-w-0 max-w-full"
      : "bg-linear-to-r from-[#1D1D1B]/10 via-[#FFFFFF]/10 to-[#1D1D1B]/10 rounded-lg w-fit";

  return (
    <div className={wrapClass}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.2, duration: 0.5 },
        }}
        viewport={{ once: true, amount: 0.5 }}
        className={subpageHeaderTitleVariants({ variant })}
      >
        {title}
      </motion.h1>
    </div>
  );
};
