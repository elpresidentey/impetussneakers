import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, first_name, last_name, phone } = body

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        first_name,
        last_name,
        phone,
      })
      .select('id, email, first_name, last_name, phone, created_at')
      .single()

    if (createError) throw createError

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
