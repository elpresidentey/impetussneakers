'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, DollarSign, Users, Truck, Shield, ArrowRight, Check } from 'lucide-react'

interface VendorApplication {
  businessName: string
  email: string
  phone: string
  description: string
  instagramHandle: string
}

export function VendorOnboarding() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [application, setApplication] = useState<VendorApplication>({
    businessName: '',
    email: '',
    phone: '',
    description: '',
    instagramHandle: '',
  })

  const benefits = [
    { icon: <DollarSign className="w-8 h-8" />, title: "Low Commission", description: "8% flat rate (vs 15-20% elsewhere)" },
    { icon: <Users className="w-8 h-8" />, title: "Ready Customers", description: "10,000+ sneaker enthusiasts" },
    { icon: <Truck className="w-8 h-8" />, title: "Logistics Handled", description: "Integrated DHL, GIG, local couriers" },
    { icon: <Shield className="w-8 h-8" />, title: "Payment Protection", description: "Guaranteed payout within 24h of delivery" },
  ]

  const handleChange = (field: keyof VendorApplication, value: string) => {
    setApplication(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!application.businessName || !application.email || !application.phone || !application.description) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...application, businessType: 'individual', hasPhysicalStore: false, expectedMonthlyVolume: '', agreeToTerms: true })
      })
      if (response.ok) {
        setSubmitted(true)
      } else {
        setError('Application failed. Please try again.')
      }
    } catch {
      setError('Application failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                We'll review your application and get back to you within 48 hours.
              </p>
              <p className="text-sm text-muted-foreground">Follow up: vendors@theimpetus.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
            🚀 Onboarding 50 select vendors
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Become a Vendor Partner</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join Nigeria's fastest-growing sneaker marketplace and scale your business
          </p>
        </div>

        {/* Benefits - compact */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {benefits.map((benefit, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-primary">{benefit.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Promo */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white text-center mb-10">
          <h2 className="text-xl font-bold mb-2">Limited Time: 5% Commission</h2>
          <p className="text-lg mb-2">First 50 vendors get <span className="font-bold">5% commission</span> for 6 months</p>
          <p className="opacity-90">Avg vendor earns ₦2.5M/month | Top: ₦8.2M</p>
        </div>

        {/* Single-page form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Vendor Application</CardTitle>
            <CardDescription>Fill in the essentials — we'll handle the rest</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <Input
                placeholder="Business Name *"
                value={application.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                required
              />
              <Input
                placeholder="Email *"
                type="email"
                value={application.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <Input
                placeholder="Phone Number *"
                value={application.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
              <Input
                placeholder="Instagram Handle"
                value={application.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
              />
              <Textarea
                placeholder="Describe your business and products *"
                value={application.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />

              <Button type="submit" disabled={loading} className="w-full py-4 text-lg" size="lg">
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}