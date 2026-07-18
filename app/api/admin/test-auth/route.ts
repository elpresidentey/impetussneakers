import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { isAdminUser } from '@/lib/admin'

export async function GET(request: Request) {
  try {
    const adminEmailHeader = request.headers.get('x-admin-email')
    const authHeader = request.headers.get('authorization')
    
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@theimpetus.com'
    
    const user = await requireAdminAuth(request)
    
    return NextResponse.json({
      isAdmin: !!user,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      headers: {
        'x-admin-email': adminEmailHeader,
        'authorization': authHeader ? 'Bearer ***' : null,
      },
      config: {
        adminEmails: adminEmails.split(',').map(e => e.trim()),
        isAdminByEmail: adminEmailHeader ? isAdminUser(adminEmailHeader) : false,
      }
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
