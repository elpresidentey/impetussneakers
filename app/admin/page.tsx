'use client'

import { useState, useEffect, useCallback } from 'react'
import { Package, Users, DollarSign, ShoppingCart, ShieldAlert, Plus, Home, Edit, Trash2, Search, ArrowLeft, X, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { AdminProductForm } from '@/components/admin-product-form'
import { createClient } from '@/lib/supabase/client'
import { isAdminUser } from '@/lib/admin'
import { Product, Order, Notification } from '@/lib/types'

type ViewMode = 'dashboard' | 'products' | 'orders' | 'add-product' | 'edit-product'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)

  const getAuthToken = useCallback(async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || ''
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const token = await getAuthToken()
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-admin-email': user?.email || '',
          },
        }),
        fetch('/api/products'),
      ])

      if (ordersRes.ok) {
        const orders = await ordersRes.json()
        const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.total_amount || 0), 0)
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue,
        }))
        setOrders(orders)
      }

      if (productsRes.ok) {
        const products = await productsRes.json()
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
        }))
        setProducts(products)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }, [user, getAuthToken])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    const isUserAdmin = isAdminUser(user)
    
    if (!isUserAdmin) {
      router.push('/dashboard')
      return
    }
    
    setIsAdmin(true)
    fetchStats()
  }, [user, router, fetchStats])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = await getAuthToken()
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-admin-email': user?.email || '',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        showNotification('success', 'Order status updated successfully')
      } else {
        const error = await response.json()
        showNotification('error', error.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      showNotification('error', 'Failed to update order status')
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this order? This action cannot be undone.')) return

    try {
      const token = await getAuthToken()
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-admin-email': user?.email || '',
        },
      })

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        setStats(prev => ({ ...prev, totalOrders: Math.max(prev.totalOrders - 1, 0) }))
        showNotification('success', 'Order deleted successfully')
      } else {
        const error = await response.json()
        showNotification('error', error.error || 'Failed to delete order')
      }
    } catch (error) {
      console.error('Failed to delete order:', error)
      showNotification('error', 'Failed to delete order')
    }
  }

  const forceDeleteProduct = async (productId: number, skipConfirm = false) => {
    if (!skipConfirm && !confirm('Delete this product? This will remove it completely including from order history.')) return

    setDeletingProductId(productId)
    
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`/api/products/${productId}/force-delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'Content-Type': 'application/json',
          'x-admin-email': user?.email || '',
        },
      })

      const result = await response.json()
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }))
        showNotification('success', 'Product deleted successfully')
      } else {
        showNotification('error', result.error || 'Failed to delete product')
      }
    } catch (error) {
      showNotification('error', `Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeletingProductId(null)
    }
  }

  const deleteProduct = async (productId: number) => {
    // Simply force delete - easier and cleaner
    await forceDeleteProduct(productId, false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setViewMode('edit-product')
  }

  const handleProductSubmit = async (formData: Record<string, string>) => {
    setIsSubmitting(true)
    try {
      const sizesArray = formData.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s)
      const colorsArray = formData.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c)

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        image_url: formData.image_url,
        alt_text: formData.alt_text,
        sizes: sizesArray,
        colors: colorsArray,
        rating: parseInt(formData.rating),
        in_stock: formData.in_stock,
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category,
      }

      const isUpdate = !!editingProduct
      const url = isUpdate ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = isUpdate ? 'PUT' : 'POST'

      // Get the Supabase session token
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'x-admin-email': user?.email || '',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const savedProduct = await response.json()
        
        if (isUpdate) {
          setProducts(products.map(p => p.id === editingProduct.id ? savedProduct : p))
          showNotification('success', 'Product updated successfully!')
        } else {
          setProducts([savedProduct, ...products])
          setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }))
          showNotification('success', 'Product added successfully!')
        }
        
        setViewMode('products')
        setEditingProduct(null)
      } else {
        const error = await response.json()
        showNotification('error', error.error || `Failed to ${isUpdate ? 'update' : 'add'} product`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showNotification('error', `Failed to ${editingProduct ? 'update' : 'add'} product`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true
    return order.status === statusFilter
  })

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center bg-slate-900/90 p-8 rounded-2xl border border-white/10 shadow-xl">
          <ShieldAlert className="w-20 h-20 mx-auto mb-4 text-white" />
          <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/80">You don't have permission to access this page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
            notification.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-foreground' 
              : 'bg-red-500/10 border-red-500/30 text-foreground'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p className="font-semibold text-foreground">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-2 text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-foreground/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                aria-label="Home"
              >
                <Home className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-foreground/80 font-normal">Manage your store</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all ${
                  viewMode === 'dashboard' 
                    ? 'bg-foreground text-background' 
                    : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('products')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all ${
                  viewMode === 'products' || viewMode === 'add-product' || viewMode === 'edit-product'
                    ? 'bg-foreground text-background' 
                    : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setViewMode('orders')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all ${
                  viewMode === 'orders' 
                    ? 'bg-foreground text-background' 
                    : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                Orders
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <div className="space-y-8 md:space-y-12 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-card border border-foreground/10 p-6 hover:border-foreground/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-foreground/70 group-hover:text-foreground transition-colors" />
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/70">Orders</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground">{stats.totalOrders}</p>
                <p className="text-xs text-foreground/80 mt-2 font-normal">Total orders</p>
              </div>

              <div className="bg-card border border-foreground/10 p-6 hover:border-foreground/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-foreground/70 group-hover:text-foreground transition-colors" />
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/70">Revenue</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground">₦{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-foreground/80 mt-2 font-normal">Total earnings</p>
              </div>

              <div className="bg-card border border-foreground/10 p-6 hover:border-foreground/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 md:w-10 md:h-10 text-foreground/70 group-hover:text-foreground transition-colors" />
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/70">Products</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground">{stats.totalProducts}</p>
                <p className="text-xs text-foreground/80 mt-2 font-normal">In catalog</p>
              </div>

              <div className="bg-card border border-foreground/10 p-6 hover:border-foreground/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-foreground/70 group-hover:text-foreground transition-colors" />
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/70">Users</span>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground">{stats.totalUsers}</p>
                <p className="text-xs text-foreground/80 mt-2 font-normal">Registered</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-foreground/10 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-black uppercase text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setViewMode('add-product')}
                  className="flex items-center gap-3 p-4 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm"
                >
                  <Plus className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-wider">Add Product</p>
                    <p className="text-xs opacity-80">Create new listing</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setViewMode('products')}
                  className="flex items-center gap-3 p-4 border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 transition-all"
                >
                  <Package className="w-6 h-6 text-foreground" />
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-wider text-foreground">View Products</p>
                    <p className="text-xs text-foreground/80">Manage inventory</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setViewMode('orders')}
                  className="flex items-center gap-3 p-4 border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 transition-all"
                >
                  <ShoppingCart className="w-6 h-6 text-foreground" />
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-wider text-foreground">View Orders</p>
                    <p className="text-xs text-foreground/80">Track orders</p>
                  </div>
                </button>
              </div>
              
              {/* Admin Tools */}
              <div className="mt-6 pt-6 border-t border-foreground/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 mb-3">Admin Tools</h3>
                <button
                  onClick={async () => {
                    if (!confirm('Remove duplicate products? This will keep the first instance of each product and delete the rest.')) return
                    
                    try {
                      const supabase = createClient()
                      const { data: { session } } = await supabase.auth.getSession()
                      
                      const response = await fetch('/api/admin/remove-duplicates', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${session?.access_token || ''}`,
                          'x-admin-email': user?.email || '',
                        },
                      })
                      
                      const data = await response.json()
                      
                      if (response.ok) {
                        showNotification('success', data.message)
                        fetchStats() // Refresh products list
                      } else {
                        showNotification('error', data.error || 'Failed to remove duplicates')
                      }
                    } catch (error) {
                      console.error('Error removing duplicates:', error)
                      showNotification('error', 'Failed to remove duplicates')
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all font-semibold text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Duplicate Products
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-card border border-foreground/10 overflow-hidden">
                <div className="p-6 border-b border-foreground/10">
                  <h3 className="text-xl font-bold text-foreground">Recent Orders</h3>
                </div>
                <div className="p-6">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-foreground/5 rounded-lg mb-2 hover:bg-foreground/10 transition-colors">
                      <div>
                        <p className="text-foreground font-semibold">{order.order_number || `Order #${order.id}`}</p>
                        <p className="text-foreground/70 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-foreground font-bold">₦{order.total_amount?.toLocaleString()}</span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-foreground/70 text-center py-8">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-card border border-foreground/10 overflow-hidden">
                <div className="p-6 border-b border-foreground/10">
                  <h3 className="text-xl font-bold text-foreground">Recent Products</h3>
                </div>
                <div className="p-6">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-foreground/5 rounded-lg mb-2 hover:bg-foreground/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-foreground/10 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-foreground/70" />
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">{product.name}</p>
                          <p className="text-foreground/70 text-sm">₦{product.price?.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.inStock ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-foreground/70 text-center py-8">No products yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products View */}
        {viewMode === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-card border border-foreground/10 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-foreground/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Products Management</h2>
                    <p className="text-foreground/80">Create, read, update, and delete products</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-background border border-foreground/30 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/50 w-64"
                      />
                    </div>
                    <button
                      onClick={() => setViewMode('add-product')}
                      className="px-5 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all font-semibold flex items-center gap-2 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="p-16 text-center">
                  <Package className="w-20 h-20 mx-auto mb-4 text-foreground/30" />
                  <p className="text-foreground/70 text-lg mb-4">
                    {searchQuery ? 'No products found matching your search' : 'No products yet'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setViewMode('add-product')}
                      className="px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all font-semibold"
                    >
                      Add Your First Product
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-card rounded-xl overflow-hidden border border-foreground/10 hover:border-foreground/20 transition-all group">
                        {/* Product Image */}
                        <div className="relative h-48 bg-foreground/5 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.alt}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.webp'
                            }}
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              product.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="text-foreground font-bold text-lg mb-1 truncate">{product.name}</h3>
                          <p className="text-foreground/70 text-sm mb-3 line-clamp-2">{product.description}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-foreground">₦{product.price?.toLocaleString()}</span>
                            <span className="text-foreground/70 text-sm">Stock: {product.stockQuantity || 0}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              disabled={deletingProductId === product.id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold"
                              title="Delete product"
                            >
                              {deletingProductId === product.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Product View */}
        {(viewMode === 'add-product' || viewMode === 'edit-product') && (
          <div className="animate-fadeIn">
            <div className="mb-4">
              <button
                onClick={() => {
                  setViewMode('products')
                  setEditingProduct(null)
                }}
                className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Products</span>
              </button>
            </div>
            
            <AdminProductForm
              product={editingProduct}
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setViewMode('products')
                setEditingProduct(null)
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Orders View */}
        {viewMode === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-card border border-foreground/10 overflow-hidden">
              <div className="p-6 border-b border-foreground/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Orders Management</h2>
                    <p className="text-foreground/80">Track and manage customer orders</p>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-background border border-foreground/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/50"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-16 text-center">
                  <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-foreground/30" />
                  <p className="text-foreground/70 text-lg">
                    {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-foreground/5">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground uppercase tracking-wider">Order ID</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground uppercase tracking-wider">Customer</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground uppercase tracking-wider">Amount</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground uppercase tracking-wider">Date</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-foreground/5 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-semibold text-foreground">{order.order_number || `#${order.id}`}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-foreground">{order.shipping_address?.fullName || 'N/A'}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-foreground font-semibold">₦{order.total_amount?.toLocaleString()}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-foreground/80">{new Date(order.created_at).toLocaleDateString()}</p>
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="px-3 py-2 bg-background border border-foreground/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/50 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
