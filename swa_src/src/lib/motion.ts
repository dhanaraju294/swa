/**
 * Shared motion utilities for SWA — Apple / Linear style.
 * Slow, elegant, never bouncy.
 */
import { useReducedMotion as useMotionReducedMotion } from 'motion/react';

/** The premium easing curve used throughout the site. */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

/** Standard fade-up variant pair. */
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE_PREMIUM },
  },
} as const;

/** Heading-specific variant — slightly more blur. */
export const headingVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.0, ease: EASE_PREMIUM },
  },
} as const;

/** Body text — less travel, no blur. */
export const bodyVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
} as const;

/** Container that staggers its children. */
export function staggerContainer(staggerMs = 80) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerMs / 1000,
        delayChildren: 0,
      },
    },
  } as const;
}

/**
 * Returns motion props that respect prefers-reduced-motion.
 * When reduced motion is on, returns props that show content instantly.
 */
export function useMotionProps(
  initial: object,
  animate: object,
  transition: object,
) {
  const reduced = useMotionReducedMotion();
  if (reduced) {
    return { initial: animate, animate, transition: { duration: 0 } };
  }
  return { initial, animate, transition };
}

/** Viewport config used for whileInView — trigger once, 15% visible. */
export const VIEWPORT_ONCE = { once: true, amount: 0.15 } as const;
