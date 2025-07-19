import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'scienceforaction',
    },
  },
});

// Database types for type safety
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  location?: string;
  interests: string[];
  preferred_causes: string[];
  contribution_stats: {
    actions_completed: number;
    organizations_supported: number;
    policies_viewed: number;
    total_impact_score: number;
  };
  personalization: {
    layout_preference: 'minimal' | 'detailed' | 'visual';
    color_scheme: 'warm' | 'cool' | 'neutral';
    engagement_level: 'low' | 'medium' | 'high';
    communication_frequency: 'daily' | 'weekly' | 'monthly';
  };
  profile_completion: number;
  created_at: string;
  updated_at: string;
  last_active: string;
  engagement_metrics: {
    session_count: number;
    avg_session_duration: number;
    page_views: number;
    actions_per_session: number;
  };
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_commitment: string;
  impact_level: 'low' | 'medium' | 'high';
  organization: string;
  location?: string;
  tags: string[];
  completion_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserAction {
  id: string;
  user_id: string;
  action_id: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  impact_reported?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemMetrics {
  id: string;
  metric_type: string;
  value: number;
  metadata: Record<string, any>;
  recorded_at: string;
}

// Real-time subscription helpers
export const subscribeToUserProfile = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`user_profile_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToSystemMetrics = (callback: (payload: any) => void) => {
  return supabase
    .channel('system_metrics')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'system_metrics',
      },
      callback
    )
    .subscribe();
};

// Connection health check
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('user_profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

export default supabase;
