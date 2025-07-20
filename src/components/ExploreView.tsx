"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { useExplore, ExploreItem } from "@/context/ExploreContext";
import FilterDropdown, { type DropdownOption } from './FilterDropdown';
import ResponsiveDrawer from './ResponsiveDrawer';

export default function ExploreView() {
  const { profile } = useProfile();
  const {
    items,
    filteredItems,
    isLoading,
    searchQuery,
    filters,
    updateSearchQuery,
    updateFilters,
    resetFilters,
    refreshItems,
    trackItemInteraction
  } = useExplore();

  // Local state for UI control
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Update context filters when local state changes
  useEffect(() => {
    const newFilters = {
      categories: selectedCategory !== 'all' ? [selectedCategory] : [],
      locations: selectedLocation !== 'all' ? [selectedLocation] : [],
      difficulties: selectedDifficulty !== 'all' ? [selectedDifficulty] : [],
      impactRange: selectedImpact !== 'all' ? 
        (selectedImpact === 'high' ? [4, 5] as [number, number] : 
         selectedImpact === 'medium' ? [2, 3] as [number, number] : [1, 1] as [number, number]) : [1, 5] as [number, number],
      tags: [],
      timeCommitments: [],
      onlyTrending: selectedSort === 'trending',
      onlyFeatured: false
    };
    updateFilters(newFilters);
  }, [selectedCategory, selectedLocation, selectedDifficulty, selectedImpact, selectedSort, updateFilters]);

  // Update search query in context
  const handleSearchChange = (query: string) => {
    updateSearchQuery(query);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== 'all' || selectedLocation !== 'all' || 
                         selectedDifficulty !== 'all' || selectedImpact !== 'all' || searchQuery;

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedDifficulty('all');
    setSelectedImpact('all');
    setSelectedSort('trending');
    updateSearchQuery('');
    resetFilters();
  };

  // Color helpers
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

  // Get filter options from current items
  const CATEGORY_OPTIONS: DropdownOption[] = [
    { id: 'all', label: 'All Categories', description: 'Show all types of actions', icon: '📁', count: items.length },
    { id: 'policy', label: 'Policy', description: 'Government policies and legislation', icon: '🏛️', count: items.filter(i => i.category === 'policy').length },
    { id: 'action', label: 'Actions', description: 'Direct community actions', icon: '⚡', count: items.filter(i => i.category === 'action').length },
    { id: 'organization', label: 'Organizations', description: 'Groups and nonprofits to join', icon: '🏢', count: items.filter(i => i.category === 'organization').length },
    { id: 'event', label: 'Events', description: 'Upcoming events and meetings', icon: '📅', count: items.filter(i => i.category === 'event').length },
  ];

  const LOCATION_OPTIONS: DropdownOption[] = [
    { id: 'all', label: 'All Locations', description: 'Actions from everywhere', icon: '🌍', count: items.length },
    { id: 'local', label: 'Local', description: 'Community-level actions', icon: '🏘️', count: items.filter(i => i.location === 'Local').length },
    { id: 'state', label: 'State Level', description: 'State government actions', icon: '🗺️', count: items.filter(i => i.location?.includes('New York')).length },
    { id: 'national', label: 'National', description: 'Federal level actions', icon: '🇺🇸', count: items.filter(i => i.location === 'National' || i.location === 'US').length },
    { id: 'global', label: 'Global', description: 'International actions', icon: '🌍', count: items.filter(i => i.location === 'Global').length },
  ];

  const DIFFICULTY_OPTIONS: DropdownOption[] = [
    { id: 'all', label: 'All Levels', description: 'Any difficulty level', icon: '📊', count: items.length },
    { id: 'easy', label: 'Easy', description: 'Quick and simple actions', icon: '🟢', count: items.filter(i => i.difficulty === 'easy').length },
    { id: 'medium', label: 'Medium', description: 'Moderate time commitment', icon: '🟡', count: items.filter(i => i.difficulty === 'medium').length },
    { id: 'hard', label: 'Hard', description: 'Significant involvement required', icon: '🔴', count: items.filter(i => i.difficulty === 'hard').length },
  ];

  const IMPACT_OPTIONS: DropdownOption[] = [
    { id: 'all', label: 'All Impact Levels', description: 'Any impact level', icon: '💥', count: items.length },
    { id: 'high', label: 'High Impact', description: 'Major potential for change', icon: '🚀', count: items.filter(i => i.impact_level === 'high').length },
    { id: 'medium', label: 'Medium Impact', description: 'Moderate potential for change', icon: '⭐', count: items.filter(i => i.impact_level === 'medium').length },
    { id: 'low', label: 'Low Impact', description: 'Building awareness and support', icon: '💡', count: items.filter(i => i.impact_level === 'low').length },
  ];

  const SORT_OPTIONS: DropdownOption[] = [
    { id: 'trending', label: 'Trending', description: 'Most popular actions', icon: '📈' },
    { id: 'impact', label: 'Impact', description: 'Highest potential impact', icon: '💥' },
    { id: 'recent', label: 'Recent', description: 'Most recently added', icon: '🕒' },
    { id: 'completion', label: 'Participation', description: 'Most completed actions', icon: '👥' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Explore Actions</h1>
        <p className="text-base sm:text-lg text-grayText">Discover ways to make a difference in your community and beyond</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-card border border-grayBorder p-4 sm:p-6 mb-6">
        {/* Search Bar with Mobile Filter Button */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search actions, topics, organizations..."
            className="flex-1 p-3 sm:p-4 bg-white border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="sm:hidden flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg touch-manipulation"
          >
            <span>🔍</span>
            <span className="text-sm font-medium">Filter</span>
            {hasActiveFilters && (
              <span className="bg-white text-primary text-xs px-1.5 py-0.5 rounded-full ml-1">
                !
              </span>
            )}
          </button>
        </div>

        {/* Desktop Filter Dropdowns */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <FilterDropdown
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Categories"
            className="text-xs sm:text-sm"
          />
          
          <FilterDropdown
            options={LOCATION_OPTIONS}
            value={selectedLocation}
            onChange={setSelectedLocation}
            placeholder="Locations"
            className="text-xs sm:text-sm"
          />
          
          <FilterDropdown
            options={DIFFICULTY_OPTIONS}
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            placeholder="Difficulty"
            className="text-xs sm:text-sm"
          />
          
          <FilterDropdown
            options={IMPACT_OPTIONS}
            value={selectedImpact}
            onChange={setSelectedImpact}
            placeholder="Impact"
            className="text-xs sm:text-sm"
          />
          
          <FilterDropdown
            options={SORT_OPTIONS}
            value={selectedSort}
            onChange={setSelectedSort}
            placeholder="Sort"
            className="text-xs sm:text-sm"
          />
        </div>

        {/* Results Summary and Clear Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm text-grayText">
              {isLoading ? 'Loading...' : `${filteredItems.length} of ${items.length} actions`}
            </span>
            {!isLoading && (
              <button
                onClick={() => window.location.reload()}
                className="text-xs sm:text-sm text-primary hover:text-primaryDark transition-colors flex items-center gap-1"
                title="Refresh data"
              >
                🔄 Refresh
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primaryDark transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Results */}
      {!isLoading && (
        <div className="space-y-4 sm:space-y-6">
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
                  <div className="bg-card border border-grayBorder rounded-card p-4 sm:p-6 hover:border-primary transition-all hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-text break-words">{item.title}</h3>
                          {item.trending && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                              🔥 Trending
                            </span>
                          )}
                          {item.featured && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <p className="text-grayText mb-3 text-sm sm:text-base">{item.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
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
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-grayText">
                          <span className="flex items-center gap-1">📍 {item.location}</span>
                          <span className="flex items-center gap-1">🏢 {item.organization}</span>
                          <span className="flex items-center gap-1">👥 {item.completion_count} completed</span>
                          <span className="capitalize flex items-center gap-1">📂 {item.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full sm:w-auto sm:ml-4">
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                            {item.difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact_level)}`}>
                            {item.impact_level} impact
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors text-sm sm:text-base"
                        onClick={() => {
                          trackItemInteraction(item.id, 'click');
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
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-primary hover:text-primaryDark transition-colors text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Mobile Filter Drawer */}
      <ResponsiveDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter Actions"
      >
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedCategory(option.id)}
                  className={`p-3 rounded-lg text-sm text-left transition-all ${
                    selectedCategory === option.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-grayText hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs opacity-75">({option.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Location</label>
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedLocation(option.id)}
                  className={`p-3 rounded-lg text-sm text-left transition-all ${
                    selectedLocation === option.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-grayText hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs opacity-75">({option.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedDifficulty(option.id)}
                  className={`p-3 rounded-lg text-sm text-center transition-all ${
                    selectedDifficulty === option.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-grayText hover:bg-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Impact Filter */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Impact Level</label>
            <div className="grid grid-cols-3 gap-2">
              {IMPACT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedImpact(option.id)}
                  className={`p-3 rounded-lg text-sm text-center transition-all ${
                    selectedImpact === option.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-grayText hover:bg-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Sort By</label>
            <div className="space-y-2">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSort(option.id)}
                  className={`w-full p-3 rounded-lg text-sm text-left transition-all ${
                    selectedSort === option.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-grayText hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{option.icon}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="flex-1 py-3 bg-gray-100 text-grayText rounded-lg text-center font-medium hover:bg-gray-200 transition-all"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-3 bg-primary text-white rounded-lg text-center font-medium hover:bg-primaryDark transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </ResponsiveDrawer>
    </div>
  );
}
