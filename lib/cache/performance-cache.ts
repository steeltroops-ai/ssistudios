/**
 * Advanced Performance Caching System for SSI Studios
 * Implements multiple caching strategies for optimal performance
 */

// In-memory cache with TTL support
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: any, ttl = 300000): void { // 5 minutes default
    // Clean up expired entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const expires = Date.now() + ttl;
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const memoryCache = new MemoryCache(200);
export const apiCache = new MemoryCache(50);
export const imageCache = new MemoryCache(100);

// Cache key generators
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  templates: (page: number, limit: number) => `templates:${page}:${limit}`,
  projects: (userId: string, filter?: string) => `projects:${userId}:${filter || 'all'}`,
  settings: (userId: string) => `settings:${userId}`,
  analytics: (userId: string, period: string) => `analytics:${userId}:${period}`,
};

// SWR-like cache with stale-while-revalidate pattern
export class SWRCache {
  private cache = new MemoryCache(100);
  private revalidating = new Set<string>();

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      ttl?: number;
      staleTime?: number;
      revalidateOnFocus?: boolean;
    } = {}
  ): Promise<T> {
    const { ttl = 300000, staleTime = 60000, revalidateOnFocus = true } = options;
    
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if fresh
    if (cached && (now - cached.timestamp) < staleTime) {
      return cached.data;
    }

    // Return stale data while revalidating
    if (cached && !this.revalidating.has(key)) {
      this.revalidate(key, fetcher, ttl);
      return cached.data;
    }

    // No cached data, fetch fresh
    if (!this.revalidating.has(key)) {
      return this.fetchAndCache(key, fetcher, ttl);
    }

    // Return stale data if available while waiting for revalidation
    return cached ? cached.data : this.fetchAndCache(key, fetcher, ttl);
  }

  private async revalidate<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<void> {
    if (this.revalidating.has(key)) return;

    this.revalidating.add(key);
    
    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() }, ttl);
    } catch (error) {
      console.warn(`Revalidation failed for key ${key}:`, error);
    } finally {
      this.revalidating.delete(key);
    }
  }

  private async fetchAndCache<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
    this.revalidating.add(key);
    
    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() }, ttl);
      return data;
    } finally {
      this.revalidating.delete(key);
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.revalidating.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    // Note: MemoryCache would need to expose keys() method for this to work
    // This is a simplified implementation
  }
}

export const swrCache = new SWRCache();

// Browser storage cache with compression
export class BrowserCache {
  private prefix: string;
  private compression: boolean;

  constructor(prefix = 'ssi_cache_', compression = true) {
    this.prefix = prefix;
    this.compression = compression;
  }

  set(key: string, data: any, ttl = 86400000): void { // 24 hours default
    if (typeof window === 'undefined') return;

    try {
      const item = {
        data: this.compression ? this.compress(data) : data,
        expires: Date.now() + ttl,
        compressed: this.compression,
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache to localStorage:', error);
    }
  }

  get(key: string): any | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      if (Date.now() > parsed.expires) {
        this.delete(key);
        return null;
      }

      return parsed.compressed ? this.decompress(parsed.data) : parsed.data;
    } catch (error) {
      console.warn('Failed to retrieve from localStorage:', error);
      return null;
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  private compress(data: any): string {
    // Simple compression using JSON.stringify
    // In production, consider using a proper compression library
    return JSON.stringify(data);
  }

  private decompress(data: string): any {
    return JSON.parse(data);
  }
}

export const browserCache = new BrowserCache();

// API response cache with automatic invalidation
export class APICache {
  private cache = new SWRCache();
  private invalidationRules = new Map<string, string[]>();

  async fetch<T>(
    url: string,
    options: RequestInit = {},
    cacheOptions: {
      ttl?: number;
      tags?: string[];
      revalidateOnFocus?: boolean;
    } = {}
  ): Promise<T> {
    const { ttl = 300000, tags = [], revalidateOnFocus = true } = cacheOptions;
    const cacheKey = this.generateCacheKey(url, options);

    // Register invalidation rules
    if (tags.length > 0) {
      this.invalidationRules.set(cacheKey, tags);
    }

    return this.cache.get(
      cacheKey,
      () => this.fetchFromAPI<T>(url, options),
      { ttl, revalidateOnFocus }
    );
  }

  invalidateByTag(tag: string): void {
    for (const [key, tags] of this.invalidationRules.entries()) {
      if (tags.includes(tag)) {
        this.cache.invalidate(key);
        this.invalidationRules.delete(key);
      }
    }
  }

  private async fetchFromAPI<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }
}

export const apiCacheManager = new APICache();

// Performance monitoring for cache effectiveness
export class CacheMetrics {
  private hits = 0;
  private misses = 0;
  private errors = 0;

  recordHit(): void {
    this.hits++;
  }

  recordMiss(): void {
    this.misses++;
  }

  recordError(): void {
    this.errors++;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      errors: this.errors,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
      total,
    };
  }

  reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.errors = 0;
  }
}

export const cacheMetrics = new CacheMetrics();

// Utility functions for cache management
export const cacheUtils = {
  // Preload critical data
  preloadCriticalData: async (userId: string) => {
    const promises = [
      apiCacheManager.fetch(`/api/user/${userId}`, {}, { tags: ['user'] }),
      apiCacheManager.fetch(`/api/dashboard/${userId}`, {}, { tags: ['dashboard'] }),
      apiCacheManager.fetch('/api/templates?limit=10', {}, { tags: ['templates'] }),
    ];

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Failed to preload critical data:', error);
    }
  },

  // Clear all caches
  clearAll: () => {
    memoryCache.clear();
    apiCache.clear();
    imageCache.clear();
    browserCache.clear();
  },

  // Get cache statistics
  getStats: () => ({
    memory: {
      size: memoryCache.size(),
      maxSize: 200,
    },
    api: {
      size: apiCache.size(),
      maxSize: 50,
    },
    image: {
      size: imageCache.size(),
      maxSize: 100,
    },
    metrics: cacheMetrics.getStats(),
  }),
};
