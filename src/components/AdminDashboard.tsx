"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseUserService } from '@/services/supabaseUserService';
import { advancedAIService } from '@/services/advancedAIService';
import { databaseInitializer } from '@/services/databaseInitializer';
import { databaseSeeder } from '@/services/databaseSeeder';
import { autonomousEngine } from '@/services/autonomousEvolutionEngine';
import { useActionEngagement } from '@/context/ActionEngagementContext';

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

interface UserManagementData {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  last_active?: string;
  actions_completed: number;
  engagement_score: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface EvolutionStatus {
  isRunning: boolean;
  health: 'healthy' | 'warning' | 'critical';
  cycle: number;
  lastFixes: string[];
  lastOptimizations: string[];
  performance?: {
    response_time: number;
  };
}

export default function AdminDashboard() {
  const { engagementData } = useActionEngagement();
  
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

  const [evolutionStatus, setEvolutionStatus] = useState<EvolutionStatus>({
    isRunning: false,
    health: 'healthy',
    cycle: 0,
    lastFixes: [],
    lastOptimizations: []
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [engagementStats, setEngagementStats] = useState<any>(null);
  const [userManagementData, setUserManagementData] = useState<UserManagementData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'evolution' | 'users' | 'data'>('overview');
  
  const [seedingProgress, setSeedingProgress] = useState<{
    isSeeding: boolean;
    progress: number;
    currentBatch: number;
    totalBatches: number;
  }>({
    isSeeding: false,
    progress: 0,
    currentBatch: 0,
    totalBatches: 0
  });

  useEffect(() => {
    loadInitialData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      refreshStats();
      updateEvolutionStatus();
      updateRealTimeMetrics();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshStats(),
        updateSystemHealth(),
        updateEvolutionStatus(),
        updateRealTimeMetrics(),
        loadUserManagementData()
      ]);
    } catch (error) {
      addLog(`Error loading data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvolutionStatus = async () => {
    try {
      const status = autonomousEngine.getEvolutionStatus();
      setEvolutionStatus({
        isRunning: status.isRunning,
        health: status.health,
        cycle: status.cycle,
        lastFixes: status.lastFixes || [],
        lastOptimizations: status.lastOptimizations || [],
        performance: status.performance ? {
          response_time: status.performance.response_time || 0
        } : undefined
      });
    } catch (error) {
      addLog(`Error updating evolution status: ${error}`);
    }
  };

  const updateRealTimeMetrics = async () => {
    try {
      const [metrics, engagement] = await Promise.all([
        supabaseUserService.getRealTimeMetrics(),
        supabaseUserService.getEngagementStats()
      ]);
      setRealTimeMetrics(metrics);
      setEngagementStats(engagement);
    } catch (error) {
      addLog(`Error updating real-time metrics: ${error}`);
    }
  };

  const loadUserManagementData = async () => {
    try {
      // Generate realistic user management data based on engagement
      const mockUsers: UserManagementData[] = Array.from({ length: 50 }, (_, i) => ({
        id: `user_${i + 1}`,
        username: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        actions_completed: Math.floor(Math.random() * 100),
        engagement_score: Math.floor(Math.random() * 100),
        status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'suspended'
      }));
      setUserManagementData(mockUsers);
    } catch (error) {
      addLog(`Error loading user management data: ${error}`);
    }
  };

  const refreshStats = async () => {
    try {
      const newStats = await databaseInitializer.getStats();
      setStats(newStats);
      addLog(`Stats updated: ${newStats.users} users, ${newStats.actions} actions`);
    } catch (error) {
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
      // System health update failed
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

  // Evolution Engine Controls
  const handleStartEvolution = async () => {
    try {
      autonomousEngine.startEvolution();
      await updateEvolutionStatus();
      addLog('🧬 Evolution Engine started successfully');
    } catch (error) {
      addLog(`❌ Failed to start Evolution Engine: ${error}`);
    }
  };

  const handleStopEvolution = async () => {
    try {
      autonomousEngine.stopEvolution();
      await updateEvolutionStatus();
      addLog('🛑 Evolution Engine stopped');
    } catch (error) {
      addLog(`❌ Failed to stop Evolution Engine: ${error}`);
    }
  };

  const handleForceEvolution = async () => {
    try {
      await autonomousEngine.forceEvolutionCycle();
      await updateEvolutionStatus();
      addLog('⚡ Forced evolution cycle completed');
    } catch (error) {
      addLog(`❌ Failed to force evolution cycle: ${error}`);
    }
  };

  // User Management Functions
  const handleUserAction = async (action: 'suspend' | 'activate' | 'delete', userIds: string[]) => {
    try {
      for (const userId of userIds) {
        setUserManagementData(prev => 
          prev.map(user => 
            user.id === userId 
              ? { 
                  ...user, 
                  status: action === 'suspend' ? 'suspended' : action === 'activate' ? 'active' : user.status 
                }
              : user
          ).filter(user => action !== 'delete' || user.id !== userId)
        );
      }
      addLog(`${action.charAt(0).toUpperCase() + action.slice(1)}d ${userIds.length} user(s)`);
      setSelectedUsers([]);
    } catch (error) {
      addLog(`❌ Failed to ${action} users: ${error}`);
    }
  };

  const handleBulkUserAction = (action: 'suspend' | 'activate' | 'delete') => {
    if (selectedUsers.length === 0) {
      addLog('⚠️ No users selected');
      return;
    }

    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`)) {
      return;
    }

    handleUserAction(action, selectedUsers);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(userManagementData.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
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

  // New comprehensive data seeding functions
  const handleSeedMassiveData = async () => {
    setIsGenerating(true);
    try {
      addLog('🚀 Starting massive data seeding (10,000+ actions)...');
      addLog('This will take several minutes. Please wait...');
      
      await databaseSeeder.seedActions(10000, 100);
      
      addLog('✅ Massive data seeding complete!');
      addLog('📊 Generated 10,000+ scientific actions with realistic data');
      await refreshStats();
    } catch (error) {
      addLog(`❌ Massive data seeding failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSeedBatchData = async (batchSize: number) => {
    setIsGenerating(true);
    try {
      addLog(`🎯 Seeding ${batchSize} actions...`);
      
      await databaseSeeder.seedActions(batchSize, 50);
      
      addLog(`✅ Successfully seeded ${batchSize} actions!`);
      await refreshStats();
    } catch (error) {
      addLog(`❌ Batch seeding failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSeedTrendingData = async () => {
    setIsGenerating(true);
    try {
      addLog('📈 Updating trending data...');
      
      await databaseSeeder.seedTrendingData();
      
      addLog('✅ Trending data updated!');
      await refreshStats();
    } catch (error) {
      addLog(`❌ Trending data update failed: ${error}`);
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

  const getEvolutionHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* System Health - Modern Red Design */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <span className="text-3xl">🔍</span>
                  <span>System Health Overview</span>
                </h2>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
                >
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
                >
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getHealthStatusColor(systemHealth.status)} mb-2`}>
                    {systemHealth.status.toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-gray-600">System Status</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                >
                  <p className="text-3xl font-black text-blue-700 mb-1">{systemHealth.uptime}</p>
                  <p className="text-sm font-semibold text-gray-600">Uptime</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200"
                >
                  <p className="text-3xl font-black text-yellow-700 mb-1">{systemHealth.response_time}ms</p>
                  <p className="text-sm font-semibold text-gray-600">Response Time</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
                >
                  <p className="text-3xl font-black text-purple-700 mb-1">{systemHealth.active_sessions}</p>
                  <p className="text-sm font-semibold text-gray-600">Active Sessions</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
                >
                  <p className="text-3xl font-black text-red-700 mb-1">{systemHealth.recent_errors}</p>
                  <p className="text-sm font-semibold text-gray-600">Recent Errors</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Platform Statistics - Modern Red Design */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <span className="text-3xl">📊</span>
                <span>Platform Statistics</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="text-center p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl text-white shadow-lg shadow-red-500/25"
                >
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-black mb-2"
                  >
                    {stats.users.toLocaleString()}
                  </motion.p>
                  <p className="text-sm font-semibold text-red-100">Total Users</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-lg shadow-green-500/25"
                >
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    className="text-4xl font-black mb-2"
                  >
                    {stats.actions.toLocaleString()}
                  </motion.p>
                  <p className="text-sm font-semibold text-green-100">Action Items</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/25"
                >
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    className="text-4xl font-black mb-2"
                  >
                    {stats.user_actions.toLocaleString()}
                  </motion.p>
                  <p className="text-sm font-semibold text-blue-100">User Actions</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/25"
                >
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    className="text-4xl font-black mb-2"
                  >
                    {stats.system_metrics.toLocaleString()}
                  </motion.p>
                  <p className="text-sm font-semibold text-purple-100">System Metrics</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Real-time Engagement */}
            {engagementStats && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <span className="text-3xl">📈</span>
                  <span>Live Engagement Metrics</span>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-red-500"
                  ></motion.div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200"
                  >
                    <p className="text-3xl font-black text-blue-700 mb-2">{engagementStats.total_users?.toLocaleString()}</p>
                    <p className="text-sm font-semibold text-gray-600">Total Users</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200"
                  >
                    <motion.p 
                      animate={{ color: ['#16a34a', '#22c55e', '#16a34a'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl font-black mb-2"
                    >
                      {engagementStats.active_users?.toLocaleString()}
                    </motion.p>
                    <p className="text-sm font-semibold text-gray-600">Active Users</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200"
                  >
                    <p className="text-3xl font-black text-purple-700 mb-2">{((engagementStats.completion_rate || 0) * 100).toFixed(1)}%</p>
                    <p className="text-sm font-semibold text-gray-600">Completion Rate</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200"
                  >
                    <p className="text-3xl font-black text-yellow-700 mb-2">{Math.round((engagementStats.avg_session_duration || 0) / 60)}m</p>
                    <p className="text-sm font-semibold text-gray-600">Avg Session</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        );
         

      case 'evolution':
        return (
          <div className="space-y-8">
            {/* Evolution Engine Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                🧬 Evolution Engine Control Center
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Panel */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Health</span>
                      <div className={`flex items-center space-x-2 ${getEvolutionHealthColor(evolutionStatus.health)}`}>
                        <div className={`w-3 h-3 rounded-full ${evolutionStatus.health === 'healthy' ? 'bg-green-500' : evolutionStatus.health === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium capitalize">{evolutionStatus.health}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <div className={`flex items-center space-x-2 ${evolutionStatus.isRunning ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${evolutionStatus.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium">{evolutionStatus.isRunning ? 'Running' : 'Stopped'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Evolution Cycle</span>
                      <span className="text-sm font-bold text-blue-600">#{evolutionStatus.cycle}</span>
                    </div>
                    {evolutionStatus.performance?.response_time && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Response Time</span>
                        <span className="text-sm font-bold text-yellow-600">
                          {evolutionStatus.performance.response_time}ms
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls Panel */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
                  <div className="space-y-3">
                    {!evolutionStatus.isRunning ? (
                      <button
                        onClick={handleStartEvolution}
                        disabled={isGenerating}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        🚀 Start Evolution Engine
                      </button>
                    ) : (
                      <button
                        onClick={handleStopEvolution}
                        disabled={isGenerating}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                      >
                        🛑 Stop Evolution Engine
                      </button>
                    )}
                    <button
                      onClick={handleForceEvolution}
                      disabled={isGenerating}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      ⚡ Force Evolution Cycle
                    </button>
                    <button
                      onClick={updateEvolutionStatus}
                      disabled={isGenerating}
                      className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      🔄 Refresh Status
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Metrics */}
            {realTimeMetrics && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Real-time Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 animate-pulse">{realTimeMetrics.active_sessions}</div>
                    <div className="text-sm text-gray-600">Active Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 animate-pulse">{realTimeMetrics.actions_in_progress}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 animate-pulse">{realTimeMetrics.recent_completions}</div>
                    <div className="text-sm text-gray-600">Recent Completions</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 animate-pulse">{realTimeMetrics.response_time}ms</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Fixes */}
              {evolutionStatus.lastFixes && evolutionStatus.lastFixes.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🔧 Recent Fixes</h3>
                  <div className="space-y-2">
                    {evolutionStatus.lastFixes.slice(-5).map((fix, index) => (
                      <div key={index} className="text-sm text-green-600 bg-green-50 rounded p-3 border-l-4 border-green-500">
                        {fix}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Optimizations */}
              {evolutionStatus.lastOptimizations && evolutionStatus.lastOptimizations.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Recent Optimizations</h3>
                  <div className="space-y-2">
                    {evolutionStatus.lastOptimizations.slice(-5).map((opt, index) => (
                      <div key={index} className="text-sm text-blue-600 bg-blue-50 rounded p-3 border-l-4 border-blue-500">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-8">
            {/* User Management Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  👥 User Management Center
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllUsers}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">
                      {selectedUsers.length} user(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkUserAction('activate')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkUserAction('suspend')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Suspend
                      </button>
                      <button
                        onClick={() => handleBulkUserAction('delete')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{userManagementData.length}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {userManagementData.filter(u => u.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {userManagementData.filter(u => u.status === 'inactive').length}
                  </p>
                  <p className="text-sm text-gray-600">Inactive Users</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {userManagementData.filter(u => u.status === 'suspended').length}
                  </p>
                  <p className="text-sm text-gray-600">Suspended Users</p>
                </div>
              </div>

              {/* User List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === userManagementData.length}
                          onChange={() => selectedUsers.length === userManagementData.length ? clearSelection() : selectAllUsers()}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userManagementData.slice(0, 20).map((user) => (
                      <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.actions_completed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${user.engagement_score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{user.engagement_score}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleUserAction(user.status === 'active' ? 'suspend' : 'activate', [user.id])}
                            className={`${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleUserAction('delete', [user.id])}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-8">
            {/* Control Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                🎮 Data Management Center
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

            {/* Advanced Data Seeding */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                🌱 Advanced Data Seeding
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Mass Data Generation</h3>
                <p className="text-blue-800 text-sm mb-4">
                  Generate thousands of realistic scientific actions with proper categorization, 
                  locations, organizations, and engagement metrics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleSeedMassiveData}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isGenerating ? '⏳ Processing...' : '🚀 Seed 10,000+ Actions'}
                  </button>
                  
                  <button
                    onClick={() => handleSeedBatchData(1000)}
                    disabled={isGenerating}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isGenerating ? '⏳' : '🎯'} Add 1,000 Actions
                  </button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">📈 Trending & Engagement</h3>
                <p className="text-green-800 text-sm mb-4">
                  Update completion counts and trending status to simulate realistic platform activity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleSeedTrendingData}
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isGenerating ? '⏳' : '📈'} Update Trending
                  </button>
                  
                  <button
                    onClick={() => handleSeedBatchData(500)}
                    disabled={isGenerating}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isGenerating ? '⏳' : '⚡'} Quick 500 Actions
                  </button>
                  
                  <button
                    onClick={() => handleSeedBatchData(100)}
                    disabled={isGenerating}
                    className="bg-green-400 hover:bg-green-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isGenerating ? '⏳' : '🔧'} Test 100 Actions
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Production Notes</h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Large data operations (10,000+ records) may take 5-10 minutes</li>
                  <li>• Database performance may be temporarily affected during seeding</li>
                  <li>• Generated data includes realistic scientific categories and organizations</li>
                  <li>• Use "Refresh Stats" to see updated counts after seeding completes</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Admin Dashboard...</p>
          <p className="text-gray-500 mt-2">Initializing Evolution Engine and system metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎛️ Science for Action - Admin Command Center
          </h1>
          <p className="text-gray-600">
            Comprehensive platform management with Evolution Engine control, user management, and real-time analytics
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: '📊 Overview', icon: '📊' },
                { id: 'evolution', name: '🧬 Evolution Engine', icon: '🧬' },
                { id: 'users', name: '� User Management', icon: '👥' },
                { id: 'data', name: '💾 Data Management', icon: '💾' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200 rounded-t-lg`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Activity Logs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            📋 System Activity Logs
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 hover:bg-gray-800 px-2 py-1 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Real-time system logs • Auto-refresh every 10 seconds
            </p>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-full shadow-lg p-3 flex items-center space-x-2 border border-gray-200">
            <div className={`w-3 h-3 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : systemHealth.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm font-medium">
              {systemHealth.status === 'healthy' ? 'All systems operational' : 
               systemHealth.status === 'warning' ? 'System warning detected' : 'Critical issues detected'}
            </span>
            <div className={`w-2 h-2 rounded-full ml-2 ${evolutionStatus.isRunning ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
        </div>

        {/* Evolution Engine Status Badge */}
        <div className="fixed bottom-6 left-6 z-50">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg p-3 border border-gray-700">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${evolutionStatus.isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm font-medium">
                Evolution Engine {evolutionStatus.isRunning ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Cycle #{evolutionStatus.cycle} • Health: {evolutionStatus.health}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

