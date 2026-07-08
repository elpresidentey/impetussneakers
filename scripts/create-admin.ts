import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseKey || supabaseKey === 'your-supabase-service-role-key') {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
  console.error('Please get your service role key from Supabase dashboard:')
  console.error('https://supabase.com/dashboard/project/jmoanmrmjmgmjgvgqqpq/settings/api')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
  },
})

async function createAdminUser() {
  const email = 'admin@theimpetus.com'
  const password = 'Admin123!@#' // You can change this

  console.log('Creating admin user...')
  
  // First, try to delete existing user
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers.users.find(u => u.email === email)
  
  if (existingUser) {
    console.log('Admin user already exists, deleting...')
    await supabase.auth.admin.deleteUser(existingUser.id)
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Skip email verification
    user_metadata: {
      role: 'admin',
    },
  })

  if (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }

  console.log('✅ Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('')
  console.log('You can now log in at /auth/login with these credentials')
  console.log('You will be redirected to /admin dashboard')
}

createAdminUser()
