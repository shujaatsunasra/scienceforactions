"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useProfile } from './ProfileContext';
import { supabaseUserService } from '@/services/supabaseUserService';
import { advancedAIService } from '@/services/advancedAIService';
import { ActionItem } from '@/lib/supabase';
import Fuse from 'fuse.js';

// Mock data for immediate functionality and fallback
const MOCK_EXPLORE_ITEMS = [
  {
    id: '1',
    title: 'Clean Industrial Heat Tax Credit',
    description: 'Smart policies that drive investments into industrial innovation to clean up the industrial sector. Providing a clean heat production tax credit to incentivize manufacturers to switch to clean energy sources.',
    tags: ['climate', 'industrial', 'policy', 'tax-credit'],
    category: 'policy',
    impact: 4,
    relevance: 4,
    organization: 'Climate Science Alliance',
    link: 'https://example.org/clean-heat',
    location: 'US',
    trending: true,
    featured: true,
    difficulty: 'easy' as const,
    impact_level: 'high' as const,
    completion_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'NY Climate Change Superfund Act',
    description: 'New York\'s Climate Change Superfund Act establishes a cost recovery program requiring companies that have emitted significant greenhouse gases to bear costs of infrastructure adaptation.',
    tags: ['ny', 'state-gov', 'policy', 'climate', 'superfund'],
    category: 'policy',
    impact: 5,
    relevance: 5,
    organization: 'NY Climate Action',
    link: 'https://example.org/ny-climate',
    location: 'New York',
    trending: true,
    featured: true,
    difficulty: 'hard' as const,
    impact_level: 'high' as const,
    completion_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Community Solar Gardens Initiative',
    description: 'Local community organizing to establish shared solar energy systems that allow residents to access clean energy even if they can\'t install panels on their own property.',
    tags: ['solar', 'community', 'renewable-energy', 'local'],
    category: 'action',
    impact: 3,
    relevance: 4,
    organization: 'Local Solar Coalition',
    link: 'https://example.org/community-solar',
    location: 'Local',
    trending: false,
    featured: false,
    difficulty: 'easy' as const,
    impact_level: 'medium' as const,
    completion_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Green Jobs Training Program',
    description: 'Workforce development program that provides training and certification in renewable energy installation, energy efficiency, and sustainable agriculture.',
    tags: ['jobs', 'training', 'green-economy', 'workforce'],
    category: 'organization',
    impact: 4,
    relevance: 3,
    organization: 'Green Jobs Alliance',
    link: 'https://example.org/green-jobs',
    location: 'National',
    trending: true,
    featured: false,
    difficulty: 'medium' as const,
    impact_level: 'medium' as const,
    completion_count: 123,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Renewable Energy Advocacy Campaign',
    description: 'Join a grassroots campaign to promote renewable energy policies at the state level. Help organize rallies, contact legislators, and spread awareness about clean energy benefits.',
    tags: ['renewable-energy', 'advocacy', 'grassroots', 'policy'],
    category: 'action',
    impact: 4,
    relevance: 4,
    organization: 'Clean Energy Coalition',
    link: 'https://example.org/renewable-advocacy',
    location: 'Local',
    trending: true,
    featured: true,
    difficulty: 'medium' as const,
    impact_level: 'high' as const,
    completion_count: 287,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Ocean Plastic Cleanup Volunteer Drive',
    description: 'Participate in coastal cleanup events to remove plastic waste from beaches and waterways. Help protect marine ecosystems while raising awareness about plastic pollution.',
    tags: ['ocean', 'plastic', 'cleanup', 'volunteer', 'marine'],
    category: 'action',
    impact: 3,
    relevance: 3,
    organization: 'Ocean Conservation Society',
    link: 'https://example.org/ocean-cleanup',
    location: 'Global',
    trending: false,
    featured: true,
    difficulty: 'easy' as const,
    impact_level: 'medium' as const,
    completion_count: 445,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export interface ExploreItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  impact: number; // 1-5 scale
  relevance: number; // 1-5 scale
  time_commitment?: string;
  organization?: string;
  link?: string;
  location?: string;
  deadline?: string;
  trending: boolean;
  featured: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  impact_level: 'low' | 'medium' | 'high';
  completion_count: number;
  created_at: string;
  updated_at: string;
}

export interface ExploreFilters {
  categories: string[];
  tags: string[];
  locations: string[];
  impactRange: [number, number];
  timeCommitments: string[];
  difficulties: string[];
  onlyTrending: boolean;
  onlyFeatured: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface ExploreContextType {
  items: ExploreItem[];
  filteredItems: ExploreItem[];
  isLoading: boolean;
  searchQuery: string;
  filters: ExploreFilters;
  trendingItems: ExploreItem[];
  personalizedItems: ExploreItem[];
  updateSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<ExploreFilters>) => void;
  resetFilters: () => void;
  refreshItems: () => Promise<void>;
  getRecommendations: () => Promise<ExploreItem[]>;
  trackItemInteraction: (itemId: string, interaction: 'view' | 'click' | 'save') => void;
  getByCategoryStats: () => Record<string, number>;
  getPopularTags: () => string[];
  loadMoreItems: () => Promise<void>;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export function ExploreProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const [filters, setFilters] = useState<ExploreFilters>({
    categories: [],
    tags: [],
    locations: [],
    impactRange: [1, 5],
    timeCommitments: [],
    difficulties: [],
    onlyTrending: false,
    onlyFeatured: false,
  });

  // Initialize Fuse.js for search with memoization
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ['title', 'description', 'tags', 'category', 'organization'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [items]);

  // Load initial items
  useEffect(() => {
    loadInitialItems();
  }, []);

  // Update personalized recommendations when profile changes
  useEffect(() => {
    if (profile) {
      loadPersonalizedItems();
    }
  }, [profile]);

  const loadInitialItems = async () => {
    setIsLoading(true);
    try {
      // Production: debug output removed
      const actions = await supabaseUserService.getActions(50, 0);
      // Production: debug output removed
      
      if (actions.length > 0) {
        const transformedItems = actions.map(transformActionToExploreItem);
        setItems(transformedItems);
        // Production: debug output removed
      } else {
        // Production: debug output removed
        setItems(MOCK_EXPLORE_ITEMS);
      }
      setCurrentPage(1);
    } catch (error) {
      // Production: debug output removed
      // Production: debug output removed
      setItems(MOCK_EXPLORE_ITEMS);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPersonalizedItems = async () => {
    if (!profile) return;

    try {
      // Production: debug output removed
      const personalizedActions = await supabaseUserService.getPersonalizedActions(profile.id, 20);
      
      if (personalizedActions.length === 0) {
        // Production: debug output removed
        return;
      }

      const enhancedItems = await Promise.all(
        personalizedActions.map(async (action) => {
          try {
            const adaptiveCard = advancedAIService.generateAdaptiveActionCard(action, profile);
            const transformedItem = transformActionToExploreItem(action);
            return {
              ...transformedItem,
              relevance: Math.round(adaptiveCard.relevanceScore * 5),
              impact: Math.min(5, Math.max(1, adaptiveCard.priority / 20)),
            };
          } catch (cardError) {
            // Production: debug output removed
            return transformActionToExploreItem(action);
          }
        })
      );

      // Merge with existing items, prioritizing personalized ones
      setItems(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = enhancedItems.filter(item => !existingIds.has(item.id));
        const mergedItems = [...enhancedItems, ...prev.filter(item => !enhancedItems.some(e => e.id === item.id))];
        // Production: debug output removed
        return mergedItems;
      });
    } catch (error) {
      // Production: debug output removed
      // Don't fail silently - add fallback data
      try {
        const popularActions = await supabaseUserService.getPopularActions(10);
        const transformedPopular = popularActions.map(transformActionToExploreItem);
        setItems(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = transformedPopular.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        // Production: debug output removed
      } catch (fallbackError) {
        // Production: debug output removed
      }
    }
  };

  const transformActionToExploreItem = (action: ActionItem): ExploreItem => {
    const impactMap = { low: 2, medium: 3, high: 5 };
    
    return {
      id: action.id,
      title: action.title,
      description: action.description,
      tags: action.tags,
      category: action.category,
      impact: impactMap[action.impact_level] || 3,
      relevance: 3, // Default, will be enhanced by AI
      time_commitment: action.time_commitment,
      organization: action.organization,
      location: action.location || undefined,
      trending: action.completion_count > 100,
      featured: action.completion_count > 500,
      difficulty: action.difficulty,
      impact_level: action.impact_level,
      completion_count: action.completion_count,
      created_at: action.created_at,
      updated_at: action.updated_at,
    };
  };

  // Filter items based on search query and filters
  const filteredItems = useMemo(() => {
    let result = items;
    // Production: debug output removed

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      result = searchResults.map(result => result.item);
      // Production: debug output removed
    }

    // Apply filters with fallback logic
    if (filters.categories.length > 0) {
      const beforeFilter = result.length;
      result = result.filter(item => filters.categories.includes(item.category));
      // Production: debug output removed
    }

    if (filters.tags.length > 0) {
      const beforeFilter = result.length;
      result = result.filter(item => 
        filters.tags.some(tag => item.tags.includes(tag))
      );
      // Production: debug output removed
    }

    if (filters.difficulties.length > 0) {
      const beforeFilter = result.length;
      result = result.filter(item => filters.difficulties.includes(item.difficulty));
      // Production: debug output removed
    }

    if (filters.locations.length > 0) {
      const beforeFilter = result.length;
      result = result.filter(item => 
        item.location && filters.locations.some(loc => 
          item.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
      // Production: debug output removed
    }

    if (filters.impactRange[0] !== 1 || filters.impactRange[1] !== 5) {
      const beforeFilter = result.length;
      result = result.filter(item => 
        item.impact >= filters.impactRange[0] && item.impact <= filters.impactRange[1]
      );
      // Production: debug output removed
    }

    if (filters.timeCommitments.length > 0) {
      const beforeFilter = result.length;
      result = result.filter(item =>
        item.time_commitment && filters.timeCommitments.includes(item.time_commitment)
      );
      // Production: debug output removed
    }

    if (filters.onlyTrending) {
      const beforeFilter = result.length;
      result = result.filter(item => item.trending);
      // Production: debug output removed
    }

    if (filters.onlyFeatured) {
      const beforeFilter = result.length;
      result = result.filter(item => item.featured);
      // Production: debug output removed
    }

    // Enhanced sorting with user preference awareness
    result.sort((a, b) => {
      if (profile) {
        // Personalized sorting with multiple factors
        const scoreA = (a.relevance * 0.4) + (a.impact * 0.3) + (a.completion_count / 1000 * 0.3);
        const scoreB = (b.relevance * 0.4) + (b.impact * 0.3) + (b.completion_count / 1000 * 0.3);
        return scoreB - scoreA;
      }
      // Default sorting for non-authenticated users
      const scoreA = (a.impact * 0.5) + (a.completion_count / 1000 * 0.5);
      const scoreB = (b.impact * 0.5) + (b.completion_count / 1000 * 0.5);
      return scoreB - scoreA;
    });

    // Production: debug output removed
    
    // If no results and filters are applied, suggest broadening search
    if (result.length === 0 && (searchQuery || Object.values(filters).some(f => 
      Array.isArray(f) ? f.length > 0 : f !== false && f[0] !== 1 && f[1] !== 5
    ))) {
      // Production: debug output removed
    }

    return result;
  }, [items, searchQuery, filters, fuse, profile]);

  // Get trending items
  const trendingItems = useMemo(() => {
    return items
      .filter(item => item.trending)
      .sort((a, b) => b.completion_count - a.completion_count)
      .slice(0, 10);
  }, [items]);

  // Get personalized items for current user
  const personalizedItems = useMemo(() => {
    if (!profile) return [];
    
    return items
      .filter(item => {
        // Filter by user interests and preferred causes
        const userInterests = [...profile.interests, ...profile.preferred_causes];
        return userInterests.some(interest =>
          item.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
          item.category.toLowerCase().includes(interest.toLowerCase())
        );
      })
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 15);
  }, [items, profile]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ExploreFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      categories: [],
      tags: [],
      locations: [],
      impactRange: [1, 5],
      timeCommitments: [],
      difficulties: [],
      onlyTrending: false,
      onlyFeatured: false,
    });
    setSearchQuery('');
  }, []);

  const refreshItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const actions = await supabaseUserService.getActions(50, 0);
      const transformedItems = actions.map(transformActionToExploreItem);
      setItems(transformedItems);
      
      if (profile) {
        await loadPersonalizedItems();
      }
    } catch (error) {
      // Production: debug output removed
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const getRecommendations = useCallback(async (): Promise<ExploreItem[]> => {
    if (!profile) return [];

    try {
      const recommendations = await advancedAIService.generateRecommendations(profile.id);
      const actionRecommendations = recommendations.filter(rec => rec.type === 'action');
      
      // Find corresponding items
      const recommendedItems = actionRecommendations
        .map(rec => items.find(item => item.id === rec.metadata.action_id))
        .filter(Boolean) as ExploreItem[];

      return recommendedItems;
    } catch (error) {
      // Production: debug output removed
      return [];
    }
  }, [profile, items]);

  const trackItemInteraction = useCallback(async (itemId: string, interaction: 'view' | 'click' | 'save') => {
    if (!profile) return;

    try {
      // Track interaction in user engagement metrics
      if (interaction === 'view') {
        // Update page views
        await supabaseUserService.updateUser(profile.id, {
          engagement_metrics: {
            ...profile.engagement_metrics,
            page_views: profile.engagement_metrics.page_views + 1,
          },
        });
      } else if (interaction === 'click') {
        // Track action start
        await supabaseUserService.startAction(profile.id, itemId);
      }
    } catch (error) {
      // Production: debug output removed
    }
  }, [profile]);

  const getByCategoryStats = useCallback((): Record<string, number> => {
    const stats: Record<string, number> = {};
    items.forEach(item => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  }, [items]);

  const getPopularTags = useCallback((): string[] => {
    const tagCounts: Record<string, number> = {};
    items.forEach(item => {
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag]) => tag);
  }, [items]);

  const loadMoreItems = useCallback(async () => {
    if (!hasMoreItems || isLoading) return;

    try {
      setIsLoading(true);
      const moreActions = await supabaseUserService.getActions(25, currentPage * 25);
      
      if (moreActions.length === 0) {
        setHasMoreItems(false);
        return;
      }

      const newItems = moreActions.map(transformActionToExploreItem);
      setItems(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      // Production: debug output removed
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMoreItems, isLoading]);

  const value: ExploreContextType = {
    items,
    filteredItems,
    isLoading,
    searchQuery,
    filters,
    trendingItems,
    personalizedItems,
    updateSearchQuery,
    updateFilters,
    resetFilters,
    refreshItems,
    getRecommendations,
    trackItemInteraction,
    getByCategoryStats,
    getPopularTags,
    loadMoreItems,
  };

  return (
    <ExploreContext.Provider value={value}>
      {children}
    </ExploreContext.Provider>
  );
}

export function useExplore() {
  const context = useContext(ExploreContext);
  if (context === undefined) {
    throw new Error('useExplore must be used within an ExploreProvider');
  }
  return context;
}

export default ExploreContext;

