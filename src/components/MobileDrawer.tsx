"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';

const navItems = [
  {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'tool',
    label: 'Action Tool',
    path: '/tool',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              onClick={onClose}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
          </motion.div>
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="fixed left-0 top-0 h-full w-80 bg-card z-50 shadow-2xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-grayBorder">
                  <div>
                    <h1 className="text-xl font-bold text-text">Science for Action</h1>
                    <p className="text-grayText text-sm">Science for people who give a shit</p>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-graySoft rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6 text-grayText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-6">
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const isActive = pathname.startsWith(item.path);
                      
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-grayText hover:text-text hover:bg-graySoft'
                            }`}
                          >
                            <div className={`${isActive ? 'text-white' : 'text-grayText'}`}>
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Quick Stats */}
                  {profile && (
                    <div className="mt-8 p-4 bg-graySoft rounded-xl">
                      <h3 className="text-sm font-semibold text-text mb-3">Your Impact</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-grayText">Actions</span>
                          <span className="font-medium text-text">{profile.contribution_stats?.actions_completed || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-grayText">Policies</span>
                          <span className="font-medium text-text">{profile.contribution_stats?.policies_viewed || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New User Prompt */}
                  {!profile && (
                    <div className="mt-8 p-4 bg-primary bg-opacity-10 rounded-xl border border-primary border-opacity-20">
                      <h3 className="text-sm font-semibold text-primary mb-2">Get Started</h3>
                      <p className="text-xs text-grayText mb-3">
                        Create your profile to get personalized recommendations.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          Create Profile
                        </button>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-grayBorder">
                  <div className="text-xs text-grayText">
                    <p>© 2024 Science for Action</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

