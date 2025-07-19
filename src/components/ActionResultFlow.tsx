"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useActionEngagement, type GeneratedAction, type ActionIntentData } from '@/context/ActionEngagementContext';
import AdaptiveActionCard from './AdaptiveActionCard';
import ActionDrawer from './ActionDrawer';
import LoadingSpinner from './LoadingSpinner';
import ToastNotification from './ToastNotification';
import { navigationService } from '@/services/navigationService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionButton = motion.button as any;

interface ActionResultFlowProps {
  intentData: ActionIntentData;
  onBack?: () => void;
  onReset?: () => void;
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

  const [selectedAction, setSelectedAction] = useState<GeneratedAction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'stack'>('stack');
  const [filterTags, setFilterTags] = useState<string[]>([]);

  // Generate actions when component mounts or intent changes
  useEffect(() => {
    if (intentData) {
      generateAdaptiveActions(intentData);
    }
  }, [intentData, generateAdaptiveActions]);

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

  // Filter actions based on selected tags
  const filteredActions = React.useMemo(() => {
    if (filterTags.length === 0) return generatedActions;
    return generatedActions.filter(action => 
      filterTags.every(tag => action.tags.includes(tag))
    );
  }, [generatedActions, filterTags]);

  // Get unique tags for filtering
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    generatedActions.forEach(action => {
      action.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [generatedActions]);

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
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with navigation and controls */}
      <MotionDiv
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center gap-4">
          <MotionButton
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="text-grayText text-base font-medium hover:underline px-2 py-2 rounded-pill transition-all"
            onClick={onBack}
          >
            ← Back
          </MotionButton>
          
          <div className="text-lg text-text">
            Results for <span className="font-bold text-primary">{intentData.intent}</span> about{' '}
            <span className="font-bold text-primary">{intentData.topic}</span> in{' '}
            <span className="font-bold text-primary">{intentData.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Display mode toggle */}
          <div className="flex bg-graySoft rounded-pill p-1">
            <MotionButton
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-pill text-sm transition-all ${
                displayMode === 'stack'
                  ? 'bg-primary text-white'
                  : 'text-grayText hover:text-text'
              }`}
              onClick={() => setDisplayMode('stack')}
            >
              Stack
            </MotionButton>
            <MotionButton
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-pill text-sm transition-all ${
                displayMode === 'grid'
                  ? 'bg-primary text-white'
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
            className="text-grayText text-base font-medium hover:underline px-2 py-2 rounded-pill transition-all"
            onClick={onReset}
          >
            Reset
          </MotionButton>
        </div>
      </MotionDiv>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <MotionDiv
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-grayText self-center mr-2">Filter by:</span>
            {allTags.map(tag => (
              <MotionButton
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 rounded-pill text-sm border transition-all ${
                  filterTags.includes(tag)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-graySoft text-grayText border-grayBorder hover:border-primary'
                }`}
                onClick={() => {
                  setFilterTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag}
              </MotionButton>
            ))}
            {filterTags.length > 0 && (
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 rounded-pill text-sm text-grayText hover:text-text"
                onClick={() => setFilterTags([])}
              >
                Clear all
              </MotionButton>
            )}
          </div>
        </MotionDiv>
      )}

      {/* Loading state */}
      {isGenerating && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <LoadingSpinner size="large" />
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-grayText text-center"
          >
            <p className="text-lg mb-2">Generating personalized actions...</p>
            <p className="text-sm">Analyzing your intent, topic preferences, and location</p>
          </MotionDiv>
        </MotionDiv>
      )}

      {/* Results grid/stack */}
      {!isGenerating && filteredActions.length > 0 && (
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`${
            displayMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }`}
        >
          <AnimatePresence>
            {filteredActions.map((action, index) => (
              <AdaptiveActionCard
                key={action.id}
                action={action}
                index={index}
                displayMode={displayMode}
                onSelect={() => handleActionSelect(action)}
                onSave={() => handleActionSave(action.id)}
                onRate={(rating: number, feedback: string | undefined) => handleActionRate(action.id, rating, feedback)}
              />
            ))}
          </AnimatePresence>
        </MotionDiv>
      )}

      {/* Empty state */}
      {!isGenerating && filteredActions.length === 0 && generatedActions.length > 0 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-grayText text-lg mb-4">No actions match your current filters.</p>
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-primary text-white rounded-pill hover:bg-primaryDark transition-all"
            onClick={() => setFilterTags([])}
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
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No actions found
            </h3>
            <p className="text-grayText mb-6">
              We couldn&apos;t generate specific actions for &quot;{intentData.topic}&quot; in &quot;{intentData.location}&quot;. 
              Let&apos;s try some alternatives.
            </p>
            <div className="space-y-3">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primaryDark transition-all"
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
                className="w-full px-6 py-3 bg-graySoft text-text rounded-xl hover:bg-grayBorder transition-all"
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
