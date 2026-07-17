'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Calendar, CreditCard, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface Order {
  id: number
  order_number: string
  status: string
  payment_status: string
  total: number
  total_amount?: number
  created_at: string
  items: any[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      if (!user) return
      const response = await fetch(`/api/orders?user_id=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'processing':
        return <Clock className="h-5 w-5 text-sky-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-foreground/50" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
      case 'processing':
        return 'bg-sky-500/10 text-sky-700 border-sky-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-500/20'
      default:
        return 'bg-foreground/5 text-foreground/60 border-foreground/10'
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center page-shell px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-foreground/10 bg-white/70">
            <Package className="h-8 w-8 text-foreground/40" />
          </div>
          <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl !text-center">
            Sign in to view orders
          </h1>
          <p className="mb-8 text-sm text-foreground/60 !text-center">
            Please log in to track and manage your order history.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/login"
              className="inline-flex min-h-11 items-center justify-center bg-foreground px-6 text-xs font-semibold uppercase tracking-[0.14em] text-background"
            >
              Log in
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center border border-foreground/20 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-foreground"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center page-shell">
        <div className="h-10 w-10 animate-spin border-2 border-foreground/15 border-t-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-shell text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-10 text-left md:mb-12">
          <button
            onClick={() => router.push('/')}
            className="group mb-6 flex items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
          <p className="section-eyebrow">Account</p>
          <h1 className="section-title text-4xl md:text-5xl">Order History</h1>
          <p className="section-lede mt-3">Track and manage your orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="border border-foreground/[0.08] bg-white/60 px-6 py-16 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-foreground/35" />
            <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-foreground !text-center">
              No orders yet
            </h2>
            <p className="mb-8 text-sm text-foreground/55 !text-center">
              Your order history will appear here after your first purchase.
            </p>
            <Link
              href="/#shop"
              className="inline-flex min-h-11 items-center justify-center bg-foreground px-6 text-xs font-semibold uppercase tracking-[0.14em] text-background"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="border border-foreground/[0.08] bg-white/70 p-5 text-left transition-colors hover:border-foreground/20 hover:bg-white md:p-6"
              >
                <div className="mb-5 flex flex-col gap-4 border-b border-foreground/[0.06] pb-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4 text-left">
                    <div className={`border p-3 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-foreground md:text-lg">
                        {order.order_number}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-foreground/55">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                        Total
                      </p>
                      <p className="text-xl font-black tracking-tight text-foreground">
                        ₦{(order.total_amount || order.total || 0).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {order.items?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="text-left text-foreground/75">
                          {item.name || item.product_name} × {item.quantity}
                        </span>
                        <span className="shrink-0 text-right font-medium text-foreground">
                          ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-foreground/[0.06] pt-4 text-sm text-foreground/55">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    Payment:{' '}
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
