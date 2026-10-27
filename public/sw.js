/*
 * The Impetus service worker.
 *
 * Strategy: NETWORK-FIRST for everything we touch.
 * - Fresh responses always win when online, so users never see stale app code
 *   (this is what keeps the app stable — the cache is only an offline fallback).
 * - We only cache same-origin GET responses for navigations and static assets.
 * - API routes, cross-origin requests and non-GET requests are left untouched.
 * - Bump CACHE_VERSION whenever offline.html changes; old caches are purged on activate.
 */

const CACHE_VERSION = 'v1'
const CACHE_NAME = `impetus-offline-${CACHE_VERSION}`
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.add(OFFLINE_URL)
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

function shouldHandle(request, url) {
  if (request.method !== 'GET') return false
  if (url.origin !== self.location.origin) return false
  if (url.pathname.startsWith('/api/')) return false
  if (url.pathname === '/sw.js') return false
  // Navigations (documents) and static assets only.
  return (
    request.mode === 'navigate' ||
    ['script', 'style', 'font', 'image'].includes(request.destination) ||
    url.pathname.startsWith('/_next/static/')
  )
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  let url
  try {
    url = new URL(request.url)
  } catch {
    return
  }
  if (!shouldHandle(request, url)) return

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(request)
        if (fresh && fresh.status === 200 && !fresh.redirected) {
          const cache = await caches.open(CACHE_NAME)
          cache.put(request, fresh.clone())
        }
        return fresh
      } catch (error) {
        // Network failed — fall back to the cache.
        const options = request.mode === 'navigate' ? { ignoreSearch: true } : {}
        const cached = await caches.match(request, options)
        if (cached) return cached

        if (request.mode === 'navigate') {
          const offline = await caches.match(OFFLINE_URL)
          if (offline) return offline
        }
        throw error
      }
    })()
  )
})
