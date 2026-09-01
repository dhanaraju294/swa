import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_PREMIUM } from '@/lib/motion';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const roles = [
  'Investor / fund',
  'Angel',
  'Campus / university',
  'Operator / advisor',
  'Press',
  'Other',
];

const inputStyle: React.CSSProperties = {
  background: 'hsl(var(--background)/0.08)',
  border: '1px solid hsl(var(--border)/0.2)',
  color: 'hsl(var(--background))',
  fontFamily: 'var(--font-sans)',
};

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const reduced = useReducedMotion();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get('_gotcha')) return;

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const org = String(formData.get('org') ?? '').trim();
    const role = String(formData.get('role') ?? '').trim();
    const note = String(formData.get('note') ?? '').trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !role) {
      setErrorMsg(!emailOk ? 'Please enter a valid email so we can send the brief.' : 'Name, email, and role help us route your note.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/api/contact/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: note || 'New investor briefing request' }],
            data: {
              __gd_contact_form_title: 'Investor Briefing Request',
              'Organisation': org,
              'Role': role,
            },
          },
          user: { email, name },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        throw new Error(json.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <section id="contact" className="bg-background py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* CTA card — dark split with image left, form right */}
        <motion.div
          className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
          style={{ background: 'var(--swa-dark)', minHeight: 560 }}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: EASE_PREMIUM }}
        >
          {/* Left: visual image */}
          <div className="relative min-h-64 lg:min-h-0">
            <img
              src="/airo-assets/images/pages/home/cta-visual"
              alt="A luminous golden orb in a cream atmosphere, suggesting inner light."
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              width={600}
              height={560}
            />
            {/* Gradient overlay fading to dark on the right */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 40%, var(--swa-dark) 100%)' }}
            />
          </div>

          {/* Right: form */}
          <div
            className="flex flex-col justify-center"
            style={{ padding: 'clamp(28px, 4vw, 48px)' }}
          >
            <span className="swa-label mb-3 block" style={{ color: 'var(--swa-gold)' }}>
              The ask
            </span>
            <h2
              className="swa-heading mb-3"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 600, color: 'hsl(var(--background))', lineHeight: 1.15 }}
            >
              Build the infrastructure for looking inward.
            </h2>
            <p
              className="mb-6 text-muted-foreground"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7 }}
            >
              Investors, campus partners, and operators — request the brief. We reply within two business days.
            </p>

            {status === 'success' ? (
              <div className="py-6">
                <p
                  className="swa-heading mb-3"
                  style={{ fontSize: 24, color: 'var(--swa-gold)' }}
                >
                  Received. Quietly.
                </p>
                <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6 }}>
                  Thank you. We'll send the brief and suggested next step to your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Honeypot */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px' }}
                  aria-hidden="true"
                />

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-name" className="swa-label text-muted-foreground" style={{ fontSize: 11 }}>
                      Name *
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className="rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-email" className="swa-label text-muted-foreground" style={{ fontSize: 11 }}>
                      Email *
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@fund.vc"
                      className="rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Org + Role row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-org" className="swa-label text-muted-foreground" style={{ fontSize: 11 }}>
                      Organisation
                    </label>
                    <input
                      id="cf-org"
                      name="org"
                      type="text"
                      autoComplete="organization"
                      placeholder="Fund, campus, studio"
                      className="rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cf-role" className="swa-label text-muted-foreground" style={{ fontSize: 11 }}>
                      I am *
                    </label>
                    <select
                      id="cf-role"
                      name="role"
                      required
                      className="rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                      style={inputStyle}
                    >
                      <option value="" style={{ background: 'hsl(var(--foreground))' }}>Select</option>
                      {roles.map((r) => (
                        <option key={r} value={r} style={{ background: 'hsl(var(--foreground))' }}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cf-note" className="swa-label text-muted-foreground" style={{ fontSize: 11 }}>
                    Note
                  </label>
                  <textarea
                    id="cf-note"
                    name="note"
                    rows={3}
                    placeholder="What would be most useful — deck, demo, data room, campus pilot?"
                    className="rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                    style={inputStyle}
                  />
                </div>

                {(status === 'error' || (errorMsg && status === 'idle')) && (
                  <p role="alert" className="text-destructive text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                    {errorMsg}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-1 px-7 py-3 rounded-full font-bold text-sm bg-primary text-foreground disabled:opacity-50 self-start"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  whileHover={reduced ? {} : { y: -2, boxShadow: '0 6px 24px hsl(var(--primary) / 0.45)' }}
                  transition={{ duration: 0.18, ease: EASE_PREMIUM }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send the request →'}
                </motion.button>

                <p
                  className="text-muted-foreground"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 11, lineHeight: 1.6 }}
                >
                  Stored only on this device for now (no server). We'll follow up at the email you give. SWA does not sell personal data — we barely collect it.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
