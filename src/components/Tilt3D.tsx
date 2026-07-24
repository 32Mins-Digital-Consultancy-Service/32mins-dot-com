import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface Tilt3DProps {
  children: ReactNode;
  /** Outer (perspective) element classes — sizing/layout live here. */
  className?: string;
  /** Rotating element classes — visual card styles live here. */
  innerClassName?: string;
  /** Max rotation in degrees. Keep small: 4–8 reads as depth, more as gimmick. */
  maxTilt?: number;
  scaleOnHover?: number;
  /** Soft light sweep following the cursor. */
  glare?: boolean;
}

const SPRING = { stiffness: 140, damping: 16, mass: 0.5 };

/**
 * Lightweight mouse-follow perspective tilt (same family as TiltedCard, but a
 * generic wrapper). Inert for touch input and reduced-motion users.
 */
const Tilt3D = ({
  children,
  className = "",
  innerClassName = "",
  maxTilt = 6,
  scaleOnHover = 1.015,
  glare = false,
}: Tilt3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, SPRING);
  const rotateY = useSpring(tiltY, SPRING);
  const scale = useSpring(1, SPRING);

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, SPRING);
  // Same light as SpotlightCard (solutions grid) so every card glows alike.
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(41, 67, 252, 0.5), transparent 80%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(-py * maxTilt * 2);
    tiltY.set(px * maxTilt * 2);
    scale.set(scaleOnHover);
    glareX.set(px * 100 + 50);
    glareY.set(py * 100 + 50);
    glareOpacity.set(0.6);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  };

  return (
    <div
      ref={ref}
      className={`[perspective:900px] ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className={`relative [transform-style:preserve-3d] ${innerClassName}`}
        style={{ rotateX, rotateY, scale }}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style={{ background: glareBackground, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Tilt3D;
