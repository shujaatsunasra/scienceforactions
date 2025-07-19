"use client";

import { useState, useEffect } from 'react';
import { supabaseUserService } from '@/services/supabaseUserService';
import { advancedAIService } from '@/services/advancedAIService';
import { databaseInitializer } from '@/services/databaseInitializer';

interface DatabaseStats {
  users: number;
  actions: number;
  user_actions: number;
  system_metrics: number;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  response_time: number;
  active_sessions: number;
  recent_errors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DatabaseStats>({
    users: 0,
    actions: 0,
    user_actions: 0,
    system_metrics: 0,
  });

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: '0d 0h 0m',
    response_time: 0,
    active_sessions: 0,
    recent_errors: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadInitialData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await refreshStats();
      await updateSystemHealth();
    } catch (error) {
      console.error('Error loading admin data:', error);
      addLog(`Error loading data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const newStats = await databaseInitializer.getStats();
      setStats(newStats);
      addLog(`Stats updated: ${newStats.users} users, ${newStats.actions} actions`);
    } catch (error) {
      console.error('Error refreshing stats:', error);
      addLog(`Error refreshing stats: ${error}`);
    }
  };

  const updateSystemHealth = async () => {
    try {
      const realtimeMetrics = await supabaseUserService.getRealTimeMetrics();
      setSystemHealth({
        status: realtimeMetrics.system_health,
        uptime: formatUptime(Date.now()),
        response_time: realtimeMetrics.response_time,
        active_sessions: realtimeMetrics.active_sessions,
        recent_errors: 0, // Would be calculated from error logs
      });
    } catch (error) {
      console.error('Error updating system health:', error);
    }
  };

  const formatUptime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const handleInitializeDatabase = async () => {
    setIsGenerating(true);
    try {
      addLog('Starting database initialization...');
      await databaseInitializer.initializeDatabase();
      addLog('Database initialization complete!');
      await refreshStats();
    } catch (error) {
      addLog(`Database initialization failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTestData = async () => {
    setIsGenerating(true);
    try {
      addLog('Generating test data...');
      await databaseInitializer.generateTestData();
      addLog('Test data generation complete!');
      await refreshStats();
    } catch (error) {
      addLog(`Test data generation failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    setIsGenerating(true);
    try {
      addLog('Clearing database...');
      await databaseInitializer.clearDatabase();
      addLog('Database cleared successfully!');
      await refreshStats();
    } catch (error) {
      addLog(`Database clear failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateUsers = async (count: number) => {
    setIsGenerating(true);
    try {
      addLog(`Generating ${count} synthetic users...`);
      await supabaseUserService.generateSyntheticUsers(count);
      addLog(`Successfully generated ${count} users!`);
      await refreshStats();
    } catch (error) {
      addLog(`User generation failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getHealthStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎛️ Science for Action Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time system monitoring, data management, and AI insights
          </p>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            🔍 System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getHealthStatusColor(systemHealth.status)}`}>
                {systemHealth.status.toUpperCase()}
              </div>
              <p className="text-sm text-gray-600 mt-1">System Status</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{systemHealth.uptime}</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{systemHealth.response_time}ms</p>
              <p className="text-sm text-gray-600">Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{systemHealth.active_sessions}</p>
              <p className="text-sm text-gray-600">Active Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{systemHealth.recent_errors}</p>
              <p className="text-sm text-gray-600">Recent Errors</p>
            </div>
          </div>
        </div>

        {/* Database Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            📊 Database Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats.users.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.actions.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Action Items</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{stats.user_actions.toLocaleString()}</p>
              <p className="text-sm text-gray-600">User Actions</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{stats.system_metrics.toLocaleString()}</p>
              <p className="text-sm text-gray-600">System Metrics</p>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            🎮 Control Panel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleInitializeDatabase}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isGenerating ? '⏳' : '🚀'} Initialize Database
            </button>
            
            <button
              onClick={handleGenerateTestData}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isGenerating ? '⏳' : '🧪'} Generate Test Data
            </button>
            
            <button
              onClick={() => handleGenerateUsers(1000)}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isGenerating ? '⏳' : '👥'} Add 1K Users
            </button>
            
            <button
              onClick={handleClearDatabase}
              disabled={isGenerating}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isGenerating ? '⏳' : '🗑️'} Clear Database
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleGenerateUsers(5000)}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Generate 5K Users
            </button>
            
            <button
              onClick={() => handleGenerateUsers(10000)}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Generate 10K Users
            </button>
            
            <button
              onClick={refreshStats}
              disabled={isGenerating}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              🔄 Refresh Stats
            </button>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            📋 Activity Logs
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="fixed bottom-6 right-6">
          <div className="bg-white rounded-full shadow-lg p-3 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : systemHealth.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm font-medium">
              {systemHealth.status === 'healthy' ? 'All systems operational' : 
               systemHealth.status === 'warning' ? 'System warning' : 'Critical issues detected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
