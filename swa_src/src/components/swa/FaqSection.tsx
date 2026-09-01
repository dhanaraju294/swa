import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FadeUp } from './SectionHeader';
import { EASE_PREMIUM, VIEWPORT_ONCE } from '@/lib/motion';

const faqs = [
  {
    q: 'Is this a 30-day course?',
    a: 'No. SWA is a continuous self-awareness journey. The daily loop has no end date. There is an authored opening chapter of 30 days that teaches Notice → Understand → Choose → Live. After that, the path keeps going.',
  },
  {
    q: 'What is the core product?',
    a: 'A daily loop: a morning prompt, a tiny practice, and an evening look-back. The loop runs every day with no end date. An authored opening chapter of 30 days teaches the practice. Optional 7-day and 21-day modules go deeper. Nodes open without catch-up shame.',
  },
  {
    q: 'Why on-device? Why no cloud?',
    a: 'Self-awareness data is the most intimate data a person can generate. Storing it on a server creates a liability — for the user and for us. On-device means no breach is possible, no account to compromise, and no temptation to monetise the data. It is also a genuine product differentiator in a market full of surveillance-as-a-service wellness apps.',
  },
  {
    q: 'Is this a mental health app? A medical device?',
    a: 'No. SWA is not a clinical product. It does not diagnose, treat, or manage any mental health condition. It is a daily self-awareness practice — closer to a structured journal than a therapy tool. We are explicit about this in the product and in all communications.',
  },
  {
    q: 'What is the kill test for the free tier?',
    a: 'If the free tier cannibalises paid conversion entirely, we tighten the module gate — not the daily loop. The daily loop stays free forever. Depth (7-day and 21-day modules, extended path) is the paid layer.',
  },
  {
    q: 'What is the kill test for the B2B tier?',
    a: 'If campus partnerships require compromising the privacy architecture (e.g. individual-level data for counsellors), we do not do the deal. The counsellor dashboard shows only aggregate, anonymous signals. Individual data never leaves the student\'s device.',
  },
  {
    q: 'Why India? Why college students?',
    a: 'India has 40 million college students — the largest single cohort of 18–24-year-olds in the world. They are digitally native, underserved by existing wellness tools, and at the exact life stage where self-awareness compounds most. The beachhead is tight by design.',
  },
  {
    q: 'What is the competitive moat?',
    a: 'Privacy architecture (on-device, zero-server) is hard to copy without rebuilding from scratch. Authored content quality compounds over time. The daily loop habit, once formed, is sticky in a way that content libraries are not. And the brand — a sanctuary, not a feed — is a positioning moat in a noisy market.',
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="border-b border-border"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.05, ease: EASE_PREMIUM }}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="text-foreground font-semibold pr-4"
          style={{ fontFamily: 'var(--font-sans)', fontSize: 16 }}
        >
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE_PREMIUM }}
        >
          <ChevronDown size={18} className="shrink-0 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE_PREMIUM }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="text-muted-foreground pb-5"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7 }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeUp delay={0} blur style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2
            className="swa-heading"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600 }}
          >
            Questions investors actually ask.
          </h2>
        </FadeUp>
        <div>
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
