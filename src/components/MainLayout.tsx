"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MobileDrawer from '@/components/MobileDrawer';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import useAutonomousSystemInitializer from '@/hooks/useAutonomousSystemInitializer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Initialize autonomous systems
  const { status, isInitialized } = useAutonomousSystemInitializer();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't render layout for the home redirect page
  if (pathname === '/') {
    return <>{children}</>;
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

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {isInitialized ? (
            <AdaptiveLayout>
              <div className="transition-opacity duration-300 ease-in-out">
                {children}
              </div>
            </AdaptiveLayout>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto animate-spin" />
                <p className="text-text">Initializing autonomous systems...</p>
                <p className="text-xs text-grayText">
                  Evolution Engine: {status.evolutionEngine || 'starting'} | 
                  SEO Engine: {status.seoEngine || 'starting'} | 
                  UI Engine: {status.emotionAwareUI || 'starting'}
                </p>
                {/* Still render children for basic functionality */}
                <div className="mt-8 opacity-50 pointer-events-none max-w-4xl mx-auto">
                  {children}
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Autonomous System Status Indicator */}
        {isInitialized && (
          <div className="fixed bottom-4 left-4 z-40">
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-green-500">
              <span className="inline-block w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
              Autonomous Mode
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

