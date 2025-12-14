'use client'

import React, { useState, useMemo } from 'react'
import { Search, Plus, Minus, X, ShoppingCart, Trash2, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createPendingInvoice } from '@/lib/storage'
import { QuickClientSelector } from '@/components/invoices/QuickClientSelector'
import { Client } from '@/lib/storage'

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const mockProducts: Product[] = [
  { id: '1', name: 'Aceite de Girasol 900ml', code: 'ACE001', price: 1250.00, stock: 74, category: 'Almacén' },
  { id: '2', name: 'Arroz Grano Largo 1kg', code: 'ARR001', price: 850.50, stock: 45, category: 'Almacén' },
  { id: '3', name: 'Detergente Líquido 1L', code: 'DET001', price: 650.00, stock: 32, category: 'Limpieza' },
  { id: '4', name: 'Jabón en Polvo 800g', code: 'JAB001', price: 420.75, stock: 28, category: 'Limpieza' },
  { id: '5', name: 'Aceite de Oliva Extra Virgen 500ml', code: 'ACE002', price: 1850.00, stock: 15, category: 'Productos Especiales' },
]

const categories = ['TODOS', 'Almacén', 'Limpieza', 'Productos Especiales']

export default function MobilePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('TODOS')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showClientSelector, setShowClientSelector] = useState(false)
  const [saleSuccess, setSaleSuccess] = useState(false)

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === 'TODOS' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
    setShowCart(true)
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header móvil */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold text-white">Venta Rápida</h1>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Barra de búsqueda y filtros */}
      <div className="p-3 space-y-2 sticky top-12 z-30 bg-slate-950/95 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800/40 text-slate-500 hover:text-slate-400 border border-slate-700/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="px-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/30"
            >
              <h3 className="text-xs font-medium text-slate-100 mb-1.5 line-clamp-2 leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/40 text-slate-400 rounded">
                  {product.code}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/30">
                <span className="text-sm font-semibold text-emerald-400">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 text-sm">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Carrito móvil (modal) */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-xl border-t border-slate-800 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-semibold text-white">Carrito</h2>
                  {totalItems > 0 && (
                    <span className="text-xs text-slate-400">({totalItems} items)</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <ShoppingCart className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-500 text-sm">Carrito vacío</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-100 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-emerald-400 mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/40 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700/40 hover:bg-emerald-500/15 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Subtotal:</p>
                        <p className="text-sm font-medium text-slate-200">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Items:</span>
                  <span className="text-slate-200 font-medium">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-white">TOTAL:</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setShowClientSelector(true)
                  }}
                >
                  Crear Factura Pendiente
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selector de Cliente */}
      {showClientSelector && (
        <QuickClientSelector
          onSelect={(client) => {
            // Crear factura pendiente
            const invoice = createPendingInvoice(
              cartItems,
              total,
              client.id,
              client.name,
              client.phone
            )
            
            // Limpiar carrito
            setCartItems([])
            setShowCart(false)
            setShowClientSelector(false)
            setSaleSuccess(true)
            
            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => {
              setSaleSuccess(false)
            }, 3000)
          }}
          onClose={() => setShowClientSelector(false)}
        />
      )}

      {/* Mensaje de éxito */}
      {saleSuccess && (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/50 rounded-lg p-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-white" />
              <p className="text-sm font-medium text-white">
                Factura pendiente creada exitosamente
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
