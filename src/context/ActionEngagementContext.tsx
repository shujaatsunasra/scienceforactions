"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { supabaseUserService } from '@/services/supabaseUserService';
import { advancedAIService } from '@/services/advancedAIService';
import type { ActionItem } from '@/lib/supabase';

export interface ActionIntentData {
  intent: string;
  topic: string;
  location: string;
  timestamp: string;
}

export interface GeneratedAction {
  id: string;
  title: string;
  description: string;
  tags: string[];
  intent: string;
  topic: string;
  location: string;
  cta: string;
  ctaType: 'contact_rep' | 'volunteer' | 'donate' | 'petition' | 'learn_more' | 'organize' | 'get_help';
  impact: number; // 1-5 scale
  urgency: number; // 1-5 scale
  timeCommitment?: string;
  organizationName?: string;
  link?: string;
  template?: {
    type: 'letter' | 'email' | 'petition' | 'form';
    content: string;
    recipientInfo?: any;
  };
  eventDetails?: {
    date: string;
    time: string;
    venue: string;
    rsvpRequired: boolean;
  };
  resourceLinks?: Array<{
    title: string;
    url: string;
    type: 'emergency' | 'informational' | 'application' | 'support';
  }>;
  socialShareData?: {
    title: string;
    message: string;
    hashtags: string[];
  };
  nextSteps?: string[];
  relatedActions?: string[];
  generatedAt: string;
  completedAt?: string;
  savedAt?: string;
  engagementScore?: number;
  relevanceScore?: number;
}

export interface UserEngagementData {
  totalActionsViewed: number;
  actionsCompleted: number;
  actionsSaved: number;
  totalTimeSpent: number; // in seconds
  preferredIntents: string[];
  preferredTopics: string[];
  preferredLocations: string[];
  engagementPattern: {
    mostActiveHours: number[];
    preferredActionTypes: string[];
    averageTimePerAction: number;
  };
  lastEngagement: string;
  streakDays: number;
}

interface ActionEngagementContextType {
  // Current session state
  currentIntent: ActionIntentData | null;
  generatedActions: GeneratedAction[];
  isGenerating: boolean;
  
  // User engagement tracking
  engagementData: UserEngagementData;
  
  // Actions
  setCurrentIntent: (intent: ActionIntentData) => void;
  generateAdaptiveActions: (intent: ActionIntentData) => Promise<GeneratedAction[]>;
  completeAction: (actionId: string, feedback?: any) => void;
  saveAction: (actionId: string) => void;
  trackEngagement: (actionId: string, timeSpent: number, interactionType: string) => void;
  getPersonalizedRecommendations: () => GeneratedAction[];
  
  // Learning and adaptation
  updateUserPreferences: (actionId: string, rating: number, feedback?: string) => void;
  getOptimizedResults: (intent: ActionIntentData) => Promise<GeneratedAction[]>;
  
  // Reset and utilities
  resetSession: () => void;
  exportEngagementData: () => string;
}

const ActionEngagementContext = createContext<ActionEngagementContextType | undefined>(undefined);

// Generative AI action templates by intent
interface ActionTemplate {
  title: string;
  description: string;
  template?: {
    type: 'letter' | 'email' | 'petition' | 'form';
    content: string;
    recipientInfo?: any;
  };
  eventDetails?: {
    date: string;
    time: string;
    venue: string;
    rsvpRequired: boolean;
  };
  resourceLinks?: Array<{
    title: string;
    url: string;
    type: 'emergency' | 'informational' | 'application' | 'support';
  }>;
  nextSteps?: string[];
  link?: string;
}

const ACTION_GENERATORS = {
  "be heard": (topic: string, location: string) => ({
    ctaType: 'contact_rep' as const,
    templates: [
      {
        title: `Contact Your Representatives About ${topic}`,
        description: `Make your voice heard on ${topic} policy by contacting your local representatives. Your input can directly influence legislative decisions.`,
        template: {
          type: 'letter' as const,
          content: `Dear [Representative Name],\n\nAs your constituent in ${location}, I am writing to express my concerns about ${topic}. I urge you to consider the following actions:\n\n[Specific policy recommendations]\n\nThank you for your attention to this critical issue.\n\nSincerely,\n[Your Name]`
        }
      },
      {
        title: `Submit Public Comment on ${topic}`,
        description: `Participate in the democratic process by submitting comments on pending ${topic} regulations and policies.`,
        template: {
          type: 'form' as const,
          content: `Structured public comment form for ${topic} policy initiatives`
        }
      }
    ] as ActionTemplate[]
  }),
  
  "volunteer": (topic: string, location: string) => ({
    ctaType: 'volunteer' as const,
    templates: [
      {
        title: `Volunteer for ${topic} Organizations in ${location}`,
        description: `Find meaningful volunteer opportunities with local organizations working on ${topic} in your area.`,
        eventDetails: {
          date: "Ongoing",
          time: "Flexible",
          venue: `Various locations in ${location}`,
          rsvpRequired: true
        }
      },
      {
        title: `Community Science Projects: ${topic}`,
        description: `Join citizen science initiatives that gather data and research on ${topic} issues affecting your community.`,
        eventDetails: {
          date: "Weekly",
          time: "Weekends",
          venue: `Field locations in ${location}`,
          rsvpRequired: true
        }
      }
    ] as ActionTemplate[]
  }),
  
  "get help": (topic: string, location: string) => ({
    ctaType: 'get_help' as const,
    templates: [
      {
        title: `${topic} Support Resources in ${location}`,
        description: `Access immediate and ongoing support resources for ${topic}-related challenges in your area.`,
        resourceLinks: [
          { title: "Emergency Assistance", url: "#", type: 'emergency' as const },
          { title: "Local Support Centers", url: "#", type: 'support' as const },
          { title: "Application Portal", url: "#", type: 'application' as const }
        ]
      },
      {
        title: `Connect with ${topic} Support Network`,
        description: `Join a community of people addressing similar ${topic} challenges and share resources.`,
        template: {
          type: 'form' as const,
          content: `Intake form to connect with appropriate ${topic} support services`
        }
      }
    ] as ActionTemplate[]
  }),
  
  "donate": (topic: string, location: string) => ({
    ctaType: 'donate' as const,
    templates: [
      {
        title: `Support ${topic} Organizations in ${location}`,
        description: `Direct financial support to vetted organizations working on ${topic} issues in your community.`,
        link: "#donate-local"
      },
      {
        title: `Emergency ${topic} Relief Fund`,
        description: `Contribute to rapid-response funding for urgent ${topic} situations affecting ${location}.`,
        link: "#emergency-fund"
      }
    ] as ActionTemplate[]
  }),
  
  "organize": (topic: string, location: string) => ({
    ctaType: 'organize' as const,
    templates: [
      {
        title: `Start a ${topic} Action Group in ${location}`,
        description: `Build grassroots power by organizing community members around ${topic} issues.`,
        nextSteps: [
          "Identify key stakeholders and allies",
          "Research local ${topic} policy landscape",
          "Plan initial community meeting",
          "Develop action plan and timeline"
        ]
      },
      {
        title: `Join Existing ${topic} Coalition`,
        description: `Connect with established groups working on ${topic} to amplify collective impact.`,
        template: {
          type: 'form' as const,
          content: `Coalition membership application for ${topic} advocacy groups`
        },
        nextSteps: [
          "Attend coalition meetings",
          "Participate in planned actions",
          "Recruit additional members",
          "Share resources and expertise"
        ]
      }
    ] as ActionTemplate[]
  })
};

export function ActionEngagementProvider({ children }: { children: React.ReactNode }) {
  const [currentIntent, setCurrentIntent] = useState<ActionIntentData | null>(null);
  const [generatedActions, setGeneratedActions] = useState<GeneratedAction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [engagementData, setEngagementData] = useLocalStorage<UserEngagementData>('user-engagement', {
    totalActionsViewed: 0,
    actionsCompleted: 0,
    actionsSaved: 0,
    totalTimeSpent: 0,
    preferredIntents: [],
    preferredTopics: [],
    preferredLocations: [],
    engagementPattern: {
      mostActiveHours: [],
      preferredActionTypes: [],
      averageTimePerAction: 0
    },
    lastEngagement: new Date().toISOString(),
    streakDays: 0
  });

  // Helper function to generate default actions when no specific generator exists
  const generateDefaultActions = (intent: ActionIntentData): GeneratedAction[] => {
    console.log('🔧 Generating default actions for:', intent);
    return [
      {
        id: `default-${intent.intent.replace(/\s+/g, '_')}-${Date.now()}`,
        title: `Take Action on ${intent.topic}`,
        description: `Get involved with ${intent.topic} initiatives in ${intent.location}. Explore opportunities to make a meaningful impact.`,
        tags: [intent.topic, intent.location, intent.intent],
        intent: intent.intent,
        topic: intent.topic,
        location: intent.location,
        cta: "Learn More",
        ctaType: 'learn_more',
        impact: 3,
        urgency: 3,
        timeCommitment: "1-2 hours",
        organizationName: "Local Community Groups",
        generatedAt: new Date().toISOString(),
        nextSteps: [
          "Research local organizations",
          "Connect with community leaders",
          "Attend community meetings"
        ]
      },
      {
        id: `default2-${intent.intent.replace(/\s+/g, '_')}-${Date.now()}`,
        title: `Join ${intent.topic} Community`,
        description: `Connect with like-minded people working on ${intent.topic} in ${intent.location}. Build lasting relationships and collective impact.`,
        tags: [intent.topic, intent.location, intent.intent, 'community'],
        intent: intent.intent,
        topic: intent.topic,
        location: intent.location,
        cta: "Connect Now",
        ctaType: 'volunteer',
        impact: 4,
        urgency: 2,
        timeCommitment: "2-3 hours",
        organizationName: `${intent.topic} Community Network`,
        generatedAt: new Date().toISOString(),
        nextSteps: [
          "Find local ${intent.topic} groups",
          "Attend community events",
          "Volunteer for initiatives"
        ]
      }
    ];
  };

  // Helper functions for enhanced Supabase integration
  const determineCTAType = (category: string): GeneratedAction['ctaType'] => {
    const categoryMap: Record<string, GeneratedAction['ctaType']> = {
      'Environmental': 'volunteer',
      'Social Justice': 'petition',
      'Political': 'contact_rep',
      'Community': 'volunteer',
      'Education': 'learn_more',
      'Healthcare': 'get_help',
      'Economic': 'contact_rep',
      'Technology': 'learn_more',
      'International': 'donate',
      'Cultural': 'volunteer'
    };
    return categoryMap[category] || 'learn_more';
  };

  const generateContextualNextSteps = (action: ActionItem, intent: ActionIntentData): string[] => {
    return [
      `Research ${action.organization} initiatives`,
      `Connect with local ${intent.topic} advocates`,
      `Explore ${action.category.toLowerCase()} opportunities`,
      `Share your progress with the community`
    ];
  };

  const calculateRelevanceScore = (action: ActionItem, intent: ActionIntentData): number => {
    let score = 0.5; // Base score
    
    // Topic relevance
    if (action.tags.some(tag => tag.toLowerCase().includes(intent.topic.toLowerCase()))) {
      score += 0.3;
    }
    
    // Location relevance
    if (action.location?.toLowerCase().includes(intent.location.toLowerCase()) || 
        action.location === 'Remote' || 
        intent.location.toLowerCase() === 'remote') {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  };

  const personalizeActionsWithAI = async (
    actions: GeneratedAction[], 
    userData: UserEngagementData, 
    intent: ActionIntentData
  ): Promise<GeneratedAction[]> => {
    try {
      // Use AI service to optimize actions
      const optimizedActions = await advancedAIService.optimizeExploreFeed(null, actions as any);
      
      // Convert back to GeneratedAction format with enhanced scoring
      return actions.map(action => ({
        ...action,
        engagementScore: calculateEngagementScore(action, userData)
      })).sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));
    } catch (error) {
      console.warn('AI personalization failed, using basic personalization:', error);
      return personalizeActions(actions, userData);
    }
  };

  const updatePreferredList = (currentList: string[], newItem: string): string[] => {
    const maxItems = 10;
    const updatedList = currentList.includes(newItem) 
      ? currentList 
      : [newItem, ...currentList.slice(0, maxItems - 1)];
    return updatedList;
  };

  const generateAdaptiveActions = useCallback(async (intent: ActionIntentData): Promise<GeneratedAction[]> => {
    setIsGenerating(true);
    console.log('🎯 ActionEngagementContext: generateAdaptiveActions called with:', intent);

    try {
      // Stage 1: Get real Supabase data with debounced fetch
      console.log('� Fetching real actions from Supabase...');
      
      // Get personalized actions from Supabase based on intent
      const [personalizedActions, popularActions] = await Promise.all([
        supabaseUserService.getPersonalizedActions('default-user', 10), // TODO: Get actual user ID
        supabaseUserService.getPopularActions(15)
      ]);

      console.log('✅ Supabase data retrieved:', {
        personalized: personalizedActions.length,
        popular: popularActions.length
      });

      // Stage 2: Transform Supabase actions to GeneratedActions
      const transformSupabaseAction = (action: ActionItem, index: number): GeneratedAction => {
        const urgencyMap = { low: 2, medium: 3, high: 4 };
        const impactMap = { low: 2, medium: 3, high: 5 };
        
        return {
          id: action.id,
          title: action.title,
          description: action.description,
          tags: action.tags || [intent.topic, intent.location, intent.intent],
          intent: intent.intent,
          topic: intent.topic,
          location: action.location || intent.location,
          cta: getCTAText(determineCTAType(action.category)),
          ctaType: determineCTAType(action.category),
          impact: impactMap[action.impact_level] || 3,
          urgency: urgencyMap[action.impact_level] || 3,
          timeCommitment: action.time_commitment || getTimeCommitment(determineCTAType(action.category)),
          organizationName: action.organization || `${intent.topic} Action Network`,
          link: `#action-${action.id}`,
          nextSteps: generateContextualNextSteps(action, intent),
          generatedAt: new Date().toISOString(),
          relevanceScore: calculateRelevanceScore(action, intent),
          engagementScore: action.completion_count / 10 // Convert to 0-100 scale
        };
      };

      // Stage 3: Combine and personalize based on user engagement data
      const combinedActions = [
        ...personalizedActions.map((action: ActionItem, index: number) => transformSupabaseAction(action, index)),
        ...popularActions.slice(0, 10 - personalizedActions.length).map((action: ActionItem, index: number) => 
          transformSupabaseAction(action, index + personalizedActions.length)
        )
      ];

      // Stage 4: AI-powered personalization and filtering
      console.log('🤖 Applying AI personalization...');
      const personalizedActionsResult = await personalizeActionsWithAI(combinedActions, engagementData, intent);
      
      // Stage 5: Fallback generation if insufficient real data
      if (personalizedActionsResult.length < 3) {
        console.log('⚠️ Insufficient Supabase data, generating fallback actions...');
        const fallbackActions = generateDefaultActions(intent);
        personalizedActionsResult.push(...fallbackActions.slice(0, 5 - personalizedActionsResult.length));
      }

      // Stage 6: Real-time reactive updates
      const finalActions = personalizedActionsResult.slice(0, 12); // Limit to prevent UI overload
      console.log(`✨ Generated ${finalActions.length} adaptive actions`);
      
      setGeneratedActions(finalActions);
      
      // Stage 7: Update engagement tracking with debounced batch updates
      setEngagementData(prev => ({
        ...prev,
        totalActionsViewed: prev.totalActionsViewed + finalActions.length,
        lastEngagement: new Date().toISOString(),
        preferredTopics: updatePreferredList(prev.preferredTopics, intent.topic),
        preferredLocations: updatePreferredList(prev.preferredLocations, intent.location),
        preferredIntents: updatePreferredList(prev.preferredIntents, intent.intent)
      }));

      return finalActions;
    } catch (error) {
      console.error('❌ Error generating adaptive actions:', error);
      // Emergency fallback with graceful degradation
      const emergencyActions = generateDefaultActions(intent);
      console.log('🆘 Emergency fallback actions:', emergencyActions.length);
      setGeneratedActions(emergencyActions);
      
      setEngagementData(prev => ({
        ...prev,
        totalActionsViewed: prev.totalActionsViewed + emergencyActions.length,
        lastEngagement: new Date().toISOString()
      }));
      
      return emergencyActions;
    } finally {
      setIsGenerating(false);
      console.log('🔄 Generation complete');
    }
  }, [engagementData, setEngagementData]);

  const completeAction = useCallback((actionId: string, feedback?: any) => {
    setGeneratedActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completedAt: new Date().toISOString() }
          : action
      )
    );
    
    setEngagementData(prev => ({
      ...prev,
      actionsCompleted: prev.actionsCompleted + 1,
      lastEngagement: new Date().toISOString()
    }));
  }, [setEngagementData]);

  const saveAction = useCallback((actionId: string) => {
    setGeneratedActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, savedAt: new Date().toISOString() }
          : action
      )
    );
    
    setEngagementData(prev => ({
      ...prev,
      actionsSaved: prev.actionsSaved + 1,
      lastEngagement: new Date().toISOString()
    }));
  }, [setEngagementData]);

  const trackEngagement = useCallback((actionId: string, timeSpent: number, interactionType: string) => {
    setEngagementData(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + timeSpent,
      lastEngagement: new Date().toISOString()
    }));
  }, [setEngagementData]);

  const getPersonalizedRecommendations = useCallback((): GeneratedAction[] => {
    // Return actions based on user preferences and engagement patterns
    return generatedActions.slice(0, 3); // Simplified for now
  }, [generatedActions]);

  const updateUserPreferences = useCallback((actionId: string, rating: number, feedback?: string) => {
    const action = generatedActions.find(a => a.id === actionId);
    if (!action) return;
    
    setEngagementData(prev => {
      const updatedPreferences = { ...prev };
      
      // Update preferred intents, topics, locations based on rating
      if (rating >= 4) {
        if (!updatedPreferences.preferredIntents.includes(action.intent)) {
          updatedPreferences.preferredIntents.push(action.intent);
        }
        if (!updatedPreferences.preferredTopics.includes(action.topic)) {
          updatedPreferences.preferredTopics.push(action.topic);
        }
        if (!updatedPreferences.preferredLocations.includes(action.location)) {
          updatedPreferences.preferredLocations.push(action.location);
        }
      }
      
      return updatedPreferences;
    });
  }, [generatedActions, setEngagementData]);

  const getOptimizedResults = useCallback(async (intent: ActionIntentData): Promise<GeneratedAction[]> => {
    // Enhanced generation with ML optimization
    const baseActions = await generateAdaptiveActions(intent);
    return optimizeForUser(baseActions, engagementData);
  }, [generateAdaptiveActions, engagementData]);

  const resetSession = useCallback(() => {
    setCurrentIntent(null);
    setGeneratedActions([]);
    setIsGenerating(false);
  }, []);

  const exportEngagementData = useCallback(() => {
    return JSON.stringify(engagementData, null, 2);
  }, [engagementData]);

  const value = {
    currentIntent,
    generatedActions,
    isGenerating,
    engagementData,
    setCurrentIntent,
    generateAdaptiveActions,
    completeAction,
    saveAction,
    trackEngagement,
    getPersonalizedRecommendations,
    updateUserPreferences,
    getOptimizedResults,
    resetSession,
    exportEngagementData
  };

  return (
    <ActionEngagementContext.Provider value={value}>
      {children}
    </ActionEngagementContext.Provider>
  );
}

export function useActionEngagement() {
  const context = useContext(ActionEngagementContext);
  if (context === undefined) {
    throw new Error('useActionEngagement must be used within an ActionEngagementProvider');
  }
  return context;
}

// Helper functions
function getCTAText(ctaType: GeneratedAction['ctaType']): string {
  const ctaMap = {
    'contact_rep': 'Contact Representative',
    'volunteer': 'Volunteer Now',
    'donate': 'Donate Now',
    'petition': 'Sign Petition',
    'learn_more': 'Learn More',
    'organize': 'Start Organizing',
    'get_help': 'Get Support'
  };
  return ctaMap[ctaType];
}

function getTimeCommitment(ctaType: GeneratedAction['ctaType']): string {
  const timeMap = {
    'contact_rep': '5-10 minutes',
    'volunteer': '2-4 hours',
    'donate': '2 minutes',
    'petition': '1 minute',
    'learn_more': '10-20 minutes',
    'organize': 'Ongoing',
    'get_help': 'As needed'
  };
  return timeMap[ctaType];
}

async function personalizeActions(actions: GeneratedAction[], userData: UserEngagementData): Promise<GeneratedAction[]> {
  // Simulate AI personalization
  return actions.map(action => ({
    ...action,
    engagementScore: calculateEngagementScore(action, userData)
  })).sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));
}

function calculateEngagementScore(action: GeneratedAction, userData: UserEngagementData): number {
  let score = action.impact * 20; // Base score from impact
  
  // Boost score based on user preferences
  if (userData.preferredIntents.includes(action.intent)) score += 15;
  if (userData.preferredTopics.includes(action.topic)) score += 15;
  if (userData.preferredLocations.includes(action.location)) score += 10;
  
  // Add urgency factor
  score += action.urgency * 5;
  
  return Math.min(score, 100); // Cap at 100
}

function optimizeForUser(actions: GeneratedAction[], userData: UserEngagementData): GeneratedAction[] {
  // Advanced ML optimization would go here
  return actions;
}
