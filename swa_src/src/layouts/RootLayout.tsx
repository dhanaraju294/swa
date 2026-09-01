import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration } from 'react-router';

import Website from '@/layouts/Website';

interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Helmet>
        <title>SWA — The Inward Journey</title>
        <meta
          name="description"
          content="SWA is a privacy-first, on-device self-awareness app for Indian college students. A continuous daily loop — morning, practice, evening — with no finish line."
        />
      </Helmet>
      <ScrollRestoration />
      {children}
    </Website>
  );
}
