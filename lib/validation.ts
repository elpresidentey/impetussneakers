import { z } from 'zod'

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  price: z.number().positive('Price must be positive').max(999999, 'Price too high'),
  image_url: z.string().optional().default('').refine(
    (value) => value === '' || /^(https?:\/\/|data:image\/|blob:|\/)/.test(value),
    { message: 'Invalid image URL' }
  ),
  alt_text: z.string().min(1, 'Alt text is required').max(255, 'Alt text too long').optional(),
  sizes: z.union([
    z.array(z.string()).min(1, 'At least one size required'),
    z.string().transform(val => val.split(',').map(s => s.trim()).filter(s => s))
  ]),
  colors: z.union([
    z.array(z.string()).min(1, 'At least one color required'),
    z.string().transform(val => val.split(',').map(c => c.trim()).filter(c => c))
  ]),
  rating: z.number().min(0).max(5).optional().default(0),
  in_stock: z.boolean().default(true),
  stock_quantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  category: z.string().min(1, 'Category is required'),
})

export const updateProductSchema = createProductSchema.partial()

// Order validation schemas
export const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required').max(255),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().min(10, 'Phone number required').max(20),
  shipping_address: z.string().min(10, 'Complete address required').max(500),
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
  })).min(1, 'At least one item required'),
  total_amount: z.number().positive('Invalid total amount'),
})

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
})

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  name: z.string().min(1, 'Name is required').max(255),
})

// Newsletter schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(255).optional(),
})

// Payment schema
export const paymentInitSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  email: z.string().email('Invalid email address'),
  orderId: z.string().min(1, 'Order ID required'),
})

// Generic validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join(', ')
    
    throw new Error(`Validation failed: ${errorMessages}`)
  }
  
  return result.data
}

// Rate limiting helper (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const key = identifier
  const windowStart = now - windowMs
  
  const current = rateLimitStore.get(key)
  
  if (!current || current.resetTime < windowStart) {
    rateLimitStore.set(key, { count: 1, resetTime: now })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}