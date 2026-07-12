'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, DollarSign, Users, Truck, Shield, ArrowRight, Check } from 'lucide-react'

interface VendorApplication {
  businessName: string
  email: string
  phone: string
  description: string
  website: string
  instagramHandle: string
  expectedMonthlyVolume: string
  businessType: 'individual' | 'small_business' | 'brand'
  hasPhysicalStore: boolean
  agreeToTerms: boolean
}

export function VendorOnboarding() {
  const [step, setStep] = useState(1)
  const [application, setApplication] = useState<VendorApplication>({
    businessName: '',
    email: '',
    phone: '',
    description: '',
    website: '',
    instagramHandle: '',
    expectedMonthlyVolume: '',
    businessType: 'individual',
    hasPhysicalStore: false,
    agreeToTerms: false
  })

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Low Commission",
      description: "Only 8% commission on sales (vs 15-20% on other platforms)",
      highlight: "Save 40-60% on fees"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Ready Customers",
      description: "Access to 10,000+ sneaker enthusiasts in Nigeria",
      highlight: "Built-in audience"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Logistics Support",
      description: "Integrated shipping with DHL, GIG, and local couriers",
      highlight: "We handle delivery"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Payment Protection",
      description: "Guaranteed payments within 24 hours of delivery",
      highlight: "No payment delays"
    }
  ]

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      })

      if (response.ok) {
        setStep(4) // Success step
      } else {
        alert('Application failed. Please try again.')
      }
    } catch (error) {
      console.error('Vendor application error:', error)
      alert('Application failed. Please try again.')
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Become a Vendor Partner
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join Nigeria's fastest-growing sneaker marketplace and scale your business
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              🚀 Currently onboarding 50 select vendors
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-primary">{benefit.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground mb-2">{benefit.description}</p>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {benefit.highlight}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Limited Time: Reduced Commission</h2>
            <p className="text-xl mb-6">
              First 50 vendors get <span className="font-bold">5% commission</span> for the first 6 months
            </p>
            <p className="text-lg opacity-90">
              Average vendor earns ₦2.5M monthly | Top vendor: ₦8.2M last month
            </p>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => setStep(2)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
            >
              Start Application <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Application form steps would go here...
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Application - Step {step} of 3</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 2 && (
              <div className="space-y-4">
                <Input
                  placeholder="Business Name"
                  value={application.businessName}
                  onChange={(e) => setApplication({...application, businessName: e.target.value})}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={application.email}
                  onChange={(e) => setApplication({...application, email: e.target.value})}
                />
                <Input
                  placeholder="Phone Number"
                  value={application.phone}
                  onChange={(e) => setApplication({...application, phone: e.target.value})}
                />
                <Textarea
                  placeholder="Describe your business and products"
                  value={application.description}
                  onChange={(e) => setApplication({...application, description: e.target.value})}
                />
                <Button onClick={() => setStep(3)} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Input
                  placeholder="Website (optional)"
                  value={application.website}
                  onChange={(e) => setApplication({...application, website: e.target.value})}
                />
                <Input
                  placeholder="Instagram Handle"
                  value={application.instagramHandle}
                  onChange={(e) => setApplication({...application, instagramHandle: e.target.value})}
                />
                <select 
                  className="w-full p-3 border rounded-lg"
                  value={application.expectedMonthlyVolume}
                  onChange={(e) => setApplication({...application, expectedMonthlyVolume: e.target.value})}
                >
                  <option value="">Expected Monthly Sales Volume</option>
                  <option value="0-500k">₦0 - ₦500,000</option>
                  <option value="500k-2m">₦500,000 - ₦2,000,000</option>
                  <option value="2m-5m">₦2,000,000 - ₦5,000,000</option>
                  <option value="5m+">₦5,000,000+</option>
                </select>
                <Button onClick={handleSubmit} className="w-full">
                  Submit Application
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  We'll review your application and get back to you within 48 hours.
                </p>
                <p className="text-sm text-muted-foreground">
                  Follow up: vendors@theimpetus.com
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}