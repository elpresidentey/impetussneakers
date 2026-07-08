import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin'

export interface AuthUser {
  id: string
  email: string
  role: string
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET not configured')
    }
    
    const decoded = jwt.verify(token, secret) as any
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization')
  const adminEmailHeader = request.headers.get('x-admin-email')

  if (adminEmailHeader && isAdminUser(adminEmailHeader)) {
    return {
      id: 'admin-header',
      email: adminEmailHeader.trim(),
      role: 'admin',
    }
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  
  // Try Supabase token first
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (!error && user) {
      const isAdmin = isAdminUser(user.email)
      
      return {
        id: user.id,
        email: user.email || '',
        role: isAdmin ? 'admin' : 'user'
      }
    }
  } catch (error) {
    console.error('Supabase auth error:', error)
  }
  
  // Fallback to JWT verification
  return verifyToken(token)
}

export async function requireAdminAuth(request: NextRequest): Promise<AuthUser | null> {
  const user = await requireAuth(request)
  
  if (!user || user.role !== 'admin') {
    return null
  }
  
  return user
}

export function createToken(user: { id: string; email: string; role: string }): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    { expiresIn: '24h' }
  )
}