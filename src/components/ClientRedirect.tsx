"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { navigationService } from '@/services/navigationService';

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect after a delay to allow search engines to crawl the content
    const timer = setTimeout(() => {
      const redirectToMain = async () => {
        const success = await navigationService.navigateTo(router, '/main', {
          replace: true,
          prefetch: false
        });

        if (!success) {
          navigationService.emergencyNavigate('/main');
        }
      };

      redirectToMain();
    }, 2000); // 2 second delay for SEO crawling

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <p className="text-sm text-grayText">
          Loading your action dashboard...
        </p>
      </div>
      <noscript>
        <div className="mt-2 text-xs text-grayText">
          JavaScript required. <a href="/main" className="text-primary underline">Continue manually</a>
        </div>
      </noscript>
    </div>
  );
}
