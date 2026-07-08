'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void
  currentImage?: string
  onClear?: () => void
}

export function ImageUpload({ onImageSelect, currentImage, onClear }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || '')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        onImageSelect(file, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const clearImage = () => {
    setPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClear?.()
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="image-upload"
      />
      
      {preview ? (
        <div className="relative w-full h-64 bg-card border border-foreground/10 rounded-xl overflow-hidden group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
          <label
            htmlFor="image-upload"
            className="absolute bottom-2 right-2 px-4 py-2 bg-foreground text-background rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-foreground/90 text-sm font-semibold"
          >
            Change
          </label>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`relative w-full h-64 border-2 border-dashed rounded-xl transition-all ${
            isDragging
              ? 'border-foreground bg-foreground/5'
              : 'border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5'
          }`}
        >
          <label
            htmlFor="image-upload"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-foreground/40 mb-4" />
            <p className="text-sm font-semibold text-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-foreground/60">
              PNG, JPG, WEBP up to 10MB
            </p>
          </label>
        </div>
      )}
      
      <p className="text-xs text-foreground/60">
        <strong>Recommended:</strong> 800x800px or higher, square aspect ratio, white or transparent background
      </p>
    </div>
  )
}
