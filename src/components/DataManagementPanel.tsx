"use client";

import React, { useState, useEffect } from 'react';
import { syntheticUserService } from '@/utils/syntheticUserService';
import { useAIAdminInsights, useAIPerformance } from '@/hooks/useAI';

export default function DataManagementPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statistics, setStatistics] = useState(syntheticUserService.getStatistics());
  const [userCount, setUserCount] = useState(10000);
  const [progress, setProgress] = useState('');

  // AI Admin Intelligence
  const {
    systemSummary,
    flaggedIssues,
    predictiveSuggestions,
    contentSuggestions,
    performanceOptimizations,
    isGenerating: aiGenerating,
    refreshInsights
  } = useAIAdminInsights();

  const {
    metrics,
    errorRate,
    responseTime,
    isHealthy
  } = useAIPerformance();

  useEffect(() => {
    setStatistics(syntheticUserService.getStatistics());
  }, []);

  const handleGenerateUsers = async () => {
    setIsGenerating(true);
    setProgress('Starting generation...');
    
    try {
      await syntheticUserService.generateUsers(userCount);
      setStatistics(syntheticUserService.getStatistics());
      setProgress(`Successfully generated ${userCount} users!`);
    } catch (error) {
      setProgress(`Error generating users: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all synthetic user data?')) {
      syntheticUserService.clearDatabase();
      setStatistics(syntheticUserService.getStatistics());
      setProgress('Database cleared');
    }
  };

  const handleExportData = () => {
    const data = syntheticUserService.exportData();
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthetic-users-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunStressTest = async () => {
    setProgress('Running stress test...');
    await syntheticUserService.runStressTest(1000);
    setProgress('Stress test completed - check console for results');
  };

  const hasFullData = statistics.hasData && 'engagementStats' in statistics;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-card rounded-card border border-grayBorder p-6">
        <h2 className="text-2xl font-bold text-text mb-4">AI-Enhanced Admin Dashboard</h2>
        <p className="text-grayText mb-6">
          Monitor system performance and get AI-powered insights for optimization and content management.
        </p>

        {/* AI System Health */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">🧠 AI System Health</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isHealthy ? '✅ Healthy' : '⚠️ Issues Detected'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Response Time</h4>
              <p className="text-xl font-bold text-blue-700">
                {responseTime.toFixed(0)}ms
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-1">Error Rate</h4>
              <p className="text-xl font-bold text-green-700">
                {(errorRate * 100).toFixed(2)}%
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-900 mb-1">AI Cache Hit Rate</h4>
              <p className="text-xl font-bold text-purple-700">
                {metrics.get('cache_hit_rate') ? (metrics.get('cache_hit_rate')! * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>

        {/* AI System Summary */}
        {systemSummary && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              📊 AI System Summary
              {aiGenerating && <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>}
            </h3>
            <p className="text-gray-700">{systemSummary}</p>
          </div>
        )}

        {/* Flagged Issues */}
        {flaggedIssues.length > 0 && (
          <div className="mb-6 bg-red-50 rounded-xl p-4 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
              🚨 AI-Detected Issues
            </h3>
            <div className="space-y-2">
              {flaggedIssues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictive Suggestions */}
        {predictiveSuggestions.length > 0 && (
          <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              🔮 AI Predictive Insights
            </h3>
            <div className="space-y-2">
              {predictiveSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Optimizations */}
        {performanceOptimizations.length > 0 && (
          <div className="mb-6 bg-green-50 rounded-xl p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              ⚡ AI Performance Recommendations
            </h3>
            <div className="space-y-2">
              {performanceOptimizations.map((optimization, index) => (
                <div key={index} className="flex items-center gap-2 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{optimization}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Suggestions */}
        {contentSuggestions.size > 0 && (
          <div className="mb-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              📝 AI Content Optimization
            </h3>
            <div className="space-y-3">
              {Array.from(contentSuggestions.entries()).map(([component, suggestion], index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-yellow-300">
                  <div className="font-medium text-yellow-900 text-sm mb-1">{component}</div>
                  <div className="text-yellow-800 text-sm">{suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Control Center */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🎛️ AI Control Center</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshInsights}
              disabled={aiGenerating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {aiGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                '🔄'
              )}
              Refresh AI Insights
            </button>
            
            <button
              onClick={() => alert('AI Self-Diagnostics feature coming soon!')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              🔍 Run AI Diagnostics
            </button>
            
            <button
              onClick={() => alert('AI Training Data Export feature coming soon!')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
            >
              📤 Export AI Training Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-card border border-grayBorder p-6">
        <h2 className="text-2xl font-bold text-text mb-4">Synthetic User Data Management</h2>
        <p className="text-grayText mb-6">
          Generate and manage synthetic user data for testing and development purposes.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-graySoft rounded-lg p-4">
            <h3 className="text-sm font-semibold text-grayText mb-1">Total Users</h3>
            <p className="text-2xl font-bold text-text">
              {statistics.totalUsers.toLocaleString()}
            </p>
          </div>
          
          {hasFullData && (
            <>
              <div className="bg-graySoft rounded-lg p-4">
                <h3 className="text-sm font-semibold text-grayText mb-1">Avg Actions</h3>
                <p className="text-2xl font-bold text-text">
                  {statistics.engagementStats.avgActionsCompleted.toFixed(1)}
                </p>
              </div>
              
              <div className="bg-graySoft rounded-lg p-4">
                <h3 className="text-sm font-semibold text-grayText mb-1">Avg Policies Viewed</h3>
                <p className="text-2xl font-bold text-text">
                  {statistics.engagementStats.avgPoliciesViewed.toFixed(1)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Generation Controls */}
        <div className="space-y-4">
          <div>
            <label htmlFor="userCount" className="block text-sm font-medium text-text mb-2">
              Number of Users to Generate
            </label>
            <input
              id="userCount"
              type="number"
              value={userCount}
              onChange={(e) => setUserCount(Number(e.target.value))}
              min="100"
              max="50000"
              step="100"
              className="w-48 px-3 py-2 border border-grayBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isGenerating}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerateUsers}
              disabled={isGenerating}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
                isGenerating
                  ? 'bg-grayBorder text-grayText cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isGenerating ? 'Generating...' : `Generate ${userCount.toLocaleString()} Users`}
            </button>

            {statistics.hasData && (
              <>
                <button
                  onClick={handleExportData}
                  className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-200 hover:scale-105"
                >
                  Export Data
                </button>

                <button
                  onClick={handleRunStressTest}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                >
                  Run Stress Test
                </button>

                <button
                  onClick={handleClearData}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 hover:scale-105"
                >
                  Clear Data
                </button>
              </>
            )}
          </div>

          {progress && (
            <div className="mt-4 p-3 bg-graySoft rounded-lg animate-fade-in">
              <p className="text-sm text-grayText">{progress}</p>
            </div>
          )}
        </div>

        {/* Data Overview */}
        {hasFullData && (
          <div className="mt-8 pt-6 border-t border-grayBorder">
            <h3 className="text-lg font-semibold text-text mb-4">Data Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text mb-3">Profile Type Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(statistics.profileTypeDistribution).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-grayText capitalize">{type}</span>
                      <span className="font-medium text-text">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>

              {statistics.topInterests && (
                <div>
                  <h4 className="font-medium text-text mb-3">Top Interests</h4>
                  <div className="space-y-2">
                    {statistics.topInterests.slice(0, 5).map((item: { interest: string; count: number }) => (
                      <div key={item.interest} className="flex justify-between text-sm">
                        <span className="text-grayText">{item.interest}</span>
                        <span className="font-medium text-text">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {statistics.lastGenerated && (
              <div className="mt-4 text-xs text-grayText">
                Last generated: {new Date(statistics.lastGenerated).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
