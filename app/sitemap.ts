import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://impetus-omega.vercel.app'
  
  const staticRoutes = [
    '',
    '/about',
    '/vendor',
    '/orders',
    '/checkout',
    '/order-success',
    '/legal/privacy',
    '/legal/terms',
    '/legal/shipping',
    '/legal/returns',
    '/auth/login',
    '/auth/sign-up',
  ]
  
  const lastModified = new Date()
  
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/legal') ? 0.3 : 0.7,
  }))
}