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
      <div className="flex w-full min-h-screen bg-white">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <Navigation />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 bg-white/90 backdrop-blur-md border border-red-200 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-out"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:ml-0 pt-16 lg:pt-0">
          <div className="w-full min-h-screen">
            {isInitialized ? (
              <AdaptiveLayout>
                <div className="transition-all duration-400 ease-out animate-fade-in">
                  {children}
                </div>
              </AdaptiveLayout>
            ) : (
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-red-50 to-white px-4">
                <div className="text-center space-y-6 p-6 max-w-md w-full">
                  <div className="relative">
                    <div className="w-12 h-12 border-3 border-red-200 border-t-red-600 rounded-full mx-auto animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-red-400 rounded-full mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">Initializing Science for Action</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Autonomous systems are coming online to power your climate action journey.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-100 shadow-lg">
                    <div className="text-xs text-gray-500 space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Evolution Engine</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status.evolutionEngine === 'running' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {status.evolutionEngine || 'starting'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SEO Engine</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status.seoEngine === 'running' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {status.seoEngine || 'starting'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>UI Engine</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          status.emotionAwareUI === 'running' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {status.emotionAwareUI || 'starting'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Enhanced Autonomous System Status Indicator */}
        {isInitialized && (
          <div className="fixed bottom-4 left-4 z-40 animate-fade-in-delay-1">
            <div className="bg-green-600 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm border border-green-500/20 hover:scale-105 transition-all duration-200 ease-out cursor-pointer group">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>Autonomous Mode</span>
                <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

