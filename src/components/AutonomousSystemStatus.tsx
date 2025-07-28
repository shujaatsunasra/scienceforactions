'use client';

import { useAutonomousSystemInitializer, getStatusColor } from '../hooks/useAutonomousSystemInitializer';

export default function AutonomousSystemStatus() {
  const { status, isInitialized, initializationError, restartSystem } = useAutonomousSystemInitializer();

  if (initializationError) {
    return (
      <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">System Error</span>
        </div>
        <p className="text-sm mb-3">{initializationError}</p>
        <button
          onClick={restartSystem}
          className="bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Restart System
        </button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="font-medium">Initializing Systems</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center space-x-2 ${getStatusColor(status.database)}`}>
            <span>•</span> <span>Database: {status.database}</span>
          </div>
          <div className={`flex items-center space-x-2 ${getStatusColor(status.evolutionEngine)}`}>
            <span>•</span> <span>Evolution Engine: {status.evolutionEngine}</span>
          </div>
          <div className={`flex items-center space-x-2 ${getStatusColor(status.emotionAwareUI)}`}>
            <span>•</span> <span>Emotion UI: {status.emotionAwareUI}</span>
          </div>
          <div className={`flex items-center space-x-2 ${getStatusColor(status.seoEngine)}`}>
            <span>•</span> <span>SEO Engine: {status.seoEngine}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show success status briefly, then hide
  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm animate-fade-in">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Autonomous Systems Active</span>
      </div>
      <p className="text-sm mt-1">Platform running in infinity mode</p>
    </div>
  );
}

