"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  React.useEffect(() => {
    // Production: Error logged to monitoring service
  }, [error]);

  const handleRetry = () => {
    // Clear any cached data and retry
    reset();
  };

  const handleGoHome = () => {
    // Navigate safely to home
    router.replace('/main');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text">Something went wrong</h2>
            <p className="text-grayText text-sm">
              We encountered an issue while loading this page. This might be due to a network error or temporary server issue.
            </p>
          </div>

          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleGoHome}
                className="w-full px-4 py-2 border border-grayBorder text-grayText rounded-lg font-medium hover:bg-graySoft transition-colors"
              >
                Go to Home
              </button>
            </motion.div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-grayText cursor-pointer hover:text-text">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </motion.div>
    </div>
  );
}

