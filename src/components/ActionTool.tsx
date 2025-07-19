"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useActionEngagement, type ActionIntentData } from '@/context/ActionEngagementContext';
import ActionResultFlow from './ActionResultFlow';
import { useProfile } from '@/context/ProfileContext';
import FilterDropdown, { type DropdownOption } from './FilterDropdown';

// Intent options with enhanced data
const INTENT_OPTIONS: DropdownOption[] = [
  { 
    id: 'be_heard', 
    label: 'Be Heard', 
    description: 'Make your voice count on policies and issues', 
    icon: '📢',
    count: 245 
  },
  { 
    id: 'volunteer', 
    label: 'Volunteer', 
    description: 'Get involved with organizations doing the work', 
    icon: '🤝',
    count: 189 
  },
  { 
    id: 'get_help', 
    label: 'Get Help', 
    description: 'Find resources and support for your needs', 
    icon: '💡',
    count: 156 
  },
  { 
    id: 'organize', 
    label: 'Organize', 
    description: 'Start or join movements for change', 
    icon: '👥',
    count: 98 
  },
  { 
    id: 'donate', 
    label: 'Donate', 
    description: 'Support causes with financial contributions', 
    icon: '💝',
    count: 167 
  }
];

// Topic options with enhanced data
const TOPIC_OPTIONS: DropdownOption[] = [
  { id: 'climate_change', label: 'Climate Change', description: 'Environmental protection and sustainability', icon: '🌍', count: 234 },
  { id: 'healthcare', label: 'Healthcare', description: 'Medical access and health policy', icon: '🏥', count: 198 },
  { id: 'education', label: 'Education', description: 'Schools, funding, and educational equity', icon: '🎓', count: 176 },
  { id: 'social_justice', label: 'Social Justice', description: 'Equality, civil rights, and fairness', icon: '⚖️', count: 203 },
  { id: 'economy', label: 'Economy', description: 'Jobs, wages, and economic policy', icon: '💼', count: 145 },
  { id: 'housing', label: 'Housing', description: 'Affordable housing and tenant rights', icon: '🏠', count: 128 },
  { id: 'transportation', label: 'Transportation', description: 'Public transit and infrastructure', icon: '🚌', count: 89 },
  { id: 'immigration', label: 'Immigration', description: 'Immigration policy and refugee support', icon: '🌏', count: 112 },
  { id: 'criminal_justice', label: 'Criminal Justice', description: 'Police reform and prison system', icon: '🔒', count: 134 },
  { id: 'voting_rights', label: 'Voting Rights', description: 'Election access and democracy', icon: '🗳️', count: 156 },
  { id: 'womens_rights', label: "Women's Rights", description: 'Gender equality and reproductive rights', icon: '👩', count: 178 },
  { id: 'lgbtq_rights', label: 'LGBTQ+ Rights', description: 'LGBTQ+ equality and protection', icon: '🏳️‍🌈', count: 145 },
  { id: 'disability_rights', label: 'Disability Rights', description: 'Accessibility and disability advocacy', icon: '♿', count: 67 },
  { id: 'mental_health', label: 'Mental Health', description: 'Mental health support and awareness', icon: '🧠', count: 123 },
  { id: 'technology', label: 'Technology', description: 'Digital rights and tech policy', icon: '💻', count: 98 }
];

// Location options with enhanced data
const LOCATION_OPTIONS: DropdownOption[] = [
  { id: 'online', label: 'Online/Virtual', description: 'Actions you can take from anywhere', icon: '💻', count: 456 },
  { id: 'local', label: 'Local Community', description: 'Actions in your local area', icon: '🏘️', count: 234 },
  { id: 'california', label: 'California', description: 'State-specific actions', icon: '🌴', count: 189 },
  { id: 'new_york', label: 'New York', description: 'State-specific actions', icon: '🗽', count: 156 },
  { id: 'texas', label: 'Texas', description: 'State-specific actions', icon: '🤠', count: 134 },
  { id: 'florida', label: 'Florida', description: 'State-specific actions', icon: '🌴', count: 112 },
  { id: 'washington', label: 'Washington', description: 'State-specific actions', icon: '🏔️', count: 98 },
  { id: 'illinois', label: 'Illinois', description: 'State-specific actions', icon: '🌆', count: 87 },
  { id: 'pennsylvania', label: 'Pennsylvania', description: 'State-specific actions', icon: '🔔', count: 76 },
  { id: 'ohio', label: 'Ohio', description: 'State-specific actions', icon: '🌽', count: 65 },
  { id: 'georgia', label: 'Georgia', description: 'State-specific actions', icon: '🍑', count: 54 },
  { id: 'north_carolina', label: 'North Carolina', description: 'State-specific actions', icon: '🏔️', count: 43 },
  { id: 'michigan', label: 'Michigan', description: 'State-specific actions', icon: '🚗', count: 38 },
  { id: 'arizona', label: 'Arizona', description: 'State-specific actions', icon: '🌵', count: 32 },
  { id: 'massachusetts', label: 'Massachusetts', description: 'State-specific actions', icon: '⚓', count: 29 },
  { id: 'colorado', label: 'Colorado', description: 'State-specific actions', icon: '🏔️', count: 27 },
  { id: 'oregon', label: 'Oregon', description: 'State-specific actions', icon: '🌲', count: 24 },
  { id: 'virginia', label: 'Virginia', description: 'State-specific actions', icon: '🏛️', count: 21 },
  { id: 'new_jersey', label: 'New Jersey', description: 'State-specific actions', icon: '🏖️', count: 19 },
  { id: 'nevada', label: 'Nevada', description: 'State-specific actions', icon: '🎰', count: 16 },
  { id: 'maryland', label: 'Maryland', description: 'State-specific actions', icon: '🦀', count: 15 },
  { id: 'minnesota', label: 'Minnesota', description: 'State-specific actions', icon: '❄️', count: 13 },
  { id: 'wisconsin', label: 'Wisconsin', description: 'State-specific actions', icon: '🧀', count: 12 },
  { id: 'missouri', label: 'Missouri', description: 'State-specific actions', icon: '🌾', count: 11 },
  { id: 'alabama', label: 'Alabama', description: 'State-specific actions', icon: '🎵', count: 9 },
  { id: 'national', label: 'National', description: 'Federal level actions', icon: '🇺🇸', count: 567 }
];

export default function ActionTool() {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const router = useRouter();
  const { setCurrentIntent } = useActionEngagement();
  const { profile } = useProfile();

  const handleIntentSelect = useCallback((intentId: string) => {
    setSelectedIntent(intentId);
    if (step === 1) {
      setStep(2);
    }
  }, [step]);

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopic(topicId);
    if (step === 2) {
      setStep(3);
    }
  }, [step]);

  const handleLocationSelect = useCallback((locationId: string) => {
    setSelectedLocation(locationId);
  }, []);

  const handleNext = useCallback(() => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

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

      await setCurrentIntent(intentData);
      setShowResults(true);
    } catch (error) {
      console.error('Error generating actions:', error);
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
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return selectedIntent.length > 0;
      case 2: return selectedTopic.length > 0;
      case 3: return true; // Location is optional
      default: return false;
    }
  };

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
    <div className="w-full max-w-2xl mx-auto bg-card rounded-card border border-grayBorder p-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    stepNum < step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {step === 1 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text">What do you want to do?</h2>
            <p className="text-grayText">Choose your goal or intention</p>
            <FilterDropdown
              options={INTENT_OPTIONS}
              value={selectedIntent}
              onChange={handleIntentSelect}
              placeholder="Select an action type"
              searchable={false}
            />
            <div className="text-sm text-grayText">
              Select from predefined action types to get started
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text">What topic interests you?</h2>
            <p className="text-grayText">Choose an area you care about</p>
            <FilterDropdown
              options={TOPIC_OPTIONS}
              value={selectedTopic}
              onChange={handleTopicSelect}
              placeholder="Select a topic"
              searchable={true}
            />
            <div className="text-sm text-grayText">
              Browse topics or search to find what matters to you
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text">Where are you located?</h2>
            <p className="text-grayText">Help us find relevant local actions (optional)</p>
            <FilterDropdown
              options={LOCATION_OPTIONS}
              value={selectedLocation}
              onChange={handleLocationSelect}
              placeholder="Select your location"
              searchable={true}
            />
            <div className="text-sm text-grayText">
              Choose your state or select online/virtual for remote actions
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            step === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-primary hover:bg-primary/10 transition-colors'
          }`}
        >
          Back
        </button>

        <div className="text-sm text-grayText">
          Step {step} of 3
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
          className={`px-6 py-2 rounded-lg font-medium ${
            canProceed() && !isLoading
              ? 'bg-primary text-white hover:bg-primaryDark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors`}
        >
          {isLoading ? 'Loading...' : step === 3 ? 'Find Actions' : 'Next'}
        </button>
      </div>

      {/* Reset button */}
      {(selectedIntent || selectedTopic || selectedLocation) && (
        <div className="text-center mt-6">
          <button
            onClick={handleReset}
            className="text-sm text-grayText hover:text-text transition-colors"
          >
            Start over
          </button>
        </div>
      )}

      {/* Quick action buttons for step 1 */}
      {step === 1 && (
        <div className="mt-8 pt-6 border-t border-grayBorder">
          <p className="text-sm text-grayText text-center mb-4">Quick start options:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                setSelectedIntent('volunteer');
                setStep(2);
              }}
              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              🤝 Volunteer
            </button>
            <button
              onClick={() => {
                setSelectedIntent('be_heard');
                setStep(2);
              }}
              className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              📢 Be Heard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
