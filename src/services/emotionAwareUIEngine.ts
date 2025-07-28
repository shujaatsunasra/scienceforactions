"use client";

import { useState, useEffect } from 'react';

// Interface for user behavior tracking
export interface UserBehaviorData {
  sessionDuration: number;
  interactionCount: number;
  scrollDepth: number;
  clickPatterns: string[];
  dwellTime: { [key: string]: number };
  frustrationSignals: number;
  engagementLevel: 'low' | 'medium' | 'high';
  preferredContentTypes: string[];
  timeOfDay: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

// Interface for adaptive UI responses
export interface AdaptiveUIState {
  layoutComplexity: 'minimal' | 'standard' | 'detailed';
  animationIntensity: 'none' | 'subtle' | 'moderate' | 'vibrant';
  colorScheme: 'warm' | 'cool' | 'neutral' | 'high-contrast';
  contentDensity: 'sparse' | 'normal' | 'dense';
  interactionHints: boolean;
  autoSuggest: boolean;
  predictiveActions: string[];
  personalizedContent: any[];
}

class EmotionAwareUIEngine {
  private behaviorData: UserBehaviorData;
  private uiState: AdaptiveUIState;
  private listeners: ((state: AdaptiveUIState) => void)[] = [];
  private sessionStartTime: number;
  private currentScrollDepth: number = 0;
  private interactionCount: number = 0;
  private frustrationSignals: number = 0;

  constructor() {
    this.sessionStartTime = Date.now();
    
    // Initialize default behavior data
    this.behaviorData = {
      sessionDuration: 0,
      interactionCount: 0,
      scrollDepth: 0,
      clickPatterns: [],
      dwellTime: {},
      frustrationSignals: 0,
      engagementLevel: 'medium',
      preferredContentTypes: [],
      timeOfDay: this.getTimeOfDay(),
      deviceType: this.getDeviceType()
    };

    // Initialize default UI state
    this.uiState = {
      layoutComplexity: 'standard',
      animationIntensity: 'moderate',
      colorScheme: 'neutral',
      contentDensity: 'normal',
      interactionHints: false,
      autoSuggest: true,
      predictiveActions: [],
      personalizedContent: []
    };

    this.initializeTracking();
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Track clicks and interactions
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Track mouse movement patterns
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Track focus patterns
    document.addEventListener('focusin', this.handleFocus.bind(this));
    
    // Periodic analysis
    setInterval(() => this.analyzeAndAdapt(), 5000);
  }

  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.currentScrollDepth = Math.max(this.currentScrollDepth, (scrollTop / scrollHeight) * 100);
    
    this.behaviorData.scrollDepth = this.currentScrollDepth;
  }

  private handleClick(event: MouseEvent): void {
    this.interactionCount++;
    this.behaviorData.interactionCount = this.interactionCount;
    
    const target = event.target as HTMLElement;
    const elementType = target.tagName.toLowerCase();
    const className = target.className;
    
    // Track click patterns
    const pattern = `${elementType}:${className}`;
    this.behaviorData.clickPatterns.push(pattern);
    
    // Keep only last 20 patterns
    if (this.behaviorData.clickPatterns.length > 20) {
      this.behaviorData.clickPatterns.shift();
    }

    // Detect potential frustration (rapid clicks in same area)
    this.detectFrustration(event);
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Track escape key as frustration signal
    if (event.key === 'Escape') {
      this.frustrationSignals++;
      this.behaviorData.frustrationSignals = this.frustrationSignals;
    }
    
    // Track typing speed and patterns
    this.interactionCount++;
    this.behaviorData.interactionCount = this.interactionCount;
  }

  private handleMouseMove(event: MouseEvent): void {
    // Track erratic mouse movements (potential frustration)
    // This could be expanded with more sophisticated analysis
  }

  private handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const elementId = target.id || target.className;
    
    // Track dwell time on elements
    const startTime = Date.now();
    const cleanup = () => {
      const dwellTime = Date.now() - startTime;
      this.behaviorData.dwellTime[elementId] = dwellTime;
    };
    
    target.addEventListener('blur', cleanup, { once: true });
  }

  private detectFrustration(event: MouseEvent): void {
    // Simple frustration detection based on rapid clicks
    const now = Date.now();
    const recentClicks = this.behaviorData.clickPatterns.slice(-5);
    
    if (recentClicks.length >= 3) {
      // Check for rapid repeated clicks (potential frustration)
      const timeWindow = 2000; // 2 seconds
      if (now - this.sessionStartTime < timeWindow) {
        this.frustrationSignals++;
        this.behaviorData.frustrationSignals = this.frustrationSignals;
      }
    }
  }

  private analyzeAndAdapt(): void {
    // Update session duration
    this.behaviorData.sessionDuration = Date.now() - this.sessionStartTime;
    
    // Analyze engagement level
    this.analyzeEngagementLevel();
    
    // Adapt UI based on behavior
    this.adaptUIToUserBehavior();
    
    // Notify listeners of changes
    this.notifyListeners();
  }

  private analyzeEngagementLevel(): void {
    const sessionMinutes = this.behaviorData.sessionDuration / (1000 * 60);
    const interactionsPerMinute = sessionMinutes > 0 ? this.behaviorData.interactionCount / sessionMinutes : 0;
    const scrollEngagement = this.behaviorData.scrollDepth / 100;
    
    // Calculate engagement score
    let engagementScore = 0;
    
    if (interactionsPerMinute > 5) engagementScore += 30;
    else if (interactionsPerMinute > 2) engagementScore += 20;
    else if (interactionsPerMinute > 1) engagementScore += 10;
    
    if (scrollEngagement > 0.8) engagementScore += 25;
    else if (scrollEngagement > 0.5) engagementScore += 15;
    else if (scrollEngagement > 0.2) engagementScore += 8;
    
    if (sessionMinutes > 10) engagementScore += 20;
    else if (sessionMinutes > 5) engagementScore += 10;
    else if (sessionMinutes > 2) engagementScore += 5;
    
    // Subtract for frustration signals
    engagementScore -= this.behaviorData.frustrationSignals * 10;
    
    // Determine engagement level
    if (engagementScore >= 50) {
      this.behaviorData.engagementLevel = 'high';
    } else if (engagementScore >= 25) {
      this.behaviorData.engagementLevel = 'medium';
    } else {
      this.behaviorData.engagementLevel = 'low';
    }
  }

  private adaptUIToUserBehavior(): void {
    const newState = { ...this.uiState };
    
    // Adapt based on engagement level
    switch (this.behaviorData.engagementLevel) {
      case 'low':
        newState.layoutComplexity = 'minimal';
        newState.animationIntensity = 'subtle';
        newState.interactionHints = true;
        newState.autoSuggest = true;
        newState.contentDensity = 'sparse';
        break;
        
      case 'medium':
        newState.layoutComplexity = 'standard';
        newState.animationIntensity = 'moderate';
        newState.interactionHints = false;
        newState.autoSuggest = true;
        newState.contentDensity = 'normal';
        break;
        
      case 'high':
        newState.layoutComplexity = 'detailed';
        newState.animationIntensity = 'vibrant';
        newState.interactionHints = false;
        newState.autoSuggest = false;
        newState.contentDensity = 'dense';
        break;
    }
    
    // Adapt based on frustration signals
    if (this.behaviorData.frustrationSignals > 3) {
      newState.layoutComplexity = 'minimal';
      newState.animationIntensity = 'none';
      newState.interactionHints = true;
      newState.contentDensity = 'sparse';
    }
    
    // Adapt based on device type
    if (this.behaviorData.deviceType === 'mobile') {
      newState.contentDensity = 'sparse';
      newState.layoutComplexity = 'minimal';
    }
    
    // Adapt based on time of day
    if (this.behaviorData.timeOfDay === 'evening') {
      newState.colorScheme = 'warm';
      newState.animationIntensity = 'subtle';
    } else if (this.behaviorData.timeOfDay === 'night') {
      newState.colorScheme = 'cool';
      newState.animationIntensity = 'none';
    }
    
    // Generate predictive actions based on click patterns
    newState.predictiveActions = this.generatePredictiveActions();
    
    this.uiState = newState;
  }

  private generatePredictiveActions(): string[] {
    const actions = [];
    const patterns = this.behaviorData.clickPatterns;
    
    // Analyze patterns and suggest next actions
    if (patterns.includes('button:filter')) {
      actions.push('Show more filter options');
      actions.push('Save current filters');
    }
    
    if (patterns.includes('a:action-link')) {
      actions.push('Show similar actions');
      actions.push('Join related cause');
    }
    
    if (this.behaviorData.scrollDepth > 80) {
      actions.push('Load more content');
      actions.push('Return to top');
    }
    
    return actions.slice(0, 3); // Limit to 3 suggestions
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.uiState));
  }

  // Public methods
  public subscribe(listener: (state: AdaptiveUIState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public getCurrentState(): AdaptiveUIState {
    return { ...this.uiState };
  }

  public getBehaviorData(): UserBehaviorData {
    return { ...this.behaviorData };
  }

  public forceAdaptation(): void {
    this.analyzeAndAdapt();
  }

  public reset(): void {
    this.sessionStartTime = Date.now();
    this.currentScrollDepth = 0;
    this.interactionCount = 0;
    this.frustrationSignals = 0;
    
    this.behaviorData = {
      sessionDuration: 0,
      interactionCount: 0,
      scrollDepth: 0,
      clickPatterns: [],
      dwellTime: {},
      frustrationSignals: 0,
      engagementLevel: 'medium',
      preferredContentTypes: [],
      timeOfDay: this.getTimeOfDay(),
      deviceType: this.getDeviceType()
    };
  }

  public destroy(): void {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    document.removeEventListener('click', this.handleClick.bind(this));
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('focusin', this.handleFocus.bind(this));
  }
}

// Export singleton instance
export const emotionAwareUI = new EmotionAwareUIEngine();
export default emotionAwareUI;

// React hook for using emotion-aware UI
export function useEmotionAwareUI() {
  const [uiState, setUIState] = useState<AdaptiveUIState>(emotionAwareUI.getCurrentState());
  const [behaviorData, setBehaviorData] = useState<UserBehaviorData>(emotionAwareUI.getBehaviorData());

  useEffect(() => {
    const unsubscribe = emotionAwareUI.subscribe((newState) => {
      setUIState(newState);
      setBehaviorData(emotionAwareUI.getBehaviorData());
    });

    // Initial state sync
    setUIState(emotionAwareUI.getCurrentState());
    setBehaviorData(emotionAwareUI.getBehaviorData());

    return unsubscribe;
  }, []);

  return {
    uiState,
    behaviorData,
    forceAdaptation: () => emotionAwareUI.forceAdaptation(),
    reset: () => emotionAwareUI.reset()
  };
}

