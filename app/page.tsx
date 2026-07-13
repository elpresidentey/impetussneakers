'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, Store } from 'lucide-react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { QuickViewModal } from '@/components/quick-view-modal'
import { SearchModal } from '@/components/search-modal'
import { CartModal } from '@/components/cart-modal'
import { CheckoutModal } from '@/components/checkout-modal'
import { SkeletonCard } from '@/components/skeleton-card'
import { AuthModal } from '@/components/auth-modal'
import { ScrollReveal } from '@/components/scroll-reveal'
import { PageTransition } from '@/components/page-transition'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { isTestProductName } from '@/lib/catalog'

// Add structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Impetus',
  description: 'Premium sneaker experience with curated collections and exclusive drops',
  url: 'https://theimpetus.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://theimpetus.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  alt: string
  sizes: string[]
  colors: string[]
  rating: number
  inStock: boolean
  stockQuantity?: number
  category?: string
}

function dedupeProducts(products: Product[]): Product[] {
  const productNames = new Set<string>()

  return products.filter((product) => {
    const normalizedName = product.name.trim().toLocaleLowerCase()

    if (productNames.has(normalizedName)) {
      return false
    }

    productNames.add(normalizedName)
    return true
  })
}

export default function Page() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('default')
  const [filterStock, setFilterStock] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const { cartItems, cartTotal } = useCart()
  const { user } = useAuth()

  const shippingCost = 2000
  const taxAmount = Math.round(cartTotal * 0.05)
  const uniqueProducts = dedupeProducts(products).filter(
    (product) => !isTestProductName(product.name)
  )
  const collectionProducts = ['new-arrivals', 'hottest', 'featured', 'sale'].reduce<Record<string, Product[]>>(
    (collections, category) => {
      const claimedIds = new Set(Object.values(collections).flat().map((product) => product.id))
      const categoryMatches = uniqueProducts.filter(
        (product) => product.category === category && !claimedIds.has(product.id)
      )

      collections[category] = (categoryMatches.length > 0
        ? categoryMatches
        : uniqueProducts.filter((product) => !claimedIds.has(product.id))
      ).slice(0, 4)

      return collections
    },
    {}
  )

  const handleCheckout = async (formData: { email: string; name: string; phone: string; address: string }) => {
    if (cartItems.length === 0) {
      throw new Error('Your cart is empty. Add items before checking out.')
    }

    const orderPayload = {
      user_id: user?.id || null,
      items: cartItems.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shipping_address: formData.address,
      billing_address: formData.address,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      customer_email: formData.email,
    }

    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })

    const orderData = await orderResponse.json()
    if (!orderResponse.ok) {
      throw new Error(orderData.error || 'Failed to create order')
    }

    const totalAmount = cartTotal + shippingCost + taxAmount
    const paymentResponse = await fetch('/api/payment/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        email: formData.email,
        order_number: orderData.order_number,
        metadata: {
          order_id: orderData.order_id,
          customer_phone: formData.phone,
          shipping_address: formData.address,
        },
      }),
    })

    const paymentData = await paymentResponse.json()
    if (!paymentResponse.ok) {
      throw new Error(paymentData.error || 'Failed to initialize payment')
    }

    if (!paymentData.authorization_url) {
      throw new Error('No payment URL returned from Paystack')
    }

    setIsCheckoutOpen(false)
    window.location.href = paymentData.authorization_url
  }

  // Filter and sort products
  const filteredProducts = uniqueProducts.filter((product) => {
    if (filterStock === 'in-stock') return product.inStock
    if (filterStock === 'out-of-stock') return !product.inStock
    if (filterCategory !== 'all' && product.category !== filterCategory) return false
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'name-reverse':
        return b.name.localeCompare(a.name)
      case 'newest':
        return b.id - a.id
      default:
        return 0
    }
  })
  
  const heroImages = [
    {
      src: '/hero-sneaker-ledge.jpg',
      alt: 'Nike sneakers styled on a concrete ledge',
      position: 'object-[42%_50%]',
    },
    {
      src: '/hero-sneaker-studio.jpg',
      alt: 'Black designer sneakers in a clean studio setting',
      position: 'object-[38%_50%]',
    },
    {
      src: '/hero-sneaker-monochrome.jpg',
      alt: 'Monochrome streetwear portrait with classic sneakers',
      position: 'object-[50%_42%]',
    },
  ]

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          // If API returns empty array, use fallback products
          if (data.length === 0) {
            setProducts([
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
                name: 'Air Jordan 11 Retro Space Jam',
                description: 'Legendary silhouette with premium leather upper',
                price: 320000,
                alt: 'Air Jordan 11 Retro Space Jam',
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['#000000', '#FFFFFF', '#0000FF'],
                rating: 5,
                inStock: true,
                category: 'new-arrivals',
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
                name: 'Adidas Samba OG',
                description: 'Classic soccer-inspired design with premium suede',
                price: 120000,
                alt: 'Adidas Samba OG',
                sizes: ['6', '7', '8', '9', '10', '11'],
                colors: ['#000000', '#FFFFFF'],
                rating: 4,
                inStock: true,
                category: 'hottest',
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
                name: 'Nike Air Force 1 \'07',
                description: 'Iconic basketball classic with clean lines',
                price: 110000,
                alt: 'Nike Air Force 1 07',
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['#00FF00', '#000000'],
                rating: 4,
                inStock: true,
                category: 'featured',
              },
              {
                id: 4,
                image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
                name: 'Air Jordan 11 Retro Low',
                description: 'Premium low-top with patent leather accents',
                price: 280000,
                alt: 'Air Jordan 11 Retro Low',
                sizes: ['8', '9', '10', '11', '12'],
                colors: ['#000000', '#FF0000'],
                category: 'sale',
                rating: 5,
                inStock: true,
              },
              {
                id: 5,
                image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
                name: 'Adidas Adizero Adios Pro',
                description: 'Elite racing shoe with carbon fiber plate',
                price: 200000,
                alt: 'Adidas Adizero Adios Pro',
                sizes: ['7', '8', '9', '10', '11'],
                colors: ['#FFFFFF', '#000000'],
                rating: 4,
                inStock: true,
                category: 'featured',
              },
              {
                id: 6,
                image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80',
                name: 'Air Jordan 3 Retro',
                description: 'Elephant print detailing with premium leather',
                price: 240000,
                alt: 'Air Jordan 3 Retro',
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['#00FF00', '#FFFF00', '#000000'],
                rating: 5,
                inStock: false,
                category: 'hottest',
              },
              {
                id: 7,
                image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
                name: 'New Balance 574 Legacy',
                description: 'Heritage running shoe with suede and mesh',
                price: 95000,
                alt: 'New Balance 574 Legacy',
                sizes: ['6', '7', '8', '9', '10', '11', '12'],
                colors: ['#808080', '#000000', '#FFFFFF'],
                rating: 4,
                inStock: true,
                category: 'new-arrivals',
              },
              {
                id: 8,
                image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
                name: 'Nike Dunk Low Retro',
                description: 'Vintage basketball aesthetic with premium materials',
                price: 135000,
                alt: 'Nike Dunk Low Retro',
                sizes: ['7', '8', '9', '10', '11'],
                colors: ['#FFFFFF', '#FF69B4', '#90EE90'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 9,
                image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80',
                name: 'Air Jordan 1 Retro High',
                description: 'Original high-top with premium leather construction',
                price: 180000,
                alt: 'Air Jordan 1 Retro High',
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['#000000', '#FFFFFF', '#FF0000'],
                rating: 4,
                inStock: true,
                category: 'hottest',
              },
              {
                id: 10,
                image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80',
                name: 'Adidas Adilette Comfort',
                description: 'Premium slides with cloudfoam comfort',
                price: 45000,
                alt: 'Adidas Adilette Comfort',
                sizes: ['6', '7', '8', '9', '10', '11', '12'],
                colors: ['#000000', '#FFFFFF', '#FF0000'],
                rating: 3,
                inStock: true,
                category: 'sale',
              },
              {
                id: 11,
                image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
                name: 'Adidas Adilette Premium',
                description: 'Luxury slides with premium leather upper',
                price: 65000,
                alt: 'Adidas Adilette Premium',
                sizes: ['7', '8', '9', '10', '11'],
                colors: ['#000000', '#FFFFFF', '#0000FF'],
                rating: 4,
                inStock: true,
                category: 'featured',
              },
              {
                id: 12,
                image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80',
                name: 'Nike Air Max 90 Essential',
                description: 'Visible Air unit with premium leather upper',
                price: 145000,
                alt: 'Nike Air Max 90 Essential',
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: ['#FFFFFF', '#000000', '#FF0000'],
                rating: 5,
                inStock: true,
                category: 'new-arrivals',
              },
              {
                id: 13,
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
                name: 'Essential Cotton Hoodie',
                description: 'Premium cotton blend with relaxed fit',
                price: 45000,
                alt: 'Essential Cotton Hoodie',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['#000000', '#FFFFFF', '#808080', '#000080'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 14,
                image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
                name: 'Premium Cotton T-Shirt',
                description: 'Heavyweight cotton with classic fit',
                price: 15000,
                alt: 'Premium Cotton T-Shirt',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['#FFFFFF', '#000000', '#FF0000', '#0000FF'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 15,
                image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
                name: 'Performance Joggers',
                description: 'Moisture-wicking fabric with tapered fit',
                price: 35000,
                alt: 'Performance Joggers',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['#000000', '#808080', '#000080'],
                rating: 4,
                inStock: true,
                category: 'featured',
              },
              {
                id: 16,
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
                name: 'Classic Leather Crossbody',
                description: 'Genuine leather with adjustable strap',
                price: 75000,
                alt: 'Classic Leather Crossbody',
                sizes: ['One Size'],
                colors: ['#000000', '#8B4513', '#FFFFFF'],
                rating: 5,
                inStock: true,
                category: 'featured',
              },
              {
                id: 17,
                image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
                name: 'Minimalist Analog Watch',
                description: 'Japanese movement with stainless steel case',
                price: 125000,
                alt: 'Minimalist Analog Watch',
                sizes: ['One Size'],
                colors: ['#C0C0C0', '#FFD700', '#000000'],
                rating: 5,
                inStock: true,
                category: 'hottest',
              },
              {
                id: 18,
                image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
                name: 'Premium Polarized Sunglasses',
                description: 'UV400 protection with polarized lenses',
                price: 25000,
                alt: 'Premium Polarized Sunglasses',
                sizes: ['One Size'],
                colors: ['#000000', '#8B4513', '#FFFFFF'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 19,
                image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
                name: 'Classic Baseball Cap',
                description: 'Structured fit with embroidered logo',
                price: 12000,
                alt: 'Classic Baseball Cap',
                sizes: ['One Size'],
                colors: ['#000000', '#FFFFFF', '#0000FF', '#FF0000'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 20,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
                name: 'Durable Canvas Backpack',
                description: 'Reinforced bottom with laptop compartment',
                price: 55000,
                alt: 'Durable Canvas Backpack',
                sizes: ['One Size'],
                colors: ['#000000', '#8B4513', '#000080', '#808080'],
                rating: 4,
                inStock: true,
                category: 'featured',
              },
              {
                id: 21,
                image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
                name: 'Athletic Performance Socks',
                description: 'Moisture-wicking blend with arch support',
                price: 8000,
                alt: 'Athletic Performance Socks',
                sizes: ['S', 'M', 'L'],
                colors: ['#000000', '#FFFFFF', '#808080'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 22,
                image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
                name: 'Genuine Leather Belt',
                description: 'Full-grain leather with brushed buckle',
                price: 18000,
                alt: 'Genuine Leather Belt',
                sizes: ['S', 'M', 'L'],
                colors: ['#000000', '#8B4513'],
                rating: 4,
                inStock: true,
                category: 'sale',
              },
              {
                id: 23,
                image: 'https://images.unsplash.com/photo-1601784551446-20df920ccfad?auto=format&fit=crop&w=800&q=80',
                name: 'Premium Phone Wallet Case',
                description: 'Leather exterior with card slots',
                price: 22000,
                alt: 'Premium Phone Wallet Case',
                sizes: ['Universal'],
                colors: ['#000000', '#8B4513', '#FFFFFF'],
                rating: 4,
                inStock: true,
                category: 'featured',
              },
              {
                id: 24,
                image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
                name: 'Classic Crew Neck Sweater',
                description: 'Merino wool blend with ribbed trim',
                price: 42000,
                alt: 'Classic Crew Neck Sweater',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['#000000', '#808080', '#FFFFFF', '#000080'],
                rating: 4,
                inStock: true,
                category: 'new-arrivals',
              },
            ])
          } else {
            setProducts(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        // Fallback to hardcoded products if API fails
        setProducts([
          {
            id: 1,
            image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
            name: 'Air Jordan 11 Retro Space Jam',
            description: 'Legendary silhouette with premium leather upper',
            price: 320000,
            alt: 'Air Jordan 11 Retro Space Jam',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['#000000', '#FFFFFF', '#0000FF'],
            rating: 5,
            inStock: true,
          },
          {
            id: 2,
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
            name: 'Adidas Samba OG',
            description: 'Classic soccer-inspired design with premium suede',
            price: 120000,
            alt: 'Adidas Samba OG',
            sizes: ['6', '7', '8', '9', '10', '11'],
            colors: ['#000000', '#FFFFFF'],
            rating: 4,
            inStock: true,
          },
          {
            id: 3,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            name: 'Nike Air Force 1 \'07',
            description: 'Iconic basketball classic with clean lines',
            price: 110000,
            alt: 'Nike Air Force 1 07',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['#00FF00', '#000000'],
            rating: 4,
            inStock: true,
          },
          {
            id: 4,
            image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
            name: 'Air Jordan 11 Retro Low',
            description: 'Premium low-top with patent leather accents',
            price: 280000,
            alt: 'Air Jordan 11 Retro Low',
            sizes: ['8', '9', '10', '11', '12'],
            colors: ['#000000', '#FF0000'],
            rating: 5,
            inStock: true,
          },
          {
            id: 5,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
            name: 'Adidas Adizero Adios Pro',
            description: 'Elite racing shoe with carbon fiber plate',
            price: 200000,
            alt: 'Adidas Adizero Adios Pro',
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['#FFFFFF', '#000000'],
            rating: 4,
            inStock: true,
          },
          {
            id: 6,
            image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=80',
            name: 'Air Jordan 3 Retro',
            description: 'Elephant print detailing with premium leather',
            price: 240000,
            alt: 'Air Jordan 3 Retro',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['#00FF00', '#FFFF00', '#000000'],
            rating: 5,
            inStock: false,
          },
          {
            id: 7,
            image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
            name: 'New Balance 574 Legacy',
            description: 'Heritage running shoe with suede and mesh',
            price: 95000,
            alt: 'New Balance 574 Legacy',
            sizes: ['6', '7', '8', '9', '10', '11', '12'],
            colors: ['#808080', '#000000', '#FFFFFF'],
            rating: 4,
            inStock: true,
          },
          {
            id: 8,
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
            name: 'Nike Dunk Low Retro',
            description: 'Vintage basketball aesthetic with premium materials',
            price: 135000,
            alt: 'Nike Dunk Low Retro',
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['#FFFFFF', '#FF69B4', '#90EE90'],
            rating: 4,
            inStock: true,
          },
          {
            id: 9,
            image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80',
            name: 'Air Jordan 1 Retro High',
            description: 'Original high-top with premium leather construction',
            price: 180000,
            alt: 'Air Jordan 1 Retro High',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['#000000', '#FFFFFF', '#FF0000'],
            rating: 4,
            inStock: true,
          },
          {
            id: 10,
            image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80',
            name: 'Adidas Adilette Comfort',
            description: 'Premium slides with cloudfoam comfort',
            price: 45000,
            alt: 'Adidas Adilette Comfort',
            sizes: ['6', '7', '8', '9', '10', '11', '12'],
            colors: ['#000000', '#FFFFFF', '#FF0000'],
            rating: 3,
            inStock: true,
          },
          {
            id: 11,
            image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
            name: 'Adidas Adilette Premium',
            description: 'Luxury slides with premium leather upper',
            price: 65000,
            alt: 'Adidas Adilette Premium',
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['#000000', '#FFFFFF', '#0000FF'],
            rating: 4,
            inStock: true,
          },
          {
            id: 12,
            image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80',
            name: 'Nike Air Max 90 Essential',
            description: 'Visible Air unit with premium leather upper',
            price: 145000,
            alt: 'Nike Air Max 90 Essential',
            sizes: ['7', '8', '9', '10', '11', '12'],
            colors: ['#FFFFFF', '#000000', '#FF0000'],
            rating: 5,
            inStock: true,
          },
          {
            id: 13,
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
            name: 'Essential Cotton Hoodie',
            description: 'Premium cotton blend with relaxed fit',
            price: 45000,
            alt: 'Essential Cotton Hoodie',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['#000000', '#FFFFFF', '#808080', '#000080'],
            rating: 4,
            inStock: true,
          },
          {
            id: 14,
            image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
            name: 'Premium Cotton T-Shirt',
            description: 'Heavyweight cotton with classic fit',
            price: 15000,
            alt: 'Premium Cotton T-Shirt',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#FFFFFF', '#000000', '#FF0000', '#0000FF'],
            rating: 4,
            inStock: true,
          },
          {
            id: 15,
            image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
            name: 'Performance Joggers',
            description: 'Moisture-wicking fabric with tapered fit',
            price: 35000,
            alt: 'Performance Joggers',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['#000000', '#808080', '#000080'],
            rating: 4,
            inStock: true,
          },
          {
            id: 16,
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
            name: 'Classic Leather Crossbody',
            description: 'Genuine leather with adjustable strap',
            price: 75000,
            alt: 'Classic Leather Crossbody',
            sizes: ['One Size'],
            colors: ['#000000', '#8B4513', '#FFFFFF'],
            rating: 5,
            inStock: true,
          },
          {
            id: 17,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
            name: 'Minimalist Analog Watch',
            description: 'Japanese movement with stainless steel case',
            price: 125000,
            alt: 'Minimalist Analog Watch',
            sizes: ['One Size'],
            colors: ['#C0C0C0', '#FFD700', '#000000'],
            rating: 5,
            inStock: true,
          },
          {
            id: 18,
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
            name: 'Premium Polarized Sunglasses',
            description: 'UV400 protection with polarized lenses',
            price: 25000,
            alt: 'Premium Polarized Sunglasses',
            sizes: ['One Size'],
            colors: ['#000000', '#8B4513', '#FFFFFF'],
            rating: 4,
            inStock: true,
          },
          {
            id: 19,
            image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
            name: 'Classic Baseball Cap',
            description: 'Structured fit with embroidered logo',
            price: 12000,
            alt: 'Classic Baseball Cap',
            sizes: ['One Size'],
            colors: ['#000000', '#FFFFFF', '#0000FF', '#FF0000'],
            rating: 4,
            inStock: true,
          },
          {
            id: 20,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
            name: 'Durable Canvas Backpack',
            description: 'Reinforced bottom with laptop compartment',
            price: 55000,
            alt: 'Durable Canvas Backpack',
            sizes: ['One Size'],
            colors: ['#000000', '#8B4513', '#000080', '#808080'],
            rating: 4,
            inStock: true,
          },
          {
            id: 21,
            image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
            name: 'Athletic Performance Socks',
            description: 'Moisture-wicking blend with arch support',
            price: 8000,
            alt: 'Athletic Performance Socks',
            sizes: ['S', 'M', 'L'],
            colors: ['#000000', '#FFFFFF', '#808080'],
            rating: 4,
            inStock: true,
          },
          {
            id: 22,
            image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
            name: 'Genuine Leather Belt',
            description: 'Full-grain leather with brushed buckle',
            price: 18000,
            alt: 'Genuine Leather Belt',
            sizes: ['S', 'M', 'L'],
            colors: ['#000000', '#8B4513'],
            rating: 4,
            inStock: true,
          },
          {
            id: 23,
            image: 'https://images.unsplash.com/photo-1601784551446-20df920ccfad?auto=format&fit=crop&w=800&q=80',
            name: 'Premium Phone Wallet Case',
            description: 'Leather exterior with card slots',
            price: 22000,
            alt: 'Premium Phone Wallet Case',
            sizes: ['Universal'],
            colors: ['#000000', '#8B4513', '#FFFFFF'],
            rating: 4,
            inStock: true,
          },
          {
            id: 24,
            image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
            name: 'Classic Crew Neck Sweater',
            description: 'Merino wool blend with ribbed trim',
            price: 42000,
            alt: 'Classic Crew Neck Sweater',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#000000', '#808080', '#FFFFFF', '#000080'],
            rating: 4,
            inStock: true,
          },
        ])
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()

    // Keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      clearInterval(interval)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email)) {
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          setIsSubscribed(true)
          setEmail('')
          alert('Successfully subscribed to newsletter!')
        } else {
          const error = await response.json()
          alert(error.error || 'Failed to subscribe. Please try again.')
        }
      } catch (error) {
        alert('Failed to subscribe. Please try again.')
      }
    } else {
      alert('Please enter a valid email address')
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header onSearchOpen={() => setIsSearchOpen(true)} onCartOpen={() => setIsCartOpen(true)} onAuthOpen={() => setIsAuthOpen(true)} />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] overflow-hidden bg-black text-white md:min-h-[95vh]">
        {heroImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            className={`object-cover ${image.position} transition-all duration-[1400ms] ease-out ${
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60" />

        <div className="relative z-10 flex min-h-[92vh] items-center px-4 pb-8 pt-24 text-center md:min-h-[95vh] md:px-8 md:pt-28">
          <div className="w-full">
            <div className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="mx-auto max-w-4xl">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
                  Where Heat Lives
                </p>
                <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  Stay Laced
                </h1>
                <p className="mx-auto mt-7 max-w-xl text-center text-base leading-relaxed text-white/85 md:text-lg">
                  Real heat, real prices. From grails to daily rotation - we got your feet covered.
                </p>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="group inline-flex min-h-12 items-center justify-center gap-2 bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-white/90 active:scale-[0.98]">
                    <span>Cop Your Heat</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex min-h-12 items-center justify-center border border-white/60 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-[0.98]">
                    Browse Drops
                  </button>
                </div>
              </div>

              <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 border-t border-white/25 pt-5">
                <div className="grid grid-cols-3 gap-4 text-center text-xs uppercase tracking-[0.18em] text-white/70">
                  <span>Fresh drops daily</span>
                  <span>100% authentic</span>
                  <span>Fast shipping</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show hero image ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 transition-all duration-300 ${
                        index === currentImageIndex ? 'w-10 bg-white' : 'w-4 bg-white/45 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="px-4 md:px-8 py-16 md:py-24 bg-[#f4f1eb]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">Collections</p>
              <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.9] tracking-normal text-foreground md:text-6xl lg:text-7xl">
                Built for the culture.
              </h2>
            </div>
          </div>

          <ScrollReveal direction="up" delay={100}>
            <div className="grid gap-4 md:grid-cols-12 md:auto-rows-[230px]">
              <button className="group relative min-h-[420px] overflow-hidden text-left md:col-span-7 md:row-span-2" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
                <Image
                  src="/hero-sneaker-ledge.jpg"
                  alt="Statement sneakers and streetwear"
                  fill
                  className="object-cover object-[43%_52%] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">01 / Statement</p>
                  <h3 className="max-w-lg text-4xl font-black uppercase leading-none md:text-6xl">Heat for your feet.</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/85">
                    Explore edit
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>

              <button className="group relative min-h-[250px] overflow-hidden text-left md:col-span-5" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
                <Image
                  src="/hero-sneaker-studio.jpg"
                  alt="Studio sneakers"
                  fill
                  className="object-cover object-[36%_50%] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">02 / Studio</p>
                  <h3 className="text-3xl font-black uppercase leading-none md:text-4xl">Understated fire.</h3>
                </div>
              </button>

              <button className="group relative min-h-[250px] overflow-hidden bg-black p-6 text-left text-white md:col-span-5" onClick={() => setFilterCategory('new-arrivals')}>
                <div className="flex h-full flex-col justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">03 / Drop room</p>
                  <div>
                    <p className="text-6xl font-black leading-none md:text-7xl">{uniqueProducts.length || 24}</p>
                    <h3 className="mt-3 max-w-sm text-2xl font-black uppercase leading-none md:text-4xl">Heat restocking weekly.</h3>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/75">
                      See arrivals
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">Collection</p>
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-normal text-foreground md:text-6xl">
                New Arrivals
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {collectionProducts['new-arrivals'].map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Hottest Products Section */}
      <section id="hottest" className="px-4 md:px-8 py-16 md:py-24 bg-[#fbfaf7]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">Trending</p>
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-normal text-foreground md:text-6xl">
                Hottest Products
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {collectionProducts.hottest.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="px-4 md:px-8 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">Curated</p>
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-normal text-foreground md:text-6xl">
                Featured
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {collectionProducts.featured.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sale Section */}
      <section id="sale" className="px-4 md:px-8 py-16 md:py-24 bg-[#fbfaf7]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-600">Special Offer</p>
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-normal text-red-600 md:text-6xl">
                Sale
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {collectionProducts.sale.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vendor Partner Banner */}
      <section className="relative isolate overflow-hidden bg-black px-4 py-16 text-white md:px-8 md:py-24">
        <Image
          src="/hero-sneaker-monochrome.jpg"
          alt="Streetwear styling and classic sneakers"
          fill
          className="-z-20 object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal direction="up" delay={100}>
            <div className="grid items-end gap-12 md:grid-cols-[1.15fr_0.85fr]">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  <Store className="h-4 w-4" />
                  <span>Sell with Impetus</span>
                </div>
                <h2 className="text-5xl font-black uppercase leading-[0.86] md:text-7xl">
                  Put your best pairs in front of the right people.
                </h2>
                <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
                  Apply to sell verified sneakers and streetwear with a storefront built for discovery.
                </p>
                <div className="mb-8 mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-2xl font-bold mb-1">₦2.5M</div>
                    <div className="text-sm opacity-80">Avg monthly revenue</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-2xl font-bold mb-1">10K+</div>
                    <div className="text-sm opacity-80">Ready customers</div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <a 
                    href="/vendor" 
                    className="group inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/85"
                  >
                    Start selling
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-green-900">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Lowest Commission</h4>
                        <p className="text-sm opacity-80">Only 8% vs 15-20% on other platforms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-green-900">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Built-in Audience</h4>
                        <p className="text-sm opacity-80">Access to 10,000+ sneaker enthusiasts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-green-900">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Fast Payments</h4>
                        <p className="text-sm opacity-80">Guaranteed payments within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-yellow-900">🚀</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Limited Time: 5% Commission</h4>
                        <p className="text-sm opacity-80">First 50 vendors get reduced rate for 6 months</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-4 rounded-xl font-bold text-center shadow-xl">
                  <div className="text-lg">50/50</div>
                  <div className="text-xs">Spots Left</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Latest Drops - Product Grid */}
      <section id="shop" className="px-4 md:px-8 py-20 md:py-28 bg-[#fbfaf7]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/50">Shop</p>
                <h2 className="text-4xl font-black uppercase leading-[0.88] tracking-normal text-foreground md:text-6xl lg:text-7xl">
                  Fresh drops.
                </h2>
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/45">
                {filteredProducts.length} products
              </p>
              <div className="hidden">
                <h2>
                  Fresh Drops
              </h2>
              <p className="text-base md:text-lg text-foreground/60 font-normal max-w-2xl">
                Limited releases. Premium quality. First access to the pairs that define culture.
              </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Filter and Sort Bar */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 grid gap-4 border-y border-foreground/12 py-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="grid gap-4 sm:grid-cols-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-12 border border-foreground/15 bg-transparent px-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-foreground hover:border-foreground/30 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="new-arrivals">New Arrivals</option>
                  <option value="hottest">Hottest Products</option>
                  <option value="featured">Featured</option>
                  <option value="sale">Sale</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 border border-foreground/15 bg-transparent px-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-foreground hover:border-foreground/30 cursor-pointer"
                >
                  <option value="default">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="name-reverse">Name: Z-A</option>
                  <option value="newest">Newest</option>
                </select>
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="h-12 border border-foreground/15 bg-transparent px-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-foreground hover:border-foreground/30 cursor-pointer"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <button onClick={() => setIsSearchOpen(true)} className="h-12 border border-foreground bg-foreground px-8 text-sm font-semibold uppercase tracking-[0.12em] text-background transition-all duration-200 hover:bg-foreground/90 active:scale-[0.98]">
                Search catalog
              </button>
            </div>
          </ScrollReveal>

          {/* Product Grid */}
          <ScrollReveal direction="up" delay={100}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {isLoadingProducts
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                      <SkeletonCard />
                    </div>
                  ))
                : filteredProducts.map((product: Product, idx: number) => (
                    <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                      <ProductCard {...product} onQuickView={() => setQuickViewProduct(product)} />
                    </div>
                  ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Flagship Experience */}
      <section id="newsletter" className="px-4 md:px-8 py-16 md:py-20 bg-white border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Experience</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-4 text-balance">
                Beyond the Store
              </h2>
              <p className="text-base md:text-lg text-foreground/60 font-normal max-w-2xl">
                A digital flagship where every pixel serves the story. Where culture meets commerce.
              </p>
            </div>
          </ScrollReveal>

          {/* Gallery Image */}
          <ScrollReveal direction="up" delay={100}>
            <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-[16/9] border border-foreground/10 group cursor-pointer shadow-2xl shadow-foreground/5">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diego-jaramillo-W4swGaKFHVQ-unsplash-eweOcZZ12tk00zydKVwmN14tnD2Nae.jpg"
                alt="Showroom Experience"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-background mb-3 text-balance">
                  Crafted for Collectors
                </h3>
                <p className="text-background/90 font-normal max-w-xl text-sm md:text-base">
                  Every detail intentional. Every drop meaningful. This is sneaker retail elevated.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Proof Section with Marquee */}
      <section className="px-4 md:px-8 py-12 md:py-16 bg-gradient-to-b from-background via-foreground/[0.02] to-background border-t border-foreground/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">Trusted By</p>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Sneaker Enthusiasts Worldwide</h3>
          </div>
          
          {/* Marquee */}
          <div className="relative overflow-hidden mb-12">
            <div className="flex animate-marquee">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-16 md:gap-24 items-center px-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">50K+</p>
                    <p className="text-sm text-foreground/60">Happy Customers</p>
                  </div>
                  <div className="w-px h-12 bg-foreground/20" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">200+</p>
                    <p className="text-sm text-foreground/60">Exclusive Drops</p>
                  </div>
                  <div className="w-px h-12 bg-foreground/20" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">4.9</p>
                    <p className="text-sm text-foreground/60">Average Rating</p>
                  </div>
                  <div className="w-px h-12 bg-foreground/20" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">24/7</p>
                    <p className="text-sm text-foreground/60">Support Available</p>
                  </div>
                  <div className="w-px h-12 bg-foreground/20" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">100%</p>
                    <p className="text-sm text-foreground/60">Authentic</p>
                  </div>
                  <div className="w-px h-12 bg-foreground/20" />
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">50+</p>
                    <p className="text-sm text-foreground/60">Countries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-background via-foreground/5 to-background border-y border-foreground/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 via-transparent to-foreground/5" />
        <ScrollReveal direction="up" delay={100}>
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground text-balance">
                Find Your Grail
              </h2>
              <p className="text-base md:text-lg text-foreground/60 font-normal max-w-2xl mx-auto">
                Join the movement. Limited drops. Premium quality. Your next pair is waiting.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="group w-full sm:w-auto px-10 py-4 bg-foreground text-background rounded-none font-semibold hover:bg-foreground/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-foreground/25 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">Start Shopping</span>
              </button>
              <button onClick={() => alert('Our Story section coming soon!')} className="w-full sm:w-auto px-10 py-4 border-2 border-foreground/20 rounded-none font-semibold hover:border-foreground/50 hover:bg-foreground/5 transition-all duration-300 hover:scale-105">
                Our Story
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Why Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-4 text-balance">
                The Impetus Difference
              </h2>
              <p className="text-base md:text-lg text-foreground/60 font-normal max-w-2xl mx-auto">
                Every detail crafted for the discerning collector. Experience sneaker retail elevated.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-foreground/10 hover:border-foreground/30 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:bg-foreground/10 transition-colors duration-300 group-hover:scale-110">
                  <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Authentic Guaranteed</h3>
                <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
                  Every pair verified through our rigorous authentication process. Your peace of mind, our promise.
                </p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-foreground/10 hover:border-foreground/30 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:bg-foreground/10 transition-colors duration-300 group-hover:scale-110">
                  <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Exclusive Drops</h3>
                <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
                  First access to limited releases. Be among the few who own the pairs that define culture.
                </p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-foreground/10 hover:border-foreground/30 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:bg-foreground/10 transition-colors duration-300 group-hover:scale-110">
                  <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Premium Packaging</h3>
                <p className="text-sm md:text-base text-foreground/60 leading-relaxed">
                  Unboxing experience designed to match the quality within. Every detail intentional.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-gradient-to-b from-background via-foreground/[0.02] to-background border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-4 text-balance">
                What Collectors Say
              </h2>
              <p className="text-base md:text-lg text-foreground/60 font-normal max-w-2xl mx-auto">
                Join thousands of satisfied collectors who trust The Impetus for their sneaker journey.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="group p-8 rounded-3xl bg-card border border-foreground/10 hover:border-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6">
                  "The authentication process gave me complete confidence. My AJ11s arrived in perfect condition. This is how sneaker retail should be."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-foreground font-semibold">JM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">James M.</p>
                    <p className="text-xs text-foreground/60">Verified Collector</p>
                  </div>
                </div>
              </div>

              <div className="group p-8 rounded-3xl bg-card border border-foreground/10 hover:border-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6">
                  "First access to drops is incredible. I've secured pairs I never thought I'd get. The unboxing experience alone is worth it."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-foreground font-semibold">SK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Sarah K.</p>
                    <p className="text-xs text-foreground/60">Premium Member</p>
                  </div>
                </div>
              </div>

              <div className="group p-8 rounded-3xl bg-card border border-foreground/10 hover:border-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6">
                  "Customer service is exceptional. They helped me find my grail pair after months of searching. Truly dedicated to collectors."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-foreground font-semibold">DL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">David L.</p>
                    <p className="text-xs text-foreground/60">Loyal Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-white border-t border-foreground/10">
        <ScrollReveal direction="up" delay={100}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Stay Connected</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-4 text-balance">
              Join the Movement
            </h2>
            <p className="text-base md:text-lg text-foreground/60 font-normal max-w-2xl mx-auto mb-8 md:mb-12">
              Be the first to know about exclusive drops, early access, and collector-only events. No spam, just culture.
            </p>
            {isSubscribed ? (
              <div className="max-w-xl mx-auto p-6 rounded-none bg-foreground/5 border border-foreground/20">
                <p className="text-foreground font-semibold text-center">Thanks for subscribing! 🎉</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 rounded-none border-2 border-foreground/20 bg-card text-foreground placeholder-foreground/40 focus:border-foreground focus:outline-none transition-colors duration-300 hover:border-foreground/40"
                />
                <button type="submit" className="group px-8 py-4 bg-foreground text-background rounded-none font-semibold hover:bg-foreground/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-foreground/25 whitespace-nowrap relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10">Subscribe</span>
                </button>
              </form>
            )}
            <p className="text-xs text-foreground/40 mt-4">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer Link Destinations */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-[#f4f1eb] border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55">Information</p>
              <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-normal text-foreground md:text-6xl">
                Everything in one place.
              </h2>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden bg-foreground/10 md:grid-cols-3">
            <article id="about" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">About</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Our Story</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                The Impetus is built for sharp sneaker edits, honest product presentation, and fast access to pieces that work in real wardrobes.
              </p>
            </article>

            <article id="contact" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Contact</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Talk to us</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                For order help, sizing questions, or sourcing requests, reach the team at support@theimpetus.com.
              </p>
            </article>

            <article id="press" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Press</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Editorial desk</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Brand assets, launch notes, and collaboration enquiries are handled through press@theimpetus.com.
              </p>
            </article>

            <article id="shipping" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Support</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Shipping Info</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Orders are prepared after confirmation and dispatched with tracking once payment and stock checks are complete.
              </p>
            </article>

            <article id="returns" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Support</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Returns</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Return requests are reviewed against item condition, delivery status, and product eligibility.
              </p>
            </article>

            <article id="faq" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Support</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">FAQ</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Common questions cover sizing, authenticity, dispatch timing, payment confirmation, and order updates.
              </p>
            </article>

            <article id="instagram" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Connect</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Instagram</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Follow release styling, launch previews, and editorial drops from the Impetus team.
              </p>
            </article>

            <article id="twitter" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Connect</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Twitter</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Drop reminders, availability notes, and quick support updates live here.
              </p>
            </article>

            <article id="policies" className="bg-[#f4f1eb] p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/45">Policies</p>
              <h3 className="text-2xl font-black uppercase leading-none text-foreground">Privacy & Terms</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/62">
                Customer data, checkout activity, and order communication are handled only for store operations and support.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-12 md:py-16 border-t border-foreground/10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base mb-4 md:mb-6">Shop</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/#shop" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="/#collections" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="/orders" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base mb-4 md:mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/about" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/#newsletter" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base mb-4 md:mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/legal/shipping" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/legal/returns" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="mailto:support@theimpetus.com" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base mb-4 md:mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/legal/terms" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/legal/privacy" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="mailto:support@theimpetus.com" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-foreground/10 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <p className="text-xs md:text-sm text-foreground/60 font-normal">
              © 2025 The Impetus. All rights reserved.
            </p>
            <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-foreground/60">
              <a href="#policies" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#policies" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={uniqueProducts}
        onProductClick={(product) => setQuickViewProduct(product)}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={(items) => {
          if (items.length === 0) return
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onCheckout={handleCheckout}
        total={cartTotal + shippingCost + taxAmount}
        items={cartItems}
        subtotal={cartTotal}
        shippingCost={shippingCost}
        taxAmount={taxAmount}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
      </main>
    </PageTransition>
  )
}
