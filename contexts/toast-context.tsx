'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    // Prevent duplicate toasts with the same message
    setToasts((prev) => {
      const existingToast = prev.find(t => t.message === message && t.type === type)
      if (existingToast) {
        return prev
      }
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { id, message, type }
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 3000)
      return [...prev, newToast]
    })
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
