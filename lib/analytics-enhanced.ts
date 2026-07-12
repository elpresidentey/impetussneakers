// Enhanced analytics for tracking business metrics that VCs care about
export interface BusinessMetrics {
  // Core KPIs
  monthlyRecurringRevenue: number
  totalGrossRevenue: number
  avgOrderValue: number
  conversionRate: number
  
  // Customer metrics
  totalCustomers: number
  activeCustomers: number
  newCustomersThisMonth: number
  customerRetentionRate: number
  customerLifetimeValue: number
  
  // Growth metrics
  monthOverMonthGrowth: number
  userGrowthRate: number
  revenueGrowthRate: number
  
  // Marketplace metrics (NEW)
  totalVendors: number
  activeVendors: number
  avgVendorRevenue: number
  platformCommissionRate: number
  vendorRetentionRate: number
  
  // Social commerce metrics (NEW)
  socialShares: number
  referralConversions: number
  ugcEngagement: number
  influencerPartners: number
}

export class AdvancedAnalytics {
  private static instance: AdvancedAnalytics
  
  static getInstance(): AdvancedAnalytics {
    if (!AdvancedAnalytics.instance) {
      AdvancedAnalytics.instance = new AdvancedAnalytics()
    }
    return AdvancedAnalytics.instance
  }

  // Track revenue events for investor metrics
  trackRevenue(event: {
    orderId: string
    amount: number
    vendorId?: string
    customerType: 'new' | 'returning'
    acquisitionChannel: string
    commission?: number
  }) {
    // This would integrate with analytics services like Mixpanel, Amplitude
    const eventData = {
      event: 'revenue_generated',
      properties: {
        ...event,
        timestamp: new Date().toISOString(),
        platform: 'the-impetus'
      }
    }
    
    // Send to analytics service
    this.sendToAnalytics(eventData)
  }

  // Track marketplace vendor metrics
  trackVendorActivity(vendorId: string, activity: {
    type: 'product_listed' | 'sale_made' | 'payout_processed'
    productId?: string
    amount?: number
    metadata?: Record<string, any>
  }) {
    this.sendToAnalytics({
      event: 'vendor_activity',
      properties: {
        vendor_id: vendorId,
        activity_type: activity.type,
        ...activity,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Track social commerce engagement
  trackSocialEngagement(event: {
    type: 'share' | 'referral' | 'ugc_creation' | 'influencer_post'
    userId?: string
    productId?: string
    platform?: 'instagram' | 'tiktok' | 'twitter' | 'whatsapp'
    conversionValue?: number
  }) {
    this.sendToAnalytics({
      event: 'social_engagement',
      properties: {
        ...event,
        timestamp: new Date().toISOString()
      }
    })
  }

  private sendToAnalytics(data: any) {
    // In production, send to Mixpanel, Amplitude, or custom analytics
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', data)
    }
    
    // TODO: Integrate with real analytics service
    // mixpanel.track(data.event, data.properties)
  }
}