"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { ExploreItem } from "@/context/ExploreContext";
import { supabaseUserService } from "@/services/supabaseUserService";
import FilterDropdown, { type DropdownOption } from './FilterDropdown';

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

// Filter options
const CATEGORY_OPTIONS: DropdownOption[] = [
  { id: 'all', label: 'All Categories', description: 'Show all types of actions', icon: '📁', count: MOCK_EXPLORE_ITEMS.length },
  { id: 'policy', label: 'Policy', description: 'Government policies and legislation', icon: '🏛️', count: MOCK_EXPLORE_ITEMS.filter(i => i.category === 'policy').length },
  { id: 'action', label: 'Actions', description: 'Direct community actions', icon: '⚡', count: MOCK_EXPLORE_ITEMS.filter(i => i.category === 'action').length },
  { id: 'organization', label: 'Organizations', description: 'Groups and nonprofits to join', icon: '🏢', count: MOCK_EXPLORE_ITEMS.filter(i => i.category === 'organization').length },
  { id: 'event', label: 'Events', description: 'Upcoming events and meetings', icon: '📅', count: MOCK_EXPLORE_ITEMS.filter(i => i.category === 'event').length },
];

const LOCATION_OPTIONS: DropdownOption[] = [
  { id: 'all', label: 'All Locations', description: 'Actions from everywhere', icon: '🌍', count: MOCK_EXPLORE_ITEMS.length },
  { id: 'local', label: 'Local', description: 'Community-level actions', icon: '🏘️', count: MOCK_EXPLORE_ITEMS.filter(i => i.location === 'Local').length },
  { id: 'state', label: 'State Level', description: 'State government actions', icon: '🗺️', count: MOCK_EXPLORE_ITEMS.filter(i => i.location?.includes('New York')).length },
  { id: 'national', label: 'National', description: 'Federal level actions', icon: '🇺🇸', count: MOCK_EXPLORE_ITEMS.filter(i => i.location === 'National' || i.location === 'US').length },
  { id: 'global', label: 'Global', description: 'International actions', icon: '🌍', count: MOCK_EXPLORE_ITEMS.filter(i => i.location === 'Global').length },
];

const DIFFICULTY_OPTIONS: DropdownOption[] = [
  { id: 'all', label: 'All Levels', description: 'Any difficulty level', icon: '📊', count: MOCK_EXPLORE_ITEMS.length },
  { id: 'easy', label: 'Easy', description: 'Quick and simple actions', icon: '🟢', count: MOCK_EXPLORE_ITEMS.filter(i => i.difficulty === 'easy').length },
  { id: 'medium', label: 'Medium', description: 'Moderate time commitment', icon: '🟡', count: MOCK_EXPLORE_ITEMS.filter(i => i.difficulty === 'medium').length },
  { id: 'hard', label: 'Hard', description: 'Significant involvement required', icon: '🔴', count: MOCK_EXPLORE_ITEMS.filter(i => i.difficulty === 'hard').length },
];

const IMPACT_OPTIONS: DropdownOption[] = [
  { id: 'all', label: 'All Impact Levels', description: 'Any impact level', icon: '💥', count: MOCK_EXPLORE_ITEMS.length },
  { id: 'high', label: 'High Impact', description: 'Major potential for change', icon: '🚀', count: MOCK_EXPLORE_ITEMS.filter(i => i.impact_level === 'high').length },
  { id: 'medium', label: 'Medium Impact', description: 'Moderate potential for change', icon: '⭐', count: MOCK_EXPLORE_ITEMS.filter(i => i.impact_level === 'medium').length },
  { id: 'low', label: 'Low Impact', description: 'Building awareness and support', icon: '💡', count: MOCK_EXPLORE_ITEMS.filter(i => i.impact_level === 'low').length },
];

const SORT_OPTIONS: DropdownOption[] = [
  { id: 'trending', label: 'Trending', description: 'Most popular actions', icon: '📈' },
  { id: 'impact', label: 'Impact', description: 'Highest potential impact', icon: '💥' },
  { id: 'recent', label: 'Recent', description: 'Most recently added', icon: '🕒' },
  { id: 'completion', label: 'Participation', description: 'Most completed actions', icon: '👥' },
];

export default function ExploreView() {
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [filteredItems, setFilteredItems] = useState<ExploreItem[]>(MOCK_EXPLORE_ITEMS);

  // Check if any filters are active
  const hasFilters = searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all' || 
                    selectedDifficulty !== 'all' || selectedImpact !== 'all' || selectedSort !== 'trending';

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedDifficulty('all');
    setSelectedImpact('all');
    setSelectedSort('trending');
  };

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = MOCK_EXPLORE_ITEMS;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(item => {
        if (selectedLocation === 'local') return item.location === 'Local';
        if (selectedLocation === 'state') return item.location?.includes('New York');
        if (selectedLocation === 'national') return item.location === 'National' || item.location === 'US';
        if (selectedLocation === 'global') return item.location === 'Global';
        return true;
      });
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }

    // Impact filter
    if (selectedImpact !== 'all') {
      filtered = filtered.filter(item => item.impact_level === selectedImpact);
    }

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

    // Sort items
    filtered = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.completion_count - a.completion_count;
        case 'impact':
          return b.impact - a.impact;
        case 'recent':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'completion':
          return b.completion_count - a.completion_count;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, selectedLocation, selectedDifficulty, selectedImpact, selectedSort]);

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

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedDifficulty('all');
    setSelectedImpact('all');
    setSearchQuery('');
    setSelectedSort('trending');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedLocation !== 'all' || 
                         selectedDifficulty !== 'all' || selectedImpact !== 'all' || searchQuery;

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

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <FilterDropdown
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="All Categories"
          />
          
          <FilterDropdown
            options={LOCATION_OPTIONS}
            value={selectedLocation}
            onChange={setSelectedLocation}
            placeholder="All Locations"
          />
          
          <FilterDropdown
            options={DIFFICULTY_OPTIONS}
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            placeholder="All Levels"
          />
          
          <FilterDropdown
            options={IMPACT_OPTIONS}
            value={selectedImpact}
            onChange={setSelectedImpact}
            placeholder="All Impact"
          />
          
          <FilterDropdown
            options={SORT_OPTIONS}
            value={selectedSort}
            onChange={setSelectedSort}
            placeholder="Sort By"
          />
        </div>

        {/* Results Summary and Clear Filters */}
        <div className="flex items-center justify-between mb-4">
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
