import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const cards = [
  {
    icon: '📚',
    title: 'Generic self-help',
    desc: 'Inspiring for a weekend. No personal context, no longitudinal memory, no next morning.',
    highlight: false,
  },
  {
    icon: '📓',
    title: 'Blank journals',
    desc: 'A cursor and a void. Overwhelming for students already drowning in assignments.',
    highlight: true,
  },
  {
    icon: '✅',
    title: 'Productivity apps',
    desc: 'Obsessed with output. Blind to the inner state that makes output possible — or impossible.',
    highlight: false,
  },
  {
    icon: '🛋️',
    title: 'Clinical therapy',
    desc: 'Irreplaceable for diagnosis and crisis. Not an everyday, stigma-free, two-minute tool.',
    highlight: false,
  },
];

export default function MissingLayerSection() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-secondary py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header row: heading left, body right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-end">
          <div>
            <FadeUp delay={0} style={{ marginBottom: 16 }}>
              <span className="swa-label text-muted-foreground block">The missing layer</span>
            </FadeUp>
            <FadeUp delay={0.08} blur>
              <h2
                className="swa-heading"
                style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.15 }}
              >
                Mental wellbeing has tools.
                <br />
                Everyday awareness does not.
              </h2>
            </FadeUp>
          </div>

          <FadeUp delay={0.18}>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7 }}
            >
              Therapy is essential in crisis. Journals are blank. Habit apps count output. Self-help is generic. None of them live in your pocket as a daily, non-clinical practice.
            </p>
          </FadeUp>
        </div>

        {/* 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              className="rounded-2xl p-6 border border-border"
              style={{
                background: c.highlight ? 'hsl(var(--card))' : 'hsl(var(--background))',
                boxShadow: c.highlight ? 'var(--shadow-md)' : 'none',
              }}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.7, delay: 0.28 + i * 0.08, ease: EASE_PREMIUM }}
              whileHover={reduced ? {} : { y: -6, boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3
                className="swa-heading mb-2"
                style={{ fontSize: 17, fontWeight: 600 }}
              >
                {c.title}
              </h3>
              <p
                className="text-muted-foreground"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.6 }}
              >
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <FadeUp delay={0.6} style={{ textAlign: 'center', marginTop: 48 }}>
          <p
            style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'hsl(var(--foreground))' }}
          >
            We built the space for <em style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>continuous, everyday self-awareness.</em>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
