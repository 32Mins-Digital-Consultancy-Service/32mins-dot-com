interface SectionRevealItemProps {
  children: React.ReactNode;
  index: number;
  isVisible: boolean;
}

export const SectionRevealItem = ({
  children,
  index,
  isVisible,
}: SectionRevealItemProps) => (
  <div
    className={isVisible ? "section-fade-in" : "opacity-0"}
    style={isVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
  >
    {children}
  </div>
);
