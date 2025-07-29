"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useActionEngagement } from '@/context/ActionEngagementContext';
import { motion, AnimatePresence } from 'framer-motion';
import UserActivityService, { UserActivity, ProfileStats, DynamicInterest } from '@/services/userActivityService';

interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityVisibility: 'public' | 'private' | 'friends';
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { engagementData, generatedActions } = useActionEngagement();
  const [activeTab, setActiveTab] = useState<'overview' | 'interests' | 'settings' | 'activity'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
  });

  // Dynamic data derived from user engagement
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    actionsCompleted: 0,
    peopleReached: 0,
    impactScore: 0,
    totalTimeSpent: 0,
    streakDays: 0,
    completionRate: 0,
    favoriteCategory: 'Environmental Action',
    totalSaved: 0
  });
  
  const [dynamicInterests, setDynamicInterests] = useState<DynamicInterest[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  // Update dynamic data when engagement data changes
  useEffect(() => {
    const stats = UserActivityService.calculateProfileStats(engagementData, generatedActions);
    const interests = UserActivityService.generateDynamicInterests(engagementData, generatedActions);
    const activities = UserActivityService.generateActivitiesFromEngagement(engagementData, generatedActions);
    
    setProfileStats(stats);
    setDynamicInterests(interests);
    setUserActivities(activities.slice(0, 10)); // Show latest 10 activities
  }, [engagementData, generatedActions]);

  const [settings, setSettings] = useState<ProfileSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'friends',
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
    },
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'interests', label: 'Interests', icon: '❤️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'activity', label: 'Activity', icon: '📊' },
  ];

  const availableInterests = [
    { name: 'Ocean Conservation', category: 'environment', color: 'bg-cyan-500' },
    { name: 'Carbon Footprint', category: 'environment', color: 'bg-gray-600' },
    { name: 'Green Technology', category: 'technology', color: 'bg-lime-500' },
    { name: 'Environmental Justice', category: 'social', color: 'bg-red-500' },
    { name: 'Climate Education', category: 'education', color: 'bg-indigo-500' },
    { name: 'Food Security', category: 'agriculture', color: 'bg-amber-500' },
    { name: 'Water Conservation', category: 'environment', color: 'bg-blue-400' },
    { name: 'Wildlife Protection', category: 'environment', color: 'bg-green-600' },
  ];

  const handleSaveProfile = async () => {
    setIsEditing(false);
  };

  const addInterest = (newInterest: { name: string; category: string; color: string }) => {
    const interest: DynamicInterest = {
      id: Date.now().toString(),
      name: newInterest.name,
      category: newInterest.category,
      color: newInterest.color,
      frequency: 0,
      lastEngaged: new Date().toISOString(),
      source: 'ai_suggested'
    };
    setDynamicInterests([...dynamicInterests, interest]);
  };

  const removeInterest = (id: string) => {
    setDynamicInterests(dynamicInterests.filter(interest => interest.id !== id));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {editData.location || 'Location not set'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <div className="space-y-4 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Tell us about yourself and your climate action goals..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{profileStats.actionsCompleted}</h3>
          <p className="text-gray-600">Actions Completed</p>
          <div className="text-xs text-green-600 mt-1">+{profileStats.completionRate}% completion rate</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{profileStats.peopleReached}</h3>
          <p className="text-gray-600">People Reached</p>
          <div className="text-xs text-blue-600 mt-1">Through your actions</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{profileStats.impactScore}%</h3>
          <p className="text-gray-600">Impact Score</p>
          <div className="text-xs text-red-600 mt-1">{profileStats.streakDays} day streak</div>
        </div>
      </div>

      {/* Dynamic Insights */}
      {profileStats.actionsCompleted > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 Your Dynamic Profile Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Real-time Activity Tracking</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {engagementData.totalActionsViewed} actions viewed</li>
                <li>• {engagementData.preferredTopics.length} preferred topics identified</li>
                <li>• {Math.round(engagementData.totalTimeSpent / 60)} minutes engaged</li>
                <li>• {engagementData.preferredLocations.length} locations of interest</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">AI-Powered Personalization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {dynamicInterests.length} interests auto-generated from behavior</li>
                <li>• {userActivities.length} recent activities tracked</li>
                <li>• Impact score calculated from action quality & consistency</li>
                <li>• People reached estimated from action types & effectiveness</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white/60 rounded-lg">
            <p className="text-xs text-gray-500">
              ℹ️ Your profile data is dynamically generated from your real engagement patterns. 
              Stats update automatically as you interact with actions on the platform.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderInterests = () => (
    <div className="space-y-6">
      {/* Current Interests */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          <AnimatePresence>
            {dynamicInterests.map((interest) => (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="relative group">
                  <div className={`${interest.color} rounded-xl p-4 text-white text-center cursor-pointer hover:scale-105 transition-transform`}>
                    <p className="font-medium text-sm">{interest.name}</p>
                    <div className="text-xs mt-1 opacity-80">
                      {interest.frequency > 0 ? `${interest.frequency} actions` : interest.category}
                    </div>
                    <button
                      onClick={() => removeInterest(interest.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add New Interests */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Discover New Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableInterests
            .filter(ai => !dynamicInterests.some(i => i.name === ai.name))
            .map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  onClick={() => addInterest(interest)}
                  className={`${interest.color} rounded-xl p-4 text-white text-center cursor-pointer hover:scale-105 transition-transform border-2 border-dashed border-white/30 hover:border-white/60`}
                >
                  <p className="font-medium text-sm">{interest.name}</p>
                  <div className="mt-2 text-white/80 text-xs">Click to add</div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 capitalize">{key} Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications via {key}</p>
              </div>
              <button
                onClick={() => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, [key]: !value }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Visibility</label>
            <select
              value={settings.privacy.activityVisibility}
              onChange={(e) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, activityVisibility: e.target.value as any }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => setSettings({
                ...settings,
                preferences: { ...settings.preferences, theme: e.target.value as any }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.preferences.language}
              onChange={(e) => setSettings({
                ...settings,
                preferences: { ...settings.preferences, language: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        {userActivities.length > 0 ? (
          <div className="space-y-4">
            {userActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'campaign' ? 'bg-green-100 text-green-600' :
                    activity.type === 'share' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'assessment' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'donation' ? 'bg-red-100 text-red-600' :
                    activity.type === 'contact' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'volunteer' ? 'bg-orange-100 text-orange-600' :
                    activity.type === 'petition' ? 'bg-indigo-100 text-indigo-600' :
                    activity.type === 'learn' ? 'bg-cyan-100 text-cyan-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'campaign' ? '📢' : 
                     activity.type === 'share' ? '📤' :
                     activity.type === 'assessment' ? '📊' :
                     activity.type === 'donation' ? '💰' :
                     activity.type === 'contact' ? '📞' :
                     activity.type === 'volunteer' ? '🤝' :
                     activity.type === 'petition' ? '✍️' :
                     activity.type === 'learn' ? '📚' : '🎯'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{activity.relativeTime}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {activity.category}
                        </span>
                        {activity.location && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {activity.location}
                          </span>
                        )}
                        <div className="flex items-center">
                          {Array(activity.impact).fill(0).map((_, i) => (
                            <span key={i} className="text-yellow-500 text-xs">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No activity yet</p>
            <p className="text-gray-500">Start engaging with actions to see your activity history!</p>
            <button 
              onClick={() => window.location.href = '/main'}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Start Taking Action
            </button>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      {userActivities.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profileStats.actionsCompleted}</div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileStats.totalSaved}</div>
              <div className="text-sm text-gray-600">Saved for Later</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profileStats.totalTimeSpent}</div>
              <div className="text-sm text-gray-600">Minutes Engaged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{profileStats.favoriteCategory}</div>
              <div className="text-sm text-gray-600">Favorite Topic</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'interests': return renderInterests();
      case 'settings': return renderSettings();
      case 'activity': return renderActivity();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and personalize your experience</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

