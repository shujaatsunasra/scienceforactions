"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MobileDrawer from '@/components/MobileDrawer';
import { InteractionProvider } from '@/context/InteractionContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { ExploreProvider } from '@/context/ExploreContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <ErrorBoundary>
      <ProfileProvider>
        <InteractionProvider>
          <ExploreProvider>
            <div className="flex w-full min-h-screen bg-background">
              {/* Desktop Navigation */}
              <div className="hidden lg:block">
                <Navigation />
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden fixed top-4 left-4 z-50">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-3 bg-card rounded-xl shadow-card border border-grayBorder"
                  >
                    <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </motion.div>
              </div>

              {/* Mobile Drawer */}
              <MobileDrawer 
                isOpen={isMobileMenuOpen} 
                onClose={() => setIsMobileMenuOpen(false)} 
              />

              {/* Main Content */}
              <main className="flex-1 min-h-screen">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <div className="h-full">
                      {children}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </ExploreProvider>
        </InteractionProvider>
      </ProfileProvider>
    </ErrorBoundary>
  );
}
