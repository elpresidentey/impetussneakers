import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const rootDir = process.cwd()

function loadEnvFile(fileName) {
  const filePath = path.join(rootDir, fileName)

  if (!fs.existsSync(filePath)) {
    return
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')
    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')
loadEnvFile('.env.example')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseKey = serviceRoleKey && !serviceRoleKey.startsWith('your-')
  ? serviceRoleKey
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@theimpetus.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in environment files.')
}

const supabase = createClient(supabaseUrl, supabaseKey)
const passwordHash = await bcrypt.hash(adminPassword, 10)

const adminUser = {
  email: adminEmail,
  password_hash: passwordHash,
  first_name: 'The',
  last_name: 'Impetus',
  phone: null,
  updated_at: new Date().toISOString(),
}

const { data, error } = await supabase
  .from('users')
  .upsert(adminUser, { onConflict: 'email' })
  .select('id, email, first_name, last_name')
  .single()

if (error) {
  throw error
}

console.log(`Admin user ready: ${data.email} (id: ${data.id})`)
console.log('Set ADMIN_PASSWORD before running this script to choose a different password.')
