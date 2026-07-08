const fs = require('fs')
const path = require('path')

const root = process.cwd()
function loadEnvFile(fileName) {
  const filePath = path.join(root, fileName)
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const separatorIndex = trimmed.indexOf('=')
    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or service role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function main() {
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@theimpetus.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456'

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 })
  if (listError) throw listError

  const existingUser = existingUsers.users.find((user) => user.email === email)

  if (existingUser) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
      app_metadata: { role: 'admin' }
    })
    if (updateError) throw updateError
    console.log(`Updated existing admin user: ${email}`)
    return
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' },
    app_metadata: { role: 'admin' }
  })

  if (error) throw error
  console.log(`Created admin user: ${data.user?.email}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
