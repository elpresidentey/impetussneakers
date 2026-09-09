import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

/**
 * Lazily creates the Supabase client on first use.
 *
 * Deliberately NOT created at module load: Next.js imports every route
 * module at build time to collect segment config, and throwing there fails
 * the entire Vercel build when env vars are absent. With lazy init the
 * build always succeeds; only routes that actually touch the database can
 * fail at runtime — where API caches/fallbacks cover the storefront.
 */
export function getSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase environment variables')
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return cachedClient
}

/**
 * Backwards-compatible handle: defers client creation until the first
 * property access, so existing `import { supabase }` call sites keep
 * working unchanged.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase()
    const value = Reflect.get(client as unknown as Record<PropertyKey, unknown>, prop)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export default supabase
