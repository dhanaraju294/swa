/**
 * Reusable staggered section header.
 * Renders: kicker → heading → lede, each fading up 80ms apart.
 * Pass dark=true when the section has a dark background.
 */
import { motion, useReducedMotion } from 'motion/react';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

interface SectionHeaderProps {
  kicker?: string;
  heading: React.ReactNode;
  lede?: React.ReactNode;
  dark?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

function FadeUp({
  children,
  delay,
  blur,
  style,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  blur?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y: 24, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}

export default function SectionHeader({
  kicker,
  heading,
  lede,
  dark = false,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const textAlign = align === 'center' ? 'text-center' : '';
  const kickerColor = dark ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
  const ledeColor = dark ? 'hsl(var(--secondary))' : 'hsl(var(--muted-foreground))';

  return (
    <div className={`${textAlign} ${className}`}>
      {kicker && (
        <FadeUp delay={0} style={{ marginBottom: 16 }}>
          <span
            className="swa-label"
            style={{ color: kickerColor, display: 'block' }}
          >
            {kicker}
          </span>
        </FadeUp>
      )}
      <FadeUp delay={0.08} blur style={{ marginBottom: lede ? 20 : 0 }}>
        <h2
          className="swa-heading"
          style={{
            fontSize: 'clamp(26px, 3.5vw, 48px)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: dark ? 'hsl(var(--background))' : undefined,
          }}
        >
          {heading}
        </h2>
      </FadeUp>
      {lede && (
        <FadeUp delay={0.16}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              lineHeight: 1.7,
              color: ledeColor,
            }}
          >
            {lede}
          </div>
        </FadeUp>
      )}
    </div>
  );
}

export { FadeUp };
