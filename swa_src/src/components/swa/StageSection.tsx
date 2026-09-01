import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const statusCards = [
  { label: 'Prototype', status: 'Complete', desc: 'Full daily loop running on-device. Rust core + React Native shell.' },
  { label: 'Content', status: 'Authored', desc: '30-day opening chapter written and reviewed. 7-day and 21-day modules in progress.' },
  { label: 'Privacy architecture', status: 'Verified', desc: 'Zero-server design confirmed. No data leaves the device in any flow.' },
  { label: 'Raise', status: 'Open', desc: 'Validation round. Seeking ₹1.5Cr to fund user research and campus pilots.' },
];

export default function StageSection() {
  const reduced = useReducedMotion();
  return (
    <section id="stage" className="bg-secondary py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeUp delay={0} blur style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            className="swa-heading"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600 }}
          >
            Prototype complete. Validation is the raise.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statusCards.map((c, i) => (
            <motion.div
              key={c.label}
              className="bg-card rounded-2xl p-6 border border-border"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE_PREMIUM }}
              whileHover={reduced ? {} : { y: -6, boxShadow: 'var(--shadow-lg)' }}
            >
              <span className="swa-label text-muted-foreground block mb-2">{c.label}</span>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={{
                  background: c.status === 'Open' ? 'var(--swa-gold)' : 'hsl(var(--primary)/0.15)',
                  color: c.status === 'Open' ? 'var(--swa-dark)' : 'var(--swa-fg)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {c.status}
              </div>
              <p
                className="text-muted-foreground"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.6 }}
              >
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
