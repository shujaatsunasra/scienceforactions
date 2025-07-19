"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useActionEngagement, type ActionIntentData } from '@/context/ActionEngagementContext';
import ActionResultFlow from './ActionResultFlow';
import { useProfile } from '@/context/ProfileContext';
import { navigationService } from '@/services/navigationService';

export default function ActionTool() {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState('');
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const router = useRouter();
  const { setCurrentIntent } = useActionEngagement();
  const { profile } = useProfile();

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
    if (!intent.trim() || !topic.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const intentData: ActionIntentData = {
        intent: intent.trim(),
        topic: topic.trim(),
        location: location.trim() || 'Not specified',
        timestamp: new Date().toISOString()
      };

      await setCurrentIntent(intentData);
      setShowResults(true);
    } catch (error) {
      console.error('Error generating actions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [intent, topic, location, profile, setCurrentIntent]);

  const handleReset = useCallback(() => {
    setStep(1);
    setIntent('');
    setTopic('');
    setLocation('');
    setShowResults(false);
    setIsLoading(false);
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return intent.trim().length > 0;
      case 2: return topic.trim().length > 0;
      case 3: return true; // Location is optional
      default: return false;
    }
  };

  if (showResults) {
    const intentData: ActionIntentData = {
      intent: intent.trim(),
      topic: topic.trim(),
      location: location.trim() || 'Not specified',
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
            <p className="text-grayText">Tell us your goal or intention</p>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g., Be heard, Volunteer, Get help, Organize, Donate..."
              className="w-full p-4 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
              autoFocus
            />
            <div className="text-sm text-grayText">
              Examples: Contact representatives, Find volunteer opportunities, Get support
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text">What topic interests you?</h2>
            <p className="text-grayText">Choose an area you care about</p>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Climate change, Healthcare, Education, Social justice..."
              className="w-full p-4 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
              autoFocus
            />
            <div className="text-sm text-grayText">
              Examples: Climate action, Mental health, Voting rights, Housing
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text">Where are you located?</h2>
            <p className="text-grayText">Help us find relevant local actions (optional)</p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, California, Chicago, or leave blank for online actions..."
              className="w-full p-4 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
              autoFocus
            />
            <div className="text-sm text-grayText">
              Examples: State, City, or "Online" for virtual opportunities
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
      {(intent || topic || location) && (
        <div className="text-center mt-6">
          <button
            onClick={handleReset}
            className="text-sm text-grayText hover:text-text transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
