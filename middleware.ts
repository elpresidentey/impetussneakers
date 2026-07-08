import { updateSession } from '@/lib/supabase/proxy'
import { addSecurityHeaders } from '@/lib/security'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request)
  
  // Add security headers
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
