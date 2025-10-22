import type { VariantProps } from "class-variance-authority";
import { cva, cx } from "class-variance-authority";

const ctaButtonVariants = cva(
  "px-6 py-4 rounded-3xl text-2xl tracking-tighter flex items-center justify-center gap-3",
  {
    variants: {
      variant: {
        primary: "bg-transparent text-white border-white border font-normal",
        secondary: "bg-[#2943FC] text-white font-semibold",
        tertiary:
          "bg-transparent text-[#8E8E8E] border-[#8E8E8E] border font-normal text-lg w-fit",
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
