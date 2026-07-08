/**
 * Admin utilities for checking admin permissions
 */

type AdminUserLike = string | null | undefined | {
  email?: string | null
  role?: string | null
  user_metadata?: Record<string, any> | null
  app_metadata?: Record<string, any> | null
}

export function isAdminUser(user: AdminUserLike): boolean {
  if (!user) return false

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@theimpetus.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

  const email = typeof user === 'string' ? user : user.email
  if (email && adminEmails.includes(email.toLowerCase())) {
    return true
  }

  if (typeof user !== 'string') {
    const role = user.user_metadata?.role || user.app_metadata?.role || user.role
    if (typeof role === 'string' && role.toLowerCase() === 'admin') {
      return true
    }
  }

  return false
}

export function getAdminEmails(): string[] {
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@theimpetus.com')
  return adminEmails.split(',').map(email => email.trim()).filter(Boolean)
}
