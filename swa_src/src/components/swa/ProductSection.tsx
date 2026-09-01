import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'morning', label: 'Morning' },
  { id: 'insights', label: 'Insights' },
];

const leftBullets = [
  'Authored 30-day path: Notice, Understand, Choose, Live',
  'On-the-spot check-in when something snags',
  'Face ID lock. Export or delete. Sacred by default.',
  'Content lives in the Rust/SQLite core, not the UI',
];

const rightBullets = [
  'Six-dimension scoring, pure functions, fully testable',
  'XP and streaks without punitive resets',
  '"I don\'t know" and Skip are first-class answers',
  'Human-reviewed content. AI drafts; people approve.',
];

function PhoneScreen({ tab }: { tab: string }) {
  if (tab === 'today') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
        <div>
          <p style={{ fontSize: 14, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>Good afternoon</p>
          <p style={{ fontSize: 13, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>Day 8 of 30 · Understand</p>
        </div>
        <div style={{ background: 'hsl(var(--card))', borderRadius: 12, padding: '10px 12px', border: '1px solid hsl(var(--border))' }}>
          <p className="swa-label" style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))', marginBottom: 2 }}>SHOWING UP</p>
          <p style={{ fontSize: 26, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: 1 }}>12</p>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>Longest 19 · missed days don't reset you</p>
        </div>
        {[
          { check: true, title: 'Morning reflection', sub: 'Saved · revisit anytime' },
          { check: false, title: 'Name the avoidance', sub: "Today's practice · 60s" },
          { check: false, title: 'Evening reflection', sub: 'What did I notice?' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0' }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
              background: item.check ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: 'var(--swa-dark)', fontWeight: 700,
            }}>
              {item.check ? '✓' : i + 1}
            </span>
            <div>
              <p style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1.3 }}>{item.title}</p>
              <p style={{ fontSize: 10, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>{item.sub}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', background: 'hsl(var(--primary))', borderRadius: 12, padding: '9px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--swa-dark)' }}>Open the practice</span>
        </div>
      </div>
    );
  }
  if (tab === 'morning') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <p className="swa-label" style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))' }}>MORNING ARRIVAL</p>
        <p style={{ fontSize: 16, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: 1.3 }}>
          What am I carrying into today?
        </p>
        <div style={{ background: 'hsl(var(--card))', borderRadius: 12, padding: '12px', border: '1px solid hsl(var(--border))' }}>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
            Thirty seconds. One question drawn from the authored path. It sits with you through the day — not demanding an answer, just opening a window.
          </p>
        </div>
        <div style={{ marginTop: 'auto', background: 'hsl(var(--primary))', borderRadius: 12, padding: '9px', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--swa-dark)' }}>Begin the morning</span>
        </div>
      </div>
    );
  }
  // insights
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <p className="swa-label" style={{ fontSize: 9, color: 'hsl(var(--muted-foreground))' }}>YOUR AWARENESS</p>
      <div className="grid grid-cols-3" style={{ gap: 6 }}>
        {[
          { d: 'Clarity', v: 7 }, { d: 'Calm', v: 6 }, { d: 'Agency', v: 8 },
          { d: 'Connect', v: 5 }, { d: 'Purpose', v: 7 }, { d: 'Presence', v: 6 },
        ].map((s) => (
          <div key={s.d} style={{ background: 'hsl(var(--card))', borderRadius: 10, padding: '8px 4px', textAlign: 'center', border: '1px solid hsl(var(--border))' }}>
            <p style={{ fontSize: 18, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'hsl(var(--primary))' }}>{s.v}</p>
            <p style={{ fontSize: 9, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))' }}>{s.d}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'hsl(var(--muted-foreground))', lineHeight: 1.5 }}>
        Private signals — not clinical labels. They belong to you.
      </p>
    </div>
  );
}

export default function ProductSection() {
  const [active, setActive] = useState('today');
  const reduced = useReducedMotion();

  return (
    <section id="product" className="bg-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.9, ease: EASE_PREMIUM }}
        >
          <span className="swa-label text-muted-foreground block mb-4">The product</span>
          <h2
            className="swa-heading"
            style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 600, lineHeight: 1.1 }}
          >
            Small moments.
            <br />
            Accumulated understanding.
          </h2>
        </motion.div>

        {/* 3-column layout: left text | phone | right text */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-start">
          {/* Left: daily loop */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, ease: EASE_PREMIUM }}
          >
            <h3
              className="swa-heading mb-3"
              style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}
            >
              A daily loop that refuses to feel like homework
            </h3>
            <p
              className="text-muted-foreground mb-6"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7 }}
            >
              Three doors, never more: a morning arrival, one tiny practice, an evening look-back. Skip anything. Miss a day — nothing is broken. Guilt is a churn machine. We designed it out.
            </p>
            <ul className="flex flex-col gap-3">
              {leftBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'hsl(var(--foreground))' }}
                >
                  <span style={{ color: 'hsl(var(--primary))', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Center: phone with tabs */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_PREMIUM }}
            className="flex flex-col items-center gap-4"
          >
            {/* Tab switcher */}
            <div
              role="tablist"
              aria-label="Product views"
              className="flex gap-1 bg-secondary rounded-full p-1"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active === t.id}
                  onClick={() => setActive(t.id)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background: active === t.id ? 'var(--swa-dark)' : 'transparent',
                    color: active === t.id ? 'hsl(var(--background))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Phone */}
            <div
              style={{
                width: 260,
                height: 500,
                borderRadius: 40,
                background: 'var(--swa-dark)',
                padding: '14px 10px 18px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-2xl)',
              }}
            >
              {/* Notch */}
              <div className="mx-auto mb-3" style={{ width: 70, height: 5, borderRadius: 4, background: 'var(--swa-dark-2)' }} />
              {/* Screen */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 28,
                  background: 'hsl(var(--background))',
                  padding: '16px 14px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? {} : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                    style={{ height: '100%' }}
                  >
                    <PhoneScreen tab={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right: intelligence */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_PREMIUM }}
          >
            <h3
              className="swa-heading mb-3"
              style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}
            >
              Intelligence that mirrors. Never diagnoses.
            </h3>
            <p
              className="text-muted-foreground mb-6"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7 }}
            >
              One hesitation in class is a signal. A hundred related signals become a pattern. SWA waits. Then it reflects — in language a student can hear without shame.
            </p>
            <ul className="flex flex-col gap-3">
              {rightBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'hsl(var(--foreground))' }}
                >
                  <span style={{ color: 'hsl(var(--primary))', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
