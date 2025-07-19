"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

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
    return [
      {
        id: `default-${intent.intent}-${Date.now()}`,
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
      }
    ];
  };

  const generateAdaptiveActions = useCallback(async (intent: ActionIntentData): Promise<GeneratedAction[]> => {
    setIsGenerating(true);
    console.log('🎯 Generating actions for:', intent);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Normalize intent name (handle both spaces and underscores)
      const normalizedIntent = intent.intent.replace(/_/g, ' ');
      console.log('🔄 Normalized intent:', normalizedIntent);
      
      const generator = ACTION_GENERATORS[normalizedIntent as keyof typeof ACTION_GENERATORS];
      
      if (!generator) {
        console.warn(`No generator found for intent: ${intent.intent}, falling back to default`);
        // Fallback to a default generator
        const fallbackActions = generateDefaultActions(intent);
        setGeneratedActions(fallbackActions);
        setEngagementData(prev => ({
          ...prev,
          totalActionsViewed: prev.totalActionsViewed + fallbackActions.length,
          lastEngagement: new Date().toISOString()
        }));
        return fallbackActions;
      }
      
      console.log('✅ Generator found, generating actions...');
      const { ctaType, templates } = generator(intent.topic, intent.location);
      
      const actions: GeneratedAction[] = templates.map((template, index) => ({
        id: `${intent.intent}-${intent.topic}-${Date.now()}-${index}`,
        title: template.title,
        description: template.description,
        tags: [intent.topic, intent.location, intent.intent],
        intent: intent.intent,
        topic: intent.topic,
        location: intent.location,
        cta: getCTAText(ctaType),
        ctaType,
        impact: Math.floor(Math.random() * 3) + 3, // 3-5 range
        urgency: Math.floor(Math.random() * 3) + 2, // 2-4 range
        timeCommitment: getTimeCommitment(ctaType),
        organizationName: `${intent.topic} Action Network`,
        template: template.template,
        eventDetails: template.eventDetails,
        resourceLinks: template.resourceLinks,
        socialShareData: {
          title: template.title,
          message: `Take action on ${intent.topic} in ${intent.location}!`,
          hashtags: [`#${intent.topic.replace(/\s+/g, '')}`, '#CivicAction', '#ScienceForAction']
        },
        nextSteps: template.nextSteps || [
          `Research current ${intent.topic} policies`,
          `Connect with local advocates`,
          `Plan follow-up actions`
        ],
        generatedAt: new Date().toISOString(),
        link: template.link
      }));
      
      console.log(`📊 Generated ${actions.length} base actions`);
      
      // Add personalization based on user history
      const personalizedActions = await personalizeActions(actions, engagementData);
      
      console.log(`✨ Personalized to ${personalizedActions.length} actions`);
      
      setGeneratedActions(personalizedActions);
      
      // Update engagement tracking
      setEngagementData(prev => ({
        ...prev,
        totalActionsViewed: prev.totalActionsViewed + personalizedActions.length,
        lastEngagement: new Date().toISOString()
      }));
      
      return personalizedActions;
    } catch (error) {
      console.error('❌ Error generating actions:', error);
      // Fallback to default actions even if there's an error
      const fallbackActions = generateDefaultActions(intent);
      setGeneratedActions(fallbackActions);
      setEngagementData(prev => ({
        ...prev,
        totalActionsViewed: prev.totalActionsViewed + fallbackActions.length,
        lastEngagement: new Date().toISOString()
      }));
      return fallbackActions;
    } finally {
      setIsGenerating(false);
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
