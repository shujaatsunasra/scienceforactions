"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { navigationService } from '@/services/navigationService';

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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-grayText">Redirecting to Science for Action...</p>
      </div>
    </div>
  );
}
