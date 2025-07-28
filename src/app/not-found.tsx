"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/main');
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.replace('/main');
    }
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
            <div className="text-8xl font-bold text-primary opacity-20">404</div>
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-text">Page Not Found</h2>
            <p className="text-grayText">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleGoHome}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Go to Home
              </button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleGoBack}
                className="w-full px-4 py-2 border border-grayBorder text-grayText rounded-lg font-medium hover:bg-graySoft transition-colors"
              >
                Go Back
              </button>
            </motion.div>
          </div>

          <div className="mt-8 text-xs text-grayText">
            <p>Need help? Check out our main sections:</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => router.push('/explore')}
                  className="text-primary hover:underline"
                >
                  Explore
                </button>
              </motion.div>
              <span>•</span>
              <motion.div whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => router.push('/tool')}
                  className="text-primary hover:underline"
                >
                  Action Tool
                </button>
              </motion.div>
              <span>•</span>
              <motion.div whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => router.push('/profile')}
                  className="text-primary hover:underline"
                >
                  Profile
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

