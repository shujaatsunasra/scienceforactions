"use client";

import React, { useState, useEffect } from 'react';
import { useEmotionAwareUI } from '@/services/emotionAwareUIEngine';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  pageType?: 'home' | 'explore' | 'tool' | 'profile' | 'admin';
}

export default function AdaptiveLayout({ children, pageType = 'home' }: AdaptiveLayoutProps) {
  const { uiState, behaviorData } = useEmotionAwareUI();
  const [layoutMode, setLayoutMode] = useState<'standard' | 'zen' | 'power-user'>('standard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simplified layout mode for better performance
    // Always use standard mode to avoid performance issues from mode switching
    setLayoutMode('standard');
    setIsLoading(false);
  }, []);

  // Generate layout classes based on UI state - simplified for performance
  const getLayoutClasses = () => {
    return 'min-h-screen transition-opacity duration-300 ease-in-out max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  };

  // Generate animation classes - optimized for performance
  const getAnimationClasses = () => {
    const animationMap = {
      none: '',
      subtle: 'animate-fade-in',
      moderate: 'animate-fade-in',
      vibrant: 'animate-fade-in'
    };

    return animationMap[uiState.animationIntensity];
  };

  // Generate interaction hints if needed - disabled for performance
  const renderInteractionHints = () => {
    // Disabled to improve performance
    return null;
  };

  // Render predictive action suggestions - disabled for performance
  const renderPredictiveActions = () => {
    // Disabled to improve performance and reduce visual clutter
    return null;
  };

  // Render engagement feedback - simplified for performance
  const renderEngagementFeedback = () => {
    // Disabled to reduce visual clutter and improve performance
    return null;
  };

  // Render layout mode indicator (for development/admin)
  const renderLayoutModeIndicator = () => {
    // Only show in admin mode or development
    if (pageType !== 'admin') return null;

    return (
      <div className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded text-xs z-30">
        <div>Mode: {layoutMode}</div>
        <div>Engagement: {behaviorData.engagementLevel}</div>
        <div>Complexity: {uiState.layoutComplexity}</div>
        <div>Session: {Math.round(behaviorData.sessionDuration / 1000)}s</div>
      </div>
    );
  };

  // Zen mode layout (minimal, focused)
  const renderZenMode = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900">Science for Action</h1>
          <p className="text-gray-600 mt-2">Simple. Focused. Effective.</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          {children}
        </div>
      </div>
      {renderInteractionHints()}
    </div>
  );

  // Power user mode layout (dense, feature-rich)
  const renderPowerUserMode = () => (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          {children}
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-2">
              {uiState.predictiveActions.map((action, index) => (
                <button
                  key={index}
                  className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Activity Summary</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Interactions: {behaviorData.interactionCount}</div>
              <div>Scroll: {Math.round(behaviorData.scrollDepth)}%</div>
              <div>Session: {Math.round(behaviorData.sessionDuration / 1000)}s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Standard mode layout (balanced) - optimized for performance
  const renderStandardMode = () => (
    <div className={getLayoutClasses()}>
      <main className="pt-16 pb-8">
        {children}
      </main>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Adapting interface to your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Layout Mode Rendering */}
      {layoutMode === 'zen' && renderZenMode()}
      {layoutMode === 'power-user' && renderPowerUserMode()}
      {layoutMode === 'standard' && renderStandardMode()}

      {/* Layout Mode Indicator */}
      {renderLayoutModeIndicator()}

      {/* Auto-suggestions overlay - disabled for performance */}
      
      {/* Contextual help - disabled for performance */}

      {/* Performance indicator - simplified */}
      <div className="fixed bottom-2 right-2 text-xs text-gray-400 z-20 opacity-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span>Adaptive UI</span>
        </div>
      </div>
    </>
  );
}

