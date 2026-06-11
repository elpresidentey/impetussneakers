'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Order {
  id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  order_items?: Array<{
    product_id: string
    quantity: number
    price_at_purchase: number
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()

      // Get current user
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData.user) {
        router.push('/auth/login')
        return
      }

      setUser(authData.user)

      // Get user's orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false })

      if (!ordersError && ordersData) {
        setOrders(ordersData)
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Account Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg">
            Sign Out
          </Button>
        </div>

        {/* Order History */}
        <div className="bg-card border border-foreground/10 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">No orders yet</p>
              <Link href="/">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-foreground/10 rounded-lg p-6 hover:border-foreground/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono text-foreground">{order.id.slice(0, 8)}...</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="text-foreground font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-foreground font-semibold">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex gap-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-foreground font-medium">
                        {order.order_items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-foreground/10 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">Continue Shopping</h3>
            <Link href="/">
              <Button className="w-full" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-foreground/10 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">Your Cart</h3>
            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Go to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
