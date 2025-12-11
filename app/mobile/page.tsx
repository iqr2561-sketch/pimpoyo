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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Venta Rápida Móvil</h1>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                ← Volver
              </Button>
            </Link>
          </div>
          <Input
            placeholder="Buscar producto por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <Card key={product.id} className="p-3">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">Cód: {product.code}</p>
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      {formatCurrency(product.price)}
                    </p>
                    <p
                      className={`text-xs ${
                        stockQty > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      Stock: {stockQty}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => addToCart(product)}
                    disabled={!canAdd}
                  >
                    {inCart ? `En carrito (${inCart.quantity})` : 'Agregar'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Carrito Flotante */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Carrito ({cart.length} items)</h3>
            <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.product.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>IVA:</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleSale}
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

