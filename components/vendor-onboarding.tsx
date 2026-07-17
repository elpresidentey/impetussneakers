'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Store, DollarSign, Users, Truck, Shield, ArrowRight, Check, ArrowLeft } from 'lucide-react'

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
    agreeToTerms: false,
  })

  const benefits = [
    {
      icon: DollarSign,
      title: 'Low Commission',
      description: 'Only 8% commission on sales (vs 15–20% on other platforms)',
      highlight: 'Save 40–60% on fees',
    },
    {
      icon: Users,
      title: 'Ready Customers',
      description: 'Access to 10,000+ sneaker enthusiasts in Nigeria',
      highlight: 'Built-in audience',
    },
    {
      icon: Truck,
      title: 'Logistics Support',
      description: 'Integrated shipping with DHL, GIG, and local couriers',
      highlight: 'We handle delivery',
    },
    {
      icon: Shield,
      title: 'Payment Protection',
      description: 'Guaranteed payments within 24 hours of delivery',
      highlight: 'No payment delays',
    },
  ]

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      })

      if (response.ok) {
        setStep(4)
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
      <div className="min-h-screen page-shell text-foreground">
        <section className="relative overflow-hidden surface-ink px-4 pb-14 pt-28 text-white md:px-8 md:pb-20 md:pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to store
            </Link>
            <div className="max-w-3xl text-left">
              <div className="mb-5 inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                <Store className="h-3.5 w-3.5" />
                Sell with Impetus
              </div>
              <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-6xl">
                Become a Vendor Partner
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                Join Nigeria&apos;s fastest-growing sneaker marketplace and scale your business.
              </p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
                Currently onboarding 50 select vendors
              </p>
            </div>
          </div>
        </section>

        <section className="section-pad surface-paper">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl text-left">
              <p className="section-eyebrow">Benefits</p>
              <h2 className="section-title text-4xl md:text-5xl">Why partner with us</h2>
            </div>

            <div className="mb-12 grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 md:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <article
                    key={benefit.title}
                    className="bg-white/80 p-7 text-left transition-colors hover:bg-white md:p-8"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center border border-foreground/10 bg-foreground/[0.04]">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-black uppercase tracking-tight text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mb-3 text-sm leading-relaxed text-foreground/65">
                      {benefit.description}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      {benefit.highlight}
                    </p>
                  </article>
                )
              })}
            </div>

            <div className="mb-10 border border-foreground/10 bg-[var(--surface-ink)] p-7 text-left text-white md:p-10">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                Limited time
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                Reduced commission for first 50 vendors
              </h2>
              <p className="mt-3 max-w-2xl text-base text-white/70">
                Get <span className="font-semibold text-white">5% commission</span> for the first 6
                months. Average vendor earns ₦2.5M monthly · Top vendor: ₦8.2M last month.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={() => setStep(2)}
                className="h-12 bg-foreground px-8 text-sm font-semibold uppercase tracking-[0.12em] text-background hover:bg-foreground/90"
              >
                Start Application <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link
                href="/#shop"
                className="inline-flex min-h-12 items-center justify-center border border-foreground/15 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground"
              >
                Browse the store
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-shell px-4 py-12 text-foreground md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => setStep(step > 2 ? step - 1 : 1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8 text-left">
          <p className="section-eyebrow">Application</p>
          <h1 className="section-title text-3xl md:text-4xl">
            {step === 4 ? 'You\'re in the queue' : `Step ${step - 1} of 2`}
          </h1>
          {step < 4 && (
            <p className="mt-2 text-sm text-foreground/55">
              Tell us about your business. We review applications within 48 hours.
            </p>
          )}
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="mb-8 flex gap-2">
            {[2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 ${step >= s ? 'bg-foreground' : 'bg-foreground/15'}`}
              />
            ))}
          </div>
        )}

        <div className="border border-foreground/[0.08] bg-white/70 p-6 text-left md:p-8">
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Business name
                </label>
                <Input
                  placeholder="Your store or brand name"
                  value={application.businessName}
                  onChange={(e) =>
                    setApplication({ ...application, businessName: e.target.value })
                  }
                  className="h-12"
                />
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Email
                </label>
                <Input
                  placeholder="you@business.com"
                  type="email"
                  value={application.email}
                  onChange={(e) => setApplication({ ...application, email: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Phone
                </label>
                <Input
                  placeholder="+234..."
                  value={application.phone}
                  onChange={(e) => setApplication({ ...application, phone: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  About your business
                </label>
                <Textarea
                  placeholder="Describe your products and what you sell"
                  value={application.description}
                  onChange={(e) =>
                    setApplication({ ...application, description: e.target.value })
                  }
                  className="min-h-[120px]"
                />
              </div>
              <Button
                onClick={() => setStep(3)}
                className="mt-2 h-12 w-full bg-foreground text-sm font-semibold uppercase tracking-[0.12em] text-background hover:bg-foreground/90"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Website (optional)
                </label>
                <Input
                  placeholder="https://"
                  value={application.website}
                  onChange={(e) => setApplication({ ...application, website: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Instagram handle
                </label>
                <Input
                  placeholder="@yourstore"
                  value={application.instagramHandle}
                  onChange={(e) =>
                    setApplication({ ...application, instagramHandle: e.target.value })
                  }
                  className="h-12"
                />
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                  Expected monthly volume
                </label>
                <select
                  className="h-12 w-full border border-foreground/15 bg-white px-3 text-sm text-foreground outline-none focus:border-foreground"
                  value={application.expectedMonthlyVolume}
                  onChange={(e) =>
                    setApplication({ ...application, expectedMonthlyVolume: e.target.value })
                  }
                >
                  <option value="">Select range</option>
                  <option value="0-500k">₦0 – ₦500,000</option>
                  <option value="500k-2m">₦500,000 – ₦2,000,000</option>
                  <option value="2m-5m">₦2,000,000 – ₦5,000,000</option>
                  <option value="5m+">₦5,000,000+</option>
                </select>
              </div>
              <Button
                onClick={handleSubmit}
                className="mt-2 h-12 w-full bg-foreground text-sm font-semibold uppercase tracking-[0.12em] text-background hover:bg-foreground/90"
              >
                Submit Application
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
                <Check className="h-7 w-7 text-emerald-700" />
              </div>
              <h2 className="mb-3 text-2xl font-black uppercase tracking-tight text-foreground !text-center">
                Application Submitted
              </h2>
              <p className="mx-auto mb-6 max-w-sm text-sm text-foreground/60 !text-center">
                We&apos;ll review your application and get back to you within 48 hours.
              </p>
              <p className="mb-8 text-xs uppercase tracking-[0.16em] text-foreground/40 !text-center">
                Follow up: vendors@theimpetus.com
              </p>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center bg-foreground px-6 text-xs font-semibold uppercase tracking-[0.14em] text-background"
              >
                Back to store
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
