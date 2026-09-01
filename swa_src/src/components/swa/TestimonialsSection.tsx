import { motion, useReducedMotion } from 'motion/react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const voices = [
  {
    name: 'Ananya',
    role: '3rd year, engineering',
    quote: '"I keep procrastinating. I don\'t think I\'m lazy. I just don\'t know what I\'m avoiding."',
    slot: '/airo-assets/images/pages/home/voice-ananya',
  },
  {
    name: 'Arjun',
    role: 'CAT year',
    quote: '"I feel overwhelmed. But I couldn\'t tell you what is actually happening."',
    slot: '/airo-assets/images/pages/home/voice-arjun',
  },
  {
    name: 'Meera',
    role: 'First job, 0–3 years',
    quote: '"Why did that one conversation follow me around for three days?"',
    slot: '/airo-assets/images/pages/home/voice-meera',
  },
];

export default function TestimonialsSection() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-secondary py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header row: title left, subtitle right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 items-end">
          <div>
            <FadeUp delay={0} style={{ marginBottom: 16 }}>
              <span className="swa-label text-muted-foreground block">Campus voices</span>
            </FadeUp>
            <FadeUp delay={0.08} blur>
              <h2
                className="swa-heading"
                style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 600, lineHeight: 1.15 }}
              >
                The inner questions we already hear.
              </h2>
            </FadeUp>
          </div>

          <FadeUp delay={0.18}>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7 }}
            >
              Composite portraits of the students SWA is built for. The questions are drawn from our research and pitch work — not from paid reviews.
            </p>
          </FadeUp>
        </div>

        {/* 3 voice cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {voices.map((v, i) => (
            <motion.div
              key={v.name}
              className="bg-card rounded-3xl overflow-hidden border border-border"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: EASE_PREMIUM }}
              whileHover={reduced ? {} : { y: -6, boxShadow: 'var(--shadow-lg)' }}
            >
              {/* Portrait photo — taller aspect ratio */}
              <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                <img
                  src={v.slot}
                  alt={v.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  width={400}
                  height={533}
                />
              </div>
              <div className="p-6">
                <blockquote
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontStyle: 'italic',
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'hsl(var(--foreground))',
                    marginBottom: 16,
                  }}
                >
                  {v.quote}
                </blockquote>
                <div>
                  <p
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: 'hsl(var(--foreground))' }}
                  >
                    {v.name}
                  </p>
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}
                  >
                    {v.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeUp delay={0.5} style={{ textAlign: 'center', marginTop: 40 }}>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5 }}
          >
            Expansion persona: early-career professionals — higher LTV, same inner loop, workplace anxiety and assertive communication.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
