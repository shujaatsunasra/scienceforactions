"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { ExploreItem } from "@/context/ExploreContext";
import { supabaseUserService } from "@/services/supabaseUserService";

// Mock data for exploration
const MOCK_EXPLORE_ITEMS: ExploreItem[] = [
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
    difficulty: 'medium',
    impact_level: 'high',
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
    difficulty: 'hard',
    impact_level: 'high',
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
    difficulty: 'easy',
    impact_level: 'medium',
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
    difficulty: 'medium',
    impact_level: 'medium',
    completion_count: 123,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ExploreView() {
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState<ExploreItem[]>(MOCK_EXPLORE_ITEMS);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = MOCK_EXPLORE_ITEMS;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.organization?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter.trim()) {
      filtered = filtered.filter(item =>
        item.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter.trim()) {
      filtered = filtered.filter(item =>
        item.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Sort by trending and impact
    filtered = filtered.sort((a, b) => {
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return b.impact - a.impact;
    });

    setFilteredItems(filtered);
  }, [searchQuery, categoryFilter, locationFilter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-purple-100 text-purple-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setLocationFilter('');
  };

  const hasFilters = searchQuery || categoryFilter || locationFilter;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text mb-4">Explore Actions</h1>
        <p className="text-lg text-grayText">Discover ways to make a difference in your community and beyond</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-card border border-grayBorder p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions, topics, organizations..."
            className="w-full p-4 bg-white border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="Filter by category (e.g., policy, action, organization)"
            className="p-3 bg-white border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
          
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location (e.g., New York, Local, National)"
            className="p-3 bg-white border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-grayText">
              {filteredItems.length} of {MOCK_EXPLORE_ITEMS.length} actions
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primaryDark transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-grayBorder rounded-card p-6 hover:border-primary transition-all hover:shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-text">{item.title}</h3>
                        {item.trending && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            🔥 Trending
                          </span>
                        )}
                        {item.featured && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-grayText mb-3">{item.description}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-graySoft text-grayText px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-sm text-grayText">
                        <span>📍 {item.location}</span>
                        <span>🏢 {item.organization}</span>
                        <span>👥 {item.completion_count} completed</span>
                        <span className="capitalize">📂 {item.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact_level)}`}>
                        {item.impact_level} impact
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-grayText">{item.impact}/5 impact</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">📊</span>
                        <span className="text-sm text-grayText">{item.relevance}/5 relevance</span>
                      </div>
                    </div>
                    
                    <button 
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors"
                      onClick={() => {
                        if (item.link) {
                          window.open(item.link, '_blank');
                        }
                      }}
                    >
                      Take Action
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-primary hover:text-primaryDark transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
