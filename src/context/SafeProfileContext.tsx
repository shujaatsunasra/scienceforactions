"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { UserProfile } from '@/lib/supabase';

// Simplified profile interface to prevent complexity
export interface SimpleUserProfile extends UserProfile {
  intent_actions: string[];
  preferred_topics: string[];
  saved_actions: string[];
  preferences: {
    auto_save: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
    digest_frequency: 'daily' | 'weekly' | 'monthly';
  };
}

interface ProfileContextType {
  profile: SimpleUserProfile | null;
  isLoading: boolean;
  isNewUser: boolean;
  updateProfile: (updates: Partial<SimpleUserProfile>) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Default profile to prevent null issues
const createDefaultProfile = (): SimpleUserProfile => ({
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
  location: 'Demo Location',
  interests: ['environment', 'climate'],
  preferred_causes: ['environment', 'climate'],
  contribution_stats: {
    actions_completed: 0,
    organizations_supported: 0,
    policies_viewed: 0,
    total_impact_score: 0
  },
  personalization: {
    layout_preference: 'detailed',
    color_scheme: 'neutral',
    engagement_level: 'medium',
    communication_frequency: 'weekly'
  },
  profile_completion: 70,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_active: new Date().toISOString(),
  engagement_metrics: {
    session_count: 1,
    avg_session_duration: 300,
    page_views: 5,
    actions_per_session: 2
  },
  // Additional SimpleUserProfile fields
  intent_actions: [],
  preferred_topics: ['climate', 'environment'],
  saved_actions: [],
  preferences: {
    auto_save: true,
    notifications: true,
    theme: 'light',
    digest_frequency: 'weekly'
  }
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SimpleUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const initializationRef = useRef(false);

  // Initialize profile on mount (only once)
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeProfile = async () => {
      try {
        // Check if we have a stored profile
        const storedProfile = localStorage.getItem('user_profile');
        
        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile);
            setProfile(parsed);
            setIsNewUser(false);
          } catch (error) {
            console.warn('Invalid stored profile, creating new one');
            const defaultProfile = createDefaultProfile();
            setProfile(defaultProfile);
            setIsNewUser(true);
            localStorage.setItem('user_profile', JSON.stringify(defaultProfile));
          }
        } else {
          // Create new profile
          const defaultProfile = createDefaultProfile();
          setProfile(defaultProfile);
          setIsNewUser(true);
          localStorage.setItem('user_profile', JSON.stringify(defaultProfile));
        }
      } catch (error) {
        console.error('Profile initialization failed:', error);
        // Fallback to default profile
        const defaultProfile = createDefaultProfile();
        setProfile(defaultProfile);
        setIsNewUser(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to prevent blocking
    setTimeout(initializeProfile, 100);
  }, []);

  // Safe profile update with local storage
  const updateProfile = useCallback((updates: Partial<SimpleUserProfile>) => {
    setProfile(prev => {
      if (!prev) return null;
      
      const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
      
      // Store in localStorage (non-blocking)
      setTimeout(() => {
        try {
          localStorage.setItem('user_profile', JSON.stringify(updated));
        } catch (error) {
          console.warn('Failed to store profile updates:', error);
        }
      }, 0);
      
      return updated;
    });
  }, []);

  const addInterest = useCallback((interest: string) => {
    if (!profile) return;
    
    const newInterests = [...(profile.interests || [])];
    if (!newInterests.includes(interest)) {
      newInterests.push(interest);
      updateProfile({ interests: newInterests });
    }
  }, [profile, updateProfile]);

  const removeInterest = useCallback((interest: string) => {
    if (!profile) return;
    
    const newInterests = (profile.interests || []).filter(i => i !== interest);
    updateProfile({ interests: newInterests });
  }, [profile, updateProfile]);

  const resetProfile = useCallback(() => {
    const defaultProfile = createDefaultProfile();
    setProfile(defaultProfile);
    setIsNewUser(true);
    
    try {
      localStorage.setItem('user_profile', JSON.stringify(defaultProfile));
    } catch (error) {
      console.warn('Failed to reset profile in storage:', error);
    }
  }, []);

  const contextValue: ProfileContextType = {
    profile,
    isLoading,
    isNewUser,
    updateProfile,
    addInterest,
    removeInterest,
    resetProfile
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
