/**
 * Admin utilities for checking admin permissions
 */

export function isAdminUser(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false
  
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@theimpetus.com'
  const adminEmailList = adminEmails.split(',').map(email => email.trim().toLowerCase())
  
  return adminEmailList.includes(userEmail.toLowerCase())
}

export function getAdminEmails(): string[] {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@theimpetus.com'
  return adminEmails.split(',').map(email => email.trim())
}
