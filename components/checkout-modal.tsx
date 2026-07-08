'use client'

import { useState } from 'react'
import { X, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: (data: { email: string; name: string; phone: string; address: string }) => Promise<void>
  total: number
  items: any[]
  subtotal?: number
  shippingCost?: number
  taxAmount?: number
}

export function CheckoutModal({ isOpen, onClose, onCheckout, total, items, subtotal, shippingCost = 2000, taxAmount }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  
  const calculatedSubtotal = subtotal || items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
  const calculatedTax = taxAmount || Math.round(calculatedSubtotal * 0.05)
  const calculatedTotal = calculatedSubtotal + shippingCost + calculatedTax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all fields')
      return
    }

    setIsProcessing(true)
    try {
      await onCheckout(formData)
    } catch (error) {
      alert('Failed to process checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-foreground/5 rounded-xl p-4 border border-foreground/10">
              <h3 className="font-semibold text-foreground mb-2">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-foreground/60">{item.name} x {item.quantity}</span>
                    <span className="text-foreground">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2 border-t border-foreground/10">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Subtotal</span>
                  <span className="text-foreground">₦{calculatedSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Shipping</span>
                  <span className="text-foreground">₦{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Tax (5%)</span>
                  <span className="text-foreground">₦{calculatedTax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <span className="text-foreground/60 font-medium">Total</span>
                  <span className="text-2xl font-bold text-foreground">₦{calculatedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Customer Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                  placeholder="Enter your full delivery address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-8 py-4 bg-foreground text-background rounded-none font-semibold hover:bg-foreground/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-foreground/25 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <p className="text-xs text-center text-foreground/60">
              You will be redirected to Paystack to complete your payment securely.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
