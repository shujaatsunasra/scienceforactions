"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MobileDrawer from '@/components/MobileDrawer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { systemIntegration } from '@/services/systemIntegrationService';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const pathname = usePathname();

  // Initialize the complete system integration
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        // Initialize all services through the integration layer
        await systemIntegration.initialize();
        setIsSystemReady(true);
        console.log('Science for Action system fully initialized');
      } catch (error) {
        console.error('System initialization failed:', error);
        // Set ready anyway to prevent blocking the UI
        setIsSystemReady(true);
      }
    };

    initializeSystem();

    // Cleanup on unmount
    return () => {
      systemIntegration.shutdown();
    };
  }, []);

  // Monitor system health
  useEffect(() => {
    if (!isSystemReady) return;

    const healthCheckInterval = setInterval(() => {
      const healthReport = systemIntegration.getHealthReport();
      if (healthReport && healthReport.status === 'critical') {
        console.warn('System health critical:', healthReport);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [isSystemReady]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  // Don't render layout for the home redirect page
  if (pathname === '/') {
    return <>{children}</>;
  }

  // Show loading state while system initializes
  if (!isSystemReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-grayText">Initializing Science for Action...</p>
          <p className="text-xs text-grayText/70">
            Setting up error handling & navigation systems
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex w-full min-h-screen bg-background">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Navigation />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-card border border-grayBorder rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="min-h-screen">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
}
