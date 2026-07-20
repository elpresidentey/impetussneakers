'use client'

import { useCart } from '@/contexts/cart-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { User } from '@supabase/supabase-js'

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, isHydrated } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user)
        setFormData((prev) => ({
          ...prev,
          email: data.user?.email || '',
        }))
      }
      // Allow guest checkout - don't redirect if no user
    }
    getUser()
  }, [])

  // Show loading while cart is hydrating from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading cart...</p>
        </div>
      </div>
    )
  }

  // Only check for empty cart after hydration
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some sneakers to get started</p>
          <Link href="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFormTouched(prev => ({ ...prev, [e.target.name]: true }))
    validateField(e.target.name, e.target.value)
  }

  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format'
        break
      case 'address':
        if (!value) error = 'Delivery address is required'
        else if (value.trim().length < 10) error = 'Please enter a complete address'
        break
      case 'phone':
        if (!value) error = 'Phone number is required'
        else {
          // Nigerian phone number validation
          const phoneRegex = /^(\+234|0)(70|71|80|81|90|91)[0-9]{8}$/
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            error = 'Enter a valid Nigerian phone number (e.g., 08012345678)'
          }
        }
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true
    
    ;['email', 'address', 'phone'].forEach(field => {
      validateField(field, formData[field])
      if (errors[field]) isValid = false
    })
    
    return isValid
  }

  const handleCheckout = async () => {
    setFormTouched({ email: true, address: true, phone: true })
    
    if (!validateForm()) {
      return
    }

    if (!formData.email || !formData.address || !formData.phone) {
      return
    }

    // Check if cart has invalid items (UUIDs instead of numbers)
    const hasInvalidItems = cartItems.some(item => {
      const id = parseInt(String(item.id))
      return isNaN(id)
    })

    if (hasInvalidItems) {
      console.error('Cart contains items with invalid IDs (UUIDs). Clearing cart.')
      clearCart()
      throw new Error('Your cart contains invalid items. The cart has been cleared. Please add items again.')
    }

    // Step 1: Create order first
    try {
      const orderPayload = {
        user_id: user?.id || null, // Allow null for guest checkout
        items: cartItems.map((item) => {
          const productId = parseInt(String(item.id))
          console.log('Processing item:', item.name, 'ID:', item.id, 'Type:', typeof item.id, 'Parsed:', productId)
          return {
            product_id: productId, // Ensure product_id is a valid number
            product_name: item.name,
            product_image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }
        }),
        shipping_address: formData.address,
        billing_address: formData.address,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        customer_email: formData.email,
      }
      
      console.log('Order payload:', JSON.stringify(orderPayload, null, 2))
      
      if (orderPayload.items.length === 0) {
        throw new Error('No items in cart. Please add items to continue.')
      }
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      
      if (!orderResponse.ok) {
        const orderError = await orderResponse.json()
        throw new Error(orderError.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()
      const orderNumber = orderData.order_number

      // Step 2: Initialize payment
      const paymentResponse = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          email: formData.email,
          order_number: orderNumber,
          metadata: {
            order_id: orderData.order_id,
            customer_phone: formData.phone,
            shipping_address: formData.address,
          },
        }),
      })

      if (!paymentResponse.ok) {
        const paymentError = await paymentResponse.json()
        throw new Error(paymentError.error || 'Failed to initialize payment')
      }

      const paymentData = await paymentResponse.json()

      // Step 3: Redirect to Paystack payment page
      if (paymentData.authorization_url) {
        window.location.href = paymentData.authorization_url
      } else {
        throw new Error('No payment URL received')
      }

    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'An error occurred during checkout')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-foreground mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-foreground/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Information</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-foreground/10 rounded-xl p-8 sticky top-32">
              <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-foreground">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-foreground/10 pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">₦2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span className="text-foreground font-medium">₦{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-foreground/10">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₦{(cartTotal + 2000 + Math.round(cartTotal * 0.05)).toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-8"
                size="lg"
              >
                {isProcessing ? 'Processing...' : 'Pay with Paystack'}
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full mt-4" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
