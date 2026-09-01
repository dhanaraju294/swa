import { motion, useReducedMotion } from 'motion/react';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const archCards = [
  { kicker: 'Layer 01', title: 'Presentational UI', desc: 'Expo SDK 52, React Native, expo-router, Reanimated. Cream, sage, gold. Fraunces + Nunito. A design system, not a feed.' },
  { kicker: 'Layer 02', title: 'UniFFI / JSI bridge', desc: 'Typed bindings from Rust to TypeScript. Heavy work off the JS thread. Mock engine for Expo Go; native engine in production.' },
  { kicker: 'Layer 03', title: 'inward_core', desc: 'SQLite (WAL, FK), migrations, scoring, streaks, XP, six awareness dimensions, export, reset. Pure functions. Integration-tested.' },
];

const frameworks = ['ACT / defusion', 'Self-Determination', 'Metacognition', 'Self-compassion', 'WOOP', 'Fogg behavior model', 'Human-in-the-loop'];

const stack = ['React Native 0.76', 'Expo 52', 'Rust 2021', 'rusqlite', 'UniFFI 0.29', 'Zustand', 'Face ID', 'iOS + Android'];

export default function ScienceSection() {
  const reduced = useReducedMotion();
  return (
    <section id="science" className="bg-background py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Science grid: text LEFT, photo RIGHT — matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, ease: EASE_PREMIUM }}
          >
            <span className="swa-label text-muted-foreground mb-4 block">Psychology + safety</span>
            <h2
              className="swa-heading mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, lineHeight: 1.15 }}
            >
              Evidence-informed.
              <br />
              Non-clinical.
              <br />
              Human-reviewed.
            </h2>
            <p
              className="text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.75 }}
            >
              SWA sits on Self-Determination Theory, ACT / defusion, metacognition, self-compassion,
              and Fogg's tiny-habits model — repositioned so awareness is the goal, not a productivity hack.
            </p>
            <p
              className="text-muted-foreground mb-6"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.75 }}
            >
              We will not diagnose, label, or sell fear. Exercises that take longer than 90 seconds are rejected.
              "I don't know" is always a valid answer. Popularity is not evidence.
            </p>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1.5 rounded-full text-sm font-bold bg-card border border-border text-foreground"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {f}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Photo RIGHT */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_PREMIUM }}
            className="rounded-3xl overflow-hidden"
            style={{ minHeight: 420 }}
          >
            <img
              src="/airo-assets/images/pages/home/science-student"
              alt="A college student sitting by a hostel window at dusk, looking at a phone in a quiet, contemplative moment."
              className="w-full h-full object-cover"
              style={{ minHeight: 420 }}
              loading="lazy"
              width={600}
              height={420}
            />
          </motion.div>
        </div>

        {/* Privacy / Tech split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14">
          {/* Photo LEFT */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, ease: EASE_PREMIUM }}
            className="rounded-3xl overflow-hidden"
            style={{ height: 380 }}
          >
            <img
              src="/airo-assets/images/pages/home/privacy-device"
              alt="A phone resting on cream paper beside a small brass lock and sage, suggesting on-device privacy."
              className="w-full h-full object-cover"
              loading="lazy"
              width={600}
              height={380}
            />
          </motion.div>

          {/* Text RIGHT */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_PREMIUM }}
          >
            <span className="swa-label text-muted-foreground mb-4 block">Infrastructure</span>
            <h3
              className="swa-heading mb-4"
              style={{ fontSize: 'clamp(22px, 3.5vw, 38px)', fontWeight: 600, lineHeight: 1.15 }}
            >
              A Rust core. A React Native shell. Zero servers to leak.
            </h3>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.75 }}
            >
              In a category drowning in cloud journals and model-trained diaries, privacy is not a policy page.
              It is the architecture. The mobile UI never owns the truth — <em>inward_core</em> does.
            </p>
          </motion.div>
        </div>

        {/* Architecture cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {archCards.map((c, i) => (
            <motion.div
              key={c.title}
              className="bg-card rounded-2xl p-6 border border-border"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE_PREMIUM }}
              whileHover={reduced ? {} : { y: -6, boxShadow: 'var(--shadow-lg)' }}
            >
              <span className="swa-label text-muted-foreground block mb-2">{c.kicker}</span>
              <h4 className="swa-heading mb-2" style={{ fontSize: 18, fontWeight: 600 }}>
                {c.title}
              </h4>
              <p
                className="text-muted-foreground"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.6 }}
              >
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="px-3 py-2 rounded-xl text-sm font-bold bg-secondary text-muted-foreground"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
