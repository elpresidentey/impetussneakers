export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  alt: string
  sizes: string[]
  colors: string[]
  rating: number
  inStock: boolean
  stockQuantity?: number
  category?: string
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: string
  total_amount: number
  shipping_address: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
  }
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: number
  product_name: string
  product_image: string
  quantity: number
  price: number
  size: string
  color: string
}

export interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
}

export interface Notification {
  type: 'success' | 'error'
  message: string
}