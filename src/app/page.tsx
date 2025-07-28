import { Metadata } from 'next';

// AGGRESSIVE SEO: Static metadata for GitHub Pages
export const metadata: Metadata = {
  title: 'Science for Action | Join Science-Driven Causes in Your Community',
  description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement.',
  keywords: 'science causes, civic engagement, community science, science activism, volunteer science, scientific campaigns, public science, STEM community support, climate action, environmental science, citizen science, science for social change, public science engagement, volunteer science movements, climate action support, how to join a science cause, public science projects near me, climate volunteer platform, student science movements, youth science movements, AI for change, public problem solving',
  openGraph: {
    title: 'Science for Action | Join Science-Driven Causes in Your Community',
    description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
    url: 'https://scienceforactions.me',
    siteName: 'Science for Action',
    images: [
      {
        url: 'https://scienceforactions.me/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Science for Action - Community-powered science campaigns'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science for Action | Join Science-Driven Causes',
    description: 'Community-powered platform for science-driven causes and campaigns.',
    images: ['https://scienceforactions.me/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://scienceforactions.me',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/main/" />
      </head>
      <body>
        <h1>Science for Action</h1>
        <p>Redirecting...</p>
        <p>If you are not redirected, <a href="/main/">click here</a></p>
      </body>
    </html>
  );
}

