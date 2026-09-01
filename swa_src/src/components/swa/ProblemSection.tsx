import { motion, useReducedMotion } from 'motion/react';
import SectionHeader from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const satellites = [
  { label: 'Career uncertainty',     top: '2%',  left: '50%',  tx: '-50%' },
  { label: 'Procrastination',        top: '22%', left: '88%',  tx: '-50%' },
  { label: 'Overthinking',           top: '68%', left: '88%',  tx: '-50%' },
  { label: 'Difficult relationships',top: '68%', left: '12%',  tx: '-50%' },
  { label: 'Confidence issues',      top: '22%', left: '12%',  tx: '-50%' },
];

export default function ProblemSection() {
  const reduced = useReducedMotion();
  return (
    <section id="journey" className="bg-background py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <SectionHeader
          kicker="The problem"
          heading={<>These aren't separate problems.<br />They orbit one core.</>}
          lede="Procrastination, overthinking, brittle confidence, difficult rooms, career fog — we treat them as isolated bugs. They are symptoms of a generation that can measure every step and still cannot name what it feels."
          align="center"
          className="mb-16"
        />

        {/* Orbit diagram — pure CSS, no SVG coordinate math */}
        <motion.div
          className="relative mx-auto"
          style={{ width: '100%', maxWidth: 480, aspectRatio: '1 / 1' }}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        >
          {/* Orbit ring */}
          <div
            className="absolute rounded-full border border-dashed border-border"
            style={{
              width: '72%',
              height: '72%',
              top: '14%',
              left: '14%',
            }}
          />

          {/* Center orb */}
          <motion.div
            className="absolute"
            style={{
              width: '26%',
              height: '26%',
              top: '37%',
              left: '37%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, hsl(var(--primary)), hsl(var(--accent) / 0.6))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            initial={reduced ? false : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_PREMIUM }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(9px, 1.8vw, 13px)',
                fontWeight: 700,
                color: 'var(--swa-dark)',
                lineHeight: 1.3,
              }}
            >
              Lack of<br />self-awareness
            </span>
          </motion.div>

          {/* Satellite nodes */}
          {satellites.map((s, i) => (
            <motion.div
              key={s.label}
              className="absolute"
              style={{
                top: s.top,
                left: s.left,
                transform: `translate(${s.tx}, -50%)`,
              }}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: EASE_PREMIUM }}
            >
              <div
                className="px-3 py-2 rounded-full text-center font-semibold bg-card border border-border text-foreground"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(11px, 1.5vw, 14px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
