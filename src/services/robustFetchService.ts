/**
 * Robust Fetch Service for Science for Action App
 * Handles all server communications with retry logic and error isolation
 */

export interface FetchConfig {
  retryAttempts?: number;
  timeout?: number;
  enableCache?: boolean;
  cacheDuration?: number;
}

export interface FetchOptions extends RequestInit {
  timeout?: number;
  retryAttempts?: number;
  skipCache?: boolean;
}

export interface ServerResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

export class RobustFetchService {
  private static instance: RobustFetchService;
  private config: FetchConfig;
  private cache: Map<string, { data: any; timestamp: number; expires: number }>;
  private requestTimeouts: Map<string, NodeJS.Timeout>;

  constructor(config: FetchConfig = {}) {
    this.config = {
      retryAttempts: 2,
      timeout: 10000,
      enableCache: true,
      cacheDuration: 5 * 60 * 1000, // 5 minutes
      ...config,
    };
    this.cache = new Map();
    this.requestTimeouts = new Map();
  }

  static getInstance(config?: FetchConfig): RobustFetchService {
    if (!RobustFetchService.instance) {
      RobustFetchService.instance = new RobustFetchService(config);
    }
    return RobustFetchService.instance;
  }

  /**
   * Creates a timeout promise for race conditions
   */
  private createTimeout(ms: number, id: string): Promise<never> {
    return new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Request timeout after ${ms}ms`));
      }, ms);
      this.requestTimeouts.set(id, timeout);
    });
  }

  /**
   * Clears timeout for a specific request
   */
  private clearTimeout(id: string): void {
    const timeout = this.requestTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.requestTimeouts.delete(id);
    }
  }

  /**
   * Generates cache key from URL and options
   */
  private getCacheKey(url: string, options?: FetchOptions): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Retrieves data from cache if valid
   */
  private getCachedData(cacheKey: string): any | null {
    if (!this.config.enableCache) return null;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }

    if (cached) {
      this.cache.delete(cacheKey); // Remove expired cache
    }

    return null;
  }

  /**
   * Stores data in cache
   */
  private setCachedData(cacheKey: string, data: any): void {
    if (!this.config.enableCache) return;

    const expires = Date.now() + this.config.cacheDuration!;
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expires,
    });
  }

  /**
   * Validates response and creates standardized response object
   */
  private async processResponse<T>(response: Response): Promise<ServerResponse<T>> {
    try {
      const timestamp = new Date().toISOString();

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.text();
          if (errorData) {
            errorMessage = errorData;
          }
        } catch (parseError) {
          // Ignore parse errors for error messages
        }

        return {
          success: false,
          error: errorMessage,
          code: response.status.toString(),
          timestamp,
        };
      }

      // Handle different content types
      const contentType = response.headers.get('content-type') || '';
      let data: T;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (contentType.includes('text/')) {
        data = (await response.text()) as T;
      } else {
        data = (await response.blob()) as T;
      }

      return {
        success: true,
        data,
        timestamp,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Response processing failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Core fetch method with retry logic and error handling
   */
  async fetchWithRetry<T = any>(
    url: string,
    options: FetchOptions = {}
  ): Promise<ServerResponse<T>> {
    const requestId = `${Date.now()}-${Math.random()}`;
    const cacheKey = this.getCacheKey(url, options);
    const timeout = options.timeout || this.config.timeout!;
    const retryAttempts = options.retryAttempts ?? this.config.retryAttempts!;

    // Check cache first (only for GET requests)
    if (!options.skipCache && (!options.method || options.method === 'GET')) {
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          timestamp: new Date().toISOString(),
        };
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        const isRetry = attempt > 0;
        if (isRetry) {
          // Progressive delay between retries
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Prepare fetch options
        const fetchOptions: RequestInit = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        };

        // Execute fetch with timeout
        const fetchPromise = fetch(url, fetchOptions);
        const timeoutPromise = this.createTimeout(timeout, requestId);

        const response = await Promise.race([fetchPromise, timeoutPromise]);
        this.clearTimeout(requestId);

        const result = await this.processResponse<T>(response);

        // Cache successful GET responses
        if (result.success && (!options.method || options.method === 'GET')) {
          this.setCachedData(cacheKey, result.data);
        }

        return result;

      } catch (error) {
        this.clearTimeout(requestId);
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
        
        console.warn(`Fetch attempt ${attempt + 1} failed:`, {
          url,
          error: lastError.message,
          isRetry: attempt > 0,
        });

        // Don't retry for certain error types
        if (lastError.message.includes('timeout') && attempt === retryAttempts) {
          break;
        }
        if (lastError.message.includes('AbortError')) {
          break;
        }
      }
    }

    // All attempts failed
    return {
      success: false,
      error: lastError?.message || 'All fetch attempts failed',
      code: 'FETCH_FAILED',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Specialized method for server response fetching
   */
  async fetchServerResponse<T = any>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ServerResponse<T>> {
    try {
      // Validate endpoint
      if (!endpoint || typeof endpoint !== 'string') {
        return {
          success: false,
          error: 'Invalid endpoint provided',
          code: 'INVALID_ENDPOINT',
          timestamp: new Date().toISOString(),
        };
      }

      // Ensure endpoint starts with /
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      // For client-side, check if we're in browser environment
      if (typeof window === 'undefined') {
        return {
          success: false,
          error: 'Server fetch not available in SSR context',
          code: 'SSR_CONTEXT',
          timestamp: new Date().toISOString(),
        };
      }

      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/api${normalizedEndpoint}`;

      return await this.fetchWithRetry<T>(fullUrl, options);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Server response fetch failed',
        code: 'SERVER_FETCH_ERROR',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * GET request wrapper
   */
  async get<T = any>(url: string, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<ServerResponse<T>> {
    return this.fetchWithRetry<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST request wrapper
   */
  async post<T = any>(url: string, data?: any, options: Omit<FetchOptions, 'method'> = {}): Promise<ServerResponse<T>> {
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request wrapper
   */
  async put<T = any>(url: string, data?: any, options: Omit<FetchOptions, 'method'> = {}): Promise<ServerResponse<T>> {
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request wrapper
   */
  async delete<T = any>(url: string, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<ServerResponse<T>> {
    return this.fetchWithRetry<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now >= value.expires) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FetchConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Cleanup method to clear timeouts and cache
   */
  cleanup(): void {
    // Clear all pending timeouts
    for (const timeout of this.requestTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.requestTimeouts.clear();
    
    // Clear cache
    this.cache.clear();
  }
}

// Export singleton instance
export const robustFetch = RobustFetchService.getInstance();

// Legacy compatibility wrapper
export async function fetchServerResponse<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ServerResponse<T>> {
  return robustFetch.fetchServerResponse<T>(endpoint, options);
}

// Export fetch hook for React components
export function useRobustFetch(config?: FetchConfig) {
  if (config) {
    robustFetch.updateConfig(config);
  }
  return robustFetch;
}
