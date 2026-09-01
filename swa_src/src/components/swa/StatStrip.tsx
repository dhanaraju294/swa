import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

const stats = [
  { display: '40M', countTo: 40, suffix: 'M', label: 'Indian higher-education students in TAM' },
  { display: '30-day', countTo: null, suffix: '', label: 'Authored path · Notice → Understand → Choose → Live' },
  { display: '100%', countTo: 100, suffix: '%', label: 'On-device · SQLite in Rust. No account required.' },
  { display: '6', countTo: 6, suffix: '', label: 'Awareness dimensions scored weekly, privately' },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(to); return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, reduced]);

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  );
}

export default function StatStrip() {
  return (
    <section className="bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.display} className="flex flex-col gap-1">
              <span
                className="swa-heading"
                style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 600, lineHeight: 1 }}
              >
                {s.countTo !== null ? (
                  <CountUp to={s.countTo} suffix={s.suffix} />
                ) : (
                  s.display
                )}
              </span>
              <span
                className="text-muted-foreground"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5 }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
