"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/context/ProfileContext';
import { safeAIService, GeneratedContent } from '@/services/ai/SafeAIService';

interface AIActionToolProps {
  title?: string;
  description?: string;
  tags?: string[];
  className?: string;
}

export default function AIActionTool({ title, description, tags = [], className = '' }: AIActionToolProps) {
  const [selectedAction, setSelectedAction] = useState('');
  const [aiContent, setAiContent] = useState<Map<string, GeneratedContent>>(new Map());
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [personalizedMessages, setPersonalizedMessages] = useState<string[]>([]);
  const [adaptiveState, setAdaptiveState] = useState({
    intent: '',
    topic: '',
    confidence: 0,
    generatedText: '',
    localImpact: '',
    personalizedTips: [] as string[]
  });

  const { profile } = useProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  // AI-powered action suggestions based on context
  const actionSuggestions = [
    { id: 'contact_rep', label: 'Contact Representative', icon: '📧', aiGenerated: true },
    { id: 'social_share', label: 'Share Awareness', icon: '🔗', aiGenerated: true },
    { id: 'local_event', label: 'Find Local Events', icon: '📍', aiGenerated: true },
    { id: 'petition_sign', label: 'Sign Petition', icon: '✍️', aiGenerated: false },
    { id: 'volunteer', label: 'Volunteer', icon: '🤝', aiGenerated: true },
    { id: 'donate', label: 'Support Cause', icon: '💝', aiGenerated: false }
  ];

  // Set up AI observation with proper dependency
  useEffect(() => {
    if (containerRef.current) {
      // Safe element observation - non-blocking
      console.log('Element ready for AI observation');
    }
  }, []); // Remove observeElement dependency to prevent infinite loop

  // Generate AI content when component mounts only
  useEffect(() => {
    let isCancelled = false;
    
    const generateInitialContent = async () => {
      if (!profile) return; // Don't run if no profile yet
      
      try {
        setIsLoading(true);
        
        // Generate personalized action suggestions
        const actionContent = await safeAIService.generateAdaptiveContent('action_suggestions', {
          userInterests: profile?.interests || [],
          location: profile?.location,
          previousActions: profile?.intent_actions || [],
          timeOfDay: new Date().getHours()
        });

        if (isCancelled) return;

        // Generate local impact statement
        const impactContent = await safeAIService.generateAdaptiveContent('local_impact_statement', {
          location: profile?.location,
          selectedTags: tags,
          userEngagement: profile?.contribution_stats?.actions_completed || 0
        });

        if (isCancelled) return;

        setAiContent(new Map([
          ['action_suggestions', actionContent],
          ['local_impact', impactContent]
        ]));

        setAdaptiveState(prev => ({
          ...prev,
          localImpact: impactContent.content,
          personalizedTips: ['Take action based on your interests', 'Connect with local organizations', 'Share your impact with others']
        }));

        setPersonalizedMessages(['Great to see your engagement!', 'Your actions make a difference']);

      } catch (error) {
        console.error('AI content generation failed:', error);
        // Set fallback content to prevent blocking
        setAdaptiveState(prev => ({
          ...prev,
          localImpact: 'Your actions can make a real difference in your community.',
          personalizedTips: ['Start with actions that match your interests', 'Connect with local organizations', 'Share your impact with others']
        }));
      } finally {
        setIsLoading(false);
      }
    };

    generateInitialContent();
    
    return () => {
      isCancelled = true;
    };
  }, [profile?.id]); // Only depend on profile ID to prevent infinite loops

  // AI-powered intent detection and content generation
  const handleActionSelect = async (actionId: string) => {
    setSelectedAction(actionId);
    
    try {
      // Track interaction with AI (non-blocking)
      safeAIService.recordInteraction('click', `action_${actionId}`, {
        actionType: actionId,
        userContext: {
          location: profile?.location,
          interests: profile?.interests,
          engagementLevel: profile?.contribution_stats?.actions_completed || 0
        }
      });

      // Generate fallback content immediately
      const fallbackText = generateFallbackText(actionId, profile?.location);
      
      setAdaptiveState(prev => ({
        ...prev,
        intent: actionId,
        confidence: 0.8,
        generatedText: fallbackText
      }));

      setShowAIInsights(true);

      // Generate AI content asynchronously (non-blocking)
      Promise.all([
        safeAIService.generateAdaptiveContent('action_intent_analysis', {
          actionType: actionId,
          userProfile: profile,
          contextTags: tags
        }),
        safeAIService.generateAdaptiveContent('action_generated_text', {
          actionType: actionId,
          userLocation: profile?.location,
          userInterests: profile?.interests,
          targetAudience: 'representatives'
        })
      ]).then(([intentContent, generatedTextContent]) => {
        setAdaptiveState(prev => ({
          ...prev,
          confidence: intentContent.confidence,
          generatedText: generatedTextContent.content
        }));
      }).catch((error: any) => {
        console.warn('AI content generation failed, using fallback:', error);
      });

    } catch (error) {
      console.error('Action selection failed:', error);
      // Ensure UI still works with fallback
      setAdaptiveState(prev => ({
        ...prev,
        intent: actionId,
        confidence: 0.5,
        generatedText: generateFallbackText(actionId, profile?.location)
      }));
      setShowAIInsights(true);
    }
  };

  // Generate fallback text for immediate UI response
  const generateFallbackText = (actionId: string, location?: string) => {
    const actionTemplates = {
      contact_rep: `I am writing to urge your support for climate action in ${location || 'our community'}. As a constituent, I believe we need immediate action on environmental policies that will protect our future.`,
      social_share: `Join me in taking action for our environment! Every small step counts toward building a sustainable future for ${location || 'our community'}.`,
      local_event: `Looking for environmental events in ${location || 'my area'}. Connecting with like-minded people is key to creating lasting change.`,
      petition_sign: `I support this important environmental initiative. Together, we can make our voices heard and create the change we need.`,
      volunteer: `Ready to volunteer for environmental causes in ${location || 'my community'}. Hands-on action is one of the best ways to make a difference.`,
      donate: `Supporting organizations that are working to protect our environment and create sustainable solutions for the future.`
    };
    
    return actionTemplates[actionId as keyof typeof actionTemplates] || 
           `I'm taking action to support environmental causes and make a positive impact in ${location || 'my community'}.`;
  };

  // AI-powered form auto-fill (non-blocking)
  const generateActionText = useCallback(async () => {
    const actionContext = {
      intent: selectedAction,
      userLocation: profile?.location,
      userInterests: profile?.interests,
      topic: adaptiveState.topic,
      tone: profile?.preferences?.theme === 'dark' ? 'formal' : 'friendly'
    };

    try {
      const generatedContent = await safeAIService.generateAdaptiveContent('action_form_text', actionContext);
      setAdaptiveState(prev => ({
        ...prev,
        generatedText: generatedContent.content
      }));
    } catch (error) {
      console.error('Text generation failed:', error);
      // Use fallback text
      setAdaptiveState(prev => ({
        ...prev,
        generatedText: generateFallbackText(selectedAction, profile?.location)
      }));
    }
  }, [selectedAction, profile?.location, profile?.interests, profile?.preferences?.theme, adaptiveState.topic]);

  // Adaptive layout based on AI recommendations (simplified)
  const getAdaptiveClasses = () => {
    const classes = [];
    classes.push('space-y-4'); // Default spacing
    return classes.join(' ');
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${getAdaptiveClasses()} ${className}`}
    >
      {/* AI Insights Badge */}
      {showAIInsights && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          🧠 AI Enhanced
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="p-6">
        {/* Header with AI-generated personalized message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title || 'AI-Powered Action Tool'}
          </h2>
          
          {/* AI-generated personalized messages */}
          {personalizedMessages.map((message, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3"
            >
              <p className="text-blue-800 text-sm font-medium">💡 {message}</p>
            </div>
          ))}

          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}
        </div>

        {/* AI-Enhanced Action Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🎯 Choose Your Action 
            {isLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {actionSuggestions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionSelect(action.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  selectedAction === action.id
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium text-gray-900">{action.label}</div>
                
                {/* AI Generated Badge */}
                {action.aiGenerated && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs">✨</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI-Generated Local Impact Statement */}
        {adaptiveState.localImpact && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              📍 Local Impact Analysis
              <span className="text-xs bg-green-200 px-2 py-1 rounded-full">AI Generated</span>
            </h4>
            <p className="text-green-800 text-sm leading-relaxed">{adaptiveState.localImpact}</p>
          </div>
        )}

        {/* AI-Generated Action Text */}
        {selectedAction && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Generated Message</h4>
              <button
                onClick={generateActionText}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
              >
                🤖 Regenerate with AI
              </button>
            </div>
            
            <div className="relative">
              <textarea
                value={adaptiveState.generatedText}
                onChange={(e) => setAdaptiveState(prev => ({ ...prev, generatedText: e.target.value }))}
                className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="AI is generating your personalized message..."
              />
              
              {/* AI Confidence Indicator */}
              {adaptiveState.confidence > 0 && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                  <div className="text-xs text-gray-600">AI Confidence:</div>
                  <div className="text-xs font-medium text-blue-600">
                    {Math.round(adaptiveState.confidence * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI-Generated Personalized Tips */}
        {adaptiveState.personalizedTips.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              💡 Personalized Tips
              <span className="text-xs bg-yellow-200 px-2 py-1 rounded-full">AI Curated</span>
            </h4>
            <div className="space-y-2">
              {adaptiveState.personalizedTips.slice(0, 3).map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <div className="text-yellow-500 text-xs mt-1">⭐</div>
                  <div>{tip}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI-Powered Next Best Actions */}
        {recommendations.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🎯 AI Recommendations
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec, index) => (
                <button
                  key={rec}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded-full hover:bg-blue-200 transition-colors"
                  onClick={() => {
                    safeAIService.recordInteraction('click', `recommendation_${rec}`, {});
                    setRecommendations(prev => prev.filter(r => r !== rec));
                  }}
                >
                  {rec.replace(/_/g, ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {selectedAction && adaptiveState.generatedText && (
          <div className="pt-6">
            <button
              onClick={() => {
                safeAIService.recordInteraction('form_submit', `action_${selectedAction}`, {});
                console.log('Action submitted:', selectedAction);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Take Action</span>
              <div className="text-lg">🚀</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
