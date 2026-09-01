import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const stats = [
  { value: '40M', label: 'TAM · Indian higher-education students' },
  { value: '100–200k', label: 'SOM · active users, years 1–3' },
  { value: '$5.6B', label: 'Mental wellness apps, global, by 2030' },
  { value: '₹149', label: 'Student premium / month · ₹999 year' },
];

export default function MarketSection() {
  const reduced = useReducedMotion();
  return (
    <section id="market" className="relative py-32 px-6 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/airo-assets/images/pages/home/market-campus"
          alt="Indian university campus at golden hour"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'hsl(var(--foreground) / 0.68)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: text */}
          <div>
            <FadeUp delay={0} style={{ marginBottom: 16 }}>
              <span className="swa-label block" style={{ color: 'hsl(var(--primary))' }}>Market</span>
            </FadeUp>
            <FadeUp delay={0.08} blur style={{ marginBottom: 24 }}>
              <h2
                className="swa-heading"
                style={{
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: 'hsl(var(--background))',
                }}
              >
                College is the crucible.
                <br />
                India is the beachhead.
              </h2>
            </FadeUp>
            <FadeUp delay={0.18} style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: 'hsl(var(--secondary))',
                }}
              >
                Identity formation, academic pressure, and career uncertainty collide in one volatile window. Indian Gen Z lives inside JEE, NEET, CAT, and placement seasons — with rising mental-health awareness and still-high stigma around clinical apps. Self-awareness, confidence, and communication are the aspirational door.
              </p>
            </FadeUp>
            <FadeUp delay={0.26} style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: 'hsl(var(--secondary))',
                }}
              >
                From campus density we expand to early-career professionals, then B2B2C university licenses, then organizations. The daily loop is the habit. Premium modules are the revenue.
              </p>
            </FadeUp>
            <FadeUp delay={0.34}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  color: 'hsl(var(--secondary) / 0.6)',
                  lineHeight: 1.5,
                }}
              >
                Sources: SWA market diligence · Grand View Research 2023 · APA College Wellness 2022. TAM is Indian higher-education enrollment; global wellness figures are category context, not our claimed SAM.
              </p>
            </FadeUp>
          </div>

          {/* Right: 2x2 stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                className="rounded-2xl p-6"
                style={{
                  background: 'hsl(var(--background) / 0.1)',
                  border: '1px solid hsl(var(--background) / 0.15)',
                }}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.09, ease: EASE_PREMIUM }}
                whileHover={reduced ? {} : { y: -4 }}
              >
                <div
                  className="swa-heading"
                  style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 600, color: 'hsl(var(--primary))', lineHeight: 1.1, marginBottom: 6 }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'hsl(var(--secondary))',
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
