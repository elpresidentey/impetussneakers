import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

// Never cache health results — each hit must actually probe the dependencies.
export const dynamic = 'force-dynamic'
export const revalidate = 0

/** How long to wait for Supabase before declaring it unhealthy. */
const DB_TIMEOUT_MS = 8_000

/** Minimum gap between alert emails so a prolonged outage doesn't spam inboxes. */
const ALERT_COOLDOWN_MS = 60 * 60 * 1000

let lastAlertAt = 0

function getAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

async function sendOutageAlert(detail: string): Promise<void> {
  const now = Date.now()
  if (now - lastAlertAt < ALERT_COOLDOWN_MS) return
  lastAlertAt = now

  const recipients = getAdminEmails()
  if (recipients.length === 0) {
    console.error('Health check: database unhealthy but no admin emails configured')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'the production site'
  await Promise.all(
    recipients.map((to) =>
      sendEmail({
        to,
        subject: '🚨 The Impetus: product database is unreachable',
        html: `
          <h2>Storefront health alert</h2>
          <p>The scheduled health check could not reach the product database.</p>
          <p><strong>Detail:</strong> ${detail}</p>
          <p>The site is currently serving cached/fallback products, so customers still see items — but <strong>admin changes won't take effect</strong> until the database recovers.</p>
          <p>Check Supabase project status (it may be paused), verify <code>NEXT_PUBLIC_SUPABASE_URL</code> in Vercel env vars, then visit ${appUrl}/api/health to confirm recovery.</p>
          <p><small>Next alert in at most 1 hour if still down. Automated check, do not reply.</small></p>
        `,
        text: `The Impetus health alert: product database unreachable (${detail}). Site is serving cached products. Check Supabase status and NEXT_PUBLIC_SUPABASE_URL env var.`,
      })
    )
  )
}

export async function GET() {
  const startedAt = Date.now()
  let dbStatus: 'ok' | 'error' = 'error'
  let dbDetail = 'unknown'
  let productCount: number | null = null

  try {
    // Lazy import so a missing/broken Supabase config is reported as
    // unhealthy (with an alert) instead of crashing the route module.
    const { supabase } = await import('@/lib/db')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), DB_TIMEOUT_MS)
    try {
      const { count, error } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .abortSignal(controller.signal)

      if (error) {
        dbDetail = error.message
      } else {
        dbStatus = 'ok'
        dbDetail = 'reachable'
        productCount = count
      }
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    dbDetail = error instanceof Error ? error.message : String(error)
  }

  const latencyMs = Date.now() - startedAt
  const healthy = dbStatus === 'ok'

  if (!healthy) {
    console.error(`Health check FAILED: database unreachable (${dbDetail})`)
    // Fire-and-forget: the alert must never delay the health response.
    sendOutageAlert(dbDetail).catch((error) =>
      console.error('Failed to send outage alert email:', error)
    )
  }

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      latencyMs,
      checks: {
        database: { status: dbStatus, detail: dbDetail, productCount },
      },
    },
    {
      status: healthy ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}
