"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface InteractionState {
  isNavigating: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  animations: {
    fadeIn: boolean;
    slideUp: boolean;
    staggered: boolean;
  };
}

interface InteractionContextType {
  state: InteractionState;
  setNavigating: (isNavigating: boolean) => void;
  updateProgress: (step: number, total: number) => void;
  triggerAnimation: (type: keyof InteractionState['animations']) => void;
  resetInteraction: () => void;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

const initialState: InteractionState = {
  isNavigating: false,
  currentStep: 0,
  totalSteps: 0,
  progress: 0,
  animations: {
    fadeIn: false,
    slideUp: false,
    staggered: false,
  },
};

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InteractionState>(initialState);

  const setNavigating = useCallback((isNavigating: boolean) => {
    setState(prev => ({ ...prev, isNavigating }));
  }, []);

  const updateProgress = useCallback((step: number, total: number) => {
    const progress = total > 0 ? (step / total) * 100 : 0;
    setState(prev => ({ ...prev, currentStep: step, totalSteps: total, progress }));
  }, []);

  const triggerAnimation = useCallback((type: keyof InteractionState['animations']) => {
    setState(prev => ({
      ...prev,
      animations: { ...prev.animations, [type]: true }
    }));
    
    // Reset animation after a short delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        animations: { ...prev.animations, [type]: false }
      }));
    }, 100);
  }, []);

  const resetInteraction = useCallback(() => {
    setState(initialState);
  }, []);

  const value = {
    state,
    setNavigating,
    updateProgress,
    triggerAnimation,
    resetInteraction,
  };

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
}