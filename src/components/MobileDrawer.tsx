"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/main',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'tool',
    label: 'Action Tool',
    path: '/tool',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-overlay backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Enhanced drawer */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200, 
              duration: 0.3 
            }}
            className="fixed left-0 top-0 h-full w-88 bg-card z-50 shadow-card border-r border-cardBorder backdrop-blur-sm"
          >
            <div className="flex flex-col h-full">
              {/* Enhanced header */}
              <div className="flex items-center justify-between p-6 border-b border-cardBorder bg-gradient-to-r from-card to-surface">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-button">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-text">Science for Action</h1>
                    <p className="text-textSecondary text-xs font-medium">Science for people who give a shit</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-surface rounded-xl transition-all duration-200 ease-smooth border border-transparent hover:border-cardBorder"
                >
                  <svg className="w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Enhanced navigation items */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-3">
                  {navItems.map((item, index) => {
                    const isActive = pathname.startsWith(item.path);
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.02, x: 6 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ease-smooth group relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-button border-l-4 border-white/30'
                              : 'text-textSecondary hover:text-text hover:bg-surface border border-transparent hover:border-cardBorder hover:shadow-smooth'
                          }`}
                        >
                          {/* Active indicator glow */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl" />
                          )}
                          
                          <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/20 shadow-inner-soft' 
                              : 'bg-surface group-hover:bg-card group-hover:shadow-smooth'
                          }`}>
                            {item.icon}
                          </div>
                          
                          <span className="relative z-10 font-semibold text-base tracking-tight">
                            {item.label}
                          </span>
                          
                          {isActive && (
                            <div className="ml-auto relative z-10 w-2 h-2 bg-white rounded-full shadow-button animate-glow-pulse" />
                          )}
                          
                          {/* Hover arrow */}
                          {!isActive && (
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg className="w-4 h-4 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Enhanced impact stats */}
                {profile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-8"
                  >
                    <div className="bg-gradient-to-br from-surface to-backgroundDark rounded-xl p-5 border border-cardBorder shadow-card">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-success to-primary rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-text">Your Impact</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-textSecondary">Actions</span>
                          <span className="text-sm font-bold text-primary">
                            {profile.contribution_stats?.actions_completed || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-textSecondary">Policies</span>
                          <span className="text-sm font-bold text-accent">
                            {profile.contribution_stats?.policies_viewed || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced onboarding CTA */}
                {!profile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-8"
                  >
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-5 border border-primary/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center animate-float">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-primary">Get Started</h3>
                      </div>
                      <p className="text-xs text-textSecondary mb-4 leading-relaxed">
                        Create your profile to get personalized recommendations.
                      </p>
                      <motion.button
                        onClick={() => handleNavigation('/profile')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-pill text-sm font-semibold shadow-button hover:shadow-button-hover transition-all duration-200 ease-smooth"
                      >
                        Create Profile
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Enhanced footer */}
              <div className="p-6 border-t border-cardBorder bg-surface/50 backdrop-blur-sm">
                <div className="text-xs text-textMuted text-center">
                  <p className="font-medium">© 2024 Science for Action</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

