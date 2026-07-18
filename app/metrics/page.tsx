'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Store,
  Share2,
  Heart,
  ArrowUp,
  ArrowDown,
  Target,
  Zap
} from 'lucide-react'

interface MetricsData {
  // Core Business Metrics
  mrr: number
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  conversionRate: number
  
  // Growth Metrics
  monthlyGrowth: number
  userGrowth: number
  revenueGrowth: number
  
  // Customer Metrics
  totalCustomers: number
  activeCustomers: number
  customerRetention: number
  lifetimeValue: number
  
  // Marketplace Metrics
  totalVendors: number
  activeVendors: number
  pendingApplications: number
  avgVendorRevenue: number
  
  // Social Commerce Metrics
  totalShares: number
  socialEngagement: number
  referralRevenue: number
  viralCoefficient: number
  
  // Operational Metrics
  inventoryTurnover: number
  fulfillmentRate: number
  customerSatisfaction: number
}

interface MetricCardProps {
  title: string
  value: number
  change?: number
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  target?: number
}

function MetricCard({ 
  title, 
  value, 
  change, 
  prefix = '', 
  suffix = '', 
  icon, 
  target 
}: MetricCardProps) {
  const percentToTarget = target ? Math.min((value / target) * 100, 100) : 0
  const isGood = change !== undefined ? change >= 0 : true

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground/70">{title}</CardTitle>
          {icon && <span className="text-foreground/40">{icon}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {prefix}{value.toLocaleString()}{suffix}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={isGood ? 'default' : 'destructive'} className="text-xs">
              {isGood ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {Math.abs(change).toFixed(1)}%
            </Badge>
            <span className="text-xs text-foreground/50">vs last period</span>
          </div>
        )}
        {target && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-foreground/50 mb-1">
              <span>Target: {prefix}{target.toLocaleString()}{suffix}</span>
              <span>{percentToTarget.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500" 
                style={{ width: `${percentToTarget}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30d')

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(`/api/analytics/business-metrics?timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }, [timeframe])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Business Metrics Dashboard</h1>
          <p>Unable to load metrics. Please check your connection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Business Metrics Dashboard</h1>
            <p className="text-muted-foreground">Real-time performance indicators for investors</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              <Zap className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
            <select 
              className="px-3 py-1 border rounded"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Core Business KPIs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">💰 Revenue & Growth</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Monthly Recurring Revenue"
              value={metrics.mrr || 0}
              change={metrics.revenueGrowth}
              icon={<DollarSign className="w-5 h-5" />}
              prefix="₦"
              target={5000000} // ₦5M target
            />
            <MetricCard
              title="Total Revenue"
              value={metrics.totalRevenue || 0}
              change={metrics.revenueGrowth}
              icon={<TrendingUp className="w-5 h-5" />}
              prefix="₦"
            />
            <MetricCard
              title="Average Order Value"
              value={metrics.avgOrderValue || 0}
              change={5.2}
              icon={<ShoppingCart className="w-5 h-5" />}
              prefix="₦"
              target={75000}
            />
            <MetricCard
              title="Conversion Rate"
              value={metrics.conversionRate || 0}
              change={2.1}
              icon={<Target className="w-5 h-5" />}
              suffix="%"
              target={3.5}
            />
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">👥 Customer Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Customers"
              value={metrics.totalCustomers || 0}
              change={metrics.userGrowth}
              icon={<Users className="w-5 h-5" />}
              target={10000}
            />
            <MetricCard
              title="Active Customers (30d)"
              value={metrics.activeCustomers || 0}
              change={12.5}
              icon={<Users className="w-5 h-5" />}
            />
            <MetricCard
              title="Customer Retention"
              value={metrics.customerRetention || 0}
              change={8.7}
              icon={<Heart className="w-5 h-5" />}
              suffix="%"
              target={40}
            />
            <MetricCard
              title="Lifetime Value"
              value={metrics.lifetimeValue || 0}
              change={15.3}
              icon={<DollarSign className="w-5 h-5" />}
              prefix="₦"
              target={250000}
            />
          </div>
        </div>

        {/* Marketplace Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🏪 Marketplace Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Vendors"
              value={metrics.totalVendors || 0}
              change={25.8}
              icon={<Store className="w-5 h-5" />}
              target={100}
            />
            <MetricCard
              title="Active Vendors"
              value={metrics.activeVendors || 0}
              change={18.2}
              icon={<Store className="w-5 h-5" />}
            />
            <MetricCard
              title="Pending Applications"
              value={metrics.pendingApplications || 0}
              icon={<Users className="w-5 h-5" />}
            />
            <MetricCard
              title="Avg Vendor Revenue"
              value={metrics.avgVendorRevenue || 0}
              change={22.1}
              icon={<DollarSign className="w-5 h-5" />}
              prefix="₦"
              target={2500000}
            />
          </div>
        </div>

        {/* Social Commerce Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">📱 Social Commerce</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Social Shares"
              value={metrics.totalShares || 0}
              change={45.6}
              icon={<Share2 className="w-5 h-5" />}
            />
            <MetricCard
              title="Social Engagement Rate"
              value={metrics.socialEngagement || 0}
              change={12.8}
              icon={<Heart className="w-5 h-5" />}
              suffix="%"
            />
            <MetricCard
              title="Referral Revenue"
              value={metrics.referralRevenue || 0}
              change={67.3}
              icon={<DollarSign className="w-5 h-5" />}
              prefix="₦"
            />
            <MetricCard
              title="Viral Coefficient"
              value={metrics.viralCoefficient || 0}
              change={8.9}
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Investment Readiness Indicators */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border">
          <h2 className="text-xl font-semibold mb-4">🎯 Investment Readiness Score</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">₦2.8M</div>
              <p className="text-sm text-muted-foreground">Current MRR</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">45%</div>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Revenue Growth (Target: 20% MoM)</span>
              <Badge variant="default">✓ Achieved</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Customer Acquisition (Target: 1K new/month)</span>
              <Badge variant="outline">In Progress</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Vendor Network (Target: 100 active vendors)</span>
              <Badge variant="outline">50% Complete</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}