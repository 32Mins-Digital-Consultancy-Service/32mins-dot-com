import type { VariantProps } from "class-variance-authority";
import { cva, cx } from "class-variance-authority";

const fancyButtonVariants = cva(
  "px-7 py-2 rounded-4xl text-[clamp(0.75rem,3vw,1.25rem)] tracking-tighter flex items-center justify-center gap-0.5 cursor-pointer w-fit rounded-3xl",
  {
    variants: {
      variant: {
        primary:
          "bg-transparent text-white border-white border font-normal btn-style902-primary",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface FancyButtonProps extends VariantProps<typeof fancyButtonVariants> {
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const FancyButton = ({
  href = "#",
  variant = "primary",
  children = (
    <>
      <span data-name="hover">Hover</span>
      <span data-name="me">me</span>
    </>
  ),
  onClick,
}: FancyButtonProps) => {
  const content = (
    <>
      <div className="block">
        <span />
      </div>
      {children}
    </>
  );

  const className = cx(fancyButtonVariants({ variant }));

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <a className={className} href={href}>
      {content}
    </a>
  );
};

export default FancyButton;
