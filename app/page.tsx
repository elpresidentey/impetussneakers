'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Store, Mail } from 'lucide-react'
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
  const [bentoCardIndex, setBentoCardIndex] = useState([0, 0, 0])
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
    { src: '/hero-sneaker-ledge.jpg', alt: 'Sneakers styled on a concrete ledge', position: 'object-[42%_50%]' },
    { src: '/hero-sneaker-studio.jpg', alt: 'Black designer sneakers in a clean studio', position: 'object-[38%_50%]' },
    { src: '/hero-sneaker-monochrome.jpg', alt: 'Monochrome streetwear with classic sneakers', position: 'object-[50%_42%]' },
    { src: '/artiom-vallat-CHKaD8uRaDU-unsplash.jpg', alt: 'Premium sneakers editorial', position: 'object-[50%_40%]' },
    { src: '/everysize-dih2AY_9EAY-unsplash.jpg', alt: 'Sneakers in a modern setting', position: 'object-[45%_50%]' },
    { src: '/yoga-sukma-ywtc7LchG2w-unsplash.jpg', alt: 'Streetwear collection editorial', position: 'object-[50%_45%]' },
    { src: '/abhay-siby-mathew-cStSHUpdApc-unsplash.jpg', alt: 'Sneaker close-up editorial', position: 'object-[50%_48%]' },
    { src: '/ayoub-aabass-rlNVq3feaNg-unsplash.jpg', alt: 'Urban sneaker photography', position: 'object-[48%_50%]' },
    { src: '/hermes-rivera-OX_en7CXMj4-unsplash.jpg', alt: 'Street style sneaker shot', position: 'object-[52%_45%]' },
    { src: '/fachry-zella-devandra-GSGBk80Fwlg-unsplash.jpg', alt: 'Sneaker lifestyle editorial', position: 'object-[46%_50%]' },
    { src: '/niklas-bahe-tA0vOQEIw0Q-unsplash.jpg', alt: 'Classic sneaker portrait', position: 'object-[50%_50%]' },
    { src: '/flow-clark-AAkK5o8mZMg-unsplash.jpg', alt: 'Sneaker detail photography', position: 'object-[50%_42%]' },
    { src: '/kc-shum-YJUsc9aZg9s-unsplash.jpg', alt: 'Minimal sneaker composition', position: 'object-[44%_50%]' },
  ]

  const bentoCard1Images = heroImages.slice(0, 4)
  const bentoCard2Images = heroImages.slice(4, 8)
  const bentoCard3Images = heroImages.slice(8, 13)

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

  useEffect(() => {
    const pools = [bentoCard1Images, bentoCard2Images, bentoCard3Images]
    const durations = [6000, 7500, 9000]
    const intervals = durations.map((dur, cardIdx) =>
      setInterval(() => {
        setBentoCardIndex((prev) => {
          const next = [...prev]
          next[cardIdx] = (next[cardIdx] + 1) % pools[cardIdx].length
          return next
        })
      }, dur)
    )
    return () => intervals.forEach(clearInterval)
  }, [])

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
      <main className="min-h-screen page-shell text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header onSearchOpen={() => setIsSearchOpen(true)} onCartOpen={() => setIsCartOpen(true)} onAuthOpen={() => setIsAuthOpen(true)} />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] overflow-hidden bg-black text-white noise-overlay md:min-h-[96vh]">
        {heroImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            className={`object-cover ${image.position} transition-all duration-[1600ms] ease-out ${
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
            }`}
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="relative z-10 flex min-h-[92vh] items-end px-4 pb-16 pt-28 md:min-h-[96vh] md:items-center md:px-8 md:pb-20 md:pt-32">
          <div className="w-full">
            <div className={`mx-auto max-w-7xl transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
                <div className="max-w-3xl text-left">
                  <div className="mb-6 inline-flex items-center gap-3 border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse bg-white" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
                      Where Heat Lives
                    </p>
                  </div>
                  <h1 className="text-5xl font-black uppercase leading-[0.84] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
                    Stay Laced
                  </h1>
                  <p className="mt-7 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
                    Real heat, real prices. From grails to daily rotation — curated pairs for people who move different.
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="group inline-flex min-h-12 items-center justify-center gap-2 bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-white/90 active:scale-[0.98]">
                      <span>Cop Your Heat</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    <button onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex min-h-12 items-center justify-center border border-white/45 bg-white/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black active:scale-[0.98]">
                      Browse Drops
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6 border-t border-white/15 pt-6 md:border-t-0 md:border-l md:pl-10 md:pt-0">
                  <div className="grid grid-cols-1 gap-4 text-[11px] uppercase tracking-[0.2em] text-white/65 sm:grid-cols-3 md:grid-cols-1">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-6 bg-white/35" />
                      <span>Fresh drops daily</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-px w-6 bg-white/35" />
                      <span>100% authentic</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-px w-6 bg-white/35" />
                      <span>Fast shipping</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Show hero image ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1 transition-all duration-300 ${
                          index === currentImageIndex ? 'w-12 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="section-pad surface-warm border-b border-foreground/[0.06]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="section-eyebrow">Collections</p>
              <h2 className="section-title max-w-3xl">
                Built for the culture.
              </h2>
            </div>
            <p className="section-lede md:justify-self-end md:text-right">
              Editorial edits and weekly restocks — pick a lane and find your next pair.
            </p>
          </div>

          <ScrollReveal direction="up" delay={100}>
            <div className="grid gap-4 md:grid-cols-12 md:auto-rows-[220px]">
              {/* Card 1 — Hero / Statement (7 cols × 2 rows) */}
              <button className="group relative min-h-[420px] overflow-hidden text-left md:col-span-7 md:row-span-2 opacity-0 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
                <Image
                  src={bentoCard1Images[bentoCardIndex[0] % bentoCard1Images.length].src}
                  alt={bentoCard1Images[bentoCardIndex[0] % bentoCard1Images.length].alt}
                  fill
                  className={`object-cover ${bentoCard1Images[bentoCardIndex[0] % bentoCard1Images.length].position} transition-opacity duration-700 group-hover:scale-[1.06]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:via-black/50" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">01 / Statement</p>
                  <h3 className="max-w-lg text-4xl font-black uppercase leading-[0.9] md:text-6xl">Heat for your feet.</h3>
                  <span className="mt-5 inline-flex items-center gap-2 border-b border-white/40 pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-all duration-300 group-hover:border-white group-hover:text-white">
                    Explore edit
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>

              {/* Card 2 — Studio (5 cols × 1 row) */}
              <button className="group relative min-h-[250px] overflow-hidden text-left md:col-span-5 opacity-0 animate-[fadeIn_0.6s_ease-out_0.25s_forwards]" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
                <Image
                  src={bentoCard2Images[bentoCardIndex[1] % bentoCard2Images.length].src}
                  alt={bentoCard2Images[bentoCardIndex[1] % bentoCard2Images.length].alt}
                  fill
                  className={`object-cover ${bentoCard2Images[bentoCardIndex[1] % bentoCard2Images.length].position} transition-opacity duration-700 group-hover:scale-[1.06]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-500 group-hover:via-black/45" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">02 / Studio</p>
                  <h3 className="text-3xl font-black uppercase leading-[0.9] md:text-4xl">Understated fire.</h3>
                  <span className="mt-3 inline-flex items-center gap-2 border-b border-white/40 pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-all duration-300 group-hover:border-white group-hover:text-white">
                    Shop now
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>

              {/* Card 3 — Trending (5 cols × 1 row, sits below Studio) */}
              <button className="group relative min-h-[250px] overflow-hidden text-left md:col-span-5 opacity-0 animate-[fadeIn_0.6s_ease-out_0.4s_forwards]" onClick={() => document.getElementById('hottest')?.scrollIntoView({ behavior: 'smooth' })}>
                <Image
                  src={bentoCard3Images[bentoCardIndex[2] % bentoCard3Images.length].src}
                  alt={bentoCard3Images[bentoCardIndex[2] % bentoCard3Images.length].alt}
                  fill
                  className={`object-cover ${bentoCard3Images[bentoCardIndex[2] % bentoCard3Images.length].position} transition-opacity duration-700 group-hover:scale-[1.06]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 group-hover:via-black/35" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">03 / Trending</p>
                  <h3 className="text-3xl font-black uppercase leading-[0.9] md:text-4xl">What the culture is rotating.</h3>
                  <span className="mt-3 inline-flex items-center gap-2 border-b border-white/40 pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-all duration-300 group-hover:border-white group-hover:text-white">
                    View hottest
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>

              {/* Card 4 — Drop Room (12 cols × 1 row, full width) */}
              <button className="group relative min-h-[250px] overflow-hidden bg-[#1a1714] p-6 text-left text-white md:col-span-12 opacity-0 animate-[fadeIn_0.6s_ease-out_0.55s_forwards]" onClick={() => setFilterCategory('new-arrivals')}>
                {/* Animated floating number watermark */}
                <div className="absolute -right-8 -top-8 text-[200px] font-black leading-none text-white/[0.03] animate-floatNumber transition-transform duration-700 group-hover:scale-110 group-hover:text-white/[0.06]">
                  {uniqueProducts.length || 24}
                </div>
                {/* Decorative animated dots */}
                <div className="absolute right-20 top-8 h-2 w-2 bg-white/[0.06] animate-driftDots" style={{ animationDelay: '0s' }} />
                <div className="absolute right-40 top-14 h-1.5 w-1.5 bg-white/[0.04] animate-driftDots" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-12 right-16 h-1 w-1 bg-white/[0.05] animate-driftDots" style={{ animationDelay: '4s' }} />
                {/* Subtle ring accent */}
                <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full border border-white/[0.05] animate-pulseRing" />
                <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full border border-white/[0.04] animate-pulseRing" style={{ animationDelay: '1.5s' }} />

                <div className="relative flex h-full flex-col justify-between sm:flex-row sm:items-end sm:gap-8">
                  <div>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">04 / Drop room</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-6xl font-black leading-none transition-all duration-500 group-hover:tracking-tight md:text-7xl">{uniqueProducts.length || 24}</p>
                      <span className="text-sm font-semibold uppercase tracking-wide text-white/50 transition-colors duration-300 group-hover:text-white/70">pairs</span>
                    </div>
                    <h3 className="mt-2 max-w-sm text-2xl font-black uppercase leading-[0.9] transition-colors duration-300 group-hover:text-white md:text-3xl">Heat restocking weekly.</h3>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 border-b border-white/30 pb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-all duration-300 group-hover:border-white/60 group-hover:text-white sm:mt-0 sm:shrink-0">
                    See arrivals
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="new-arrivals" className="section-pad surface-paper">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10 flex flex-col gap-3 border-b border-foreground/[0.08] pb-6 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-eyebrow">Collection</p>
                <h2 className="section-title text-4xl md:text-6xl">
                  New Arrivals
                </h2>
              </div>
              <p className="section-lede">Just landed. Limited stock.</p>
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
      <section id="hottest" className="section-pad surface-warm">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10 flex flex-col gap-3 border-b border-foreground/[0.08] pb-6 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-eyebrow">Trending</p>
                <h2 className="section-title text-4xl md:text-6xl">
                  Hottest Products
                </h2>
              </div>
              <p className="section-lede">What the culture is rotating right now.</p>
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
      <section id="featured" className="section-pad surface-paper">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10 flex flex-col gap-3 border-b border-foreground/[0.08] pb-6 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-eyebrow">Curated</p>
                <h2 className="section-title text-4xl md:text-6xl">
                  Featured
                </h2>
              </div>
              <p className="section-lede">Hand-picked silhouettes worth the cop.</p>
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
      <section id="sale" className="section-pad surface-paper">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-10 flex flex-col gap-3 border-b border-foreground/[0.08] pb-6 md:mb-12 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-eyebrow">Special Offer</p>
                <h2 className="section-title text-4xl md:text-6xl">
                  Sale
                </h2>
              </div>
              <p className="section-lede">Marked-down heat — while stock lasts.</p>
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
      <section className="relative isolate overflow-hidden bg-black px-4 py-16 text-white noise-overlay md:px-8 md:py-24">
        <Image
          src="/flow-clark-AAkK5o8mZMg-unsplash.jpg"
          alt="Streetwear styling and classic sneakers"
          fill
          className="-z-20 object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />
        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal direction="up" delay={100}>
            <div className="grid items-end gap-12 md:grid-cols-[1.15fr_0.85fr]">
              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-3 border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur-sm">
                  <Store className="h-4 w-4" />
                  <span>Sell with Impetus</span>
                </div>
                <h2 className="text-5xl font-black uppercase leading-[0.86] md:text-7xl">
                  Put your best pairs in front of the right people.
                </h2>
                <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg">
                  Apply to sell verified sneakers and streetwear with a storefront built for discovery.
                </p>
                <div className="mb-8 mt-8 grid grid-cols-2 gap-3">
                  <div className="border border-white/15 bg-white/8 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-2xl font-black">₦2.5M</div>
                    <div className="text-xs uppercase tracking-[0.14em] text-white/65">Avg monthly revenue</div>
                  </div>
                  <div className="border border-white/15 bg-white/8 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-2xl font-black">10K+</div>
                    <div className="text-xs uppercase tracking-[0.14em] text-white/65">Ready customers</div>
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
                <div className="border border-white/15 bg-white/8 p-7 backdrop-blur-md md:p-8">
                  <h3 className="mb-6 text-xl font-black uppercase tracking-wide">Why Choose Us?</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-emerald-300/40 bg-emerald-400/90">
                        <span className="text-sm font-bold text-emerald-950">✓</span>
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide">Lowest Commission</h4>
                        <p className="text-sm text-white/70">Only 8% vs 15-20% on other platforms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-emerald-300/40 bg-emerald-400/90">
                        <span className="text-sm font-bold text-emerald-950">✓</span>
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide">Built-in Audience</h4>
                        <p className="text-sm text-white/70">Access to 10,000+ sneaker enthusiasts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-emerald-300/40 bg-emerald-400/90">
                        <span className="text-sm font-bold text-emerald-950">✓</span>
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide">Fast Payments</h4>
                        <p className="text-sm text-white/70">Guaranteed payments within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-amber-300/50 bg-amber-400">
                        <span className="text-sm font-bold text-amber-950">★</span>
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide">Limited: 5% Commission</h4>
                        <p className="text-sm text-white/70">First 50 vendors get reduced rate for 6 months</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-3 -top-3 border border-black/10 bg-amber-400 px-4 py-3 text-center font-black text-black shadow-xl md:-right-4 md:-top-4">
                  <div className="text-lg leading-none">50/50</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em]">Spots Left</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Latest Drops - Product Grid */}
      <section id="shop" className="section-pad-lg surface-warm border-t border-foreground/[0.06]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 grid gap-6 border-b border-foreground/[0.08] pb-8 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="section-eyebrow">Shop</p>
                <h2 className="section-title">
                  Fresh drops.
                </h2>
                <p className="section-lede mt-4">
                  Limited releases. Premium quality. First access to the pairs that define culture.
                </p>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
                {filteredProducts.length} products
              </p>
            </div>
          </ScrollReveal>

          {/* Filter and Sort Bar */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 grid gap-4 border border-foreground/[0.08] bg-white/50 p-4 backdrop-blur-sm md:grid-cols-[1fr_auto] md:items-center md:p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-12 border border-foreground/12 bg-white/80 px-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-foreground hover:border-foreground/30 cursor-pointer"
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
                  className="h-12 border border-foreground/12 bg-white/80 px-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-foreground hover:border-foreground/30 cursor-pointer"
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
                  className="h-12 border border-foreground/12 bg-white/80 px-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-foreground hover:border-foreground/30 cursor-pointer"
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
      <section id="experience" className="section-pad surface-paper border-t border-foreground/[0.06]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 md:mb-16">
              <p className="section-eyebrow">Experience</p>
              <h2 className="section-title mb-4 max-w-3xl">
                Beyond the Store
              </h2>
              <p className="section-lede">
                A digital flagship where every pixel serves the story. Where culture meets commerce.
              </p>
            </div>
          </ScrollReveal>

          {/* Gallery Image */}
          <ScrollReveal direction="up" delay={100}>
            <div className="group relative aspect-video cursor-pointer overflow-hidden border border-foreground/10 shadow-[0_24px_80px_rgba(20,16,12,0.12)] md:aspect-[16/9]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diego-jaramillo-W4swGaKFHVQ-unsplash-eweOcZZ12tk00zydKVwmN14tnD2Nae.jpg"
                alt="Showroom Experience"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-8 md:p-12">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Flagship</p>
                <h3 className="mb-3 max-w-xl text-2xl font-black uppercase leading-none tracking-tight text-white md:text-4xl">
                  Crafted for Collectors
                </h3>
                <p className="max-w-xl text-sm text-white/80 md:text-base">
                  Every detail intentional. Every drop meaningful. This is sneaker retail elevated.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Proof Section with Marquee */}
      <section className="overflow-hidden border-y border-foreground/[0.08] surface-paper px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center md:mb-12">
            <p className="section-eyebrow !mb-2">Trusted By</p>
            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
              Sneaker Enthusiasts Worldwide
            </h3>
          </div>
          
          <div className="relative mb-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--surface-paper)] to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--surface-paper)] to-transparent md:w-24" />
            <div className="flex animate-marquee">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-12 px-8 md:gap-20">
                  {[
                    ['50K+', 'Happy Customers'],
                    ['200+', 'Exclusive Drops'],
                    ['4.9', 'Average Rating'],
                    ['24/7', 'Support Available'],
                    ['100%', 'Authentic'],
                    ['50+', 'Countries'],
                  ].map(([stat, label]) => (
                    <div key={`${i}-${label}`} className="flex items-center gap-12 md:gap-20">
                      <div className="flex min-w-[7rem] flex-col items-center text-center">
                        <p className="mb-1 text-3xl font-black tracking-tight text-foreground md:text-4xl">{stat}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">{label}</p>
                      </div>
                      <div className="h-10 w-px bg-foreground/12" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden surface-ink px-4 py-16 text-white md:px-8 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        <ScrollReveal direction="up" delay={100}>
          <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
            <div className="space-y-4 md:space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/50">Ready?</p>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
                Find Your Grail
              </h2>
              <p className="mx-auto max-w-2xl text-base text-white/65 md:text-lg">
                Join the movement. Limited drops. Premium quality. Your next pair is waiting.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} className="group relative w-full overflow-hidden bg-white px-10 py-4 font-semibold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-white/90 sm:w-auto">
                <span className="relative z-10">Start Shopping</span>
              </button>
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="w-full border border-white/30 px-10 py-4 font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white/10 sm:w-auto">
                Our Story
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section className="section-pad surface-warm border-t border-foreground/[0.06]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-14 max-w-2xl md:mb-16">
              <p className="section-eyebrow">Why Us</p>
              <h2 className="section-title mb-4">
                The Impetus Difference
              </h2>
              <p className="section-lede">
                Every detail crafted for the discerning collector. Experience sneaker retail elevated.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 md:grid-cols-3">
              <div className="group bg-[var(--surface-warm)] p-8 transition-colors duration-300 hover:bg-white md:p-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center border border-foreground/10 bg-foreground/[0.04]">
                  <svg className="h-6 w-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-foreground">Authentic Guaranteed</h3>
                <p className="text-sm leading-relaxed text-foreground/60 md:text-base">
                  Every pair verified through our rigorous authentication process. Your peace of mind, our promise.
                </p>
              </div>

              <div className="group bg-[var(--surface-warm)] p-8 transition-colors duration-300 hover:bg-white md:p-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center border border-foreground/10 bg-foreground/[0.04]">
                  <svg className="h-6 w-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-foreground">Exclusive Drops</h3>
                <p className="text-sm leading-relaxed text-foreground/60 md:text-base">
                  First access to limited releases. Be among the few who own the pairs that define culture.
                </p>
              </div>

              <div className="group bg-[var(--surface-warm)] p-8 transition-colors duration-300 hover:bg-white md:p-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center border border-foreground/10 bg-foreground/[0.04]">
                  <svg className="h-6 w-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-foreground">Premium Packaging</h3>
                <p className="text-sm leading-relaxed text-foreground/60 md:text-base">
                  Unboxing experience designed to match the quality within. Every detail intentional.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-pad surface-paper border-t border-foreground/[0.06]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="mb-12 max-w-2xl md:mb-16">
              <p className="section-eyebrow">Testimonials</p>
              <h2 className="section-title mb-4">
                What Collectors Say
              </h2>
              <p className="section-lede">
                Join thousands of satisfied collectors who trust The Impetus for their sneaker journey.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {[
                {
                  quote: 'The authentication process gave me complete confidence. My AJ11s arrived in perfect condition. This is how sneaker retail should be.',
                  initials: 'JM',
                  name: 'James M.',
                  role: 'Verified Collector',
                },
                {
                  quote: "First access to drops is incredible. I've secured pairs I never thought I'd get. The unboxing experience alone is worth it.",
                  initials: 'SK',
                  name: 'Sarah K.',
                  role: 'Premium Member',
                },
                {
                  quote: 'Customer service is exceptional. They helped me find my grail pair after months of searching. Truly dedicated to collectors.',
                  initials: 'DL',
                  name: 'David L.',
                  role: 'Loyal Customer',
                },
              ].map((t) => (
                <div
                  key={t.initials}
                  className="group flex flex-col border border-foreground/[0.08] bg-white/70 p-7 transition-all duration-300 hover:border-foreground/20 hover:bg-white hover:shadow-[0_16px_40px_rgba(20,16,12,0.06)] md:p-8"
                >
                  <div className="mb-5 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-8 flex-1 text-sm leading-relaxed text-foreground/75 md:text-base">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-foreground/[0.06] pt-5">
                    <div className="flex h-11 w-11 items-center justify-center border border-foreground/10 bg-foreground/[0.04]">
                      <span className="text-xs font-bold tracking-wide text-foreground">{t.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/45">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="relative overflow-hidden border-y border-foreground/[0.08] surface-ink px-4 py-16 text-white md:px-8 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_55%)]" />
        <ScrollReveal direction="up" delay={100}>
          <div className="relative z-10 mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/50">Stay Connected</p>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                Join the Movement
              </h2>
              <p className="mt-4 max-w-md text-base text-white/65">
                Be the first to know about exclusive drops, early access, and collector-only events. No spam, just culture.
              </p>
            </div>
            <div>
              {isSubscribed ? (
                <div className="border border-white/20 bg-white/5 p-6">
                  <p className="text-center font-semibold text-white">Thanks for subscribing.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="min-h-12 flex-1 border border-white/25 bg-white/5 px-5 text-sm text-white placeholder-white/40 outline-none transition-colors duration-300 focus:border-white/60"
                  />
                  <button type="submit" className="min-h-12 whitespace-nowrap bg-white px-8 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-white/90">
                    Subscribe
                  </button>
                </form>
              )}
              <p className="mt-3 text-[11px] text-white/40">
                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer Link Destinations */}
      <section className="section-pad surface-warm border-t border-foreground/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 grid gap-6 md:mb-12 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="section-eyebrow">Information</p>
              <h2 className="section-title">
                Everything in one place.
              </h2>
            </div>
            <p className="section-lede md:justify-self-end md:text-right">
              Policies, support, and ways to reach the team — clear and easy to find.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-foreground/10 bg-foreground/10 md:grid-cols-3">
            {[
              { id: 'about', kicker: 'About', title: 'Our Story', body: 'The Impetus is built for sharp sneaker edits, honest product presentation, and fast access to pieces that work in real wardrobes.', href: '/about' },
              { id: 'contact', kicker: 'Contact', title: 'Talk to us', body: 'For order help, sizing questions, or sourcing requests, reach the team at support@theimpetus.com.', href: 'mailto:support@theimpetus.com' },
              { id: 'press', kicker: 'Press', title: 'Editorial desk', body: 'Brand assets, launch notes, and collaboration enquiries are handled through press@theimpetus.com.', href: 'mailto:press@theimpetus.com' },
              { id: 'shipping', kicker: 'Support', title: 'Shipping Info', body: 'Orders are prepared after confirmation and dispatched with tracking once payment and stock checks are complete.', href: '/legal/shipping' },
              { id: 'returns', kicker: 'Support', title: 'Returns', body: 'Return requests are reviewed against item condition, delivery status, and product eligibility.', href: '/legal/returns' },
              { id: 'faq', kicker: 'Support', title: 'FAQ', body: 'Common questions cover sizing, authenticity, dispatch timing, payment confirmation, and order updates.', href: '/legal/shipping' },
              { id: 'instagram', kicker: 'Connect', title: 'Instagram', body: 'Follow release styling, launch previews, and editorial drops from the Impetus team.', href: 'https://instagram.com/theimpetus', external: true },
              { id: 'twitter', kicker: 'Connect', title: 'Twitter', body: 'Drop reminders, availability notes, and quick support updates live here.', href: 'https://twitter.com/theimpetus', external: true },
              { id: 'policies', kicker: 'Policies', title: 'Privacy & Terms', body: 'Customer data, checkout activity, and order communication are handled only for store operations and support.', href: '/legal/privacy' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block bg-[var(--surface-warm)] p-6 transition-colors duration-300 hover:bg-white md:p-8"
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/40">{item.kicker}</p>
                <h3 className="text-xl font-black uppercase leading-none tracking-tight text-foreground md:text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  {item.body}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[var(--surface-ink)] px-4 py-12 text-white md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-10 border-b border-white/10 pb-12 md:mb-14 md:grid-cols-[1.1fr_2fr] md:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">The</p>
              <p className="mt-1 text-2xl font-black uppercase tracking-[0.18em]">Impetus</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
                Premium sneakers and streetwear — curated for culture, built for the daily rotation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
              <div>
                <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Shop</h4>
                <ul className="space-y-3">
                  <li><Link href="/#shop" className="text-sm text-white/65 transition-colors hover:text-white">All Products</Link></li>
                  <li><Link href="/#collections" className="text-sm text-white/65 transition-colors hover:text-white">Collections</Link></li>
                  <li><Link href="/#new-arrivals" className="text-sm text-white/65 transition-colors hover:text-white">New Arrivals</Link></li>
                  <li><Link href="/#sale" className="text-sm text-white/65 transition-colors hover:text-white">Sale</Link></li>
                  <li><a href="/orders" className="text-sm text-white/65 transition-colors hover:text-white">Track Order</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Company</h4>
                <ul className="space-y-3">
                  <li><a href="/about" className="text-sm text-white/65 transition-colors hover:text-white">About Us</a></li>
                  <li><a href="/vendor" className="text-sm text-white/65 transition-colors hover:text-white">Sell With Us</a></li>
                  <li><Link href="/#newsletter" className="text-sm text-white/65 transition-colors hover:text-white">Newsletter</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Support</h4>
                <ul className="space-y-3">
                  <li><a href="/legal/shipping" className="text-sm text-white/65 transition-colors hover:text-white">Shipping Policy</a></li>
                  <li><a href="/legal/returns" className="text-sm text-white/65 transition-colors hover:text-white">Returns & Refunds</a></li>
                  <li><a href="mailto:support@theimpetus.com" className="text-sm text-white/65 transition-colors hover:text-white">Help Center</a></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="/legal/terms" className="text-sm text-white/65 transition-colors hover:text-white">Terms of Service</a></li>
                  <li><a href="/legal/privacy" className="text-sm text-white/65 transition-colors hover:text-white">Privacy Policy</a></li>
                  <li><a href="mailto:support@theimpetus.com" className="text-sm text-white/65 transition-colors hover:text-white">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} The Impetus. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a href="https://instagram.com/theimpetus" target="_blank" rel="noopener noreferrer" className="text-white/40 transition-colors hover:text-white/80" aria-label="Instagram">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com/theimpetus" target="_blank" rel="noopener noreferrer" className="text-white/40 transition-colors hover:text-white/80" aria-label="Twitter">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="mailto:support@theimpetus.com" className="text-white/40 transition-colors hover:text-white/80" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
              <span className="h-3 w-px bg-white/20" />
              <a href="/legal/privacy" className="text-xs text-white/40 transition-colors hover:text-white/80">Privacy</a>
              <a href="/legal/terms" className="text-xs text-white/40 transition-colors hover:text-white/80">Terms</a>
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
