import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'
import { validateInput, loginSchema, rateLimit, sanitizeHtml } from '@/lib/validation'

export async function POST(request: Request) {
  // Aggressive rate limiting for login attempts
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`login_${ip}`, 5, 300000)) { // 5 attempts per 5 minutes
    return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    
    // Validate input
    const { email, password } = validateInput(loginSchema, body)

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token with role
    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    })

    // Sanitize user data before sending
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: sanitizeHtml(user.first_name || ''),
        last_name: sanitizeHtml(user.last_name || ''),
        phone: sanitizeHtml(user.phone || ''),
        role: user.role || 'user'
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
