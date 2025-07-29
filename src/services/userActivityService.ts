"use client";

import { useActionEngagement } from '@/context/ActionEngagementContext';
import type { GeneratedAction, UserEngagementData } from '@/context/ActionEngagementContext';

// Real-time user activity interface
export interface UserActivity {
  id: string;
  action: string;
  type: 'campaign' | 'share' | 'assessment' | 'donation' | 'event' | 'contact' | 'volunteer' | 'petition' | 'learn';
  time: string;
  relativeTime: string;
  impact: number;
  category: string;
  location?: string;
}

export interface ProfileStats {
  actionsCompleted: number;
  peopleReached: number;
  impactScore: number;
  totalTimeSpent: number;
  streakDays: number;
  completionRate: number;
  favoriteCategory: string;
  totalSaved: number;
}

export interface DynamicInterest {
  id: string;
  name: string;
  category: string;
  color: string;
  frequency: number;
  lastEngaged: string;
  source: 'user_action' | 'topic_engagement' | 'location_based' | 'ai_suggested';
}

class UserActivityService {
  // Convert engagement data to user activities
  static generateActivitiesFromEngagement(
    engagementData: UserEngagementData, 
    generatedActions: GeneratedAction[]
  ): UserActivity[] {
    const activities: UserActivity[] = [];
    
    // Get completed and saved actions
    const completedActions = generatedActions.filter(action => action.completedAt);
    const savedActions = generatedActions.filter(action => action.savedAt && !action.completedAt);
    
    // Convert completed actions to activities
    completedActions.forEach(action => {
      const completedTime = new Date(action.completedAt!);
      activities.push({
        id: action.id,
        action: `Completed: ${action.title}`,
        type: this.mapCTATypeToActivityType(action.ctaType),
        time: action.completedAt!,
        relativeTime: this.getRelativeTime(completedTime),
        impact: action.impact,
        category: action.topic,
        location: action.location
      });
    });
    
    // Convert saved actions to activities
    savedActions.forEach(action => {
      const savedTime = new Date(action.savedAt!);
      activities.push({
        id: `saved-${action.id}`,
        action: `Saved for later: ${action.title}`,
        type: 'assessment', // Generic type for saved actions
        time: action.savedAt!,
        relativeTime: this.getRelativeTime(savedTime),
        impact: action.impact,
        category: action.topic,
        location: action.location
      });
    });
    
    // Add engagement milestones as activities
    if (engagementData.actionsCompleted >= 5) {
      activities.push({
        id: 'milestone-5',
        action: 'Reached 5 actions milestone',
        type: 'event',
        time: engagementData.lastEngagement,
        relativeTime: this.getRelativeTime(new Date(engagementData.lastEngagement)),
        impact: 4,
        category: 'Achievement'
      });
    }
    
    if (engagementData.streakDays >= 3) {
      activities.push({
        id: 'streak-3',
        action: `Maintained ${engagementData.streakDays}-day engagement streak`,
        type: 'event',
        time: engagementData.lastEngagement,
        relativeTime: this.getRelativeTime(new Date(engagementData.lastEngagement)),
        impact: 3,
        category: 'Consistency'
      });
    }
    
    // Sort by time (most recent first)
    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }
  
  // Calculate dynamic profile statistics
  static calculateProfileStats(
    engagementData: UserEngagementData, 
    generatedActions: GeneratedAction[]
  ): ProfileStats {
    const completedActions = generatedActions.filter(action => action.completedAt);
    const totalImpact = completedActions.reduce((sum, action) => sum + action.impact, 0);
    const averageImpact = completedActions.length > 0 ? totalImpact / completedActions.length : 0;
    
    // Calculate people reached based on action types and impact
    const peopleReached = completedActions.reduce((total, action) => {
      const multiplier = this.getPeopleReachedMultiplier(action.ctaType, action.impact);
      return total + multiplier;
    }, 0);
    
    // Calculate impact score (0-100)
    const baseScore = Math.min(engagementData.actionsCompleted * 8, 60); // Max 60 from quantity
    const qualityScore = Math.min(averageImpact * 8, 25); // Max 25 from quality
    const consistencyScore = Math.min(engagementData.streakDays * 2, 15); // Max 15 from consistency
    const impactScore = Math.round(baseScore + qualityScore + consistencyScore);
    
    // Find favorite category
    const categoryFrequency: Record<string, number> = {};
    completedActions.forEach(action => {
      categoryFrequency[action.topic] = (categoryFrequency[action.topic] || 0) + 1;
    });
    const favoriteCategory = Object.keys(categoryFrequency).reduce((a, b) => 
      categoryFrequency[a] > categoryFrequency[b] ? a : b, 'Environmental Action'
    );
    
    // Completion rate
    const completionRate = engagementData.totalActionsViewed > 0 
      ? Math.round((engagementData.actionsCompleted / engagementData.totalActionsViewed) * 100)
      : 0;
    
    return {
      actionsCompleted: engagementData.actionsCompleted,
      peopleReached,
      impactScore,
      totalTimeSpent: Math.round(engagementData.totalTimeSpent / 60), // Convert to minutes
      streakDays: engagementData.streakDays,
      completionRate,
      favoriteCategory,
      totalSaved: engagementData.actionsSaved
    };
  }
  
  // Generate dynamic interests based on user engagement
  static generateDynamicInterests(
    engagementData: UserEngagementData, 
    generatedActions: GeneratedAction[]
  ): DynamicInterest[] {
    const interests: DynamicInterest[] = [];
    
    // Extract interests from preferred topics
    engagementData.preferredTopics.forEach((topic, index) => {
      interests.push({
        id: `topic-${index}`,
        name: topic,
        category: 'User Preference',
        color: this.getTopicColor(topic),
        frequency: this.calculateTopicFrequency(topic, generatedActions),
        lastEngaged: engagementData.lastEngagement,
        source: 'topic_engagement'
      });
    });
    
    // Extract interests from completed actions
    const actionTopics = new Set<string>();
    generatedActions
      .filter(action => action.completedAt)
      .forEach(action => {
        if (!engagementData.preferredTopics.includes(action.topic)) {
          actionTopics.add(action.topic);
        }
      });
    
    Array.from(actionTopics).slice(0, 3).forEach((topic, index) => {
      interests.push({
        id: `action-topic-${index}`,
        name: topic,
        category: 'Active Engagement',
        color: this.getTopicColor(topic),
        frequency: this.calculateTopicFrequency(topic, generatedActions),
        lastEngaged: this.getLastEngagementWithTopic(topic, generatedActions),
        source: 'user_action'
      });
    });
    
    // Add location-based interests
    engagementData.preferredLocations.slice(0, 2).forEach((location, index) => {
      interests.push({
        id: `location-${index}`,
        name: `${location} Community`,
        category: 'Local Engagement',
        color: 'bg-blue-500',
        frequency: this.calculateLocationFrequency(location, generatedActions),
        lastEngaged: engagementData.lastEngagement,
        source: 'location_based'
      });
    });
    
    return interests.slice(0, 8); // Limit to 8 interests
  }
  
  // Helper methods
  private static mapCTATypeToActivityType(ctaType: string): UserActivity['type'] {
    const mapping: Record<string, UserActivity['type']> = {
      'contact_rep': 'contact',
      'volunteer': 'volunteer',
      'donate': 'donation',
      'petition': 'petition',
      'learn_more': 'learn',
      'organize': 'campaign',
      'get_help': 'assessment'
    };
    return mapping[ctaType] || 'event';
  }
  
  private static getPeopleReachedMultiplier(ctaType: string, impact: number): number {
    const baseMultipliers: Record<string, number> = {
      'contact_rep': 50,
      'volunteer': 25,
      'donate': 10,
      'petition': 100,
      'learn_more': 5,
      'organize': 200,
      'get_help': 2
    };
    const base = baseMultipliers[ctaType] || 10;
    return Math.round(base * impact * (0.5 + Math.random() * 0.5)); // Add some variation
  }
  
  private static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else {
      const diffWeeks = Math.round(diffDays / 7);
      return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
    }
  }
  
  private static getTopicColor(topic: string): string {
    const colorMap: Record<string, string> = {
      'Climate Action': 'bg-green-500',
      'Climate Change': 'bg-green-600',
      'Environmental': 'bg-emerald-500',
      'Renewable Energy': 'bg-blue-500',
      'Sustainability': 'bg-lime-500',
      'Ocean Conservation': 'bg-cyan-500',
      'Policy Research': 'bg-purple-500',
      'Community Building': 'bg-orange-500',
      'Social Justice': 'bg-red-500',
      'Education': 'bg-indigo-500',
      'Healthcare': 'bg-pink-500',
      'Technology': 'bg-gray-600',
      'Economic': 'bg-yellow-500',
      'Food Security': 'bg-amber-500',
      'Water Conservation': 'bg-blue-400',
      'Wildlife Protection': 'bg-green-600'
    };
    
    // Find partial matches for dynamic topics
    const topicLower = topic.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
      if (topicLower.includes(key.toLowerCase()) || key.toLowerCase().includes(topicLower)) {
        return color;
      }
    }
    
    // Generate a consistent color based on topic name
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'];
    const index = topic.length % colors.length;
    return colors[index];
  }
  
  private static calculateTopicFrequency(topic: string, actions: GeneratedAction[]): number {
    return actions.filter(action => 
      action.topic === topic || action.tags.includes(topic)
    ).length;
  }
  
  private static calculateLocationFrequency(location: string, actions: GeneratedAction[]): number {
    return actions.filter(action => 
      action.location === location
    ).length;
  }
  
  private static getLastEngagementWithTopic(topic: string, actions: GeneratedAction[]): string {
    const topicActions = actions
      .filter(action => (action.topic === topic || action.tags.includes(topic)) && action.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    return topicActions.length > 0 ? topicActions[0].completedAt! : new Date().toISOString();
  }
}

export default UserActivityService;
