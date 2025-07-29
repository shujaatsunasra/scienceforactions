"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseUserService } from '@/services/supabaseUserService';
import { UserProfile } from '@/lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Verify user still exists and load current profile
          const profile = await supabaseUserService.getUserById(userData.id);
          if (profile) {
            setUser({
              ...userData,
              role: userData.email === 'admin@scienceforaction.com' ? 'admin' : 'user', // Ensure role is set
              profile,
            });
          } else {
            // User doesn't exist anymore, clear storage
            localStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Simple demo authentication - in production, use proper auth service
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Check if user exists by email (demo implementation)
      const users = await supabaseUserService.getUsersByEmail(email);
      let profile = users[0];

      if (!profile) {
        // Create new user if doesn't exist (auto-register flow)
        const newProfile = await supabaseUserService.createUser({
          name: email.split('@')[0],
          email,
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
        });
        
        if (!newProfile) {
          return { success: false, error: 'Failed to create user profile' };
        }
        
        profile = newProfile;
      }

      if (profile) {
        const authUser: AuthUser = {
          id: profile.id,
          email: profile.email || email,
          name: profile.name,
          created_at: profile.created_at,
          role: email === 'admin@scienceforaction.com' ? 'admin' : 'user', // Set admin role for specific email
          profile,
        };

        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      // Check if user already exists
      const existingUsers = await supabaseUserService.getUsersByEmail(email);
      if (existingUsers.length > 0) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const profile = await supabaseUserService.createUser({
        name,
        email,
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
      });

      if (profile) {
        const authUser: AuthUser = {
          id: profile.id,
          email: profile.email || email,
          name: profile.name,
          created_at: profile.created_at,
          role: email === 'admin@scienceforaction.com' ? 'admin' : 'user', // Set admin role for specific email
          profile,
        };

        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedProfile = await supabaseUserService.updateUser(user.id, updates);
      if (updatedProfile) {
        const updatedUser = {
          ...user,
          profile: updatedProfile,
        };
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
