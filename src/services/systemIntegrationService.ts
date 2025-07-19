/**
 * System Integration Service
 * Coordinates all error handling and navigation services for complete reliability
 * Provides comprehensive monitoring and health checks across the application
 */

import { navigationService } from './navigationService';
import { robustFetch } from './robustFetchService';
import { cacheCleanupService } from './cacheCleanupService';

interface SystemHealthReport {
  status: 'healthy' | 'degraded' | 'critical';
  services: {
    navigation: boolean;
    fetch: boolean;
    cache: boolean;
  };
  metrics: {
    errorCount: number;
    lastError?: string;
  };
  timestamp: string;
}

interface SystemConfig {
  healthCheckInterval: number;
  maxErrorsPerMinute: number;
  enableAutoRecovery: boolean;
  monitoringEnabled: boolean;
}

class SystemIntegrationService {
  private config: SystemConfig = {
    healthCheckInterval: 30000, // 30 seconds
    maxErrorsPerMinute: 5,
    enableAutoRecovery: true,
    monitoringEnabled: true
  };

  private isInitialized = false;
  private healthCheckTimer?: NodeJS.Timeout;
  private errorCount = 0;
  private errorCountResetTimer?: NodeJS.Timeout;
  private lastHealthReport?: SystemHealthReport;
  private lastError?: string;

  /**
   * Initialize the complete system integration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize all core services
      await this.initializeCoreServices();

      // Start health monitoring
      if (this.config.monitoringEnabled) {
        this.startHealthMonitoring();
      }

      // Set up error tracking
      this.setupErrorTracking();

      this.isInitialized = true;
      console.log('System Integration Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize System Integration Service:', error);
      throw error;
    }
  }

  /**
   * Initialize all core services with proper configuration
   */
  private async initializeCoreServices(): Promise<void> {
    // Initialize cache cleanup service
    cacheCleanupService.initialize();

    // Configure navigation service for maximum reliability
    navigationService.updateConfig({
      enablePrefetch: true,
      retryAttempts: 3,
      timeout: 8000,
      fallbackRoute: '/main'
    });

    // Configure fetch service for optimal performance
    robustFetch.updateConfig({
      retryAttempts: 2,
      timeout: 10000,
      enableCache: true,
      cacheDuration: 5 * 60 * 1000 // 5 minutes
    });

    // Clean up any existing cache issues
    robustFetch.cleanupCache();
  }

  /**
   * Start continuous health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<SystemHealthReport> {
    const report: SystemHealthReport = {
      status: 'healthy',
      services: {
        navigation: this.checkNavigationHealth(),
        fetch: this.checkFetchHealth(),
        cache: this.checkCacheHealth()
      },
      metrics: {
        errorCount: this.errorCount,
        lastError: this.lastError
      },
      timestamp: new Date().toISOString()
    };

    // Determine overall system status
    const failedServices = Object.values(report.services).filter(service => !service).length;
    if (failedServices > 0) {
      report.status = failedServices >= 2 ? 'critical' : 'degraded';
    }

    // Auto-recovery if enabled
    if (this.config.enableAutoRecovery && report.status !== 'healthy') {
      await this.attemptAutoRecovery(report);
    }

    this.lastHealthReport = report;
    return report;
  }

  /**
   * Check navigation service health
   */
  private checkNavigationHealth(): boolean {
    try {
      // Test basic navigation functionality
      return typeof navigationService.navigateWithRetry === 'function';
    } catch (error) {
      console.error('Navigation health check failed:', error);
      return false;
    }
  }

  /**
   * Check fetch service health
   */
  private checkFetchHealth(): boolean {
    try {
      // Check if fetch service is responsive
      return typeof robustFetch.fetchWithRetry === 'function';
    } catch (error) {
      console.error('Fetch health check failed:', error);
      return false;
    }
  }

  /**
   * Check cache service health
   */
  private checkCacheHealth(): boolean {
    try {
      // Verify cache service is operational
      return typeof cacheCleanupService.clearAllCaches === 'function';
    } catch (error) {
      console.error('Cache health check failed:', error);
      return false;
    }
  }

  /**
   * Attempt automatic recovery for degraded systems
   */
  private async attemptAutoRecovery(report: SystemHealthReport): Promise<void> {
    console.warn('System degradation detected, attempting auto-recovery...');

    try {
      // Reset cache service if failing
      if (!report.services.cache) {
        cacheCleanupService.emergencyCleanup();
        cacheCleanupService.initialize();
      }

      // Clear error counters
      this.errorCount = 0;
      this.lastError = undefined;

      console.log('Auto-recovery completed');
    } catch (error) {
      console.error('Auto-recovery failed:', error);
    }
  }

  /**
   * Set up error tracking across the system
   */
  private setupErrorTracking(): void {
    // Track errors from all services
    this.setupErrorCountReset();

    // Listen for unhandled errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handleGlobalRejection.bind(this));
    }
  }

  /**
   * Set up error count reset timer
   */
  private setupErrorCountReset(): void {
    this.errorCountResetTimer = setInterval(() => {
      this.errorCount = 0;
    }, 60000); // Reset every minute
  }

  /**
   * Handle global errors
   */
  private handleGlobalError(event: ErrorEvent): void {
    this.errorCount++;
    this.lastError = event.error?.message || 'Unknown error';
    console.error('Global error detected:', event.error);

    // Emergency cleanup if too many errors
    if (this.errorCount >= this.config.maxErrorsPerMinute) {
      this.emergencyCleanup();
    }
  }

  /**
   * Handle global promise rejections
   */
  private handleGlobalRejection(event: PromiseRejectionEvent): void {
    this.errorCount++;
    this.lastError = event.reason?.message || 'Promise rejection';
    console.error('Global promise rejection:', event.reason);

    // Emergency cleanup if too many errors
    if (this.errorCount >= this.config.maxErrorsPerMinute) {
      this.emergencyCleanup();
    }
  }

  /**
   * Perform emergency system cleanup
   */
  private emergencyCleanup(): void {
    console.warn('Emergency cleanup initiated due to high error rate');
    
    try {
      cacheCleanupService.emergencyCleanup();
      robustFetch.cleanup();
      
      // Reset error counter
      this.errorCount = 0;
      this.lastError = undefined;
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
    }
  }

  /**
   * Get current system health report
   */
  getHealthReport(): SystemHealthReport | null {
    return this.lastHealthReport || null;
  }

  /**
   * Check if system is ready for operation
   */
  isSystemReady(): boolean {
    return this.isInitialized && this.errorCount < this.config.maxErrorsPerMinute;
  }

  /**
   * Update system configuration
   */
  updateConfig(newConfig: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Graceful shutdown of the integration service
   */
  shutdown(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    if (this.errorCountResetTimer) {
      clearInterval(this.errorCountResetTimer);
    }

    // Cleanup all services
    cacheCleanupService.destroy();
    robustFetch.cleanup();

    this.isInitialized = false;
    console.log('System Integration Service shut down');
  }
}

export const systemIntegration = new SystemIntegrationService();
export type { SystemHealthReport, SystemConfig };
