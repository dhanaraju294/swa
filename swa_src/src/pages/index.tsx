import { Helmet } from '@dr.pogodin/react-helmet';

import SwaHeader from '@/components/swa/SwaHeader';
import HeroSection from '@/components/swa/HeroSection';
import StatStrip from '@/components/swa/StatStrip';
import ProblemSection from '@/components/swa/ProblemSection';
import MissingLayerSection from '@/components/swa/MissingLayerSection';
import ProductSection from '@/components/swa/ProductSection';
import PrivacySection from '@/components/swa/PrivacySection';
import SignalSection from '@/components/swa/SignalSection';
import ScienceSection from '@/components/swa/ScienceSection';
import MarketSection from '@/components/swa/MarketSection';
import TestimonialsSection from '@/components/swa/TestimonialsSection';
import BusinessModelSection from '@/components/swa/BusinessModelSection';
import StageSection from '@/components/swa/StageSection';
import FaqSection from '@/components/swa/FaqSection';
import ContactSection from '@/components/swa/ContactSection';
import SwaFooter from '@/components/swa/SwaFooter';

const site = 'https://swa.app';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      name: 'SWA',
      url: `${site}/`,
    },
    {
      '@type': 'Organization',
      '@id': `${site}/#organization`,
      name: 'SWA',
      url: `${site}/`,
      description: 'Privacy-first, on-device self-awareness app for Indian college students.',
    },
    {
      '@type': 'WebPage',
      '@id': `${site}/#webpage`,
      url: `${site}/`,
      name: 'SWA — The Inward Journey',
      isPartOf: { '@id': `${site}/#website` },
      about: { '@id': `${site}/#organization` },
      datePublished: '2026-01-01',
      dateModified: '2026-08-21',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'SWA',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'iOS, Android',
      description: 'A continuous self-awareness journey. Daily loop — morning, practice, evening — with no finish line. On-device, private, no cloud.',
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>SWA — The Inward Journey</title>
        <meta
          name="description"
          content="SWA is a continuous self-awareness journey. A daily loop — morning, practice, evening — with no finish line. Privacy-first, on-device, for Indian college students."
        />
        <link rel="canonical" href={`${site}/`} />
        <link rel="icon" href="/assets/other/be90c240fb554839b7f0a421c9f4b65a.svg" type="image/svg+xml" />
        <meta property="og:title" content="SWA — The Inward Journey" />
        <meta
          property="og:description"
          content="A continuous self-awareness journey. Daily loop with no finish line. Privacy-first, on-device."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${site}/`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SWA — The Inward Journey" />
        <meta
          name="twitter:description"
          content="A continuous self-awareness journey. Daily loop with no finish line. Privacy-first, on-device."
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <SwaHeader />

      <main>
        {/* Primary h1 for SEO — rendered visually in HeroSection */}
        <h1 className="sr-only">SWA — The Inward Journey</h1>
        <HeroSection />
        <StatStrip />
        <ProblemSection />
        <MissingLayerSection />
        <ProductSection />
        <PrivacySection />
        <SignalSection />
        <ScienceSection />
        <MarketSection />
        <TestimonialsSection />
        <BusinessModelSection />
        <StageSection />
        <FaqSection />
        <ContactSection />
      </main>

      <SwaFooter />
    </>
  );
}
