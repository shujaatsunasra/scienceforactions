"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { navigationService } from '@/services/navigationService';

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

// Admin item - only show to admin users
const adminNavItem = {
  id: 'admin',
  label: 'Admin',
  path: '/admin',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();
  const { user, logout } = useAuth();

  // Prefetch navigation routes on component mount
  useEffect(() => {
    const prefetchRoutes = async () => {
      if (typeof window !== 'undefined') {
        for (const item of navItems) {
          await navigationService.smartPrefetch(router, item.path);
        }
      }
    };

    prefetchRoutes().catch(() => {}); // Graceful prefetch failure
  }, [router]);

  const handleNavigation = async (path: string) => {
    try {
      const success = await navigationService.navigateTo(router, path, {
        prefetch: false, // Already prefetched
      });

      if (!success) {
        // Production: debug output removed
      }
    } catch (error) {
      // Production: debug output removed
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
    <div className="w-88 h-screen flex-shrink-0">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', height: '100%' }}
      >
        <nav className="w-full h-full bg-card border-r border-cardBorder flex flex-col shadow-smooth backdrop-blur-sm">
          {/* Brand Header */}
          <div className="p-8 border-b border-cardBorder bg-gradient-to-br from-card to-surface">
            <div
              onClick={handleBrandClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-button">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-text group-hover:text-primary transition-colors duration-200">
                  Science for Action
                </h1>
              </div>
              <p className="text-textSecondary text-sm font-medium">
                Science for people who give a shit
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-3">
              {[...navItems, ...(user && user.role === 'admin' ? [adminNavItem] : [])].map((item, index) => {
                const isActive = pathname.startsWith(item.path);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                      aria-label={`Navigate to ${item.label}`}
                    >
                      {/* Active indicator glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeGlow"
                          style={{ 
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to right, rgba(255, 68, 68, 0.2), rgba(255, 107, 107, 0.2))',
                            borderRadius: '0.75rem'
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
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
                        <motion.div
                          layoutId="activeIndicator"
                          style={{ marginLeft: 'auto', position: 'relative', zIndex: 10 }}
                          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full shadow-button animate-glow-pulse" />
                        </motion.div>
                      )}
                      
                      {/* Hover effect */}
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

            {/* Impact Dashboard */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{ marginTop: '2rem' }}
              >
                <div className="bg-gradient-to-br from-surface to-backgroundDark rounded-xl p-6 border border-cardBorder shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-success to-primary rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-text">Your Impact</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-textSecondary">Actions Completed</span>
                      <span className="text-lg font-bold text-primary">
                        {profile.contribution_stats?.actions_completed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-textSecondary">Policies Viewed</span>
                      <span className="text-lg font-bold text-accent">
                        {profile.contribution_stats?.policies_viewed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-textSecondary">Organizations</span>
                      <span className="text-lg font-bold text-success">
                        {profile.contribution_stats?.organizations_supported || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Onboarding CTA */}
            {!profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{ marginTop: '2rem' }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center animate-float">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-primary">Get Started</h3>
                  </div>
                  <p className="text-sm text-textSecondary mb-4 leading-relaxed">
                    Create your profile to get personalized recommendations and track your climate impact.
                  </p>
                  <button
                    onClick={handleProfileNavigation}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-pill text-sm font-semibold shadow-button hover:shadow-button-hover transition-all duration-200 ease-smooth"
                  >
                    Create Profile
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer - User Info */}
          <div className="p-6 border-t border-cardBorder bg-surface/50 backdrop-blur-sm">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text truncate">{user.name}</p>
                    <p className="text-xs text-textMuted truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full py-2 px-3 text-xs font-medium text-textSecondary hover:text-text bg-surface hover:bg-backgroundDark border border-cardBorder rounded-lg transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="text-xs text-textMuted space-y-1 text-center">
                <p className="font-medium">© 2024 Science for Action</p>
                <p>Making science accessible and actionable</p>
              </div>
            )}
          </div>
        </nav>
      </motion.div>
    </div>
  );
}

