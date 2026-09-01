import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { EASE_PREMIUM } from '@/lib/motion';

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Journey', href: '#journey' },
  { label: 'Science', href: '#science' },
  { label: 'Market', href: '#market' },
  { label: 'Model', href: '#model' },
  { label: 'FAQ', href: '#faq' },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative text-sm font-semibold text-foreground"
      style={{ fontFamily: 'var(--font-sans)', color: hovered ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.75)', transition: 'color 0.2s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      {/* Underline grow */}
      {!reduced && (
        <motion.span
          className="absolute left-0 -bottom-0.5 h-px bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: hovered ? '100%' : 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'block' }}
        />
      )}
    </a>
  );
}

export default function SwaHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-background"
      style={{ boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <img
            src="/airo-assets/images/logo/horizontal"
            alt="SWA"
            className="h-auto max-h-10 w-auto max-w-[140px] object-contain self-center"
          />
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <NavLink key={l.label} label={l.label} href={l.href} />
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="#product"
            className="px-5 py-2 rounded-full text-sm font-bold border border-foreground text-foreground"
            style={{ fontFamily: 'var(--font-sans)' }}
            whileHover={reduced ? {} : { y: -1, opacity: 0.7 }}
            transition={{ duration: 0.18, ease: EASE_PREMIUM }}
          >
            See the product
          </motion.a>
          <motion.a
            href="#contact"
            className="px-5 py-2 rounded-full text-sm font-bold bg-primary text-foreground"
            style={{ fontFamily: 'var(--font-sans)' }}
            whileHover={reduced ? {} : { y: -2, boxShadow: '0 4px 18px hsl(var(--primary) / 0.5)' }}
            transition={{ duration: 0.18, ease: EASE_PREMIUM }}
          >
            Request a briefing
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border px-6 py-5 flex flex-col gap-4 bg-background">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-base font-semibold text-foreground"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-2 inline-block px-5 py-2 rounded-full text-sm font-bold text-center bg-primary text-foreground"
            onClick={() => setOpen(false)}
          >
            Request a briefing
          </a>
        </div>
      )}
    </header>
  );
}
