 'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = (message: string, variant: ToastVariant = 'info') => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message, variant }])
  }

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 inset-x-0 flex justify-center z-[9999] px-4 pointer-events-none">
          <div className="flex flex-col gap-2 max-w-sm w-full">
            {toasts.map((t) => (
              <ToastCard key={t.id} item={t} onRemove={() => remove(t.id)} />
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 2800)
    return () => clearTimeout(timer)
  }, [onRemove])

  const colors = useMemo(() => {
    switch (item.variant) {
      case 'success':
        return 'from-emerald-500/90 to-emerald-600/90 border-emerald-300/40'
      case 'error':
        return 'from-rose-500/90 to-rose-600/90 border-rose-300/40'
      default:
        return 'from-slate-800/90 to-slate-900/90 border-slate-300/30'
    }
  }, [item.variant])

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-xl border shadow-xl backdrop-blur text-white px-4 py-3 flex items-center justify-between gap-3 animate-[fade-in_150ms_ease]',
        'bg-gradient-to-r',
        colors
      )}
    >
      <span className="text-sm font-medium">{item.message}</span>
      <button
        onClick={onRemove}
        className="text-xs px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition"
      >
        Cerrar
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

// Animations
const style = document?.createElement?.('style')
if (style && !document.getElementById('toast-animations')) {
  style.id = 'toast-animations'
  style.innerHTML = `
    @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `
  document.head.appendChild(style)
}

