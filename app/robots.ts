import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://impetus-omega.vercel.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/checkout', '/orders', '/dashboard', '/auth/', '/payment/', '/vendor'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}