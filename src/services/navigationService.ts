/**
 * Robust Navigation Service for Science for Action App
 * Handles all navigation operations with error resilience and proper validation
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';

export interface NavigationConfig {
  enablePrefetch?: boolean;
  retryAttempts?: number;
  timeout?: number;
  fallbackRoute?: string;
}

export interface RouteParams {
  intent?: string;
  topic?: string;
  location?: string;
  [key: string]: string | undefined;
}

export class NavigationService {
  private static instance: NavigationService;
  private config: NavigationConfig;
  private retryDelays = [100, 300, 500]; // Progressive retry delays

  constructor(config: NavigationConfig = {}) {
    this.config = {
      enablePrefetch: true,
      retryAttempts: 2,
      timeout: 5000,
      fallbackRoute: '/main',
      ...config,
    };
  }

  static getInstance(config?: NavigationConfig): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService(config);
    }
    return NavigationService.instance;
  }

  /**
   * Validates if a route exists and is accessible
   */
  private async validateRoute(path: string): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return true; // SSR - assume valid
      
      // Basic path validation
      if (!path || path === '/' || !path.startsWith('/')) {
        return false;
      }

      // Check against known valid routes
      const validRoutes = [
        '/main',
        '/explore', 
        '/tool',
        '/profile',
        '/admin',
        '/action'
      ];

      const isKnownRoute = validRoutes.some(route => 
        path === route || path.startsWith(route + '/')
      );

      return isKnownRoute;
    } catch (error) {
      // Production: debug output removed
      return false;
    }
  }

  /**
   * Safely encodes URI components with fallback
   */
  private safeEncodeURIComponent(str: string): string {
    try {
      if (!str || typeof str !== 'string') return '';
      return encodeURIComponent(str.trim());
    } catch (error) {
      // Production: debug output removed
      return str.replace(/[^a-zA-Z0-9-_.~]/g, ''); // Fallback: remove special chars
    }
  }

  /**
   * Builds action route with proper parameter validation
   */
  buildActionRoute(params: RouteParams): string | null {
    try {
      const { intent, topic, location } = params;

      if (!intent || !topic) {
        // Production: debug output removed
        return null;
      }

      const encodedIntent = this.safeEncodeURIComponent(intent);
      const encodedTopic = this.safeEncodeURIComponent(topic);

      if (!encodedIntent || !encodedTopic) {
        // Production: debug output removed
        return null;
      }

      let route = `/action/${encodedIntent}/${encodedTopic}`;

      if (location && location.trim()) {
        const encodedLocation = this.safeEncodeURIComponent(location);
        if (encodedLocation) {
          route += `?location=${encodedLocation}`;
        }
      }

      return route;
    } catch (error) {
      // Production: debug output removed
      return null;
    }
  }

  /**
   * Safely navigates with retry mechanism and fallback
   */
  async navigateWithRetry(
    router: AppRouterInstance,
    path: string,
    options: { replace?: boolean; scroll?: boolean } = {}
  ): Promise<boolean> {
    const { replace = false, scroll = true } = options;
    
    for (let attempt = 0; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        // Validate route before navigation
        const isValid = await this.validateRoute(path);
        if (!isValid) {
          // Production: debug output removed
          path = this.config.fallbackRoute!;
        }

        // Execute navigation
        if (replace) {
          router.replace(path, { scroll });
        } else {
          router.push(path, { scroll });
        }

        return true;
      } catch (error) {
        // Production: debug output removed
        
        if (attempt < this.config.retryAttempts!) {
          await this.delay(this.retryDelays[attempt] || 500);
          continue;
        }

        // Final fallback
        try {
          // Production: debug output removed
          router.replace(this.config.fallbackRoute!);
          return false;
        } catch (fallbackError) {
          // Production: debug output removed
          return false;
        }
      }
    }

    return false;
  }

  /**
   * Smart prefetch with validation and error handling
   */
  async smartPrefetch(router: AppRouterInstance, path: string): Promise<void> {
    if (!this.config.enablePrefetch || typeof window === 'undefined') {
      return;
    }

    try {
      const isValid = await this.validateRoute(path);
      if (!isValid) {
        // Production: debug output removed
        return;
      }

      // Only prefetch if router and path are valid
      if (router && typeof router.prefetch === 'function' && path) {
        await Promise.race([
          router.prefetch(path),
          this.delay(this.config.timeout!)
        ]);
      }
    } catch (error) {
      // Silently handle prefetch errors to avoid disrupting user experience
      // Production: debug output removed
    }
  }

  /**
   * Navigates to action route with full validation
   */
  async navigateToAction(
    router: AppRouterInstance,
    params: RouteParams,
    options: { replace?: boolean; prefetch?: boolean } = {}
  ): Promise<boolean> {
    try {
      const route = this.buildActionRoute(params);
      if (!route) {
        // Production: debug output removed
        return this.navigateWithRetry(router, '/tool');
      }

      // Optional prefetch
      if (options.prefetch !== false && this.config.enablePrefetch) {
        this.smartPrefetch(router, route).catch(() => {}); // Non-blocking
      }

      return this.navigateWithRetry(router, route, { 
        replace: options.replace,
        scroll: true 
      });
    } catch (error) {
      // Production: debug output removed
      return this.navigateWithRetry(router, '/tool');
    }
  }

  /**
   * Safe navigation to any route with validation
   */
  async navigateTo(
    router: AppRouterInstance,
    path: string,
    options: { replace?: boolean; prefetch?: boolean; params?: URLSearchParams } = {}
  ): Promise<boolean> {
    try {
      let fullPath = path;

      // Add query parameters if provided
      if (options.params && options.params.toString()) {
        const separator = path.includes('?') ? '&' : '?';
        fullPath = `${path}${separator}${options.params.toString()}`;
      }

      // Optional prefetch
      if (options.prefetch !== false && this.config.enablePrefetch) {
        this.smartPrefetch(router, fullPath).catch(() => {}); // Non-blocking
      }

      return this.navigateWithRetry(router, fullPath, {
        replace: options.replace,
        scroll: true
      });
    } catch (error) {
      // Production: debug output removed
      return this.navigateWithRetry(router, this.config.fallbackRoute!);
    }
  }

  /**
   * Emergency navigation function for critical failures
   */
  emergencyNavigate(path: string = '/main'): void {
    if (typeof window !== 'undefined') {
      try {
        window.location.href = path;
      } catch (error) {
        // Production: debug output removed
        // Last resort - reload to home
        window.location.reload();
      }
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Parse search parameters safely
   */
  parseSearchParams(searchParams: ReadonlyURLSearchParams | null): Record<string, string> {
    const params: Record<string, string> = {};
    
    try {
      if (searchParams) {
        searchParams.forEach((value, key) => {
          if (value && key) {
            params[key] = decodeURIComponent(value);
          }
        });
      }
    } catch (error) {
      // Production: debug output removed
    }

    return params;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<NavigationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const navigationService = NavigationService.getInstance();

// Export navigation hook for React components
export function useNavigationService(config?: NavigationConfig) {
  if (config) {
    navigationService.updateConfig(config);
  }
  return navigationService;
}

