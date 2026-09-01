import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const tiers = [
  {
    name: 'Free experience',
    price: 'Free',
    tag: 'Forever. No day cap.',
    features: [
      'Full daily loop — morning, practice, evening',
      'Authored opening chapter (30 days)',
      'On-device storage, Face ID lock',
      'Weekly awareness scores',
      'Export or delete anytime',
    ],
    highlight: false,
  },
  {
    name: 'Freemium',
    price: '₹149/month',
    tag: 'Depth without limits',
    features: [
      'Everything in Free',
      'Optional 7-day deep modules',
      'Optional 21-day deep modules',
      'Extended path — nodes keep unlocking',
      'Priority content updates',
    ],
    highlight: true,
  },
  {
    name: 'Campus B2B',
    price: 'Custom',
    tag: 'Institution licensing',
    features: [
      'Bulk student access',
      'Counsellor dashboard (aggregate, anonymous)',
      'Campus-branded onboarding',
      'Wellness programme integration',
      'Annual contract pricing',
    ],
    highlight: false,
  },
];

export default function BusinessModelSection() {
  const reduced = useReducedMotion();
  return (
    <section id="model" className="bg-background py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <FadeUp delay={0} blur>
            <h2
              className="swa-heading"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600 }}
            >
              Value first. Revenue that scales with depth.
            </h2>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              className={`rounded-3xl p-8 border ${t.highlight ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE_PREMIUM }}
              whileHover={reduced ? {} : { y: -6, boxShadow: 'var(--shadow-lg)' }}
            >
              <span className="swa-label text-muted-foreground block mb-3">{t.name}</span>
              <div
                className="swa-heading mb-1"
                style={{ fontSize: 32, fontWeight: 600 }}
              >
                {t.price}
              </div>
              <p
                className="text-muted-foreground mb-6"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 14 }}
              >
                {t.tag}
              </p>
              <ul className="flex flex-col gap-3">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-foreground"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5 }}
                  >
                    <span style={{ color: 'var(--swa-gold)', fontWeight: 700, marginTop: 1 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.a
            href="#contact"
            className="inline-block px-8 py-3 rounded-full font-bold text-base bg-primary text-foreground"
            style={{ fontFamily: 'var(--font-sans)' }}
            whileHover={reduced ? {} : { y: -2, boxShadow: '0 6px 24px hsl(var(--primary) / 0.45)' }}
            transition={{ duration: 0.18, ease: EASE_PREMIUM }}
          >
            Request investor briefing →
          </motion.a>
        </div>
      </div>
    </section>
  );
}
