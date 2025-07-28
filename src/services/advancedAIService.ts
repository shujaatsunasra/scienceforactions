import { supabaseUserService, EnhancedUserProfile } from '@/services/supabaseUserService';
import { UserProfile, ActionItem } from '@/lib/supabase';

// Enhanced AI intelligence service with Supabase integration
export interface AIRecommendation {
  id: string;
  type: 'action' | 'profile_improvement' | 'engagement' | 'community';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  estimated_impact: number;
  metadata: Record<string, any>;
}

export interface AIInsight {
  insight_type: 'behavioral' | 'engagement' | 'impact' | 'trend';
  title: string;
  description: string;
  data_points: Array<{
    label: string;
    value: number | string;
    trend?: 'up' | 'down' | 'stable';
  }>;
  actionable_items: string[];
  confidence_score: number;
}

export interface AIPersonalizationEngine {
  user_segment: 'new_user' | 'casual_user' | 'active_user' | 'power_user' | 'at_risk';
  engagement_prediction: number;
  churn_risk: number;
  next_best_actions: ActionItem[];
  personalized_content: {
    hero_message: string;
    call_to_action: string;
    motivational_quote: string;
    progress_message: string;
  };
  ui_preferences: {
    layout: 'minimal' | 'standard' | 'detailed';
    color_scheme: 'warm' | 'cool' | 'neutral' | 'high_contrast';
    animation_level: 'none' | 'subtle' | 'moderate' | 'dynamic';
    information_density: 'low' | 'medium' | 'high';
  };
}

class AdvancedAIIntelligenceService {
  private readonly models = {
    engagement: {
      weights: { recency: 0.3, frequency: 0.4, depth: 0.3 },
      thresholds: { low: 0.3, medium: 0.6, high: 0.8 },
    },
    personalization: {
      segments: {
        new_user: { max_actions: 2, max_days: 7 },
        casual_user: { max_actions: 10, max_days: 30 },
        active_user: { max_actions: 50, max_days: 90 },
        power_user: { min_actions: 50 },
      },
    },
    content: {
      templates: {
        motivational: [
          "Your actions are creating real change in the world!",
          "Every step counts towards a better tomorrow.",
          "You're part of a growing movement for positive change.",
          "Your commitment to action inspires others to follow.",
        ],
        progress: [
          "You've completed {count} actions this month!",
          "Your impact score has increased by {percent}%",
          "You're in the top {percentile}% of engaged users",
          "You've supported {orgs} different organizations",
        ],
        calls_to_action: [
          "Ready to take your next action?",
          "Find actions that match your passions",
          "Explore opportunities in your area",
          "Join others making a difference",
        ],
      },
    },
  };

  // === USER ANALYSIS AND PERSONALIZATION ===

  async analyzeUser(userId: string): Promise<AIPersonalizationEngine | null> {
    try {
      const user = await supabaseUserService.getUserById(userId);
      if (!user) return null;

      const userSegment = this.classifyUserSegment(user);
      const engagementPrediction = this.calculateEngagementPrediction(user);
      const churnRisk = this.calculateChurnRisk(user);
      const nextBestActions = await this.generateNextBestActions(user);
      const personalizedContent = this.generatePersonalizedContent(user);
      const uiPreferences = this.generateUIPreferences(user);

      return {
        user_segment: userSegment,
        engagement_prediction: engagementPrediction,
        churn_risk: churnRisk,
        next_best_actions: nextBestActions,
        personalized_content: personalizedContent,
        ui_preferences: uiPreferences,
      };
    } catch (error) {
      // Production: debug output removed
      return null;
    }
  }

  async generateRecommendations(userId: string): Promise<AIRecommendation[]> {
    try {
      const user = await supabaseUserService.getUserById(userId);
      if (!user) return [];

      const recommendations: AIRecommendation[] = [];

      // Profile completion recommendations
      if (user.profile_completion < 100) {
        recommendations.push(this.createProfileCompletionRecommendation(user));
      }

      // Action recommendations based on interests
      const actionRecs = await this.generateActionRecommendations(user);
      recommendations.push(...actionRecs);

      // Engagement recommendations
      const engagementRecs = this.generateEngagementRecommendations(user);
      recommendations.push(...engagementRecs);

      // Community recommendations
      const communityRecs = await this.generateCommunityRecommendations(user);
      recommendations.push(...communityRecs);

      return recommendations.sort((a, b) => {
        // Sort by priority and confidence
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        if (a.priority !== b.priority) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.confidence - a.confidence;
      });
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }

  async generateSystemInsights(): Promise<AIInsight[]> {
    try {
      const insights: AIInsight[] = [];

      // User engagement insights
      const engagementStats = await supabaseUserService.getEngagementStats();
      insights.push({
        insight_type: 'engagement',
        title: 'User Engagement Overview',
        description: 'Analysis of user activity and engagement patterns',
        data_points: [
          { label: 'Total Users', value: engagementStats.total_users },
          { label: 'Active Users', value: engagementStats.active_users },
          { label: 'Completion Rate', value: `${engagementStats.completion_rate.toFixed(1)}%` },
          { label: 'New Users (7d)', value: engagementStats.new_users_this_week },
        ],
        actionable_items: [
          'Focus on user retention strategies',
          'Improve action completion flow',
          'Enhance new user onboarding',
        ],
        confidence_score: 0.92,
      });

      // Real-time system insights
      const realtimeMetrics = await supabaseUserService.getRealTimeMetrics();
      insights.push({
        insight_type: 'trend',
        title: 'Real-Time System Health',
        description: 'Current system performance and user activity',
        data_points: [
          { 
            label: 'Active Sessions', 
            value: realtimeMetrics.active_sessions,
            trend: realtimeMetrics.active_sessions > 50 ? 'up' : 'stable'
          },
          { 
            label: 'Actions in Progress', 
            value: realtimeMetrics.actions_in_progress,
            trend: 'stable'
          },
          { 
            label: 'Recent Completions', 
            value: realtimeMetrics.recent_completions,
            trend: realtimeMetrics.recent_completions > 10 ? 'up' : 'down'
          },
        ],
        actionable_items: [
          'Monitor system performance',
          'Scale resources if needed',
          'Optimize database queries',
        ],
        confidence_score: 0.88,
      });

      // Impact analysis
      const impactInsight = await this.generateImpactInsight();
      if (impactInsight) insights.push(impactInsight);

      return insights;
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }

  // === ADAPTIVE CONTENT GENERATION ===

  generateAdaptiveExploreContent(user: UserProfile | null): {
    heroMessage: string;
    callToAction: string;
    featuredActions: string[];
    personalizedTips: string[];
  } {
    if (!user) {
      return {
        heroMessage: "Discover actions that create meaningful change in your community",
        callToAction: "Start exploring actions that match your interests",
        featuredActions: ['Climate Action', 'Community Volunteering', 'Social Justice'],
        personalizedTips: [
          "Create a profile to get personalized recommendations",
          "Browse actions by category to find what interests you",
          "Start with easy actions to build momentum",
        ],
      };
    }

    const userSegment = this.classifyUserSegment(user);
    const templates = this.models.content.templates;

    return {
      heroMessage: this.selectRandomTemplate(templates.motivational, user),
      callToAction: this.selectRandomTemplate(templates.calls_to_action, user),
      featuredActions: user.interests.slice(0, 3),
      personalizedTips: this.generatePersonalizedTips(user, userSegment),
    };
  }

  generateAdaptiveActionCard(action: ActionItem, user: UserProfile | null): {
    priority: number;
    relevanceScore: number;
    personalizedDescription: string;
    difficultyAdjustment: string;
    estimatedTimeForUser: string;
  } {
    const relevanceScore = user ? this.calculateActionRelevance(action, user) : 0.5;
    const priority = this.calculateActionPriority(action, user);

    return {
      priority,
      relevanceScore,
      personalizedDescription: this.personalizeActionDescription(action, user),
      difficultyAdjustment: this.adjustDifficultyForUser(action, user),
      estimatedTimeForUser: this.estimateTimeForUser(action, user),
    };
  }

  // === REAL-TIME ADAPTATION ===

  generateRealTimeUIAdaptations(user: UserProfile | null, currentPath: string): {
    layout: Record<string, any>;
    animations: Record<string, any>;
    colorScheme: Record<string, any>;
    contentDensity: 'low' | 'medium' | 'high';
  } {
    const preferences = user?.personalization || {
      layout_preference: 'detailed',
      color_scheme: 'neutral',
      engagement_level: 'medium',
      communication_frequency: 'weekly',
    };

    return {
      layout: this.generateLayoutAdaptations(preferences, currentPath),
      animations: this.generateAnimationSettings(preferences),
      colorScheme: this.generateColorScheme(preferences.color_scheme),
      contentDensity: this.determineContentDensity(user),
    };
  }

  async optimizeExploreFeed(
    userId: string | null, 
    currentActions: ActionItem[]
  ): Promise<ActionItem[]> {
    try {
      if (!userId) {
        // For anonymous users, return popular actions
        return await supabaseUserService.getPopularActions(20);
      }

      const user = await supabaseUserService.getUserById(userId);
      if (!user) return currentActions;

      // Get personalized actions
      const personalizedActions = await supabaseUserService.getPersonalizedActions(userId, 15);
      
      // Get popular actions for diversity
      const popularActions = await supabaseUserService.getPopularActions(10);

      // Combine and deduplicate
      const combinedActions = [...personalizedActions, ...popularActions];
      const uniqueActions = combinedActions.filter(
        (action, index, self) => 
          index === self.findIndex(a => a.id === action.id)
      );

      // Sort by relevance and engagement
      return uniqueActions.sort((a, b) => {
        const scoreA = this.calculateActionScore(a, user);
        const scoreB = this.calculateActionScore(b, user);
        return scoreB - scoreA;
      });
    } catch (error) {
      // Production: debug output removed
      return currentActions;
    }
  }

  // === PRIVATE HELPER METHODS ===

  private classifyUserSegment(user: UserProfile): AIPersonalizationEngine['user_segment'] {
    const { actions_completed } = user.contribution_stats;
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (actions_completed === 0 && daysSinceCreation <= 7) return 'new_user';
    if (actions_completed <= 10 && daysSinceCreation <= 30) return 'casual_user';
    if (actions_completed <= 50 && daysSinceCreation <= 90) return 'active_user';
    if (actions_completed > 50) return 'power_user';
    
    // Check for at-risk users (inactive for too long)
    const daysSinceLastActive = Math.floor(
      (Date.now() - new Date(user.last_active).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastActive > 30) return 'at_risk';

    return 'casual_user';
  }

  private calculateEngagementPrediction(user: UserProfile): number {
    const weights = this.models.engagement.weights;
    
    // Recency score (how recently active)
    const daysSinceLastActive = Math.floor(
      (Date.now() - new Date(user.last_active).getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyScore = Math.max(0, 1 - (daysSinceLastActive / 30));

    // Frequency score (session count)
    const frequencyScore = Math.min(1, user.engagement_metrics.session_count / 50);

    // Depth score (actions completed)
    const depthScore = Math.min(1, user.contribution_stats.actions_completed / 20);

    return (
      recencyScore * weights.recency +
      frequencyScore * weights.frequency +
      depthScore * weights.depth
    );
  }

  private calculateChurnRisk(user: UserProfile): number {
    const daysSinceLastActive = Math.floor(
      (Date.now() - new Date(user.last_active).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Higher churn risk for users inactive for longer
    if (daysSinceLastActive > 60) return 0.9;
    if (daysSinceLastActive > 30) return 0.7;
    if (daysSinceLastActive > 14) return 0.4;
    if (daysSinceLastActive > 7) return 0.2;
    return 0.1;
  }

  private async generateNextBestActions(user: UserProfile): Promise<ActionItem[]> {
    try {
      // Get personalized actions based on user interests
      const personalizedActions = await supabaseUserService.getPersonalizedActions(user.id, 5);
      
      // Score and sort actions based on user profile
      return personalizedActions
        .map(action => ({
          ...action,
          score: this.calculateActionScore(action, user),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }

  private generatePersonalizedContent(user: UserProfile): AIPersonalizationEngine['personalized_content'] {
    const { actions_completed, total_impact_score } = user.contribution_stats;
    const templates = this.models.content.templates;

    return {
      hero_message: this.selectRandomTemplate(templates.motivational, user),
      call_to_action: this.selectRandomTemplate(templates.calls_to_action, user),
      motivational_quote: this.selectRandomTemplate(templates.motivational, user),
      progress_message: this.interpolateTemplate(
        templates.progress[Math.floor(Math.random() * templates.progress.length)],
        {
          count: actions_completed,
          score: total_impact_score,
          percent: Math.floor((total_impact_score / 1000) * 100),
          percentile: Math.floor(Math.random() * 20) + 80, // Mock percentile
          orgs: user.contribution_stats.organizations_supported,
        }
      ),
    };
  }

  private generateUIPreferences(user: UserProfile): AIPersonalizationEngine['ui_preferences'] {
    const engagement = this.calculateEngagementPrediction(user);
    const userPrefs = user.personalization;

    return {
      layout: userPrefs.layout_preference === 'visual' ? 'standard' : userPrefs.layout_preference,
      color_scheme: userPrefs.color_scheme,
      animation_level: engagement > 0.7 ? 'dynamic' : engagement > 0.4 ? 'moderate' : 'subtle',
      information_density: 
        userPrefs.layout_preference === 'minimal' ? 'low' :
        userPrefs.layout_preference === 'visual' ? 'medium' : 'high',
    };
  }

  private createProfileCompletionRecommendation(user: UserProfile): AIRecommendation {
    const missingFields = [];
    if (!user.email) missingFields.push('email');
    if (!user.location) missingFields.push('location');
    if (user.interests.length === 0) missingFields.push('interests');
    if (user.preferred_causes.length === 0) missingFields.push('preferred causes');

    return {
      id: `profile_completion_${user.id}`,
      type: 'profile_improvement',
      title: 'Complete Your Profile',
      description: `Add ${missingFields.join(', ')} to get better recommendations`,
      priority: 'medium',
      confidence: 0.9,
      estimated_impact: 25,
      metadata: { missing_fields: missingFields },
    };
  }

  private async generateActionRecommendations(user: UserProfile): Promise<AIRecommendation[]> {
    try {
      const actions = await supabaseUserService.getPersonalizedActions(user.id, 3);
      
      return actions.map((action, index) => ({
        id: `action_rec_${action.id}`,
        type: 'action' as const,
        title: `Try: ${action.title}`,
        description: action.description,
        priority: index === 0 ? 'high' : 'medium' as const,
        confidence: this.calculateActionRelevance(action, user),
        estimated_impact: this.estimateActionImpact(action),
        metadata: { action_id: action.id, category: action.category },
      }));
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }

  private generateEngagementRecommendations(user: UserProfile): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const engagement = this.calculateEngagementPrediction(user);

    if (engagement < 0.3) {
      recommendations.push({
        id: `engagement_boost_${user.id}`,
        type: 'engagement',
        title: 'Boost Your Engagement',
        description: 'Try setting a weekly action goal to stay motivated',
        priority: 'medium',
        confidence: 0.75,
        estimated_impact: 40,
        metadata: { current_engagement: engagement },
      });
    }

    return recommendations;
  }

  private async generateCommunityRecommendations(user: UserProfile): Promise<AIRecommendation[]> {
    try {
      // Find users with similar interests
      const similarUsers = await supabaseUserService.getUsersByInterest(
        user.interests[0] || 'Climate Change'
      );

      if (similarUsers.length > 10) {
        return [{
          id: `community_${user.id}`,
          type: 'community',
          title: 'Join Your Community',
          description: `Connect with ${similarUsers.length} others who share your interests`,
          priority: 'low',
          confidence: 0.6,
          estimated_impact: 20,
          metadata: { similar_users_count: similarUsers.length },
        }];
      }

      return [];
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }

  private async generateImpactInsight(): Promise<AIInsight | null> {
    try {
      const stats = await supabaseUserService.getEngagementStats();
      
      return {
        insight_type: 'impact',
        title: 'Community Impact Analysis',
        description: 'Collective impact of user actions across the platform',
        data_points: [
          { label: 'Actions Completed', value: stats.completion_rate * stats.total_users },
          { label: 'Organizations Supported', value: Math.floor(stats.total_users * 0.3) },
          { label: 'Estimated Reach', value: Math.floor(stats.total_users * 5.2) },
        ],
        actionable_items: [
          'Showcase success stories',
          'Create impact visualization',
          'Encourage peer sharing',
        ],
        confidence_score: 0.85,
      };
    } catch (error) {
      // Production: debug output removed
      return null;
    }
  }

  private calculateActionRelevance(action: ActionItem, user: UserProfile): number {
    let relevance = 0.5; // Base relevance

    // Interest matching
    const interestMatch = user.interests.some(interest =>
      action.tags.includes(interest) || action.category.includes(interest)
    );
    if (interestMatch) relevance += 0.3;

    // Cause matching
    const causeMatch = user.preferred_causes.some(cause =>
      action.tags.includes(cause) || action.category.includes(cause)
    );
    if (causeMatch) relevance += 0.2;

    return Math.min(1, relevance);
  }

  private calculateActionPriority(action: ActionItem, user: UserProfile | null): number {
    let priority = 50; // Base priority

    // High completion count = proven popular
    priority += Math.min(30, action.completion_count / 10);

    // User relevance boost
    if (user) {
      priority += this.calculateActionRelevance(action, user) * 20;
    }

    return Math.min(100, priority);
  }

  private calculateActionScore(action: ActionItem, user: UserProfile): number {
    const relevance = this.calculateActionRelevance(action, user);
    const popularity = Math.min(1, action.completion_count / 1000);
    const freshness = 1; // All actions are fresh in our system

    return relevance * 0.5 + popularity * 0.3 + freshness * 0.2;
  }

  private selectRandomTemplate(templates: string[], user: UserProfile): string {
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private interpolateTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => 
      variables[key]?.toString() || match
    );
  }

  private personalizeActionDescription(action: ActionItem, user: UserProfile | null): string {
    if (!user) return action.description;

    // Add personal touch based on user's interests
    const relevantInterest = user.interests.find(interest =>
      action.category.toLowerCase().includes(interest.toLowerCase())
    );

    if (relevantInterest) {
      return `${action.description} This aligns with your interest in ${relevantInterest}.`;
    }

    return action.description;
  }

  private adjustDifficultyForUser(action: ActionItem, user: UserProfile | null): string {
    if (!user) return action.difficulty;

    const userExperience = user.contribution_stats.actions_completed;
    
    if (userExperience === 0 && action.difficulty === 'hard') {
      return 'Consider starting with easier actions first';
    }
    
    if (userExperience > 20 && action.difficulty === 'easy') {
      return 'This should be quick for you!';
    }

    return `${action.difficulty} difficulty`;
  }

  private estimateTimeForUser(action: ActionItem, user: UserProfile | null): string {
    return action.time_commitment;
  }

  private estimateActionImpact(action: ActionItem): number {
    const impactMap = { low: 20, medium: 50, high: 80 };
    return impactMap[action.impact_level] || 50;
  }

  private generatePersonalizedTips(user: UserProfile, segment: string): string[] {
    const tips: Record<string, string[]> = {
      new_user: [
        "Start with actions that match your interests",
        "Set a goal to complete one action this week",
        "Explore different categories to find your passion",
      ],
      casual_user: [
        "Try increasing your impact with medium-difficulty actions",
        "Connect with others who share your interests",
        "Track your progress to stay motivated",
      ],
      active_user: [
        "Consider organizing actions in your community",
        "Share your experience to inspire others",
        "Try high-impact actions for greater change",
      ],
      power_user: [
        "Mentor new users to expand the community",
        "Lead initiatives in your area of expertise",
        "Help improve the platform with feedback",
      ],
      at_risk: [
        "We miss you! Check out what's new",
        "Find actions that fit your current schedule",
        "Small actions can make a big difference",
      ],
    };

    return tips[segment] || tips.casual_user;
  }

  private generateLayoutAdaptations(preferences: UserProfile['personalization'], path: string): Record<string, any> {
    return {
      containerWidth: preferences.layout_preference === 'minimal' ? 'narrow' : 'wide',
      cardSpacing: preferences.layout_preference === 'visual' ? 'loose' : 'compact',
      showSidebar: preferences.layout_preference !== 'minimal',
    };
  }

  private generateAnimationSettings(preferences: UserProfile['personalization']): Record<string, any> {
    const level = preferences.engagement_level;
    return {
      duration: level === 'high' ? 'normal' : level === 'medium' ? 'fast' : 'instant',
      complexity: level === 'high' ? 'rich' : 'simple',
    };
  }

  private generateColorScheme(scheme: string): Record<string, any> {
    const schemes: Record<string, { primary: string; secondary: string }> = {
      warm: { primary: '#ff6b35', secondary: '#f7931e' },
      cool: { primary: '#4285f4', secondary: '#34a853' },
      neutral: { primary: '#6c757d', secondary: '#495057' },
    };

    return schemes[scheme] || schemes.neutral;
  }

  private determineContentDensity(user: UserProfile | null): 'low' | 'medium' | 'high' {
    if (!user) return 'medium';
    
    const experience = user.contribution_stats.actions_completed;
    if (experience > 50) return 'high';
    if (experience > 10) return 'medium';
    return 'low';
  }
}

// Export singleton instance
export const advancedAIService = new AdvancedAIIntelligenceService();
export default advancedAIService;

