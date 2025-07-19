import { supabase, UserProfile, ActionItem, UserAction, SystemMetrics } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Enhanced user profile interface with AI insights
export interface EnhancedUserProfile extends UserProfile {
  ai_insights?: {
    engagement_prediction: number;
    recommended_actions: string[];
    behavioral_patterns: string[];
    impact_potential: 'low' | 'medium' | 'high';
    next_best_action?: string;
  };
}

// Analytics interfaces
export interface UserEngagementStats {
  total_users: number;
  active_users: number;
  new_users_this_week: number;
  completion_rate: number;
  avg_session_duration: number;
  top_performing_actions: ActionItem[];
  user_distribution_by_location: Record<string, number>;
  engagement_trends: Array<{
    date: string;
    active_users: number;
    actions_completed: number;
  }>;
}

export interface RealTimeMetrics {
  active_sessions: number;
  actions_in_progress: number;
  recent_completions: number;
  system_health: 'healthy' | 'warning' | 'critical';
  response_time: number;
}

class SupabaseUserService {
  private realtimeSubscriptions: Map<string, RealtimeChannel> = new Map();
  private performanceMetrics: Map<string, number> = new Map();

  constructor() {
    this.initializePerformanceTracking();
  }

  // Performance tracking for optimization
  private initializePerformanceTracking() {
    setInterval(() => {
      this.recordSystemMetric('performance_check', Date.now());
    }, 30000); // Every 30 seconds
  }

  // === USER PROFILE OPERATIONS ===

  async createUser(userData: Partial<UserProfile>): Promise<UserProfile | null> {
    const startTime = Date.now();
    
    try {
      const user: Partial<UserProfile> = {
        name: userData.name || 'Anonymous User',
        email: userData.email,
        location: userData.location,
        interests: userData.interests || [],
        preferred_causes: userData.preferred_causes || [],
        contribution_stats: userData.contribution_stats || {
          actions_completed: 0,
          organizations_supported: 0,
          policies_viewed: 0,
          total_impact_score: 0,
        },
        personalization: userData.personalization || {
          layout_preference: 'detailed',
          color_scheme: 'neutral',
          engagement_level: 'medium',
          communication_frequency: 'weekly',
        },
        profile_completion: this.calculateProfileCompletion(userData),
        engagement_metrics: {
          session_count: 0,
          avg_session_duration: 0,
          page_views: 0,
          actions_per_session: 0,
        },
        last_active: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([user])
        .select()
        .single();

      if (error) throw error;

      await this.recordSystemMetric('user_created', 1, {
        creation_time: Date.now() - startTime,
        profile_completion: user.profile_completion,
      });

      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      await this.recordSystemMetric('user_creation_error', 1, { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return null;
    }
  }

  async getUserById(id: string): Promise<EnhancedUserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Enhance with AI insights
      const enhancedUser = await this.enhanceUserWithAI(data);
      return enhancedUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const updateData = {
        ...updates,
        profile_completion: updates.name || updates.email || updates.location ? 
          this.calculateProfileCompletion(updates) : undefined,
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.recordSystemMetric('user_updated', 1);
      return data;
    } catch (error) {
      console.error('Error updating user:', {
        error,
        userId: id,
        updateKeys: Object.keys(updates),
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  async getUsersByLocation(location: string, limit: number = 50): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('location', `%${location}%`)
        .order('last_active', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users by location:', error);
      return [];
    }
  }

  async getUsersByInterest(interest: string, limit: number = 50): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .contains('interests', [interest])
        .order('last_active', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users by interest:', error);
      return [];
    }
  }

  async searchUsers(query: string, limit: number = 50): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,location.ilike.%${query}%`)
        .order('last_active', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async getEngagementLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_engagement_summary')
        .select('*')
        .order('actions_completed', { ascending: false })
        .order('completion_rate', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  async getRecentlyActive(days: number = 30, limit: number = 100): Promise<UserProfile[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .gte('last_active', cutoffDate.toISOString())
        .order('last_active', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recently active users:', error);
      return [];
    }
  }

  // === ACTION OPERATIONS ===

  async getActions(limit: number = 50, offset: number = 0): Promise<ActionItem[]> {
    try {
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('is_active', true)
        .order('completion_count', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching actions:', error);
      return [];
    }
  }

  async getPopularActions(limit: number = 20): Promise<ActionItem[]> {
    try {
      const { data, error } = await supabase
        .from('popular_actions')
        .select('*')
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular actions:', error);
      return [];
    }
  }

  async getPersonalizedActions(userId: string, limit: number = 10): Promise<ActionItem[]> {
    try {
      // Get user's interests and preferred causes
      const user = await this.getUserById(userId);
      if (!user) return [];

      const { interests, preferred_causes } = user;
      const allTags = [...interests, ...preferred_causes];

      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .overlaps('tags', allTags)
        .eq('is_active', true)
        .order('completion_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching personalized actions:', error);
      return [];
    }
  }

  // === USER ACTION TRACKING ===

  async startAction(userId: string, actionId: string): Promise<UserAction | null> {
    try {
      const { data, error } = await supabase
        .from('user_actions')
        .insert([
          {
            user_id: userId,
            action_id: actionId,
            status: 'started',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await this.recordSystemMetric('action_started', 1);
      return data;
    } catch (error) {
      console.error('Error starting action:', error);
      return null;
    }
  }

  async completeAction(
    userId: string,
    actionId: string,
    impactReported?: number,
    feedback?: string
  ): Promise<UserAction | null> {
    try {
      const { data, error } = await supabase
        .from('user_actions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          impact_reported: impactReported,
          feedback,
        })
        .eq('user_id', userId)
        .eq('action_id', actionId)
        .select()
        .single();

      if (error) throw error;

      // Update action completion count
      await supabase.rpc('increment_completion_count', { action_id: actionId });

      await this.recordSystemMetric('action_completed', 1, {
        impact_reported: impactReported,
        has_feedback: !!feedback,
      });

      return data;
    } catch (error) {
      console.error('Error completing action:', error);
      return null;
    }
  }

  // === ANALYTICS AND METRICS ===

  async getEngagementStats(): Promise<UserEngagementStats> {
    try {
      const [usersCount, activeUsers, newUsers, completionStats, topActions] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('user_profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from('user_profiles')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('user_actions').select('status', { count: 'exact' }),
        supabase.from('popular_actions').select('*').limit(10),
      ]);

      const totalActions = completionStats.count || 0;
      const completedActions = await supabase
        .from('user_actions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed');

      return {
        total_users: usersCount.count || 0,
        active_users: activeUsers.count || 0,
        new_users_this_week: newUsers.count || 0,
        completion_rate: totalActions > 0 ? ((completedActions.count || 0) / totalActions) * 100 : 0,
        avg_session_duration: 0, // Will be calculated from session data
        top_performing_actions: topActions.data || [],
        user_distribution_by_location: await this.getUserLocationDistribution(),
        engagement_trends: await this.getEngagementTrends(),
      };
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
      return {
        total_users: 0,
        active_users: 0,
        new_users_this_week: 0,
        completion_rate: 0,
        avg_session_duration: 0,
        top_performing_actions: [],
        user_distribution_by_location: {},
        engagement_trends: [],
      };
    }
  }

  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    try {
      const [activeSessions, actionsInProgress, recentCompletions] = await Promise.all([
        supabase
          .from('user_sessions')
          .select('id', { count: 'exact', head: true })
          .is('session_end', null),
        supabase
          .from('user_actions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'in_progress'),
        supabase
          .from('user_actions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('completed_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()),
      ]);

      return {
        active_sessions: activeSessions.count || 0,
        actions_in_progress: actionsInProgress.count || 0,
        recent_completions: recentCompletions.count || 0,
        system_health: 'healthy', // Will be determined by various health checks
        response_time: this.performanceMetrics.get('avg_response_time') || 0,
      };
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      return {
        active_sessions: 0,
        actions_in_progress: 0,
        recent_completions: 0,
        system_health: 'critical',
        response_time: 0,
      };
    }
  }

  // === SYNTHETIC DATA GENERATION ===

  async generateSyntheticUsers(count: number = 1000): Promise<void> {
    console.log(`Starting generation of ${count} synthetic users in Supabase...`);
    
    const batchSize = 50; // Even smaller batches for better reliability
    const startTime = Date.now();
    let successfulInserts = 0;
    
    try {
      for (let i = 0; i < count; i += batchSize) {
        const currentBatchSize = Math.min(batchSize, count - i);
        const batchUsers = this.generateUserBatch(currentBatchSize);
        
        try {
          const { error } = await supabase
            .from('user_profiles')
            .insert(batchUsers);

          if (error) {
            console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, {
              error: error.message,
              batchStart: i,
              batchSize: currentBatchSize
            });
            // Add a delay before trying the next batch
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          successfulInserts += currentBatchSize;

          if ((i + batchSize) % 500 === 0) {
            console.log(`Generated ${successfulInserts}/${count} users...`);
          }

          // Add a small delay between batches to prevent overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (batchError) {
          console.error(`Failed to process batch ${Math.floor(i / batchSize) + 1}:`, batchError);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Generate corresponding action items
      await this.generateSyntheticActions(500);

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      await this.recordSystemMetric('synthetic_data_generated', count, {
        duration_seconds: duration,
        batch_size: batchSize,
      });

      console.log(`Successfully generated ${count} users and 500 actions in ${duration.toFixed(2)} seconds`);
    } catch (error) {
      console.error('Error generating synthetic users:', error);
      throw error;
    }
  }

  private generateUserBatch(count: number): Partial<UserProfile>[] {
    const users: Partial<UserProfile>[] = [];
    
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
      'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
      'London, UK', 'Berlin, Germany', 'Paris, France', 'Tokyo, Japan', 'Sydney, Australia',
    ];
    
    const interests = [
      'Climate Change', 'Social Justice', 'Education', 'Healthcare', 'Technology',
      'Environment', 'Human Rights', 'Economic Justice', 'Democracy', 'Immigration',
      'LGBTQ+ Rights', 'Racial Equality', 'Gender Equality', 'Mental Health', 'Housing',
    ];
    
    const causes = [
      'Environmental Protection', 'Poverty Reduction', 'Educational Access', 'Healthcare Access',
      'Civil Rights', 'Criminal Justice Reform', 'Immigration Reform', 'LGBTQ+ Advocacy',
      'Climate Action', 'Social Services', 'Economic Opportunity', 'Democratic Participation',
    ];

    for (let i = 0; i < count; i++) {
      const userInterests = this.getRandomItems(interests, Math.floor(Math.random() * 5) + 1);
      const userCauses = this.getRandomItems(causes, Math.floor(Math.random() * 3) + 1);
      
      users.push({
        name: this.generateRandomName(),
        email: Math.random() > 0.3 ? this.generateRandomEmail() : undefined,
        location: locations[Math.floor(Math.random() * locations.length)],
        interests: userInterests,
        preferred_causes: userCauses,
        contribution_stats: {
          actions_completed: Math.floor(Math.random() * 20),
          organizations_supported: Math.floor(Math.random() * 10),
          policies_viewed: Math.floor(Math.random() * 50),
          total_impact_score: Math.floor(Math.random() * 1000),
        },
        personalization: {
          layout_preference: ['minimal', 'detailed', 'visual'][Math.floor(Math.random() * 3)] as any,
          color_scheme: ['warm', 'cool', 'neutral'][Math.floor(Math.random() * 3)] as any,
          engagement_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          communication_frequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)] as any,
        },
        profile_completion: Math.floor(Math.random() * 101),
        engagement_metrics: {
          session_count: Math.floor(Math.random() * 100),
          avg_session_duration: Math.floor(Math.random() * 3600),
          page_views: Math.floor(Math.random() * 500),
          actions_per_session: Math.random() * 5,
        },
        last_active: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
    
    return users;
  }

  async generateSyntheticActions(count: number = 500): Promise<void> {
    const batchSize = 50;
    
    const categories = [
      'Environmental', 'Social Justice', 'Education', 'Healthcare', 'Economic',
      'Technology', 'Political', 'Community', 'International', 'Cultural',
    ];
    
    const organizations = [
      'Greenpeace', 'ACLU', 'United Way', 'Red Cross', 'Amnesty International',
      'Sierra Club', 'NAACP', 'Planned Parenthood', 'Electronic Frontier Foundation',
      'Human Rights Watch', 'Doctors Without Borders', 'Habitat for Humanity',
    ];

    try {
      for (let i = 0; i < count; i += batchSize) {
        const batchActions: Partial<ActionItem>[] = [];
        
        for (let j = 0; j < Math.min(batchSize, count - i); j++) {
          const category = categories[Math.floor(Math.random() * categories.length)];
          
          batchActions.push({
            title: `${category} Action ${i + j + 1}`,
            description: `Take meaningful action for ${category.toLowerCase()} causes in your community.`,
            category,
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
            time_commitment: ['15 minutes', '30 minutes', '1 hour', '2 hours'][Math.floor(Math.random() * 4)],
            impact_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
            organization: organizations[Math.floor(Math.random() * organizations.length)],
            location: Math.random() > 0.5 ? 'Remote' : 'Local',
            tags: this.getRandomItems(
              ['urgent', 'beginner-friendly', 'high-impact', 'community', 'policy', 'volunteer'],
              Math.floor(Math.random() * 3) + 1
            ),
            completion_count: Math.floor(Math.random() * 1000),
          });
        }

        const { error } = await supabase
          .from('action_items')
          .insert(batchActions);

        if (error) {
          console.error(`Error inserting action batch:`, error);
        }
      }
    } catch (error) {
      console.error('Error generating synthetic actions:', error);
    }
  }

  // === REAL-TIME SUBSCRIPTIONS ===

  subscribeToUserUpdates(userId: string, callback: (user: UserProfile) => void): () => void {
    const channel = supabase
      .channel(`user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    this.realtimeSubscriptions.set(`user_${userId}`, channel);

    return () => {
      channel.unsubscribe();
      this.realtimeSubscriptions.delete(`user_${userId}`);
    };
  }

  subscribeToSystemMetrics(callback: (metrics: SystemMetrics) => void): () => void {
    const channel = supabase
      .channel('system_metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_metrics',
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as SystemMetrics);
          }
        }
      )
      .subscribe();

    this.realtimeSubscriptions.set('system_metrics', channel);

    return () => {
      channel.unsubscribe();
      this.realtimeSubscriptions.delete('system_metrics');
    };
  }

  // === UTILITY METHODS ===

  private async recordSystemMetric(
    type: string,
    value: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase.from('system_metrics').insert([
        {
          metric_type: type,
          value,
          metadata,
        },
      ]);
    } catch (error) {
      console.error('Error recording system metric:', error);
    }
  }

  private calculateProfileCompletion(user: Partial<UserProfile>): number {
    let completion = 0;
    if (user.name) completion += 20;
    if (user.email) completion += 20;
    if (user.location) completion += 15;
    if (user.interests && user.interests.length > 0) completion += 25;
    if (user.preferred_causes && user.preferred_causes.length > 0) completion += 20;
    return Math.min(completion, 100);
  }

  private async enhanceUserWithAI(user: UserProfile): Promise<EnhancedUserProfile> {
    // Simple AI enhancement - in production, this would call actual AI services
    const aiInsights = {
      engagement_prediction: Math.random() * 100,
      recommended_actions: ['Climate Action', 'Community Volunteering'],
      behavioral_patterns: ['Morning Active', 'Weekend Engaged'],
      impact_potential: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      next_best_action: 'Complete your profile for better recommendations',
    };

    return {
      ...user,
      ai_insights: aiInsights,
    };
  }

  private async getUserLocationDistribution(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('location');

      if (error) throw error;

      const distribution: Record<string, number> = {};
      data?.forEach((user) => {
        if (user.location) {
          distribution[user.location] = (distribution[user.location] || 0) + 1;
        }
      });

      return distribution;
    } catch (error) {
      console.error('Error getting location distribution:', error);
      return {};
    }
  }

  private async getEngagementTrends(): Promise<Array<{ date: string; active_users: number; actions_completed: number }>> {
    // Simplified implementation - in production, this would query historical data
    const trends = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        active_users: Math.floor(Math.random() * 1000),
        actions_completed: Math.floor(Math.random() * 500),
      });
    }
    
    return trends;
  }

  private generateRandomName(): string {
    const firstNames = [
      'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
      'Sage', 'River', 'Phoenix', 'Rowan', 'Skylar', 'Emery', 'Finley',
    ];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
      'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    ];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  }

  private generateRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    const name = this.generateRandomName().toLowerCase().replace(' ', '.');
    return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
  }

  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Cleanup method
  destroy(): void {
    this.realtimeSubscriptions.forEach((channel) => {
      channel.unsubscribe();
    });
    this.realtimeSubscriptions.clear();
  }
}

// Export singleton instance
export const supabaseUserService = new SupabaseUserService();
export default supabaseUserService;
