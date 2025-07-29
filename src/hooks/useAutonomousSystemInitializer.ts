"use client";

import { useEffect, useState } from 'react';

interface AutonomousSystemStatus {
  evolutionEngine: 'starting' | 'running' | 'stopped' | 'error';
  emotionAwareUI: 'starting' | 'running' | 'stopped' | 'error';
  seoEngine: 'starting' | 'running' | 'stopped' | 'error';
  database: 'starting' | 'connected' | 'disconnected' | 'error';
  overallHealth: 'healthy' | 'warning' | 'critical';
}

export default function useAutonomousSystemInitializer() {
  const [status, setStatus] = useState<AutonomousSystemStatus>({
    evolutionEngine: 'starting',
    emotionAwareUI: 'starting',
    seoEngine: 'starting',
    database: 'starting',
    overallHealth: 'warning'
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    // Quick initialization for demo purposes
    const timer = setTimeout(() => {
      setStatus({
        evolutionEngine: 'running',
        emotionAwareUI: 'running',
        seoEngine: 'running',
        database: 'connected',
        overallHealth: 'healthy'
      });
      setIsInitialized(true);
    }, 500); // Quick initialization

    return () => clearTimeout(timer);
  }, []);

  const reinitialize = () => {
    setIsInitialized(false);
    setInitializationError(null);
    setStatus({
      evolutionEngine: 'starting',
      emotionAwareUI: 'starting',
      seoEngine: 'starting',
      database: 'starting',
      overallHealth: 'warning'
    });
    
    const timer = setTimeout(() => {
      setStatus({
        evolutionEngine: 'running',
        emotionAwareUI: 'running',
        seoEngine: 'running',
        database: 'connected',
        overallHealth: 'healthy'
      });
      setIsInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  };

  return {
    status,
    isInitialized,
    initializationError,
    reinitialize,
    restartSystem: reinitialize // Alias for backward compatibility
  };
}

// Helper function for status colors
export function getStatusColor(status: string): string {
  switch (status) {
    case 'running':
    case 'connected':
      return 'text-green-600';
    case 'starting':
      return 'text-yellow-600';
    case 'error':
    case 'disconnected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

