import type { VariantProps } from "class-variance-authority";
import { cva, cx } from "class-variance-authority";

const ctaButtonVariants = cva(
  "px-7 py-2 rounded-4xl text-[clamp(1rem,4vw,1.5rem)] tracking-tighter flex items-center justify-center gap-3 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-transparent text-white border-white border font-normal rounded-3xl w-fit",
        secondary: "bg-[#2943FC] text-white font-semibold w-fit rounded-3xl",
        tertiary:
          "bg-transparent text-[#8E8E8E] border-[#8E8E8E] border font-normal text-[clamp(0.875rem,3vw,1.125rem)] w-fit",
      },
    },
  }
);

export default function CtaButton({
  variant = "primary",
  onClick = () => {},
  children = "",
}: VariantProps<typeof ctaButtonVariants> & {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className={cx(ctaButtonVariants({ variant }))} onClick={onClick}>
      {children}
    </button>
  );
}
