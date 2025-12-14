'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { ProductCard } from '@/components/tpv/ProductCard'
import { Cart } from '@/components/tpv/Cart'
import { Input } from '@/components/ui/Input'
import AuthGuard from '@/components/auth/AuthGuard'

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

export default function TPVPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('TODOS')
  const [cartItems, setCartItems] = useState<CartItem[]>([])

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sección principal de productos */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 space-y-3">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <Input
                type="text"
                placeholder="Buscar por nombre o código del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Filtros de categoría */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800/40 text-slate-500 hover:text-slate-400 hover:bg-slate-800/60 border border-slate-700/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de productos */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-500 text-sm">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Carrito lateral */}
        <div className="w-72 flex-shrink-0">
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        </div>
      </div>
      </div>
    </AuthGuard>
  )
}
