"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';
import { 
  aiService, 
  AIContext, 
  GeneratedContent, 
  AdaptiveLayoutConfig,
  UserInteraction 
} from '@/services/ai/AIIntelligenceService';
import { ExploreItem } from '@/context/ExploreContext';

// Main AI Hook for component-level intelligence
export function useAIIntelligence() {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [aiContent, setAiContent] = useState<Map<string, GeneratedContent>>(new Map());
  const [layoutConfig, setLayoutConfig] = useState<AdaptiveLayoutConfig | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [personalizedMessages, setPersonalizedMessages] = useState<string[]>([]);
  const { profile } = useProfile();
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Update AI context when profile or path changes (with debouncing)
  useEffect(() => {
    if (!profile) return;
    
    const timeoutId = setTimeout(() => {
      aiService.updateContext({
        user: profile,
        currentPath: pathname,
        sessionDuration: Date.now() - (performance.timeOrigin || Date.now())
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [profile?.id, pathname]); // Only depend on profile.id to prevent infinite loops

  // Set up interaction tracking
  useEffect(() => {
    if (!isAIEnabled) return;

    // Track scroll interactions
    const handleScroll = () => {
      aiService.recordInteraction('scroll', pathname, { scrollY: window.scrollY });
    };

    // Track visibility changes
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aiService.recordInteraction('view', entry.target.id || 'unknown', {
            visibilityRatio: entry.intersectionRatio
          });
        }
      });
    }, { threshold: [0.1, 0.5, 0.9] });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRef.current?.disconnect();
    };
  }, [isAIEnabled, pathname]);

  // AI-powered interaction tracker (with proper error handling)
  const trackAIInteraction = useCallback(async (
    type: UserInteraction['type'], 
    target: string, 
    context: Record<string, any> = {}
  ) => {
    if (!isAIEnabled) return;

    try {
      setIsLoading(true);
      const result = await Promise.race([
        aiService.analyzeAndRecommend(type, target),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 5000))
      ]) as any;
      
      setRecommendations(result.nextBestActions || []);
      setLayoutConfig(result.uiAdaptations || null);
      setPersonalizedMessages(result.personalizedMessages || []);
      
      // Update content map (prevent memory leaks)
      const updatedContent = new Map(aiContent);
      if (result.generatedContent) {
        result.generatedContent.forEach((content: any, index: number) => {
          updatedContent.set(`${target}_${index}`, content);
        });
        // Limit cache size
        if (updatedContent.size > 50) {
          const keys = Array.from(updatedContent.keys());
          keys.slice(0, 25).forEach(key => updatedContent.delete(key));
        }
        setAiContent(updatedContent);
      }
      
    } catch (error) {
      console.warn('AI interaction tracking failed:', error);
      // Set fallback state
      setRecommendations([]);
      setPersonalizedMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAIEnabled]); // Remove aiContent dependency to prevent infinite loops

  // Generate adaptive content for components (with timeout and caching)
  const generateContent = useCallback(async (
    componentType: string, 
    context: Record<string, any> = {}
  ): Promise<GeneratedContent> => {
    if (!isAIEnabled) {
      return {
        type: 'suggestion',
        content: 'Content loading...',
        confidence: 0,
        reasoning: 'AI disabled',
        fallback: 'Static content',
        metadata: {}
      };
    }

    try {
      const content = await Promise.race([
        aiService.generateAdaptiveContent(componentType, context),
        new Promise<GeneratedContent>((_, reject) => 
          setTimeout(() => reject(new Error('Content generation timeout')), 3000)
        )
      ]);
      
      return content;
    } catch (error) {
      console.warn(`Content generation failed for ${componentType}:`, error);
      return {
        type: 'suggestion',
        content: 'Content unavailable',
        confidence: 0,
        reasoning: 'Generation failed',
        fallback: 'Please try again later',
        metadata: {}
      };
    }
  }, [isAIEnabled]); // Remove aiContent dependency

  // Observer for automatic element tracking
  const observeElement = useCallback((element: HTMLElement | null) => {
    if (!element || !observerRef.current) return;
    observerRef.current.observe(element);
  }, []);

  return {
    // State
    isAIEnabled,
    isLoading,
    aiContent,
    layoutConfig,
    recommendations,
    personalizedMessages,
    
    // Actions
    trackAIInteraction,
    generateContent,
    observeElement,
    setIsAIEnabled,
    
    // Utilities
    hasRecommendations: recommendations.length > 0,
    getContentForComponent: (componentType: string) => {
      for (const [key, content] of aiContent) {
        if (key.startsWith(componentType)) return content;
      }
      return null;
    }
  };
}

// Specialized hooks for specific AI features

// Hook for AI-powered Explore feed
export function useAIExploreFeed() {
  const [optimizedItems, setOptimizedItems] = useState<ExploreItem[]>([]);
  const [explanations, setExplanations] = useState<Map<string, string>>(new Map());
  const [quickActions, setQuickActions] = useState<Map<string, string[]>>(new Map());
  const [autoSummaries, setAutoSummaries] = useState<Map<string, string>>(new Map());
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeFeed = useCallback(async (items: ExploreItem[]) => {
    if (!items.length) return;

    try {
      setIsOptimizing(true);
      const result = await aiService.optimizeExploreFeed(items);
      
      setOptimizedItems(result.rankedItems);
      setExplanations(result.explanations);
      setQuickActions(result.quickActions);
      setAutoSummaries(result.autoSummaries);
    } catch (error) {
      console.error('Feed optimization failed:', error);
      setOptimizedItems(items);
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return {
    optimizedItems,
    explanations,
    quickActions,
    autoSummaries,
    isOptimizing,
    optimizeFeed
  };
}

// Hook for AI-enhanced profile management
export function useAIProfile() {
  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);
  const [autoFillData, setAutoFillData] = useState({});
  const [impactSummary, setImpactSummary] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [shareableContent, setShareableContent] = useState<any>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhanceProfile = useCallback(async (profile: any) => {
    try {
      setIsEnhancing(true);
      const result = await aiService.enhanceProfile(profile);
      
      setProfileSuggestions(result.suggestions);
      setAutoFillData(result.autoFillData);
      setImpactSummary(result.impactSummary);
      setAchievements(result.achievements);
      setShareableContent(result.shareableContent);
    } catch (error) {
      console.error('Profile enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  return {
    profileSuggestions,
    autoFillData,
    impactSummary,
    achievements,
    shareableContent,
    isEnhancing,
    enhanceProfile
  };
}

// Hook for AI admin insights
export function useAIAdminInsights() {
  const [systemSummary, setSystemSummary] = useState('');
  const [flaggedIssues, setFlaggedIssues] = useState<string[]>([]);
  const [predictiveSuggestions, setPredictiveSuggestions] = useState<string[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<Map<string, string>>(new Map());
  const [performanceOptimizations, setPerformanceOptimizations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = useCallback(async () => {
    try {
      setIsGenerating(true);
      const result = await aiService.generateAdminInsights();
      
      setSystemSummary(result.systemSummary);
      setFlaggedIssues(result.flaggedIssues);
      setPredictiveSuggestions(result.predictiveSuggestions);
      setContentSuggestions(result.contentSuggestions);
      setPerformanceOptimizations(result.performanceOptimizations);
    } catch (error) {
      console.error('Admin insights generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Auto-generate insights periodically
  useEffect(() => {
    generateInsights();
    const interval = setInterval(generateInsights, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [generateInsights]);

  return {
    systemSummary,
    flaggedIssues,
    predictiveSuggestions,
    contentSuggestions,
    performanceOptimizations,
    isGenerating,
    generateInsights,
    refreshInsights: generateInsights
  };
}

// Performance monitoring hook for AI features
export function useAIPerformance() {
  const [metrics, setMetrics] = useState<Map<string, number>>(new Map());
  const [errorRate, setErrorRate] = useState(0);
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would collect real performance metrics
      setMetrics(new Map([
        ['ai_response_time', Math.random() * 100 + 50],
        ['content_generation_success_rate', 0.95 + Math.random() * 0.05],
        ['cache_hit_rate', 0.8 + Math.random() * 0.2]
      ]));
      
      setErrorRate(Math.random() * 0.05);
      setResponseTime(50 + Math.random() * 100);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    errorRate,
    responseTime,
    isHealthy: errorRate < 0.05 && responseTime < 200
  };
}
