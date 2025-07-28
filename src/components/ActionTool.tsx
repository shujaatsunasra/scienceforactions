"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type MotionProps } from 'framer-motion';
import { useActionEngagement, type ActionIntentData } from '@/context/ActionEngagementContext';
import ActionResultFlow from './ActionResultFlow';
import { useProfile } from '@/context/ProfileContext';
import FilterDropdown, { type DropdownOption } from './FilterDropdown';

// Enhanced intent options with better engagement data
const INTENT_OPTIONS: DropdownOption[] = [
  { 
    id: 'be_heard', 
    label: 'Be Heard', 
    description: 'Make your voice count on policies and issues', 
    icon: '📢',
    count: 1245 
  },
  { 
    id: 'volunteer', 
    label: 'Volunteer', 
    description: 'Get involved with organizations doing the work', 
    icon: '🤝',
    count: 2189 
  },
  { 
    id: 'get_help', 
    label: 'Get Help', 
    description: 'Find resources and support for your needs', 
    icon: '💡',
    count: 856 
  },
  { 
    id: 'organize', 
    label: 'Organize', 
    description: 'Start or join movements for change', 
    icon: '👥',
    count: 498 
  },
  { 
    id: 'donate', 
    label: 'Donate', 
    description: 'Support causes with financial contributions', 
    icon: '💝',
    count: 1567 
  }
];

// Enhanced topic options with real-world relevance
const TOPIC_OPTIONS: DropdownOption[] = [
  { id: 'climate_change', label: 'Climate Change', description: 'Environmental protection and sustainability', icon: '🌍', count: 2834 },
  { id: 'healthcare', label: 'Healthcare', description: 'Medical access and health policy', icon: '🏥', count: 2198 },
  { id: 'education', label: 'Education', description: 'Schools, funding, and educational equity', icon: '🎓', count: 1876 },
  { id: 'social_justice', label: 'Social Justice', description: 'Equality, civil rights, and fairness', icon: '⚖️', count: 2203 },
  { id: 'economy', label: 'Economy', description: 'Jobs, wages, and economic policy', icon: '💼', count: 1445 },
  { id: 'housing', label: 'Housing', description: 'Affordable housing and tenant rights', icon: '🏠', count: 1128 },
  { id: 'transportation', label: 'Transportation', description: 'Public transit and infrastructure', icon: '🚌', count: 589 },
  { id: 'immigration', label: 'Immigration', description: 'Immigration policy and refugee support', icon: '🌏', count: 1112 },
  { id: 'criminal_justice', label: 'Criminal Justice', description: 'Police reform and prison system', icon: '🔒', count: 1334 },
  { id: 'voting_rights', label: 'Voting Rights', description: 'Election access and democracy', icon: '🗳️', count: 1856 },
  { id: 'womens_rights', label: "Women's Rights", description: 'Gender equality and reproductive rights', icon: '👩', count: 1978 },
  { id: 'lgbtq_rights', label: 'LGBTQ+ Rights', description: 'LGBTQ+ equality and protection', icon: '🏳️‍🌈', count: 1245 },
  { id: 'disability_rights', label: 'Disability Rights', description: 'Accessibility and disability advocacy', icon: '♿', count: 567 },
  { id: 'mental_health', label: 'Mental Health', description: 'Mental health support and awareness', icon: '🧠', count: 1523 },
  { id: 'technology', label: 'Technology', description: 'Digital rights and tech policy', icon: '💻', count: 898 }
];

// Enhanced location options with better coverage
const LOCATION_OPTIONS: DropdownOption[] = [
  { id: 'online', label: 'Online/Virtual', description: 'Actions you can take from anywhere', icon: '💻', count: 4567 },
  { id: 'local', label: 'Local Community', description: 'Actions in your local area', icon: '🏘️', count: 3234 },
  { id: 'california', label: 'California', description: 'State-specific actions', icon: '🌴', count: 1890 },
  { id: 'new_york', label: 'New York', description: 'State-specific actions', icon: '🗽', count: 1560 },
  { id: 'texas', label: 'Texas', description: 'State-specific actions', icon: '🤠', count: 1340 },
  { id: 'florida', label: 'Florida', description: 'State-specific actions', icon: '🌴', count: 1120 },
  { id: 'washington', label: 'Washington', description: 'State-specific actions', icon: '🏔️', count: 980 },
  { id: 'illinois', label: 'Illinois', description: 'State-specific actions', icon: '🌆', count: 870 },
  { id: 'pennsylvania', label: 'Pennsylvania', description: 'State-specific actions', icon: '🔔', count: 760 },
  { id: 'ohio', label: 'Ohio', description: 'State-specific actions', icon: '🌽', count: 650 },
  { id: 'national', label: 'National', description: 'Federal level actions', icon: '🇺🇸', count: 5670 }
];

export default function ActionTool() {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const router = useRouter();
  const { setCurrentIntent, generatedActions, isGenerating } = useActionEngagement();
  const { profile } = useProfile();

  // Auto-advance when selections are made
  const handleIntentSelect = useCallback((intentId: string) => {
    setSelectedIntent(intentId);
    setHasStarted(true);
    setTimeout(() => setStep(2), 300); // Small delay for better UX
  }, []);

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopic(topicId);
    setTimeout(() => setStep(3), 300);
  }, []);

  const handleLocationSelect = useCallback((locationId: string) => {
    setSelectedLocation(locationId);
    // Auto-submit after location selection with a short delay
    setTimeout(() => {
      if (selectedIntent && selectedTopic) {
        handleSubmit();
      }
    }, 500);
  }, [selectedIntent, selectedTopic]);

  const handleSubmit = useCallback(async () => {
    if (!selectedIntent || !selectedTopic) {
      return;
    }

    setIsLoading(true);
    
    try {
      const intentOption = INTENT_OPTIONS.find(i => i.id === selectedIntent);
      const topicOption = TOPIC_OPTIONS.find(t => t.id === selectedTopic);
      const locationOption = LOCATION_OPTIONS.find(l => l.id === selectedLocation);
      
      const intentData: ActionIntentData = {
        intent: intentOption?.label || selectedIntent,
        topic: topicOption?.label || selectedTopic,
        location: locationOption?.label || selectedLocation || 'Not specified',
        timestamp: new Date().toISOString()
      };

      // Production: debug output removed
      await setCurrentIntent(intentData);
      setShowResults(true);
    } catch (error) {
      // Production: debug output removed
    } finally {
      setIsLoading(false);
    }
  }, [selectedIntent, selectedTopic, selectedLocation, setCurrentIntent]);

  const handleReset = useCallback(() => {
    setStep(1);
    setSelectedIntent('');
    setSelectedTopic('');
    setSelectedLocation('');
    setShowResults(false);
    setIsLoading(false);
    setHasStarted(false);
  }, []);

  const handleSkipLocation = useCallback(() => {
    setSelectedLocation('online'); // Default to online if skipped
    handleSubmit();
  }, [handleSubmit]);

  const canProceed = () => {
    switch (step) {
      case 1: return selectedIntent.length > 0;
      case 2: return selectedTopic.length > 0;
      case 3: return true; // Location is optional
      default: return false;
    }
  };

  // Show results view
  if (showResults) {
    const intentOption = INTENT_OPTIONS.find(i => i.id === selectedIntent);
    const topicOption = TOPIC_OPTIONS.find(t => t.id === selectedTopic);
    const locationOption = LOCATION_OPTIONS.find(l => l.id === selectedLocation);
    
    const intentData: ActionIntentData = {
      intent: intentOption?.label || selectedIntent,
      topic: topicOption?.label || selectedTopic,
      location: locationOption?.label || selectedLocation || 'Not specified',
      timestamp: new Date().toISOString()
    };

    return (
      <ActionResultFlow 
        intentData={intentData}
        onBack={() => setShowResults(false)}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with dynamic messaging */}
      <div 
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
          {step === 1 && !hasStarted && "Ready to make a difference?"}
          {step === 1 && hasStarted && "Great choice! Let's find the perfect way for you to take action."}
          {step === 2 && "What issue fires you up?"}
          {step === 3 && "Where would you like to focus your impact?"}
        </h1>
        <p className="text-lg text-grayText max-w-2xl mx-auto">
          {step === 1 && "Join thousands of people taking meaningful action on the issues that matter most."}
          {step === 2 && "Choose a topic you're passionate about and we'll show you exactly how to make an impact."}
          {step === 3 && "Help us find the most relevant opportunities in your area (or choose virtual actions)."}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  stepNum <= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNum <= step - 1 ? '✓' : stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`w-16 h-2 rounded-full ${
                    stepNum < step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main content card */}
      <div 
        className="bg-white rounded-2xl border border-grayBorder p-8 shadow-lg"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Intent Selection */}
          {step === 1 && (
            <div
              key="step1"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-text">How do you want to make an impact?</h2>
                <p className="text-grayText">Choose your preferred way to take action</p>
              </div>
              
              <FilterDropdown
                options={INTENT_OPTIONS}
                value={selectedIntent}
                onChange={handleIntentSelect}
                placeholder="Select your action type"
                searchable={false}
                className="text-lg"
              />

              {/* Quick action hints */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
                {INTENT_OPTIONS.slice(0, 6).map((intent) => (
                  <button
                    key={intent.id}
                    onClick={() => handleIntentSelect(intent.id)}
                    className="p-3 border border-grayBorder rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
                  >
                    <div className="text-2xl mb-1">{intent.icon}</div>
                    <div className="text-sm font-medium text-text">{intent.label}</div>
                    <div className="text-xs text-grayText">{intent.count}+ actions</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Topic Selection */}
          {step === 2 && (
            <div
              key="step2"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-text">What issue do you care about?</h2>
                <p className="text-grayText">Choose a topic that matters to you</p>
              </div>
              
              <FilterDropdown
                options={TOPIC_OPTIONS}
                value={selectedTopic}
                onChange={handleTopicSelect}
                placeholder="Search or select a topic"
                searchable={true}
                className="text-lg"
              />

              {/* Trending topics */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-grayText">🔥 Trending now:</p>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.slice(0, 8).map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      className="px-3 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors duration-200 border border-primary/20"
                    >
                      {topic.icon} {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location Selection */}
          {step === 3 && (
            <div
              key="step3"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-text">Where would you like to take action?</h2>
                <p className="text-grayText">Choose your location to find relevant opportunities</p>
              </div>
              
              <FilterDropdown
                options={LOCATION_OPTIONS}
                value={selectedLocation}
                onChange={handleLocationSelect}
                placeholder="Search or select your location"
                searchable={true}
                className="text-lg"
              />

              {/* Quick location options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleLocationSelect('online')}
                  className="p-4 border border-grayBorder rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
                >
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-medium text-text">Online Actions</div>
                  <div className="text-sm text-grayText">Work from anywhere</div>
                </button>
                <button
                  onClick={() => handleLocationSelect('local')}
                  className="p-4 border border-grayBorder rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-center"
                >
                  <div className="text-2xl mb-2">🏘️</div>
                  <div className="font-medium text-text">Local Community</div>
                  <div className="text-sm text-grayText">In-person actions</div>
                </button>
              </div>

              {/* Skip option */}
              <div className="text-center">
                <button
                  onClick={handleSkipLocation}
                  className="text-primary hover:text-primaryDark underline text-sm"
                >
                  Skip - Show me all opportunities
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-grayBorder">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary hover:bg-primary/10 border border-primary/20'
            }`}
          >
            ← Back
          </button>

          <div className="text-sm text-grayText font-medium">
            Step {step} of 3
          </div>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primaryDark shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || isGenerating}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                !isLoading && !isGenerating
                  ? 'bg-primary text-white hover:bg-primaryDark shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading || isGenerating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding Actions...
                </span>
              ) : (
                'Find My Actions 🚀'
              )}
            </button>
          )}
        </div>

        {/* Reset option */}
        {(selectedIntent || selectedTopic || selectedLocation) && (
          <div className="text-center mt-4">
            <button
              onClick={handleReset}
              className="text-sm text-grayText hover:text-text transition-colors"
            >
              ↻ Start over
            </button>
          </div>
        )}
      </div>

      {/* Live stats footer */}
      <div 
        className="text-center mt-8 text-sm text-grayText"
      >
        <p>
          🌟 Join <strong>50,000+</strong> people who have taken action this month • 
          <strong> 12,500+</strong> actions available • 
          <strong>98%</strong> user satisfaction
        </p>
      </div>
    </div>
  );
}

