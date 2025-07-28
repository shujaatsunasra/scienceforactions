import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ActionEngagementProvider } from '@/context/ActionEngagementContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { InteractionProvider } from '@/context/InteractionContext';
import { ExploreProvider } from '@/context/ExploreContext';
import MainLayout from '@/components/MainLayout';
import AutonomousSystemStatus from '@/components/AutonomousSystemStatus';
import { generateMetadata as generateSEOMetadata, generateWebsiteSchema, generateOrganizationSchema } from '@/lib/seo';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// AGGRESSIVE SEO: Force static metadata generation
export const metadata: Metadata = {
  metadataBase: new URL('https://scienceforactions.me'),
  title: {
    default: 'Science for Action | Join Science-Driven Causes in Your Community',
    template: '%s | Science for Action'
  },
  description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement.',
  keywords: [
    'science causes', 'civic engagement', 'community science', 'science activism', 
    'volunteer science', 'scientific campaigns', 'public science', 'STEM community support',
    'climate action', 'environmental science', 'citizen science', 'science for social change',
    'public science engagement', 'volunteer science movements', 'climate action support',
    'how to join a science cause', 'public science projects near me', 'climate volunteer platform',
    'student science movements', 'youth science movements', 'AI for change', 'public problem solving'
  ],
  authors: [{ name: 'Science for Action' }],
  creator: 'Science for Action',
  publisher: 'Science for Action',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Science for Action',
    title: 'Science for Action | Join Science-Driven Causes in Your Community',
    description: 'Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world.',
    url: 'https://scienceforactions.me',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Science for Action - Community-powered science campaigns'
      }
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@scienceforaction',
    creator: '@scienceforaction',
    title: 'Science for Action | Join Science-Driven Causes',
    description: 'Community-powered platform for science-driven causes and campaigns.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'yPPhLtRFW6EL99093WfkyJdyj1v3Ng4mlccRfMR18xo',
    yandex: 'verification-code-here',
    yahoo: 'verification-code-here',
  },
  alternates: {
    canonical: 'https://scienceforactions.me',
  },
  category: 'Science and Technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        
        {/* Google-specific optimization tags */}
        <meta name="google-site-verification" content="yPPhLtRFW6EL99093WfkyJdyj1v3Ng4mlccRfMR18xo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Google-focused structured data */}
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
        
        {/* Preconnect to Google services for performance */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-text`} suppressHydrationWarning>
        <InteractionProvider>
          <ProfileProvider>
            <ActionEngagementProvider>
              <ExploreProvider>
                <MainLayout>
                  {children}
                </MainLayout>
                <AutonomousSystemStatus />
              </ExploreProvider>
            </ActionEngagementProvider>
          </ProfileProvider>
        </InteractionProvider>
      </body>
    </html>
  );
}

