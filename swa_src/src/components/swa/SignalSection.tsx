import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const frameworks = [
  'Self-Determination Theory',
  'Acceptance & Commitment',
  'Metacognition',
  'Self-Compassion',
  'Fogg Tiny Habits',
  'WOOP / Mental Contrasting',
  'Signal ≠ Label',
  'Human-in-the-loop AI',
];

const marqueeItems = [...frameworks, ...frameworks];

const clusterTags = ['Skipped the meeting', "Didn't send the email", 'Stayed quiet again', 'Felt judged by peers'];

export default function SignalSection() {
  const reduced = useReducedMotion();
  return (
    <section
      id="signal"
      style={{ background: 'var(--swa-dark)' }}
      className="py-24 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeUp delay={0} style={{ marginBottom: 16 }}>
            <span className="swa-label block" style={{ color: 'hsl(var(--primary))' }}>The differentiator</span>
          </FadeUp>
          <FadeUp delay={0.08} blur style={{ marginBottom: 20 }}>
            <h2
              className="swa-heading"
              style={{
                fontSize: 'clamp(40px, 7vw, 80px)',
                fontWeight: 600,
                lineHeight: 1,
                color: 'hsl(var(--background))',
              }}
            >
              Signal ≠ Label
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 17,
                lineHeight: 1.7,
                color: 'hsl(var(--secondary))',
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              Most apps try to name you on day one. SWA refuses. A single moment is weather. Repeated signals are climate.
            </p>
          </FadeUp>
        </div>

        {/* Two-panel card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {/* Left: single signal */}
          <motion.div
            className="rounded-2xl p-7 border"
            style={{ background: 'hsl(var(--foreground) / 0.06)', borderColor: 'hsl(var(--background) / 0.1)' }}
            initial={reduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, ease: EASE_PREMIUM }}
          >
            <span className="swa-label block mb-5" style={{ color: 'hsl(var(--primary))', fontSize: 11 }}>A single signal</span>
            <blockquote
              className="swa-heading mb-4"
              style={{ fontSize: 20, fontWeight: 600, color: 'hsl(var(--background))', lineHeight: 1.3 }}
            >
              "I hesitated before speaking in class."
            </blockquote>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: 'hsl(var(--primary))', fontSize: 18 }}>→</span>
              <span
                className="swa-label"
                style={{ fontSize: 11, color: 'hsl(var(--primary))', textDecoration: 'line-through', letterSpacing: '0.1em' }}
              >
                "I AM AN INSECURE PERSON"
              </span>
            </div>
            <p
              style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'hsl(var(--secondary))', lineHeight: 1.6 }}
            >
              One data point. Held lightly. Never written into identity.
            </p>
          </motion.div>

          {/* Right: cluster over time */}
          <motion.div
            className="rounded-2xl p-7 border"
            style={{ background: 'hsl(var(--foreground) / 0.06)', borderColor: 'hsl(var(--background) / 0.1)' }}
            initial={reduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_PREMIUM }}
          >
            <span className="swa-label block mb-5" style={{ color: 'hsl(var(--secondary) / 0.7)', fontSize: 11 }}>A cluster over time</span>
            <div className="flex flex-wrap gap-2 mb-6">
              {clusterTags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background: 'hsl(var(--foreground) / 0.08)',
                    borderColor: 'hsl(var(--background) / 0.12)',
                    color: 'hsl(var(--background))',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 40% 40%, hsl(var(--primary)), hsl(var(--accent) / 0.5))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 12,
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--swa-dark)', lineHeight: 1.3 }}>
                  Fear of<br />evaluation
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee row 1 — left */}
      <div className="overflow-hidden mb-3">
        <div className="flex gap-6 animate-marquee-left whitespace-nowrap">
          {marqueeItems.map((f, i) => (
            <span
              key={i}
              className="swa-label px-5 py-2 rounded-full shrink-0"
              style={{
                background: 'hsl(var(--primary) / 0.12)',
                color: 'hsl(var(--primary))',
                border: '1px solid hsl(var(--primary) / 0.2)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee row 2 — right */}
      <div className="overflow-hidden">
        <div className="flex gap-6 animate-marquee-right whitespace-nowrap">
          {[...marqueeItems].reverse().map((f, i) => (
            <span
              key={i}
              className="swa-label px-5 py-2 rounded-full shrink-0"
              style={{
                background: 'hsl(var(--secondary) / 0.1)',
                color: 'hsl(var(--secondary))',
                border: '1px solid hsl(var(--secondary) / 0.2)',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
