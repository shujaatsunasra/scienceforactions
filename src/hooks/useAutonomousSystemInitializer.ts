"use client";

import { useEffect, useState } from 'react';
import { autonomousEngine } from '@/services/autonomousEvolutionEngine';
import { emotionAwareUI } from '@/services/emotionAwareUIEngine';
import { infiniteSEOEngine } from '@/services/infiniteSEOEngine';
import { databaseInitializer } from '@/services/databaseInitializer';

interface AutonomousSystemStatus {
  evolutionEngine: 'starting' | 'running' | 'stopped' | 'error';
  emotionAwareUI: 'starting' | 'running' | 'stopped' | 'error';
  seoEngine: 'starting' | 'running' | 'stopped' | 'error';
  database: 'starting' | 'connected' | 'disconnected' | 'error';
  overallHealth: 'healthy' | 'warning' | 'critical';
}

export function useAutonomousSystemInitializer() {
  const [status, setStatus] = useState<AutonomousSystemStatus>({
    evolutionEngine: 'stopped',
    emotionAwareUI: 'stopped',
    seoEngine: 'stopped',
    database: 'disconnected',
    overallHealth: 'critical'
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    initializeAutonomousSystems();
  }, []);

  const initializeAutonomousSystems = async () => {
    // Production: debug output removed
    
    try {
      // Update status to starting
      setStatus(prev => ({
        ...prev,
        evolutionEngine: 'starting',
        emotionAwareUI: 'starting',
        seoEngine: 'starting',
        database: 'starting'
      }));

      // Step 1: Initialize and test database connection
      // Production: debug output removed
      await databaseInitializer.initializeDatabase();
      setStatus(prev => ({ ...prev, database: 'connected' }));

      // Step 2: Start the autonomous evolution engine
      // Production: debug output removed
      autonomousEngine.startEvolution();
      setStatus(prev => ({ ...prev, evolutionEngine: 'running' }));

      // Step 3: Initialize emotion-aware UI system
      // Production: debug output removed
      // The emotion-aware UI starts automatically on instantiation
      setStatus(prev => ({ ...prev, emotionAwareUI: 'running' }));

      // Step 4: Start SEO optimization engine
      // Production: debug output removed
      infiniteSEOEngine.startAutoUpdates();
      await infiniteSEOEngine.forceUpdate(); // Generate initial sitemap
      setStatus(prev => ({ ...prev, seoEngine: 'running' }));

      // Step 5: Final health check
      const healthStatus = await performSystemHealthCheck();
      setStatus(prev => ({ ...prev, overallHealth: healthStatus }));

      setIsInitialized(true);
      // Production: debug output removed
      
      // Log initialization metrics
      logInitializationMetrics();

    } catch (error) {
      // Production: debug output removed
      setInitializationError(error instanceof Error ? error.message : String(error));
      
      setStatus(prev => ({
        evolutionEngine: 'error',
        emotionAwareUI: 'error',
        seoEngine: 'error',
        database: 'error',
        overallHealth: 'critical'
      }));
    }
  };

  const performSystemHealthCheck = async (): Promise<'healthy' | 'warning' | 'critical'> => {
    try {
      // Check evolution engine status
      const evolutionStatus = autonomousEngine.getEvolutionStatus();
      
      // Check database connection
      const dbStats = await databaseInitializer.getStats();
      
      // Check SEO engine metrics
      const seoMetrics = infiniteSEOEngine.getSEOMetrics();

      // Determine overall health
      let healthScore = 0;
      
      if (evolutionStatus.isRunning && evolutionStatus.health !== 'critical') healthScore += 25;
      if (dbStats.users > 0 && dbStats.actions > 0) healthScore += 25;
      if (seoMetrics.sitemapUrls > 0 && seoMetrics.isRunning) healthScore += 25;
      if (evolutionStatus.health === 'healthy') healthScore += 25;

      if (healthScore >= 75) return 'healthy';
      if (healthScore >= 50) return 'warning';
      return 'critical';

    } catch (error) {
      // Production: debug output removed
      return 'critical';
    }
  };

  const logInitializationMetrics = async () => {
    try {
      const metrics = {
        initialization_time: Date.now(),
        status: status,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        viewport_size: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
        system_features: {
          autonomous_evolution: status.evolutionEngine === 'running',
          emotion_aware_ui: status.emotionAwareUI === 'running',
          seo_optimization: status.seoEngine === 'running',
          database_connected: status.database === 'connected'
        }
      };

      // Production: debug output removed
      
      // In a real implementation, you might want to send this to analytics
      // await analytics.track('autonomous_system_initialized', metrics);
      
    } catch (error) {
      // Production: debug output removed
    }
  };

  const restartSystem = async () => {
    // Production: debug output removed
    
    // Stop all systems
    autonomousEngine.stopEvolution();
    infiniteSEOEngine.stopAutoUpdates();
    emotionAwareUI.reset();
    
    // Reset status
    setIsInitialized(false);
    setInitializationError(null);
    
    // Restart
    await initializeAutonomousSystems();
  };

  const getSystemDiagnostics = () => {
    return {
      status,
      isInitialized,
      initializationError,
      evolutionMetrics: autonomousEngine.getEvolutionStatus(),
      seoMetrics: infiniteSEOEngine.getSEOMetrics(),
      uiMetrics: emotionAwareUI.getBehaviorData()
    };
  };

  return {
    status,
    isInitialized,
    initializationError,
    restartSystem,
    getSystemDiagnostics
  };
}

// Helper function for status colors
export function getStatusColor(status: string): string {
  switch (status) {
    case 'running':
    case 'connected':
      return 'text-green-300';
    case 'starting':
      return 'text-yellow-300';
    case 'error':
    case 'disconnected':
      return 'text-red-300';
    default:
      return 'text-gray-300';
  }
}

// Export the initialization hook for use in the main app
export default useAutonomousSystemInitializer;

