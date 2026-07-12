import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { validateInput, rateLimit } from '@/lib/validation'
import { z } from 'zod'

const vendorApplicationSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  description: z.string().min(20, 'Business description required'),
  website: z.string().url().optional().or(z.literal('')),
  instagramHandle: z.string().min(1, 'Instagram handle required'),
  expectedMonthlyVolume: z.string().min(1, 'Expected volume required'),
  businessType: z.enum(['individual', 'small_business', 'brand']),
  hasPhysicalStore: z.boolean().optional(),
  agreeToTerms: z.boolean()
})

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`vendor_apply_${ip}`, 3, 300000)) { // 3 applications per 5 minutes
    return NextResponse.json({ error: 'Too many applications. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const validatedData = validateInput(vendorApplicationSchema, body)

    // Check for duplicate applications
    const { data: existing } = await supabase
      .from('vendor_applications')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Application with this email already exists' },
        { status: 400 }
      )
    }

    // Create vendor application
    const { data: application, error } = await supabase
      .from('vendor_applications')
      .insert({
        business_name: validatedData.businessName,
        email: validatedData.email,
        phone: validatedData.phone,
        description: validatedData.description,
        website: validatedData.website || null,
        instagram_handle: validatedData.instagramHandle,
        expected_monthly_volume: validatedData.expectedMonthlyVolume,
        business_type: validatedData.businessType,
        has_physical_store: validatedData.hasPhysicalStore || false,
        status: 'pending',
        application_date: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating vendor application:', error)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    // Send notification to admin (in production, this would be an email)
    await supabase
      .from('admin_notifications')
      .insert({
        type: 'vendor_application',
        title: 'New Vendor Application',
        message: `New vendor application from ${validatedData.businessName} (${validatedData.email})`,
        data: { application_id: application.id },
        created_at: new Date().toISOString()
      })

    // Track analytics for investor metrics
    await supabase
      .from('business_events')
      .insert({
        event_type: 'vendor_application_submitted',
        event_data: {
          business_type: validatedData.businessType,
          expected_volume: validatedData.expectedMonthlyVolume,
          has_social_presence: !!validatedData.instagramHandle
        },
        timestamp: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id
    })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    console.error('Vendor application error:', error)
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    )
  }
}