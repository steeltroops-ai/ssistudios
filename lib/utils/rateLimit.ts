import { LRUCache } from 'lru-cache';

// Rate limiting configuration
interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens per interval
}

interface RateLimitData {
  count: number;
  resetTime: number;
}

// Create a rate limiter factory
export default function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, RateLimitData>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const tokenData = tokenCache.get(token);

      if (!tokenData) {
        // First request from this token
        tokenCache.set(token, {
          count: 1,
          resetTime: now + options.interval,
        });
        return;
      }

      // Check if the time window has expired
      if (now > tokenData.resetTime) {
        // Reset the counter
        tokenCache.set(token, {
          count: 1,
          resetTime: now + options.interval,
        });
        return;
      }

      // Check if limit is exceeded
      if (tokenData.count >= limit) {
        const error = new Error('Rate limit exceeded');
        (error as any).status = 429;
        (error as any).resetTime = tokenData.resetTime;
        throw error;
      }

      // Increment the counter
      tokenCache.set(token, {
        count: tokenData.count + 1,
        resetTime: tokenData.resetTime,
      });
    },
  };
}

// Pre-configured rate limiters for common use cases
export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
});

export const strictLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 100,
});
