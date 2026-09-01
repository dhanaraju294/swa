import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const features = [
  {
    icon: '🌅',
    title: 'Morning arrival',
    desc: 'What state am I entering? Current feeling, intention, one anticipated friction. Not a gratitude essay.',
  },
  {
    icon: '🌱',
    title: 'One tiny practice',
    desc: 'Thirty to ninety seconds. Wheels, scales, this-or-that, thought-catching. High reflection, near-zero typing.',
    highlight: true,
  },
  {
    icon: '🌙',
    title: 'Evening look-back',
    desc: 'What did I notice? Surprises, what worked, the story I told myself. Pattern soil for later.',
  },
  {
    icon: '⚡',
    title: 'On-the-spot',
    desc: 'A 30-second pocket when something snags mid-day. Feeling, intensity, a note. Not part of the path — a refuge.',
  },
  {
    icon: '🗺️',
    title: 'A 30-day path',
    desc: 'Duolingo-shaped, sanctuary-paced. Days 1–7 Notice, 8–14 Understand, 15–21 Choose, 22–30 Live. Nodes unlock without catch-up shame.',
  },
  {
    icon: '🔒',
    title: 'Private by architecture',
    desc: 'No login. No analytics cloud. SQLite on device. Face ID. Export JSON when you want. Delete when you don\'t.',
  },
];

export default function PrivacySection() {
  const reduced = useReducedMotion();
  return (
    <section id="journey-features" className="bg-secondary py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-end">
          <div>
            <FadeUp delay={0} style={{ marginBottom: 16 }}>
              <span className="swa-label text-muted-foreground block">The journey</span>
            </FadeUp>
            <FadeUp delay={0.08} blur>
              <h2
                className="swa-heading"
                style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.15 }}
              >
                Everything a sanctuary needs.
                <br />
                Nothing a feed would want.
              </h2>
            </FadeUp>
          </div>

          <FadeUp delay={0.18}>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.7 }}
            >
              Designed like a quiet paper object. Engineered like infrastructure. The UI is presentational. The truth lives in Rust.
            </p>
          </FadeUp>
        </div>

        {/* 6 feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-2xl p-6 border border-border"
              style={{
                background: (f as { highlight?: boolean }).highlight ? 'hsl(var(--card))' : 'hsl(var(--background))',
                boxShadow: (f as { highlight?: boolean }).highlight ? 'var(--shadow-md)' : 'none',
              }}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.7, delay: 0.28 + i * 0.07, ease: EASE_PREMIUM }}
              whileHover={reduced ? {} : { y: -6, boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3
                className="swa-heading mb-2"
                style={{ fontSize: 17, fontWeight: 600 }}
              >
                {f.title}
              </h3>
              <p
                className="text-muted-foreground"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.6 }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
