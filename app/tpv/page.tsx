'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  code: string
  barcode?: string
  name: string
  price: number
  stock?: { quantity: number }
  category?: string
}

interface CartItem {
  product: Product
  quantity: number
}

export default function TPVPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')

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

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category || 'SIN CATEGORÍA')))]

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'ALL' || (p.category || 'SIN CATEGORÍA') === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Función para manejar escaneo de código de barras
  const handleBarcodeSearch = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode || p.code === barcode)
    if (product) {
      addToCart(product)
      setSearchTerm('') // Limpiar búsqueda después de agregar
    }
  }

  // Detectar cuando se escanea un código de barras (Enter después de escribir)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Buscar producto exacto por código de barras o código
      const product = products.find(
        (p) => 
          p.barcode === searchTerm.trim() || 
          p.code.toLowerCase() === searchTerm.trim().toLowerCase()
      )
      
      if (product) {
        addToCart(product)
        setSearchTerm('')
        // Enfocar nuevamente el input para siguiente escaneo
        ;(e.target as HTMLInputElement).focus()
      }
    }
  }

  const addToCart = (product: Product) => {
    const stockQty = product.stock?.quantity || 0
    const inCartQty = cart.find((item) => item.product.id === product.id)?.quantity || 0

    if (stockQty <= inCartQty) {
      alert('Stock insuficiente')
      return
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    const stockQty = product?.stock?.quantity || 0

    if (newQty > stockQty) {
      alert('Stock insuficiente')
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const clearCart = () => {
    if (confirm('¿Limpiar todo el carrito?')) {
      setCart([])
    }
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setShowPayment(true)
  }

  const confirmPayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: null,
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        }),
      })

      if (response.ok) {
        alert('✅ Venta registrada exitosamente')
        setCart([])
        setShowPayment(false)
        setPaymentAmount('')
        fetchProducts()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al procesar venta')
      }
    } catch (error) {
      alert('Error al procesar venta')
    } finally {
      setIsProcessing(false)
    }
  }

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000, 10000]
  const change = paymentAmount ? parseFloat(paymentAmount) - total : 0

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      {/* TPV Header - Compacto */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 shadow-xl border-b-2 border-emerald-400">
        <div className="max-w-[1920px] mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  TERMINAL PUNTO DE VENTA
                </h1>
                <p className="text-emerald-100 text-xs font-medium">
                  Sistema de cobro profesional • Rápido y confiable
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/sales">
                <Button size="sm" variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30 text-xs">
                  📊 Ventas
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30 text-xs">
                  🏠 Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto p-3">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Panel de Productos (izquierda - 2/3) */}
          <div className="xl:col-span-2 space-y-3">
            {/* Buscador con soporte para código de barras */}
            <div className="bg-white rounded-xl shadow-lg p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar por nombre, código o escanear código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full text-base px-3 py-2.5 pr-20 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                    📷 Escanear
                  </span>
                </div>
              </div>
              {searchTerm && filteredProducts.length === 0 && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ No se encontró producto con ese código
                </p>
              )}
            </div>

            {/* Categorías */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? '🔥 TODOS' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[calc(100vh-280px)] overflow-y-auto p-1">
              {filteredProducts.map((product) => {
                const stockQty = product.stock?.quantity || 0
                const inCart = cart.find((item) => item.product.id === product.id)
                const inCartQty = inCart?.quantity || 0

                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={stockQty <= inCartQty}
                    className={`relative bg-gradient-to-br from-white to-slate-50 rounded-xl p-3 shadow-md border-2 transition-all duration-150 text-left ${
                      stockQty <= inCartQty
                        ? 'opacity-50 cursor-not-allowed border-slate-200'
                        : 'border-emerald-200 hover:border-emerald-400 hover:shadow-xl hover:scale-105 cursor-pointer active:scale-95'
                    }`}
                  >
                    {inCartQty > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md animate-pulse">
                        {inCartQty}
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-xs text-slate-900 leading-tight line-clamp-2 min-h-[32px]">
                        {product.name}
                      </h3>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-medium inline-block w-fit">
                          {product.code}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold inline-block w-fit ${
                          stockQty > 10
                            ? 'bg-emerald-100 text-emerald-700'
                            : stockQty > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {stockQty}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200">
                        <p className="text-base font-black text-emerald-600">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="bg-white text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold text-slate-900">
                  No se encontraron productos
                </p>
              </Card>
            )}
          </div>

          {/* Carrito (derecha - 1/3) */}
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl border-2 border-slate-700 rounded-xl p-4 sticky top-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/20">
                  <h2 className="text-xl font-black">🛒 CARRITO</h2>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-semibold transition"
                    >
                      🗑️ Limpiar
                    </button>
                  )}
                </div>

                {/* Items del Carrito */}
                <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🛒</div>
                      <p className="text-slate-400 text-sm">Carrito vacío</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-white/10 rounded-lg p-3 space-y-2 border border-white/10"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-xs line-clamp-1">
                              {item.product.name}
                            </h3>
                            <p className="text-emerald-300 font-bold text-sm">
                              {formatCurrency(item.product.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-400 hover:text-red-300 text-lg font-bold flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-lg flex items-center justify-center transition active:scale-95"
                          >
                            −
                          </button>
                          <div className="flex-1 text-center">
                            <div className="bg-white/20 rounded-lg py-1.5 font-black text-xl">
                              {item.quantity}
                            </div>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-lg flex items-center justify-center transition active:scale-95"
                          >
                            +
                          </button>
                        </div>

                        <div className="pt-1.5 border-t border-white/20 flex justify-between items-center">
                          <span className="text-slate-300 text-xs">Subtotal:</span>
                          <span className="text-base font-black text-white">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                {cart.length > 0 && (
                  <>
                    <div className="pt-3 border-t-2 border-emerald-500 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Items:</span>
                        <span className="text-lg font-bold">
                          {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-emerald-500/20 rounded-lg p-3">
                        <span className="text-lg font-black text-emerald-300">TOTAL:</span>
                        <span className="text-2xl font-black text-white">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleFinalizeSale}
                      disabled={isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-black text-xl shadow-xl hover:shadow-emerald-500/50 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing ? '⏳ PROCESANDO...' : '💰 COBRAR'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="max-w-2xl w-full bg-white shadow-2xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="text-4xl">💰</span>
              Procesar Pago
            </h2>

            <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200">
              <p className="text-slate-600 text-lg mb-2">Total a cobrar:</p>
              <p className="text-5xl font-black text-emerald-600">
                {formatCurrency(total)}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <label className="block">
                <span className="text-slate-700 font-semibold text-lg mb-2 block">
                  Monto recibido:
                </span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-3xl font-bold px-6 py-4 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                  autoFocus
                />
              </label>

              {/* Botones de Montos Rápidos */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setPaymentAmount(amount.toString())}
                    className="py-3 bg-slate-100 hover:bg-emerald-100 rounded-xl font-bold text-lg transition border-2 border-transparent hover:border-emerald-500"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
                <button
                  onClick={() => setPaymentAmount(total.toString())}
                  className="py-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl font-bold text-lg transition border-2 border-emerald-500"
                >
                  EXACTO
                </button>
              </div>

              {/* Vuelto */}
              {change >= 0 && paymentAmount && (
                <div className={`rounded-xl p-6 border-2 ${
                  change > 0
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-emerald-50 border-emerald-300'
                }`}>
                  <p className="text-slate-600 text-lg mb-1">
                    {change > 0 ? 'Vuelto a entregar:' : 'Pago exacto'}
                  </p>
                  <p className={`text-4xl font-black ${
                    change > 0 ? 'text-blue-600' : 'text-emerald-600'
                  }`}>
                    {change > 0 ? formatCurrency(change) : '✓'}
                  </p>
                </div>
              )}

              {change < 0 && paymentAmount && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                  <p className="text-red-600 text-lg font-bold">
                    ⚠️ Monto insuficiente: Faltan {formatCurrency(Math.abs(change))}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPayment(false)
                  setPaymentAmount('')
                }}
                className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPayment}
                disabled={change < 0 || !paymentAmount || isProcessing}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-black text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isProcessing ? '⏳ Procesando...' : '✓ CONFIRMAR PAGO'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

