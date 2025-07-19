"use client";

import { UserProfile } from '@/lib/supabase';
import { ExploreItem } from '@/context/ExploreContext';

// Safe AI service with fallbacks and timeout protection
export interface GeneratedContent {
  type: 'summary' | 'explanation' | 'suggestion' | 'action' | 'narrative';
  content: string;
  confidence: number;
  reasoning: string;
  fallback: string;
  metadata: Record<string, any>;
}

export interface AdaptiveLayoutConfig {
  priorityComponents: string[];
  componentOrder: string[];
  emphasizedElements: string[];
  hiddenElements: string[];
  colorScheme: 'default' | 'high-contrast' | 'warm' | 'cool';
  density: 'compact' | 'comfortable' | 'spacious';
}

export interface UserInteraction {
  id: string;
  type: 'click' | 'hover' | 'scroll' | 'form_submit' | 'search' | 'share';
  target: string;
  timestamp: Date;
  context: Record<string, any>;
  sentiment?: 'positive' | 'neutral' | 'negative';
  engagement_score: number;
}

class SafeAIService {
  private fallbackContent: Map<string, string> = new Map();
  private cache: Map<string, any> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.setupFallbacks();
  }

  private setupFallbacks(): void {
    this.fallbackContent.set('action_suggestions', 'Take meaningful action in your community');
    this.fallbackContent.set('local_impact_statement', 'Your voice can make a real difference in your local community');
    this.fallbackContent.set('personalized_tips', 'Start with small actions that align with your interests');
    this.fallbackContent.set('action_intent_analysis', 'This action can help create positive change');
    this.fallbackContent.set('action_generated_text', 'I am writing to express my support for important environmental and social causes');
    this.fallbackContent.set('action_form_text', 'Thank you for your attention to these important matters');
  }

  // Safe content generation with timeout and fallbacks
  async generateAdaptiveContent(componentType: string, context: Record<string, any> = {}): Promise<GeneratedContent> {
    const cacheKey = `${componentType}_${JSON.stringify(context).slice(0, 100)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Simulate AI generation with timeout
      const content = await Promise.race([
        this.generateContentSafely(componentType, context),
        this.timeoutPromise(1500) // 1.5 second timeout
      ]);

      // Cache result (limit cache size)
      if (this.cache.size > 50) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }
      this.cache.set(cacheKey, content);

      return content;
    } catch (error) {
      console.warn(`AI content generation failed for ${componentType}, using fallback:`, error);
      return this.getFallbackContent(componentType);
    }
  }

  private async generateContentSafely(componentType: string, context: Record<string, any>): Promise<GeneratedContent> {
    // Immediate fallback response to prevent blocking
    const fallbackText = this.fallbackContent.get(componentType) || 'Content loading...';
    
    // Simulate AI processing (replace with real AI calls in production)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

    switch (componentType) {
      case 'action_suggestions':
        return {
          type: 'suggestion',
          content: this.generateActionSuggestions(context),
          confidence: 0.85,
          reasoning: 'Based on user profile and interests',
          fallback: fallbackText,
          metadata: { source: 'ai_generated' }
        };

      case 'local_impact_statement':
        return {
          type: 'explanation',
          content: this.generateLocalImpact(context),
          confidence: 0.80,
          reasoning: 'Localized impact analysis',
          fallback: fallbackText,
          metadata: { location: context.location }
        };

      case 'action_generated_text':
        return {
          type: 'action',
          content: this.generateActionText(context),
          confidence: 0.90,
          reasoning: 'Personalized action template',
          fallback: fallbackText,
          metadata: { actionType: context.actionType }
        };

      default:
        return this.getFallbackContent(componentType);
    }
  }

  private generateActionSuggestions(context: Record<string, any>): string {
    const { userInterests = [], location = 'your community' } = context;
    const interests = userInterests.slice(0, 3);
    
    if (interests.length > 0) {
      return `Based on your interests in ${interests.join(', ')}, here are personalized actions you can take in ${location} to make a positive impact.`;
    }
    
    return `Discover meaningful ways to create positive change in ${location} through civic engagement and community action.`;
  }

  private generateLocalImpact(context: Record<string, any>): string {
    const { location = 'your area', userEngagement = 0 } = context;
    
    if (userEngagement > 5) {
      return `Your continued engagement in ${location} is building momentum for positive change. Keep up the great work!`;
    } else if (userEngagement > 0) {
      return `Your actions in ${location} are contributing to a growing movement for positive change.`;
    }
    
    return `Taking action in ${location} can create ripple effects that benefit your entire community.`;
  }

  private generateActionText(context: Record<string, any>): string {
    const { actionType, userLocation = 'my community', userInterests = [] } = context;
    
    const templates = {
      contact_rep: `I am writing as a constituent from ${userLocation} to urge your support for policies that address climate change and environmental protection. These issues are crucial for our community's future.`,
      social_share: `I'm taking action on environmental issues that matter to our community. Join me in making a difference! #ClimateAction #Community`,
      volunteer: `I'm interested in volunteering for environmental causes in ${userLocation}. Together, we can create meaningful change.`,
      petition_sign: `I strongly support this initiative and encourage others in ${userLocation} to join this important cause.`,
      local_event: `Looking for environmental events and activities in ${userLocation}. Community engagement is key to lasting change.`,
      donate: `Supporting organizations that are working to address environmental challenges and create sustainable solutions.`
    };
    
    return templates[actionType as keyof typeof templates] || 
           `I'm committed to taking action on important issues affecting ${userLocation} and our broader community.`;
  }

  private getFallbackContent(componentType: string): GeneratedContent {
    return {
      type: 'suggestion',
      content: this.fallbackContent.get(componentType) || 'Content temporarily unavailable',
      confidence: 0.5,
      reasoning: 'Fallback content',
      fallback: 'Please try again later',
      metadata: { fallback: true }
    };
  }

  private timeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI generation timeout')), ms)
    );
  }

  // Safe interaction tracking
  async analyzeAndRecommend(type: string, target: string): Promise<{
    nextBestActions: string[];
    uiAdaptations: AdaptiveLayoutConfig;
    generatedContent: GeneratedContent[];
    personalizedMessages: string[];
  }> {
    try {
      // Quick fallback response
      const fallbackResponse = {
        nextBestActions: ['explore_more', 'take_action', 'share_impact'],
        uiAdaptations: {
          priorityComponents: ['action_tool', 'results'],
          componentOrder: ['header', 'content', 'actions'],
          emphasizedElements: [target],
          hiddenElements: [],
          colorScheme: 'default' as const,
          density: 'comfortable' as const
        },
        generatedContent: [],
        personalizedMessages: ['Keep up the great work!', 'Your actions make a difference.']
      };

      // Return immediately to prevent blocking
      return fallbackResponse;
    } catch (error) {
      console.warn('AI analysis failed:', error);
      return {
        nextBestActions: [],
        uiAdaptations: {
          priorityComponents: [],
          componentOrder: [],
          emphasizedElements: [],
          hiddenElements: [],
          colorScheme: 'default',
          density: 'comfortable'
        },
        generatedContent: [],
        personalizedMessages: []
      };
    }
  }

  // Safe context updating
  updateContext(context: any): void {
    // Non-blocking context update
    setTimeout(() => {
      try {
        // Update context in background
        console.log('AI context updated:', context);
      } catch (error) {
        console.warn('Context update failed:', error);
      }
    }, 0);
  }

  // Safe interaction recording
  recordInteraction(type: string, target: string, context: Record<string, any> = {}): void {
    // Non-blocking interaction recording
    setTimeout(() => {
      try {
        console.log('Interaction recorded:', { type, target, context });
      } catch (error) {
        console.warn('Interaction recording failed:', error);
      }
    }, 0);
  }
}

// Export singleton instance
export const safeAIService = new SafeAIService();
