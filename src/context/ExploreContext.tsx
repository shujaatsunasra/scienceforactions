"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useProfile } from './ProfileContext';
import { supabaseUserService } from '@/services/supabaseUserService';
import { advancedAIService } from '@/services/advancedAIService';
import { ActionItem } from '@/lib/supabase';
import Fuse from 'fuse.js';

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
      const actions = await supabaseUserService.getActions(50, 0);
      const transformedItems = actions.map(transformActionToExploreItem);
      setItems(transformedItems);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading initial items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPersonalizedItems = async () => {
    if (!profile) return;

    try {
      const personalizedActions = await supabaseUserService.getPersonalizedActions(profile.id, 20);
      const enhancedItems = await Promise.all(
        personalizedActions.map(async (action) => {
          const adaptiveCard = advancedAIService.generateAdaptiveActionCard(action, profile);
          const transformedItem = transformActionToExploreItem(action);
          return {
            ...transformedItem,
            relevance: Math.round(adaptiveCard.relevanceScore * 5),
            impact: adaptiveCard.priority / 20,
          };
        })
      );

      // Merge with existing items, prioritizing personalized ones
      setItems(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = enhancedItems.filter(item => !existingIds.has(item.id));
        return [...enhancedItems, ...prev.filter(item => !enhancedItems.some(e => e.id === item.id))];
      });
    } catch (error) {
      console.error('Error loading personalized items:', error);
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

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      result = searchResults.map(result => result.item);
    }

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.category));
    }

    if (filters.tags.length > 0) {
      result = result.filter(item => 
        filters.tags.some(tag => item.tags.includes(tag))
      );
    }

    if (filters.difficulties.length > 0) {
      result = result.filter(item => filters.difficulties.includes(item.difficulty));
    }

    if (filters.locations.length > 0) {
      result = result.filter(item => 
        item.location && filters.locations.some(loc => 
          item.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    if (filters.impactRange[0] !== 1 || filters.impactRange[1] !== 5) {
      result = result.filter(item => 
        item.impact >= filters.impactRange[0] && item.impact <= filters.impactRange[1]
      );
    }

    if (filters.timeCommitments.length > 0) {
      result = result.filter(item =>
        item.time_commitment && filters.timeCommitments.includes(item.time_commitment)
      );
    }

    if (filters.onlyTrending) {
      result = result.filter(item => item.trending);
    }

    if (filters.onlyFeatured) {
      result = result.filter(item => item.featured);
    }

    // Sort by relevance and impact
    return result.sort((a, b) => {
      if (profile) {
        // Personalized sorting
        return (b.relevance * 0.6 + b.impact * 0.4) - (a.relevance * 0.6 + a.impact * 0.4);
      }
      // Default sorting
      return b.completion_count - a.completion_count;
    });
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
      console.error('Error refreshing items:', error);
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
      console.error('Error getting recommendations:', error);
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
      console.error('Error tracking interaction:', error);
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
      console.error('Error loading more items:', error);
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
