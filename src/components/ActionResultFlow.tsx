"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useActionEngagement, type GeneratedAction, type ActionIntentData } from '@/context/ActionEngagementContext';
import AdaptiveActionCard from './AdaptiveActionCard';
import ActionDrawer from './ActionDrawer';
import LoadingSpinner from './LoadingSpinner';
import ToastNotification from './ToastNotification';
import { navigationService } from '@/services/navigationService';
import { useDebounce } from '@/hooks/useDebounce';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion.button as any;

interface ActionResultFlowProps {
  intentData: ActionIntentData;
  onBack?: () => void;
  onReset?: () => void;
}

// Enhanced filtering interface
interface FilterState {
  tags: string[];
  urgency: number[];
  impact: number[];
  timeCommitment: string[];
  searchQuery: string;
}

const ActionResultFlow: React.FC<ActionResultFlowProps> = ({
  intentData,
  onBack,
  onReset
}) => {
  const router = useRouter();
  const {
    generatedActions,
    isGenerating,
    generateAdaptiveActions,
    completeAction,
    saveAction,
    trackEngagement,
    updateUserPreferences
  } = useActionEngagement();

  // Enhanced state management
  const [selectedAction, setSelectedAction] = useState<GeneratedAction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'stack'>('stack');
  const [filterState, setFilterState] = useState<FilterState>({
    tags: [],
    urgency: [],
    impact: [],
    timeCommitment: [],
    searchQuery: ''
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(filterState.searchQuery, 300);

  // Viewport detection for responsive behavior
  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
      // Auto-adjust display mode based on screen size
      if (window.innerWidth <= 768) {
        setDisplayMode('stack');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Auto-generate actions when component mounts or intent changes
  useEffect(() => {
    console.log('🚀 ActionResultFlow: Effect triggered with intentData:', intentData);
    if (intentData) {
      console.log('📞 ActionResultFlow: Calling generateAdaptiveActions');
      generateAdaptiveActions(intentData).then(actions => {
        console.log('✅ ActionResultFlow: Actions received:', actions?.length || 0);
      }).catch(error => {
        console.error('❌ ActionResultFlow: Error generating actions:', error);
      });
    }
  }, [intentData, generateAdaptiveActions]);

  // Real-time filtering with multiple criteria
  const filteredActions = useMemo(() => {
    console.log('🔍 Real-time filtering actions:', {
      total: generatedActions?.length || 0,
      filters: filterState,
      searchQuery: debouncedSearchQuery
    });
    
    if (!generatedActions || generatedActions.length === 0) {
      console.log('📭 No actions to filter');
      return [];
    }

    let filtered = [...generatedActions];

    // Text search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(action => 
        action.title.toLowerCase().includes(query) ||
        action.description.toLowerCase().includes(query) ||
        action.organizationName?.toLowerCase().includes(query) ||
        action.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Tag filters
    if (filterState.tags.length > 0) {
      filtered = filtered.filter(action => 
        filterState.tags.every(tag => action.tags?.includes(tag))
      );
    }

    // Urgency filters
    if (filterState.urgency.length > 0) {
      filtered = filtered.filter(action => 
        filterState.urgency.includes(action.urgency)
      );
    }

    // Impact filters  
    if (filterState.impact.length > 0) {
      filtered = filtered.filter(action => 
        filterState.impact.includes(action.impact)
      );
    }

    // Time commitment filters
    if (filterState.timeCommitment.length > 0) {
      filtered = filtered.filter(action => 
        filterState.timeCommitment.some(time => 
          action.timeCommitment?.toLowerCase().includes(time.toLowerCase())
        )
      );
    }

    console.log('✅ Filtered results:', {
      filteredCount: filtered.length,
      originalCount: generatedActions.length
    });
    
    return filtered;
  }, [generatedActions, filterState, debouncedSearchQuery]);

  // Get unique filter options from current actions
  const filterOptions = useMemo(() => {
    if (!generatedActions || generatedActions.length === 0) {
      return { tags: [], urgencyLevels: [], impactLevels: [], timeCommitments: [] };
    }

    const tags = new Set<string>();
    const urgencyLevels = new Set<number>();
    const impactLevels = new Set<number>();
    const timeCommitments = new Set<string>();

    generatedActions.forEach(action => {
      action.tags.forEach(tag => tags.add(tag));
      urgencyLevels.add(action.urgency);
      impactLevels.add(action.impact);
      if (action.timeCommitment) {
        timeCommitments.add(action.timeCommitment);
      }
    });

    return {
      tags: Array.from(tags).sort(),
      urgencyLevels: Array.from(urgencyLevels).sort(),
      impactLevels: Array.from(impactLevels).sort(),
      timeCommitments: Array.from(timeCommitments).sort()
    };
  }, [generatedActions]);

  // Safe navigation handlers
  const handleBackNavigation = useCallback(async () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback: navigate to tool page
      await navigationService.navigateTo(router, '/tool');
    }
  }, [onBack, router]);

  const handleResetNavigation = useCallback(async () => {
    if (onReset) {
      onReset();
    } else {
      // Fallback: navigate to main page
      await navigationService.navigateTo(router, '/main');
    }
  }, [onReset, router]);

  // Handle action selection and drawer opening
  const handleActionSelect = useCallback((action: GeneratedAction) => {
    setSelectedAction(action);
    setIsDrawerOpen(true);
    
    // Track engagement
    trackEngagement(action.id, 0, 'view');
  }, [trackEngagement]);

  // Handle action completion
  const handleActionComplete = useCallback((actionId: string, feedback?: Record<string, unknown>) => {
    completeAction(actionId, feedback);
    setToast({
      message: 'Action completed! Your engagement has been recorded.',
      type: 'success'
    });
    
    // Close drawer after completion
    setTimeout(() => {
      setIsDrawerOpen(false);
      setSelectedAction(null);
    }, 1500);
  }, [completeAction]);

  // Handle action saving
  const handleActionSave = useCallback((actionId: string) => {
    saveAction(actionId);
    setToast({
      message: 'Action saved to your profile!',
      type: 'success'
    });
  }, [saveAction]);

  // Handle action rating for ML improvement
  const handleActionRate = useCallback((actionId: string, rating: number, feedback?: string) => {
    updateUserPreferences(actionId, rating, feedback);
    setToast({
      message: 'Thank you for your feedback! This helps us improve recommendations.',
      type: 'info'
    });
  }, [updateUserPreferences]);

  // Get unique tags for filtering (legacy compatibility)
  const allTags = useMemo(() => {
    return filterOptions.tags;
  }, [filterOptions]);

  // Handle filter changes
  const handleFilterChange = useCallback((type: keyof FilterState, value: any) => {
    setFilterState(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterState({
      tags: [],
      urgency: [],
      impact: [],
      timeCommitment: [],
      searchQuery: ''
    });
  }, []);

  // Animation variants for results container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Enhanced Mobile-First Header */}
      <MotionDiv
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col space-y-4 mb-6 lg:mb-8"
      >
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <MotionButton
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center gap-2 text-grayText text-sm font-medium hover:text-text transition-colors px-3 py-2 rounded-lg hover:bg-graySoft"
            onClick={onBack}
          >
            <span className="text-lg">←</span>
            <span className="hidden sm:inline">Back</span>
          </MotionButton>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle */}
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden flex items-center gap-1 px-3 py-2 bg-graySoft text-grayText rounded-lg text-sm font-medium"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <span>🔍</span>
              <span>Filter</span>
              {(filterState.tags.length > 0 || filterState.searchQuery) && (
                <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                  {filterState.tags.length + (filterState.searchQuery ? 1 : 0)}
                </span>
              )}
            </MotionButton>

            {/* Display Mode Toggle */}
            <div className="hidden sm:flex bg-graySoft rounded-lg p-1">
              <MotionButton
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  displayMode === 'stack'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-grayText hover:text-text'
                }`}
                onClick={() => setDisplayMode('stack')}
              >
                Stack
              </MotionButton>
              <MotionButton
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  displayMode === 'grid'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-grayText hover:text-text'
                }`}
                onClick={() => setDisplayMode('grid')}
              >
                Grid
              </MotionButton>
            </div>

            <MotionButton
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-grayText text-sm font-medium hover:text-text transition-colors px-3 py-2 rounded-lg hover:bg-graySoft"
              onClick={onReset}
            >
              Reset
            </MotionButton>
          </div>
        </div>

        {/* Intent Summary */}
        <div className="text-center lg:text-left">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-text leading-tight">
            Results for <span className="text-primary">{intentData.intent}</span>
          </h1>
          <p className="text-sm sm:text-base text-grayText mt-1">
            About <span className="font-semibold text-text">{intentData.topic}</span> in{' '}
            <span className="font-semibold text-text">{intentData.location}</span>
          </p>
        </div>

        {/* Desktop Search and Filters */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search actions..."
              value={filterState.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-4 py-2 border border-grayBorder rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-grayText font-medium">Filters:</span>
            
            {/* Urgency Filter */}
            <select
              value={filterState.urgency[0] || ''}
              onChange={(e) => handleFilterChange('urgency', e.target.value ? [parseInt(e.target.value)] : [])}
              className="px-3 py-1.5 border border-grayBorder rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Any Urgency</option>
              {filterOptions.urgencyLevels.map(level => (
                <option key={level} value={level}>Urgency {level}</option>
              ))}
            </select>

            {/* Impact Filter */}
            <select
              value={filterState.impact[0] || ''}
              onChange={(e) => handleFilterChange('impact', e.target.value ? [parseInt(e.target.value)] : [])}
              className="px-3 py-1.5 border border-grayBorder rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Any Impact</option>
              {filterOptions.impactLevels.map(level => (
                <option key={level} value={level}>Impact {level}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {(filterState.tags.length > 0 || filterState.searchQuery || filterState.urgency.length > 0 || filterState.impact.length > 0) && (
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 text-sm text-grayText hover:text-text border border-grayBorder rounded-md hover:border-primary transition-all"
                onClick={clearAllFilters}
              >
                Clear All
              </MotionButton>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="text-xs sm:text-sm text-grayText font-medium self-start sm:self-center">
                Topics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allTags.slice(0, viewportWidth <= 768 ? 8 : 12).map(tag => (
                  <MotionButton
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all touch-manipulation ${
                      filterState.tags.includes(tag)
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-graySoft text-grayText border-grayBorder hover:border-primary hover:text-text hover:bg-white'
                    }`}
                    onClick={() => {
                      const newTags = filterState.tags.includes(tag)
                        ? filterState.tags.filter((t: string) => t !== tag)
                        : [...filterState.tags, tag];
                      
                      handleFilterChange('tags', newTags);
                    }}
                  >
                    {tag}
                  </MotionButton>
                ))}
                
                {filterState.tags.length > 0 && (
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2.5 py-1 rounded-full text-xs text-grayText hover:text-text border border-transparent hover:border-grayBorder transition-all"
                    onClick={() => handleFilterChange('tags', [])}
                  >
                    Clear topics
                  </MotionButton>
                )}
              </div>
            </div>
            
            {/* Filter Results Indicator */}
            {(filterState.tags.length > 0 || filterState.searchQuery) && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs sm:text-sm text-grayText bg-graySoft px-3 py-2 rounded-lg"
              >
                Showing <span className="font-semibold text-text">{filteredActions.length}</span> of{' '}
                <span className="font-semibold text-text">{generatedActions.length}</span> actions
              </MotionDiv>
            )}
          </div>
        )}
      </MotionDiv>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            {/* Backdrop */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            
            {/* Drawer */}
            <MotionDiv
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text">Filter Actions</h3>
                <MotionButton
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-grayText hover:text-text rounded-lg hover:bg-graySoft transition-all"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  ✕
                </MotionButton>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={filterState.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="w-full px-4 py-3 border border-grayBorder rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                />
              </div>

              {/* Filter Sections */}
              <div className="space-y-6">
                {/* Topics */}
                {allTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text mb-3">Topics</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <MotionButton
                          key={tag}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                            filterState.tags.includes(tag)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-graySoft text-grayText border-grayBorder'
                          }`}
                          onClick={() => {
                            const newTags = filterState.tags.includes(tag)
                              ? filterState.tags.filter((t: string) => t !== tag)
                              : [...filterState.tags, tag];
                            handleFilterChange('tags', newTags);
                          }}
                        >
                          {tag}
                        </MotionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-text mb-3">Urgency Level</label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.urgencyLevels.map(level => (
                      <MotionButton
                        key={level}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          filterState.urgency.includes(level)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-graySoft text-grayText border-grayBorder'
                        }`}
                        onClick={() => {
                          const newUrgency = filterState.urgency.includes(level)
                            ? filterState.urgency.filter(u => u !== level)
                            : [...filterState.urgency, level];
                          handleFilterChange('urgency', newUrgency);
                        }}
                      >
                        Level {level}
                      </MotionButton>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <label className="block text-sm font-medium text-text mb-3">Impact Level</label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.impactLevels.map(level => (
                      <MotionButton
                        key={level}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          filterState.impact.includes(level)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-graySoft text-grayText border-grayBorder'
                        }`}
                        onClick={() => {
                          const newImpact = filterState.impact.includes(level)
                            ? filterState.impact.filter(i => i !== level)
                            : [...filterState.impact, level];
                          handleFilterChange('impact', newImpact);
                        }}
                      >
                        Level {level}
                      </MotionButton>
                    ))}
                  </div>
                </div>

                {/* Time Commitment */}
                <div>
                  <label className="block text-sm font-medium text-text mb-3">Time Commitment</label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.timeCommitments.map(time => (
                      <MotionButton
                        key={time}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          filterState.timeCommitment.includes(time)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-graySoft text-grayText border-grayBorder'
                        }`}
                        onClick={() => {
                          const newTime = filterState.timeCommitment.includes(time)
                            ? filterState.timeCommitment.filter(t => t !== time)
                            : [...filterState.timeCommitment, time];
                          handleFilterChange('timeCommitment', newTime);
                        }}
                      >
                        {time}
                      </MotionButton>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-grayBorder">
                <MotionButton
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 text-grayText border border-grayBorder rounded-lg text-center font-medium hover:border-primary hover:text-text transition-all"
                  onClick={clearAllFilters}
                >
                  Clear All
                </MotionButton>
                <MotionButton
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-primary text-white rounded-lg text-center font-medium hover:bg-opacity-90 transition-all"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  Show Results ({filteredActions.length})
                </MotionButton>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>

      {/* Loading state - Enhanced mobile UX */}
      {isGenerating && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 sm:py-16 px-4"
        >
          <LoadingSpinner size="large" />
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-grayText text-center max-w-md"
          >
            <p className="text-base sm:text-lg mb-2 font-medium">Generating personalized actions...</p>
            <p className="text-xs sm:text-sm">Analyzing your intent, topic preferences, and location</p>
          </MotionDiv>
        </MotionDiv>
      )}

      {/* Results grid/stack - Fully responsive */}
      {!isGenerating && filteredActions.length > 0 && (
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`${
            displayMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
              : 'flex flex-col gap-3 sm:gap-4'
          }`}
        >
          <AnimatePresence mode="wait">
            {filteredActions.map((action, index) => (
              <AdaptiveActionCard
                key={action.id}
                action={action}
                index={index}
                displayMode={displayMode}
                onSelect={() => handleActionSelect(action)}
                onSave={() => handleActionSave(action.id)}
                onRate={(rating: number, feedback?: string) => handleActionRate(action.id, rating, feedback)}
              />
            ))}
          </AnimatePresence>
        </MotionDiv>
      )}

      {/* Empty state - filtered results */}
      {!isGenerating && filteredActions.length === 0 && generatedActions.length > 0 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16 px-4"
        >
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <p className="text-grayText text-base sm:text-lg mb-4">No actions match your current filters.</p>
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-pill hover:bg-primaryDark transition-all text-sm sm:text-base touch-manipulation"
            onClick={() => clearAllFilters()}
          >
            Clear filters
          </MotionButton>
        </MotionDiv>
      )}

      {/* Empty state - no actions generated */}
      {!isGenerating && generatedActions.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16 px-4"
        >
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-text mb-2">
              No actions found
            </h3>
            <p className="text-grayText mb-6 text-sm sm:text-base leading-relaxed">
              We couldn&apos;t generate specific actions for &quot;{intentData.topic}&quot; in &quot;{intentData.location}&quot;. 
              Let&apos;s try some alternatives.
            </p>
            <div className="space-y-3">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 sm:px-6 py-3 bg-primary text-white rounded-xl hover:bg-primaryDark transition-all text-sm sm:text-base touch-manipulation"
                onClick={() => {
                  // Try regenerating with a more generic location
                  const fallbackData = { ...intentData, location: 'Local' };
                  generateAdaptiveActions(fallbackData);
                }}
              >
                Try with &quot;Local&quot; instead
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 sm:px-6 py-3 bg-graySoft text-text rounded-xl hover:bg-grayBorder transition-all text-sm sm:text-base touch-manipulation"
                onClick={onBack}
              >
                Choose a different topic
              </MotionButton>
            </div>
          </div>
        </MotionDiv>
      )}

      {/* Action drawer for detailed interaction */}
      <ActionDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAction(null);
        }}
        action={selectedAction}
        onComplete={handleActionComplete}
        onSave={() => selectedAction && handleActionSave(selectedAction.id)}
        onRate={(rating: number, feedback: string | undefined) => selectedAction && handleActionRate(selectedAction.id, rating, feedback)}
      />

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionResultFlow;
