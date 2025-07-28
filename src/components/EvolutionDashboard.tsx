"use client";

import React, { useState, useEffect } from 'react';
import { autonomousEngine } from '@/services/autonomousEvolutionEngine';
import { supabaseUserService } from '@/services/supabaseUserService';

interface EvolutionDashboardProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function EvolutionDashboard({ isVisible, onToggle }: EvolutionDashboardProps) {
  const [evolutionStatus, setEvolutionStatus] = useState(autonomousEngine.getEvolutionStatus());
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [engagementStats, setEngagementStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateData = async () => {
      try {
        const [status, metrics, engagement] = await Promise.all([
          Promise.resolve(autonomousEngine.getEvolutionStatus()),
          supabaseUserService.getRealTimeMetrics(),
          supabaseUserService.getEngagementStats()
        ]);

        setEvolutionStatus(status);
        setRealTimeMetrics(metrics);
        setEngagementStats(engagement);
        setIsLoading(false);
      } catch (error) {
        // Production: debug output removed
        setIsLoading(false);
      }
    };

    // Initial load
    updateData();

    // Update every 5 seconds
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartEvolution = () => {
    autonomousEngine.startEvolution();
    setEvolutionStatus(autonomousEngine.getEvolutionStatus());
  };

  const handleStopEvolution = () => {
    autonomousEngine.stopEvolution();
    setEvolutionStatus(autonomousEngine.getEvolutionStatus());
  };

  const handleForceEvolution = async () => {
    await autonomousEngine.forceEvolutionCycle();
    setEvolutionStatus(autonomousEngine.getEvolutionStatus());
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'critical':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-gray-900 text-white z-50 overflow-y-auto shadow-xl animate-slide-in-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">🧬 Evolution Engine</h2>
        <button
          onClick={onToggle}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* System Status */}
        <div className="bg-gray-800 rounded-lg p-4 animate-fade-in">
          <h3 className="text-sm font-medium text-gray-300 mb-3">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Health</span>
              <div className={`flex items-center space-x-2 ${getHealthColor(evolutionStatus.health)}`}>
                {getHealthIcon(evolutionStatus.health)}
                <span className="text-sm font-medium capitalize">{evolutionStatus.health}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <div className={`flex items-center space-x-2 ${evolutionStatus.isRunning ? 'text-green-400' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${evolutionStatus.isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">{evolutionStatus.isRunning ? 'Running' : 'Stopped'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Evolution Cycle</span>
              <span className="text-sm font-medium text-blue-400">#{evolutionStatus.cycle}</span>
            </div>
            {evolutionStatus.performance?.response_time && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="text-sm font-medium text-yellow-400">
                  {evolutionStatus.performance.response_time}ms
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-4 animate-fade-in-delay-1">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Controls</h3>
          <div className="space-y-2">
            {!evolutionStatus.isRunning ? (
              <button
                onClick={handleStartEvolution}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Start Evolution
              </button>
            ) : (
              <button
                onClick={handleStopEvolution}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Stop Evolution
              </button>
            )}
            <button
              onClick={handleForceEvolution}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Force Evolution Cycle
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        {realTimeMetrics && (
          <div className="bg-gray-800 rounded-lg p-4 animate-fade-in-delay-2">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Real-time Metrics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 animate-pulse">{realTimeMetrics.active_sessions}</div>
                <div className="text-gray-400">Active Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 animate-pulse">{realTimeMetrics.actions_in_progress}</div>
                <div className="text-gray-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 animate-pulse">{realTimeMetrics.recent_completions}</div>
                <div className="text-gray-400">Recent Completions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 animate-pulse">{realTimeMetrics.response_time}ms</div>
                <div className="text-gray-400">Response Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        {engagementStats && (
          <div className="bg-gray-800 rounded-lg p-4 animate-fade-in-delay-3">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Engagement Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Users</span>
                <span className="font-medium text-blue-400">{engagementStats.total_users?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Users</span>
                <span className="font-medium text-green-400">{engagementStats.active_users?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completion Rate</span>
                <span className="font-medium text-purple-400">{((engagementStats.completion_rate || 0) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Session</span>
                <span className="font-medium text-yellow-400">{Math.round((engagementStats.avg_session_duration || 0) / 60)}m</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Fixes */}
        {evolutionStatus.lastFixes && evolutionStatus.lastFixes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 animate-fade-in-delay-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Fixes</h3>
            <div className="space-y-2">
              {evolutionStatus.lastFixes.slice(-3).map((fix, index) => (
                <div key={index} className="text-xs text-green-400 bg-green-900/20 rounded p-2 animate-fade-in">
                  {fix}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Optimizations */}
        {evolutionStatus.lastOptimizations && evolutionStatus.lastOptimizations.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 animate-fade-in-delay-5">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Optimizations</h3>
            <div className="space-y-2">
              {evolutionStatus.lastOptimizations.slice(-3).map((opt, index) => (
                <div key={index} className="text-xs text-blue-400 bg-blue-900/20 rounded p-2 animate-fade-in">
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8 animate-fade-in">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-sm text-gray-400 mt-2">Loading evolution data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

