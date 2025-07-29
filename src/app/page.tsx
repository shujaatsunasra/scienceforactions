'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/main');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Science for Action</h1>
        <p className="mb-4">Redirecting to main page...</p>
        <a href="/main" className="text-blue-600 underline">
          Click here if not redirected automatically
        </a>
      </div>
    </main>
  );
}

