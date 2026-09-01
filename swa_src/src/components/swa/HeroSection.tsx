import { motion, useReducedMotion } from 'motion/react';
import { EASE_PREMIUM } from '@/lib/motion';

const badges = [
  { label: 'Prototype live', dot: true },
  { label: 'India beachhead · 18–24' },
  { label: 'On-device · Rust core' },
];

/** Shared fade-up item for the hero stagger. */
function FadeItem({
  children,
  delay = 0,
  blur = false,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  blur?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y: 26, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: 280,
        height: 560,
        borderRadius: 44,
        background: 'var(--swa-dark)',
        padding: '16px 12px 20px',
        boxShadow: 'var(--swa-shadow-phone)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center px-2 mb-3">
        <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>9:41</span>
        <div style={{ width: 72, height: 20, borderRadius: 10, background: 'var(--swa-dark-2)' }} />
        <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>···</span>
      </div>

      {/* Screen */}
      <div
        style={{
          flex: 1,
          borderRadius: 32,
          background: 'hsl(var(--background))',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflow: 'hidden',
        }}
      >
        {/* Greeting */}
        <div>
          <p style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: 1.2 }}>
            Good morning,<br />Ananya
          </p>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>
            Thursday, August 20
          </p>
        </div>

        {/* Streak card */}
        <div
          style={{
            background: 'hsl(var(--card))',
            borderRadius: 14,
            padding: '10px 12px',
            border: '1px solid hsl(var(--border))',
          }}
        >
          <p className="swa-label" style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))', marginBottom: 2 }}>SHOWING UP</p>
          <p style={{ fontSize: 28, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: 1 }}>12</p>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>days you returned to yourself</p>
        </div>

        {/* Today's ritual label */}
        <p className="swa-label" style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))' }}>TODAY'S RITUAL</p>
        <p style={{ fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'hsl(var(--foreground))', marginTop: -6 }}>
          Noticing the first hour
        </p>

        {/* Ritual items */}
        {[
          { n: 1, title: 'Morning reflection', sub: 'What state am I entering?' },
          { n: 2, title: 'Catch the story', sub: 'One tiny noticing' },
          { n: 3, title: 'Evening reflection', sub: 'What did I notice?' },
        ].map((item) => (
          <div
            key={item.n}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              background: item.n === 1 ? 'hsl(var(--primary) / 0.15)' : 'transparent',
              borderRadius: 10,
              padding: '6px 8px',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: item.n === 1 ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                color: item.n === 1 ? 'var(--swa-dark)' : 'hsl(var(--muted-foreground))',
                flexShrink: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {item.n}
            </span>
            <div>
              <p style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1.3 }}>{item.title}</p>
              <p style={{ fontSize: 10, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>{item.sub}</p>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div
          style={{
            marginTop: 'auto',
            background: 'hsl(var(--primary))',
            borderRadius: 14,
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--swa-dark)' }}>
            Continue the path
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: 64 }}
    >
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/airo-assets/images/pages/home/hero-bg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.92) 35%, hsl(var(--background) / 0.55) 60%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — staggered on-load sequence */}
          <div>
            {/* 1. Pills */}
            <FadeItem delay={0.05} style={{ marginBottom: 32 }}>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className="swa-label px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground flex items-center gap-1.5"
                  >
                    {b.dot && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: 'var(--swa-live)',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {b.label}
                  </span>
                ))}
              </div>
            </FadeItem>

            {/* 2. Kicker */}
            <FadeItem delay={0.15} blur>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                  color: 'hsl(var(--muted-foreground))',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                The Inward Journey
              </p>
            </FadeItem>

            {/* 3. H1 line 1 */}
            <FadeItem delay={0.25} blur>
              <h1
                className="swa-heading"
                style={{ fontSize: 'clamp(44px, 6.5vw, 78px)', fontWeight: 600, lineHeight: 1.0, marginBottom: 4 }}
              >
                We track everything.
              </h1>
            </FadeItem>

            {/* 4. H1 line 2 — italic gold with shimmer */}
            <FadeItem delay={0.37} blur style={{ marginBottom: 28 }}>
              <p
                className="swa-heading swa-shimmer-text"
                style={{
                  fontSize: 'clamp(44px, 6.5vw, 78px)',
                  fontWeight: 600,
                  lineHeight: 1.0,
                  fontStyle: 'italic',
                }}
              >
                Except ourselves.
              </p>
            </FadeItem>

            {/* 5. Body */}
            <FadeItem delay={0.5} style={{ marginBottom: 36 }}>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: 'hsl(var(--muted-foreground))',
                  maxWidth: 500,
                }}
              >
                SWA is a continuous self-awareness journey. Thirty to ninety seconds, morning to evening, entirely on your phone. No cloud. No account. No clinical labels. Small moments of noticing that compound into the rarest asset in a loud generation: inner clarity.
              </p>
            </FadeItem>

            {/* 6. Buttons */}
            <FadeItem delay={0.62} style={{ marginBottom: 40 }}>
              <div className="flex flex-wrap items-center gap-4">
                <motion.a
                  href="#contact"
                  className="swa-btn-primary px-7 py-3 rounded-full font-bold text-base bg-primary text-foreground"
                  style={{ fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  whileHover={reduced ? {} : { y: -2, boxShadow: '0 6px 24px hsl(var(--primary) / 0.45)' }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Request investor briefing</span>
                  <motion.span
                    whileHover={reduced ? {} : { x: 4 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-block' }}
                  >
                    →
                  </motion.span>
                </motion.a>
                <motion.a
                  href="#product"
                  className="px-7 py-3 rounded-full font-bold text-base border border-foreground text-foreground"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  whileHover={reduced ? {} : { y: -2, opacity: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  Walk the product
                </motion.a>
              </div>
            </FadeItem>

            {/* 7. Quote — last */}
            <FadeItem delay={0.76}>
              <blockquote
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                "The answer to every question begins within."
              </blockquote>
            </FadeItem>
          </div>

          {/* Right: phone + floating cards */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: reduced ? 0 : 0.3, ease: EASE_PREMIUM }}
            className="flex justify-center lg:justify-end relative"
          >
            {/* Floating card: 30-90s */}
            <div
              className="absolute z-10 bg-card rounded-2xl px-4 py-3 border border-border"
              style={{ top: '8%', left: '-5%', boxShadow: 'var(--swa-shadow-card)' }}
            >
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, color: 'hsl(var(--foreground))' }}>30-90s</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>A full daily loop</p>
            </div>

            {/* Floating card: 0 servers */}
            <div
              className="absolute z-10 bg-card rounded-2xl px-4 py-3 border border-border"
              style={{ bottom: '12%', left: '-5%', boxShadow: 'var(--swa-shadow-card)' }}
            >
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, color: 'hsl(var(--foreground))' }}>0 servers</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>Data never leaves the device</p>
            </div>

            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
