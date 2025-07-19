"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabaseUserService, EnhancedUserProfile } from '@/services/supabaseUserService';
import { UserProfile } from '@/lib/supabase';
import { useDebounce } from '@/hooks/useDebounce';

// Extended interface for context-specific profile data
export interface ExtendedUserProfile extends UserProfile {
  intent_actions: string[];
  preferred_topics: string[];
  saved_actions: string[];
  policy_engagement_history: {
    policy_id: string;
    action: 'viewed' | 'shared' | 'acted';
    timestamp: string;
  }[];
  preferences: {
    auto_save: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
    digest_frequency: 'daily' | 'weekly' | 'monthly';
  };
}

interface ProfileContextType {
  profile: ExtendedUserProfile | null;
  isLoading: boolean;
  isNewUser: boolean;
  updateProfile: (updates: Partial<ExtendedUserProfile>) => Promise<void>;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  addSavedAction: (actionId: string) => void;
  removeSavedAction: (actionId: string) => void;
  trackPolicyEngagement: (policyId: string, action: 'viewed' | 'shared' | 'acted') => void;
  updateContributionStats: (type: keyof UserProfile['contribution_stats'], increment?: number) => void;
  resetProfile: () => void;
  exportProfileData: () => string;
  importProfileData: (data: string) => boolean;
  refreshProfile: () => Promise<void>;
  createNewProfile: (initialData: Partial<ExtendedUserProfile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Debounced updates for real-time sync
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ExtendedUserProfile>>({});
  const debouncedUpdates = useDebounce(pendingUpdates, 5000); // Increased to 5 seconds to reduce calls

  // Initialize profile from Supabase or create new user
  useEffect(() => {
    const initializeProfile = async () => {
      setIsLoading(true);
      
      try {
        // Try to get stored user ID from sessionStorage (temporary)
        let userId = null;
        if (typeof window !== 'undefined') {
          userId = sessionStorage.getItem('current_user_id');
        }

        if (userId) {
          // Load existing user
          const existingUser = await supabaseUserService.getUserById(userId);
          if (existingUser) {
            setProfile(transformToExtendedProfile(existingUser));
            setCurrentUserId(userId);
            setIsNewUser(false);
          } else {
            // User ID exists but user not found, create new
            await createDefaultProfile();
          }
        } else {
          // No user ID, create new user
          await createDefaultProfile();
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        await createDefaultProfile();
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  // Handle debounced updates
  useEffect(() => {
    if (Object.keys(debouncedUpdates).length > 0 && currentUserId) {
      const syncUpdates = async () => {
        try {
          console.log('Syncing profile updates:', Object.keys(debouncedUpdates));
          const updatedUser = await supabaseUserService.updateUser(currentUserId, debouncedUpdates);
          if (updatedUser) {
            setProfile(transformToExtendedProfile(updatedUser));
            console.log('Profile synced successfully');
          } else {
            console.warn('Profile update returned null, keeping local changes');
          }
          setPendingUpdates({});
        } catch (error) {
          console.error('Error syncing profile updates:', {
            error,
            updates: Object.keys(debouncedUpdates),
            userId: currentUserId
          });
          // Don't clear pending updates on error, let them retry
        }
      };

      syncUpdates();
    }
  }, [debouncedUpdates, currentUserId]);

  const createDefaultProfile = async () => {
    try {
      const defaultProfileData: Partial<UserProfile> = {
        name: 'New User',
        interests: [],
        preferred_causes: [],
        contribution_stats: {
          actions_completed: 0,
          organizations_supported: 0,
          policies_viewed: 0,
          total_impact_score: 0,
        },
        personalization: {
          layout_preference: 'detailed',
          color_scheme: 'neutral',
          engagement_level: 'medium',
          communication_frequency: 'weekly',
        },
        profile_completion: 20, // Just has a name
        engagement_metrics: {
          session_count: 1,
          avg_session_duration: 0,
          page_views: 1,
          actions_per_session: 0,
        },
      };

      const newUser = await supabaseUserService.createUser(defaultProfileData);
      if (newUser) {
        setProfile(transformToExtendedProfile(newUser));
        setCurrentUserId(newUser.id);
        setIsNewUser(true);
        
        // Store user ID for session persistence
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('current_user_id', newUser.id);
        }
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    }
  };

  const transformToExtendedProfile = (user: UserProfile): ExtendedUserProfile => {
    return {
      ...user,
      intent_actions: [],
      preferred_topics: user.preferred_causes,
      saved_actions: [],
      policy_engagement_history: [],
      preferences: {
        auto_save: true,
        notifications: true,
        theme: 'light',
        digest_frequency: 'weekly',
      },
    };
  };

  const updateProfile = useCallback(async (updates: Partial<ExtendedUserProfile>) => {
    if (!profile || !currentUserId) return;

    // Update local state immediately for responsiveness
    setProfile(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);

    // Queue updates for Supabase sync
    setPendingUpdates(prev => ({ ...prev, ...updates }));
  }, [profile, currentUserId]);

  const refreshProfile = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      const freshProfile = await supabaseUserService.getUserById(currentUserId);
      if (freshProfile) {
        setProfile(transformToExtendedProfile(freshProfile));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  const createNewProfile = useCallback(async (initialData: Partial<ExtendedUserProfile>) => {
    try {
      setIsLoading(true);
      const newUser = await supabaseUserService.createUser(initialData);
      if (newUser) {
        setProfile(transformToExtendedProfile(newUser));
        setCurrentUserId(newUser.id);
        setIsNewUser(true);
        
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('current_user_id', newUser.id);
        }
      }
    } catch (error) {
      console.error('Error creating new profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addInterest = useCallback((interest: string) => {
    if (!profile || profile.interests.includes(interest)) return;
    
    const interests = [...profile.interests, interest];
    updateProfile({ interests });
  }, [profile, updateProfile]);

  const removeInterest = useCallback((interest: string) => {
    if (!profile) return;
    
    const interests = profile.interests.filter((i: string) => i !== interest);
    updateProfile({ interests });
  }, [profile, updateProfile]);

  const addSavedAction = useCallback((actionId: string) => {
    if (!profile || profile.saved_actions.includes(actionId)) return;
    
    const saved_actions = [...profile.saved_actions, actionId];
    updateProfile({ saved_actions });
  }, [profile, updateProfile]);

  const removeSavedAction = useCallback((actionId: string) => {
    if (!profile) return;
    
    const saved_actions = profile.saved_actions.filter((id: string) => id !== actionId);
    updateProfile({ saved_actions });
  }, [profile, updateProfile]);

  const trackPolicyEngagement = useCallback((policyId: string, action: 'viewed' | 'shared' | 'acted') => {
    if (!profile) return;
    
    const engagement = {
      policy_id: policyId,
      action,
      timestamp: new Date().toISOString(),
    };
    
    const policy_engagement_history = [...profile.policy_engagement_history, engagement];
    
    // Also update contribution stats
    const contribution_stats = {
      ...profile.contribution_stats,
      policies_viewed: profile.contribution_stats.policies_viewed + 1,
    };
    
    updateProfile({ policy_engagement_history, contribution_stats });
  }, [profile, updateProfile]);

  const updateContributionStats = useCallback((type: keyof UserProfile['contribution_stats'], increment = 1) => {
    if (!profile) return;
    
    const contribution_stats = {
      ...profile.contribution_stats,
      [type]: profile.contribution_stats[type] + increment,
    };
    
    updateProfile({ contribution_stats });
  }, [profile, updateProfile]);

  const resetProfile = useCallback(async () => {
    try {
      // Clear session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('current_user_id');
      }
      
      // Create new profile
      await createDefaultProfile();
    } catch (error) {
      console.error('Error resetting profile:', error);
    }
  }, []);

  const exportProfileData = useCallback((): string => {
    if (!profile) return '{}';
    return JSON.stringify(profile, null, 2);
  }, [profile]);

  const importProfileData = useCallback((data: string): boolean => {
    try {
      const importedProfile = JSON.parse(data) as ExtendedUserProfile;
      
      // Validate required fields
      if (!importedProfile.name) {
        console.error('Invalid profile data: missing name');
        return false;
      }

      // Ensure required structure exists
      const validatedProfile: Partial<ExtendedUserProfile> = {
        name: importedProfile.name,
        email: importedProfile.email,
        location: importedProfile.location,
        interests: Array.isArray(importedProfile.interests) ? importedProfile.interests : [],
        preferred_causes: Array.isArray(importedProfile.preferred_causes) ? importedProfile.preferred_causes : [],
        contribution_stats: {
          actions_completed: importedProfile.contribution_stats?.actions_completed || 0,
          organizations_supported: importedProfile.contribution_stats?.organizations_supported || 0,
          policies_viewed: importedProfile.contribution_stats?.policies_viewed || 0,
          total_impact_score: importedProfile.contribution_stats?.total_impact_score || 0,
        },
        personalization: {
          layout_preference: importedProfile.personalization?.layout_preference || 'detailed',
          color_scheme: importedProfile.personalization?.color_scheme || 'neutral',
          engagement_level: importedProfile.personalization?.engagement_level || 'medium',
          communication_frequency: importedProfile.personalization?.communication_frequency || 'weekly',
        }
      };

      updateProfile(validatedProfile);
      return true;
    } catch (error) {
      console.error('Error importing profile data:', error);
      return false;
    }
  }, [updateProfile]);

  const value: ProfileContextType = {
    profile,
    isLoading,
    isNewUser,
    updateProfile,
    addInterest,
    removeInterest,
    addSavedAction,
    removeSavedAction,
    trackPolicyEngagement,
    updateContributionStats,
    resetProfile,
    exportProfileData,
    importProfileData,
    refreshProfile,
    createNewProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
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

export default ProfileContext;
