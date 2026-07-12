'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Heart, MessageCircle, Instagram, Twitter, Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SocialCommerceProps {
  productId: string
  productName: string
  productImage: string
  price: number
  vendorName: string
}

export function SocialCommerce({ productId, productName, productImage, price, vendorName }: SocialCommerceProps) {
  const [liked, setLiked] = useState(false)
  const [shared, setShared] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/product/${productId}`
  const shareText = `Check out this amazing ${productName} from ${vendorName} for ₦${price.toLocaleString()} on The Impetus! 🔥👟`

  const handleShare = async (platform: 'whatsapp' | 'instagram' | 'twitter' | 'copy') => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      instagram: `https://www.instagram.com/`, // Would need Instagram API integration
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      copy: shareUrl
    }

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    } else {
      window.open(urls[platform], '_blank')
    }

    // Track social engagement
    // Analytics would track this for investor metrics
    setShared(true)
    
    // Track in analytics
    fetch('/api/analytics/social-engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'share',
        productId,
        platform,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error)
  }

  const handleLike = async () => {
    setLiked(!liked)
    
    // Track engagement
    fetch('/api/analytics/social-engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'like',
        productId,
        liked: !liked,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error)
  }

  return (
    <div className="space-y-4">
      {/* Social Engagement Bar */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${liked ? 'text-red-500' : ''}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Ask Vendor</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            ⚡ 127 people viewed today
          </Badge>
          <Badge variant="outline" className="text-xs text-green-600">
            🔥 Trending
          </Badge>
        </div>
      </div>

      {/* Share Options */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share & Earn ₦500 Commission
          </h4>
          {shared && (
            <Badge variant="outline" className="text-green-600">
              ✓ Shared
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Share this product and earn ₦500 for every sale through your link!
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('whatsapp')}
            className="flex-1"
          >
            WhatsApp
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('instagram')}
            className="flex-1"
          >
            <Instagram className="w-4 h-4 mr-1" />
            Stories
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="flex-1"
          >
            <Twitter className="w-4 h-4 mr-1" />
            Tweet
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('copy')}
            className="px-3"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Generated Content Prompt */}
      <div className="p-4 bg-card rounded-lg border">
        <h4 className="font-semibold mb-2">Share Your Style 📸</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Post your fit on Instagram with #TheImpetusFit and get featured!
        </p>
        <Button size="sm" variant="outline" className="w-full">
          Upload Your Photo
        </Button>
      </div>

      {/* Vendor Social Proof */}
      <div className="p-4 bg-card rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">About {vendorName}</h4>
          <Badge variant="outline" className="text-xs">
            ⭐ 4.8 (234 reviews)
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>📦 Fast shipping</span>
          <span>✅ Verified seller</span>
          <span>🏆 Top rated</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline">
            Follow Vendor
          </Button>
          <Button size="sm" variant="outline">
            View Store
          </Button>
        </div>
      </div>
    </div>
  )
}