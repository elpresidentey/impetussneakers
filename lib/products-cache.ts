/**
 * Shared in-memory product cache (per server instance).
 *
 * Purpose: survive short Supabase outages. Fresh data is served fast from
 * memory; if Supabase goes down, the last good payload is served stale
 * instead of failing the storefront with a 500.
 *
 * Note: this is per-instance memory. On serverless it helps within a warm
 * instance; CDN caching via `Cache-Control: s-maxage + stale-while-revalidate`
 * (set on the API responses) covers the rest.
 */

interface ProductsCacheEntry {
  payload: unknown[]
  fetchedAt: number
}

let entry: ProductsCacheEntry | null = null

/** How long cached products are considered fresh (5 minutes). */
export const PRODUCTS_CACHE_TTL_MS = 5 * 60 * 1000

/** Fresh cache hit, or null when missing/expired. */
export function getCachedProducts(): unknown[] | null {
  if (!entry) return null
  if (Date.now() - entry.fetchedAt > PRODUCTS_CACHE_TTL_MS) return null
  return entry.payload
}

/** Last known payload regardless of age (for stale-while-revalidate fallback). */
export function getStaleProducts(): unknown[] | null {
  return entry?.payload ?? null
}

export function setCachedProducts(payload: unknown[]): void {
  entry = { payload, fetchedAt: Date.now() }
}

/** Call after any product mutation (create/update/delete). */
export function invalidateProductsCache(): void {
  entry = null
}
