/**
 * Simple in-memory cache for API responses
 * Reduces network requests and speeds up page loads
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

// Cache durations in milliseconds
export const CACHE_DURATIONS = {
    BROWSE: 5 * 60 * 1000,      // 5 minutes for browse results
    DETAILS: 30 * 60 * 1000,    // 30 minutes for manga details
    CHAPTERS: 10 * 60 * 1000,   // 10 minutes for chapter list
    PAGES: 60 * 60 * 1000,      // 1 hour for chapter pages
} as const;

/**
 * Get cached data if available and not expired
 */
export function getCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }

    return entry.data as T;
}

/**
 * Set cache data with expiration
 */
export function setCache<T>(key: string, data: T, duration: number): void {
    cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
    });
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
    cache.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
    cache.clear();
}

/**
 * Clear expired cache entries (cleanup)
 */
export function cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
        if (now > entry.expiresAt) {
            cache.delete(key);
        }
    }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
    return {
        size: cache.size,
        keys: Array.from(cache.keys()),
    };
}
