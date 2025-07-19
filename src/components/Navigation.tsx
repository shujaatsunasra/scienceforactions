"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { navigationService } from '@/services/navigationService';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/main',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
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
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();

  // Prefetch navigation routes on component mount
  useEffect(() => {
    const prefetchRoutes = async () => {
      if (typeof window !== 'undefined') {
        for (const item of navItems) {
          await navigationService.smartPrefetch(router, item.path);
        }
      }
    };

    prefetchRoutes().catch(console.warn);
  }, [router]);

  const handleNavigation = async (path: string) => {
    try {
      const success = await navigationService.navigateTo(router, path, {
        prefetch: false, // Already prefetched
      });

      if (!success) {
        console.warn(`Navigation to ${path} failed, but fallback should have been triggered`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Emergency fallback
      navigationService.emergencyNavigate(path);
    }
  };

  const handleBrandClick = async () => {
    await handleNavigation('/main');
  };

  const handleProfileNavigation = async () => {
    await handleNavigation('/profile');
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="w-80 h-screen bg-card border-r border-grayBorder flex flex-col">
        {/* Brand Header */}
        <div className="p-8 border-b border-grayBorder">
          <motion.div
            whileHover={{ scale: 1.02 }}
          >
            <div 
              onClick={handleBrandClick}
              className="cursor-pointer"
            >
              <h1 className="text-2xl font-bold text-text mb-2">Science for Action</h1>
              <p className="text-grayText text-sm">Science for people who give a shit</p>
            </div>
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
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <div className={`${isActive ? 'text-white' : 'text-grayText'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                      >
                        <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stats */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mt-8 p-4 bg-graySoft rounded-xl">
                <h3 className="text-sm font-semibold text-text mb-3">Your Impact</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-grayText">Actions Completed</span>
                    <span className="font-medium text-text">{profile.contribution_stats?.actions_completed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-grayText">Policies Viewed</span>
                    <span className="font-medium text-text">{profile.contribution_stats?.policies_viewed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-grayText">Organizations</span>
                    <span className="font-medium text-text">{profile.contribution_stats?.organizations_supported || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* New User Prompt */}
          {!profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mt-8 p-4 bg-primary bg-opacity-10 rounded-xl border border-primary border-opacity-20">
                <h3 className="text-sm font-semibold text-primary mb-2">Get Started</h3>
                <p className="text-xs text-grayText mb-3">
                  Create your profile to get personalized recommendations and track your impact.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleProfileNavigation}
                    className="w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Create Profile
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-grayBorder">
          <div className="text-xs text-grayText space-y-1">
            <p>© 2024 Science for Action</p>
            <p>Making science accessible and actionable</p>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
