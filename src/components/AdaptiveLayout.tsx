"use client";

import React, { useState, useEffect } from 'react';
import { useEmotionAwareUI } from '@/services/emotionAwareUIEngine';
import { autonomousEngine } from '@/services/autonomousEvolutionEngine';
import EvolutionDashboard from './EvolutionDashboard';
import Navigation from './Navigation';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  pageType?: 'home' | 'explore' | 'tool' | 'profile' | 'admin';
}

export default function AdaptiveLayout({ children, pageType = 'home' }: AdaptiveLayoutProps) {
  const { uiState, behaviorData } = useEmotionAwareUI();
  const [showEvolutionDashboard, setShowEvolutionDashboard] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'standard' | 'zen' | 'power-user'>('standard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Determine layout mode based on user behavior and engagement
    if (behaviorData.engagementLevel === 'low' || behaviorData.frustrationSignals > 2) {
      setLayoutMode('zen');
    } else if (behaviorData.engagementLevel === 'high' && behaviorData.interactionCount > 50) {
      setLayoutMode('power-user');
    } else {
      setLayoutMode('standard');
    }

    setIsLoading(false);
  }, [behaviorData]);

  // Generate layout classes based on UI state
  const getLayoutClasses = () => {
    const baseClasses = 'min-h-screen transition-all duration-300 ease-in-out';
    const complexityClasses = {
      minimal: 'max-w-4xl mx-auto px-4',
      standard: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      detailed: 'max-w-full px-2 sm:px-4 lg:px-6'
    };

    const colorSchemeClasses = {
      warm: 'bg-gradient-to-br from-orange-50 to-red-50 text-orange-900',
      cool: 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900',
      neutral: 'bg-gradient-to-br from-gray-50 to-slate-50 text-gray-900',
      'high-contrast': 'bg-white text-black'
    };

    const densityClasses = {
      sparse: 'space-y-8',
      normal: 'space-y-6',
      dense: 'space-y-4'
    };

    return `${baseClasses} ${complexityClasses[uiState.layoutComplexity]} ${colorSchemeClasses[uiState.colorScheme]} ${densityClasses[uiState.contentDensity]}`;
  };

  // Generate animation classes
  const getAnimationClasses = () => {
    const animationMap = {
      none: '',
      subtle: 'animate-fade-in',
      moderate: 'animate-fade-in transition-transform hover:scale-[1.02]',
      vibrant: 'animate-fade-in transition-all hover:scale-105 hover:shadow-lg'
    };

    return animationMap[uiState.animationIntensity];
  };

  // Generate interaction hints if needed
  const renderInteractionHints = () => {
    if (!uiState.interactionHints) return null;

    return (
      <div className="fixed bottom-20 left-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-40 animate-bounce">
        <div className="text-sm font-medium">💡 Tip</div>
        <div className="text-xs">Click any cause to learn more and take action!</div>
      </div>
    );
  };

  // Render predictive action suggestions
  const renderPredictiveActions = () => {
    if (!uiState.predictiveActions.length) return null;

    return (
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-40 max-w-sm">
        <div className="text-sm font-medium mb-2">🤖 Suggested Actions</div>
        <div className="space-y-1">
          {uiState.predictiveActions.map((action, index) => (
            <button
              key={index}
              className="block w-full text-left text-xs text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                // In a real implementation, these would trigger actual actions
                // Production: debug output removed
              }}
            >
              • {action}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render engagement feedback
  const renderEngagementFeedback = () => {
    if (behaviorData.engagementLevel === 'high' && Math.random() > 0.95) {
      return (
        <div className="fixed top-20 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-40 animate-slide-in-right">
          <div className="text-sm font-medium">🎉 You're making a difference!</div>
          <div className="text-xs">Your engagement helps strengthen our community</div>
        </div>
      );
    }

    return null;
  };

  // Render layout mode indicator (for development/admin)
  const renderLayoutModeIndicator = () => {
    if (!showEvolutionDashboard) return null;

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
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen p-4">
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-900">Quick Actions</div>
            {uiState.predictiveActions.map((action, index) => (
              <button
                key={index}
                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              {children}
            </div>
            <div className="col-span-4 space-y-4">
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
        </main>
      </div>
    </div>
  );

  // Standard mode layout (balanced)
  const renderStandardMode = () => (
    <div className={getLayoutClasses()}>
      <Navigation />
      <main className={`pt-16 pb-8 ${getAnimationClasses()}`}>
        {children}
      </main>
      {renderInteractionHints()}
      {renderPredictiveActions()}
      {renderEngagementFeedback()}
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

      {/* Evolution Dashboard */}
      <EvolutionDashboard
        isVisible={showEvolutionDashboard}
        onToggle={() => setShowEvolutionDashboard(!showEvolutionDashboard)}
      />

      {/* Layout Mode Indicator */}
      {renderLayoutModeIndicator()}

      {/* Auto-suggestions overlay */}
      {uiState.autoSuggest && behaviorData.sessionDuration > 30000 && (
        <div className="fixed bottom-32 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-40 max-w-xs animate-fade-in">
          <div className="text-sm font-medium mb-2">💡 Personalized for you</div>
          <div className="text-xs">
            Based on your activity, you might be interested in {pageType === 'explore' ? 'climate action causes' : 'taking action on causes you care about'}.
          </div>
          <button
            className="text-xs text-blue-200 hover:text-white mt-2 block"
            onClick={() => {
              // Implement suggestion acceptance logic
              // Production: debug output removed
            }}
          >
            Show me →
          </button>
        </div>
      )}

      {/* Contextual help based on user behavior */}
      {behaviorData.frustrationSignals > 1 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded-lg shadow-xl z-50 max-w-md">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">Need help?</div>
            <div className="text-sm mb-4">
              We noticed you might be having trouble. Would you like some guidance?
            </div>
            <div className="space-x-3">
              <button
                className="bg-white text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100"
                onClick={() => {
                  // Trigger help system
                  setLayoutMode('zen');
                }}
              >
                Yes, simplify interface
              </button>
              <button
                className="border border-white text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700"
                onClick={() => {
                  // Dismiss help
                  // Production: debug output removed
                }}
              >
                No, I'm fine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance indicator */}
      <div className="fixed bottom-2 right-2 text-xs text-gray-400 z-20">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            behaviorData.sessionDuration < 10000 ? 'bg-green-400' :
            behaviorData.sessionDuration < 30000 ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span>Adaptive UI Active</span>
        </div>
      </div>
    </>
  );
}

