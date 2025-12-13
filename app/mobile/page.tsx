'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { useToast } from '@/components/ui/Toast'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  code: string
  name: string
  price: number
  stock?: {
    quantity: number
  }
}

export default function MobilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([])
  const [clientId, setClientId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchProducts()
    }
  }, [status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id)
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleSale = async () => {
    if (cart.length === 0) {
      toast('El carrito está vacío', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }))

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          clientId: clientId || null,
          paymentMethod: 'CASH',
        }),
      })

      if (response.ok) {
        toast('Venta realizada exitosamente', 'success')
        setCart([])
        setClientId('')
        fetchProducts() // Actualizar stock
      } else {
        const error = await response.json()
        toast(error.error || 'Error al realizar la venta', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      toast('Error al realizar la venta', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * 0.21
  const total = subtotal + tax

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg sticky top-0 z-10">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">Venta Rápida</h1>
              <p className="text-xs text-indigo-100">Modo móvil optimizado</p>
            </div>
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                ← Volver
              </Button>
            </Link>
          </div>
          <Input
            placeholder="🔍 Buscar producto por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-md"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Lista de Productos */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {filteredProducts.map((product) => {
            const stockQty = product.stock?.quantity || 0
            const inCart = cart.find((item) => item.product.id === product.id)
            const canAdd = stockQty > 0

            return (
              <Card 
                key={product.id} 
                className={`p-4 shadow-md hover:shadow-xl transition-shadow duration-200 ${
                  inCart ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1 text-slate-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 mb-2 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">
                      {product.code}
                    </p>
                    <p className="text-xl font-bold text-indigo-600 mb-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className={`text-xs font-semibold px-2 py-1 rounded inline-block ${
                      stockQty > 0 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      Stock: {stockQty}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 w-full font-extrabold shadow-[0_8px_16px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.5)] active:scale-[0.97] transition-all duration-200 ring-2 ring-indigo-400 hover:ring-4 hover:ring-indigo-500 text-base"
                    onClick={() => addToCart(product)}
                    disabled={!canAdd}
                  >
                    {inCart ? `🛒 ${inCart.quantity}` : '+ Agregar'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Botón Flotante del Carrito */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-full shadow-[0_8px_20px_rgba(79,70,229,0.6)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.7)] flex items-center justify-center font-bold text-lg z-50 active:scale-95 transition-all duration-200 ring-4 ring-white"
        >
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      {/* Carrito Flotante */}
      {cart.length > 0 && showCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-indigo-500 shadow-2xl z-50">
          <div className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-slate-900">
                🛒 Carrito <span className="text-indigo-600">({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCart(false)}
                  className="text-xs text-slate-600 font-semibold hover:text-slate-900 bg-slate-100 px-3 py-1 rounded-full"
                >
                  ✕ Cerrar
                </button>
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-red-600 font-semibold hover:text-red-700 bg-red-50 px-3 py-1 rounded-full"
                >
                  Vaciar
                </button>
              </div>
            </div>
            <div className="max-h-36 overflow-y-auto mb-3 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-200 shadow-sm"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {formatCurrency(item.product.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-3 mb-3 border border-indigo-200">
              <div className="flex justify-between text-sm mb-2 text-slate-700">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2 text-slate-700">
                <span className="font-medium">IVA (21%):</span>
                <span className="font-bold">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-slate-900 border-t-2 border-indigo-300 pt-2">
                <span>Total:</span>
                <span className="text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-base font-bold shadow-md"
                onClick={() => setShowCart(false)}
                disabled={isProcessing}
              >
                ← Seguir comprando
              </Button>
              <Button
                className="flex-1 text-base font-bold shadow-lg"
                onClick={() => {
                  handleSale()
                  setShowCart(false)
                }}
                disabled={isProcessing}
              >
                {isProcessing ? '⏳...' : '✓ Finalizar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

