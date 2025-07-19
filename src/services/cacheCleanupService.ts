/**
 * Cache and Build Isolation Service
 * Handles cleanup, cache management, and external interference prevention
 */

export interface CleanupConfig {
  clearCacheOnMount?: boolean;
  preventExtensionInterference?: boolean;
  enablePerformanceMonitoring?: boolean;
  logLevel?: 'silent' | 'warn' | 'info' | 'debug';
}

export class CacheCleanupService {
  private static instance: CacheCleanupService;
  private config: CleanupConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  constructor(config: CleanupConfig = {}) {
    this.config = {
      clearCacheOnMount: true,
      preventExtensionInterference: true,
      enablePerformanceMonitoring: true,
      logLevel: 'warn',
      ...config,
    };
  }

  static getInstance(config?: CleanupConfig): CacheCleanupService {
    if (!CacheCleanupService.instance) {
      CacheCleanupService.instance = new CacheCleanupService(config);
    }
    return CacheCleanupService.instance;
  }

  /**
   * Initialize cleanup service
   */
  initialize(): void {
    if (typeof window === 'undefined') return;

    this.log('info', 'Initializing cache cleanup service...');

    if (this.config.clearCacheOnMount) {
      this.clearAllCaches();
    }

    if (this.config.preventExtensionInterference) {
      this.preventExtensionInterference();
    }

    if (this.config.enablePerformanceMonitoring) {
      this.initializePerformanceMonitoring();
    }

    this.startPeriodicCleanup();
    this.log('info', 'Cache cleanup service initialized');
  }

  /**
   * Clear all browser caches safely
   */
  clearAllCaches(): void {
    if (typeof window === 'undefined') return;

    try {
      if (window.sessionStorage) {
        const keysToPreserve = ['user-preference', 'auth-state'];
        const preserved: Record<string, string> = {};
        
        keysToPreserve.forEach(key => {
          const value = window.sessionStorage.getItem(key);
          if (value) preserved[key] = value;
        });

        window.sessionStorage.clear();
        
        Object.entries(preserved).forEach(([key, value]) => {
          window.sessionStorage.setItem(key, value);
        });
      }

      if (window.localStorage) {
        const cacheKeys = Object.keys(window.localStorage).filter(key => 
          key.includes('cache') || 
          key.includes('temp') ||
          key.includes('prefetch') ||
          key.startsWith('_next')
        );

        cacheKeys.forEach(key => {
          window.localStorage.removeItem(key);
        });
      }

      this.log('info', 'Browser caches cleared');
    } catch (error) {
      this.log('warn', 'Failed to clear some caches:', error);
    }
  }

  /**
   * Prevent browser extension interference
   */
  preventExtensionInterference(): void {
    if (typeof window === 'undefined') return;

    try {
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name: string, value: string) {
            if (name === 'src' && value.includes('chrome-extension://')) {
              console.warn('Blocked potential extension script injection:', value);
              return;
            }
            return originalSetAttribute.call(this, name, value);
          };
        }
        
        return element;
      };

      this.log('info', 'Extension interference prevention enabled');
    } catch (error) {
      this.log('warn', 'Failed to prevent extension interference:', error);
    }
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const totalTime = navEntry.loadEventEnd - navEntry.fetchStart;
            
            if (totalTime > 5000) {
              this.log('warn', `Slow navigation detected: ${totalTime}ms`);
            }
          }

          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.fetchStart;
            
            if (loadTime > 3000) {
              this.log('warn', `Slow resource loading: ${resourceEntry.name} (${loadTime}ms)`);
            }
          }
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'measure'] 
      });

      this.log('info', 'Performance monitoring enabled');
    } catch (error) {
      this.log('warn', 'Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Start periodic cleanup
   */
  startPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.performMaintenanceCleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Perform maintenance cleanup
   */
  performMaintenanceCleanup(): void {
    if (typeof window === 'undefined') return;

    try {
      if (window.localStorage) {
        const now = Date.now();
        Object.keys(window.localStorage).forEach(key => {
          if (key.includes('expires_')) {
            const expireTime = parseInt(window.localStorage.getItem(key) || '0');
            if (expireTime < now) {
              window.localStorage.removeItem(key);
              window.localStorage.removeItem(key.replace('expires_', ''));
            }
          }
        });
      }

      this.log('debug', 'Maintenance cleanup completed');
    } catch (error) {
      this.log('warn', 'Maintenance cleanup failed:', error);
    }
  }

  /**
   * Emergency cleanup for critical errors
   */
  emergencyCleanup(): void {
    this.log('warn', 'Performing emergency cleanup...');
    
    try {
      this.clearAllCaches();
      
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }

      if (this.performanceObserver) {
        this.performanceObserver.disconnect();
        this.performanceObserver = null;
      }

      this.log('info', 'Emergency cleanup completed');
    } catch (error) {
      this.log('warn', 'Emergency cleanup failed:', error);
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CleanupConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Cleanup and destroy service
   */
  destroy(): void {
    this.log('info', 'Destroying cache cleanup service...');
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    this.log('info', 'Cache cleanup service destroyed');
  }

  /**
   * Logging utility
   */
  private log(level: 'silent' | 'warn' | 'info' | 'debug', message: string, ...args: any[]): void {
    if (this.config.logLevel === 'silent') return;
    
    const shouldLog = (
      level === 'warn' ||
      (level === 'info' && ['info', 'debug'].includes(this.config.logLevel!)) ||
      (level === 'debug' && this.config.logLevel === 'debug')
    );

    if (shouldLog) {
      const prefix = '[CacheCleanup]';
      if (level === 'warn') {
        console.warn(prefix, message, ...args);
      } else {
        console.log(prefix, message, ...args);
      }
    }
  }
}

// Export singleton
export const cacheCleanupService = CacheCleanupService.getInstance();

// React hook
export function useCacheCleanup(config?: CleanupConfig) {
  if (config) {
    const currentInstance = CacheCleanupService.getInstance();
    currentInstance.updateConfig(config);
  }
  return cacheCleanupService;
}
