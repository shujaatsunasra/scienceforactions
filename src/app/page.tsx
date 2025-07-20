"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { navigationService } from '@/services/navigationService';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const redirectToMain = async () => {
      // Use robust navigation service for redirect
      const success = await navigationService.navigateTo(router, '/main', {
        replace: true,
        prefetch: false
      });

      if (!success) {
        // Emergency fallback
        navigationService.emergencyNavigate('/main');
      }
    };

    redirectToMain();
  }, [router]);

  return (
    <>
      <Head>
        <title>Science for Action | Join Science-Driven Causes in Your Community</title>
        <meta name="description" content="Science for Action is a community-powered platform to join, support, and launch science-driven causes and campaigns across the world. Take action on what matters with science-backed civic engagement." />
        <h1 style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          Science for Action - Community Science Campaigns
        </h1>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-grayText">Redirecting to Science for Action...</p>
          <noscript>
            <p className="text-sm text-grayText mt-4">
              JavaScript is required. Please enable JavaScript and refresh the page, or visit{' '}
              <a href="/main" className="text-primary underline">
                Science for Action directly
              </a>
              .
            </p>
          </noscript>
        </div>
      </div>
    </>
  );
}
