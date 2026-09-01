const footerLinks = {
  Product: [
    { label: 'Daily loop', href: '#product' },
    { label: 'Path & features', href: '#product' },
  ],
  Science: [
    { label: 'Architecture', href: '#science' },
  ],
  Company: [
    { label: 'Market', href: '#market' },
    { label: 'Model', href: '#model' },
    { label: 'Stage', href: '#stage' },
    { label: 'Investor briefing', href: '#contact' },
  ],
  Principles: [
    { label: 'Not a clinical product', href: '#faq' },
    { label: 'Signal never a label', href: '#faq' },
    { label: 'Skip is always allowed', href: '#faq' },
    { label: 'Nothing leaves the device', href: '#science' },
  ],
};

export default function SwaFooter() {
  return (
    <footer style={{ background: 'var(--swa-dark)' }} className="pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <img
                src="/airo-assets/images/logo/horizontal"
                alt="SWA"
                className="h-auto max-h-10 w-auto max-w-[120px] object-contain self-center"
              />
            </a>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--swa-warm)',
                lineHeight: 1.6,
              }}
            >
              The Inward Journey.
              <br />
              A sanctuary for the mind — private, daily, on-device.
              <br />
              Look inward.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4
                className="swa-label mb-4"
                style={{ color: 'var(--swa-muted)' }}
              >
                {col}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="transition-opacity hover:opacity-70"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 14,
                        color: 'var(--swa-warm)',
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid hsl(var(--border)/0.15)' }}
        >
          <a
            href="/"
            className="swa-label transition-opacity hover:opacity-70"
            style={{ color: 'var(--swa-muted)' }}
          >
            SWA
          </a>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: 'var(--swa-muted)',
              textAlign: 'center',
            }}
          >
            © 2026 SWA · The Inward Journey · Made with the cream, gold, and sage of the product itself.
          </p>
        </div>
      </div>
    </footer>
  );
}
