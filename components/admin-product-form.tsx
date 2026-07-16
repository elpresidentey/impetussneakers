'use client'

import { useState } from 'react'
import { X, ImageIcon, Tag, Palette, Ruler, Star, Box, Info, Eye, ChevronRight, Upload, Check, Package } from 'lucide-react'
import { ImageUpload } from './image-upload'

interface ProductFormProps {
  product?: any
  onSubmit: (product: any) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function AdminProductForm({ product, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [formStep, setFormStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '')
  const [formData, setFormData] = useState({
    name: String(product?.name || ''),
    description: String(product?.description || ''),
    price: product?.price != null ? String(product.price) : '',
    image_url: String(product?.image || ''),
    alt_text: String(product?.alt || ''),
    sizes: Array.isArray(product?.sizes) ? (product.sizes as string[]).join(', ') : '',
    colors: Array.isArray(product?.colors) ? (product.colors as string[]).join(', ') : '',
    rating: product?.rating != null ? String(product.rating) : '4',
    in_stock: Boolean(product?.inStock ?? true),
    stock_quantity: product?.stockQuantity != null ? String(product.stockQuantity) : '',
    category: String(product?.category || 'new-arrivals'),
  })

  const handleImageSelect = (file: File, previewUrl: string) => {
    setImageFile(file)
    setImagePreview(previewUrl)
    setFormData({ ...formData, image_url: previewUrl })
  }

  const handleClearImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const getPreviewData = () => {
    const sizesArray = formData.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s)
    const colorsArray = formData.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c)
    
    return {
      name: formData.name || 'Product Name',
      description: formData.description || 'Product description',
      price: parseInt(formData.price) || 0,
      image: formData.image_url || '/placeholder.webp',
      sizes: sizesArray.length > 0 ? sizesArray : ['7', '8', '9'],
      colors: colorsArray.length > 0 ? colorsArray : ['#000000'],
      rating: parseInt(formData.rating) || 4,
      inStock: formData.in_stock,
      stockQuantity: parseInt(formData.stock_quantity) || 0,
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.description.trim() && formData.price
      case 2:
        return formData.image_url.trim() && formData.alt_text.trim()
      case 3:
        return formData.sizes.trim() && formData.colors.trim()
      case 4:
        return formData.stock_quantity
      default:
        return false
    }
  }

  const preview = getPreviewData()

  return (
    <div className="bg-white/5 border-b border-white/20 animate-fadeIn">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package className="w-7 h-7" />
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-white/60 text-sm mt-1">Follow the guidelines to add your product details</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => setFormStep(step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      formStep === step
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-110'
                        : formStep > step || isStepValid(step)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/50'
                    }`}
                  >
                    {formStep > step || isStepValid(step) ? <Check className="w-5 h-5" /> : step}
                  </button>
                  <span className="text-xs text-white/70 mt-2 text-center">
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Images'}
                    {step === 3 && 'Variants'}
                    {step === 4 && 'Stock & Category'}
                  </span>
                </div>
                {step < 4 && (
                  <ChevronRight className="w-5 h-5 text-white/30 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {formStep === 1 && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="w-6 h-6 text-pink-400" />
                    <h4 className="text-lg font-bold text-white">Basic Information</h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <span>Product Name</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Air Jordan 11 Retro"
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-lg transition-all"
                    />
                    <p className="text-xs text-white/50 mt-1">Enter a clear, descriptive product name</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <span>Description</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., Legendary silhouette with premium leather upper and iconic design"
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-lg transition-all"
                    />
                    <p className="text-xs text-white/50 mt-1">Provide a compelling product description (50-200 characters recommended)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <span>Price (₦)</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 font-bold">₦</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="320000"
                        required
                        min="0"
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-lg transition-all"
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-1">Set a competitive price in Nigerian Naira</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                    <Info className="w-5 h-5 text-blue-300 flex-shrink-0" />
                    <p className="text-sm text-white/90">Start with a clear name and description. This is what customers will see first!</p>
                  </div>
                </div>
              )}

              {/* Step 2: Images */}
              {formStep === 2 && (
                <div className="bg-card border border-foreground/10 p-6 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageIcon className="w-6 h-6 text-foreground" />
                    <h4 className="text-lg font-bold text-foreground">Product Images</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span>Product Image</span>
                      <span className="text-red-600">*</span>
                    </label>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      currentImage={imagePreview}
                      onClear={handleClearImage}
                    />
                  </div>

                  <div className="text-xs text-foreground/60 bg-foreground/5 p-4 rounded-lg">
                    <p className="font-semibold mb-2">📁 Alternative: Use URL Instead</p>
                    <p className="mb-2">If you prefer to use an image URL from your server:</p>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value })
                        setImagePreview(e.target.value)
                      }}
                      placeholder="/product-name.webp"
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/50 text-sm"
                    />
                    <p className="mt-2 text-xs">Add image to /public folder, then enter the path</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span>Alt Text (for SEO)</span>
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.alt_text}
                      onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                      placeholder="Air Jordan 11 Retro High Top Sneakers"
                      required
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
                    />
                    <p className="text-xs text-foreground/60 mt-1">Describe the image for accessibility and search engines</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Image Guidelines:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-foreground/80">
                        <li>High-quality images (recommended: 800x800px or higher)</li>
                        <li>Square aspect ratio preferred</li>
                        <li>White or transparent background works best</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Variants */}
              {formStep === 3 && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-6 h-6 text-green-400" />
                    <h4 className="text-lg font-bold text-white">Product Variants</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      <span>Available Sizes</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="7, 8, 9, 10, 11, 12"
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-lg transition-all"
                    />
                    <p className="text-xs text-white/50 mt-1">Enter sizes separated by commas (e.g., 7, 8, 9, 10, 11, 12)</p>
                    {formData.sizes && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.sizes.split(',').map((size: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-white text-sm">
                            {size.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span>Available Colors (Hex Codes)</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="#000000, #FFFFFF, #FF0000"
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-lg transition-all"
                    />
                    <p className="text-xs text-white/50 mt-1">Enter hex color codes separated by commas (e.g., #000000, #FFFFFF)</p>
                    {formData.colors && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.colors.split(',').map((color: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white/30"
                              style={{ backgroundColor: color.trim() }}
                            />
                            <span className="text-white text-sm">{color.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>Product Rating</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-lg transition-all"
                      required
                    >
                      <option value="5" className="bg-purple-900">★★★★★ (5 stars)</option>
                      <option value="4" className="bg-purple-900">★★★★☆ (4 stars)</option>
                      <option value="3" className="bg-purple-900">★★★☆☆ (3 stars)</option>
                      <option value="2" className="bg-purple-900">★★☆☆☆ (2 stars)</option>
                      <option value="1" className="bg-purple-900">★☆☆☆☆ (1 star)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                    <Info className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <p className="text-sm text-white/90">Sizes and colors let customers choose their preferred variant. Make sure to list all available options!</p>
                  </div>
                </div>
              )}

              {/* Step 4: Stock & Category */}
              {formStep === 4 && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <Box className="w-6 h-6 text-orange-400" />
                    <h4 className="text-lg font-bold text-white">Stock & Category</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Product Category</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-lg transition-all"
                      required
                    >
                      <option value="new-arrivals" className="bg-purple-900">🆕 New Arrivals</option>
                      <option value="hottest" className="bg-purple-900">🔥 Hottest</option>
                      <option value="featured" className="bg-purple-900">⭐ Featured</option>
                      <option value="sale" className="bg-purple-900">💰 Sale</option>
                    </select>
                    <p className="text-xs text-white/50 mt-1">Choose the collection where this product will appear</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      <span>Stock Quantity</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      placeholder="50"
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-lg transition-all"
                    />
                    <p className="text-xs text-white/50 mt-1">How many units are available for sale?</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-all border border-white/20">
                      <input
                        type="checkbox"
                        checked={formData.in_stock}
                        onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                        className="w-5 h-5 rounded accent-orange-500"
                      />
                      <div>
                        <span className="text-sm font-semibold text-white">Product is in stock</span>
                        <p className="text-xs text-white/60">Uncheck if the product is temporarily unavailable</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-orange-500/20 border border-orange-400/30 rounded-xl">
                    <Info className="w-5 h-5 text-orange-300 flex-shrink-0" />
                    <p className="text-sm text-white/90">Almost done! Choose the category and review all details before submitting.</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 pt-4">
                {formStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep - 1)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold"
                  >
                    Previous
                  </button>
                )}
                {formStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep + 1)}
                    disabled={!isStepValid(formStep)}
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold flex items-center gap-2"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStepValid(4)}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-semibold shadow-lg"
                  >
                    {isSubmitting ? 'Submitting...' : product ? 'Update Product' : 'Add Product'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Product Preview
                </h4>
                <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                  <div className="relative w-full h-48 bg-white/10 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={preview.image}
                      alt={formData.alt_text || 'Preview'}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.webp'
                      }}
                    />
                    {!preview.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <h5 className="font-bold text-white text-lg mb-2">{preview.name}</h5>
                  <p className="text-white/70 text-sm mb-3">{preview.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-white">₦{preview.price.toLocaleString()}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < preview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-white/60 font-semibold">Sizes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {preview.sizes.map((size: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-white/10 rounded text-white text-xs">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-white/60 font-semibold">Colors:</span>
                      <div className="flex gap-2 mt-1">
                        {preview.colors.map((color: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
