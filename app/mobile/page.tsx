'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { formatCurrency, generateWhatsAppLink, generarMensajeVentaWhatsApp } from '@/lib/utils'
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

interface Client {
  id: string
  name: string
  phone?: string | null
  email?: string | null
}

export default function MobilePage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [whatsAppPhone, setWhatsAppPhone] = useState('')
  const [lastSaleNumber, setLastSaleNumber] = useState<string | null>(null)
  const [lastSaleItems, setLastSaleItems] = useState<Array<{ product: Product; quantity: number }>>([])
  const [lastSaleTotal, setLastSaleTotal] = useState(0)
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null)
  const [touchStartX, setTouchStartX] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    // Cargar productos siempre, sin requerir sesión
    fetchProducts()
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

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
          clientId: selectedClient?.id || null,
          paymentMethod: 'CASH',
        }),
      })

      if (response.ok) {
        const saleData = await response.json()
        setLastSaleNumber(saleData.number)
        // Guardar items y total antes de limpiar el carrito
        setLastSaleItems([...cart])
        setLastSaleTotal(total)
        toast('Venta realizada exitosamente', 'success')
        setCart([])
        fetchProducts() // Actualizar stock
        setShowCart(false)
        // Mostrar modal de WhatsApp después de un breve delay
        setTimeout(() => {
          setShowWhatsAppModal(true)
          if (selectedClient?.phone) {
            setWhatsAppPhone(selectedClient.phone)
          }
        }, 300)
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

  const handleSendWhatsApp = () => {
    const phoneToUse = selectedClient?.phone || whatsAppPhone
    
    if (!phoneToUse) {
      toast('Por favor ingresa un número de teléfono', 'error')
      return
    }

    if (!lastSaleNumber) {
      toast('Error: No se encontró el número de operación', 'error')
      return
    }

    if (lastSaleItems.length === 0) {
      toast('Error: No se encontraron items para el mensaje', 'error')
      return
    }

    const message = generarMensajeVentaWhatsApp({
      numeroVenta: lastSaleNumber,
      nombreCliente: selectedClient?.name,
      nombreEmpresa: 'Mi Empresa', // TODO: obtener de la empresa
      total: lastSaleTotal,
      items: lastSaleItems.map(item => ({
        nombre: item.product.name,
        cantidad: item.quantity,
        precio: item.product.price,
      })),
    })

    const whatsappLink = generateWhatsAppLink(phoneToUse, message)
    window.open(whatsappLink, '_blank')
    setShowWhatsAppModal(false)
    setWhatsAppPhone('')
    setLastSaleNumber(null)
    setLastSaleItems([])
    setLastSaleTotal(0)
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

  // Sin verificación de sesión - acceso libre

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg sticky top-0 z-10">
        <div className="p-4">
          {/* Banner Modo Demo */}
          <div className="mb-3 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <span className="text-lg">🧪</span>
            <span>VERSIÓN DEMOSTRACIÓN - Modo Prueba</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">Venta Rápida</h1>
              <p className="text-xs text-indigo-100">Modo móvil optimizado</p>
            </div>
            <Link href="/">
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                ← Inicio
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="🔍 Buscar producto por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-md flex-1"
            />
            <Button
              onClick={() => setShowClientModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-md"
              size="sm"
            >
              👤 {selectedClient ? selectedClient.name.substring(0, 10) + '...' : 'Cliente'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Texto sutil de desarrollo */}
        <div className="text-center mb-3">
          <a
            href="https://wa.me/5492245506078"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-slate-500 transition-colors"
          >
            bajo desarrollo por{' '}
            <span className="underline decoration-dotted">surconexion</span>
          </a>
        </div>
        
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
              {cart.map((item) => {
                const handleTouchStart = (e: React.TouchEvent) => {
                  setTouchStartX({ ...touchStartX, [item.product.id]: e.targetTouches[0].clientX })
                }

                const handleTouchMove = (e: React.TouchEvent) => {
                  const startX = touchStartX[item.product.id]
                  if (!startX) return
                  
                  const currentX = e.targetTouches[0].clientX
                  const distance = startX - currentX
                  
                  if (distance > 50) {
                    setSwipedItemId(item.product.id)
                  } else if (distance < -50) {
                    setSwipedItemId(null)
                  }
                }

                const handleTouchEnd = () => {
                  if (swipedItemId === item.product.id) {
                    // Si está deslizado, mantener visible el botón de eliminar
                    // El usuario puede hacer click para eliminar
                  } else {
                    setSwipedItemId(null)
                  }
                  setTouchStartX({ ...touchStartX, [item.product.id]: 0 })
                }

                return (
                  <div
                    key={item.product.id}
                    className="relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className={`flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-200 shadow-sm transition-transform duration-300 ${
                        swipedItemId === item.product.id ? '-translate-x-20' : 'translate-x-0'
                      }`}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromCart(item.product.id)
                          }}
                          className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center shadow-sm active:scale-95 transition-all opacity-50 hover:opacity-100"
                          title="Eliminar"
                        >
                          <span className="text-[10px] font-bold leading-none">✕</span>
                        </button>
                      </div>
                    </div>
                    {/* Botón de eliminar al deslizar */}
                    <div
                      className={`absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center text-white font-bold transition-opacity duration-300 rounded-r-lg ${
                        swipedItemId === item.product.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                      onClick={() => {
                        removeFromCart(item.product.id)
                        setSwipedItemId(null)
                      }}
                    >
                      <span className="text-xs">Eliminar</span>
                    </div>
                  </div>
                )
              })}
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
                onClick={handleSale}
                disabled={isProcessing}
              >
                {isProcessing ? '⏳...' : '✓ Finalizar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Selección de Clientes */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Seleccionar Cliente</h2>
                <button
                  onClick={() => {
                    setShowClientModal(false)
                    setClientSearch('')
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  ✕
                </button>
              </div>
              <Input
                placeholder="🔍 Buscar cliente..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-4">
              <button
                onClick={() => {
                  setSelectedClient(null)
                  setShowClientModal(false)
                  setClientSearch('')
                }}
                className="w-full p-4 mb-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-left border-2 border-slate-300"
              >
                <div className="font-bold text-slate-900">Sin Cliente</div>
                <div className="text-sm text-slate-600">Venta sin asignar</div>
              </button>
              {clients
                .filter(client =>
                  client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                  client.phone?.includes(clientSearch)
                )
                .map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client)
                      setShowClientModal(false)
                      setClientSearch('')
                    }}
                    className={`w-full p-4 mb-2 rounded-lg text-left border-2 transition-all ${
                      selectedClient?.id === client.id
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{client.name}</div>
                    {client.phone && (
                      <div className="text-sm text-slate-600">📱 {client.phone}</div>
                    )}
                    {client.email && (
                      <div className="text-sm text-slate-600">✉️ {client.email}</div>
                    )}
                  </button>
                ))}
              {clients.filter(client =>
                client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                client.phone?.includes(clientSearch)
              ).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No se encontraron clientes
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de WhatsApp */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              📱 Enviar comprobante por WhatsApp
            </h2>
            <p className="text-slate-600 mb-4">
              ¿Deseas enviar una copia del comprobante de venta por WhatsApp?
            </p>
            {selectedClient && selectedClient.phone ? (
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-sm text-slate-600 mb-1">Cliente seleccionado:</div>
                <div className="font-bold text-slate-900">{selectedClient.name}</div>
                <div className="text-sm text-slate-600">📱 {selectedClient.phone}</div>
              </div>
            ) : (
              <div className="mb-4">
                <Input
                  label="Número de teléfono"
                  placeholder="+54 9 11 1234-5678"
                  value={whatsAppPhone}
                  onChange={(e) => setWhatsAppPhone(e.target.value)}
                  type="tel"
                />
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowWhatsAppModal(false)
                  setWhatsAppPhone('')
                  setLastSaleNumber(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={handleSendWhatsApp}
              >
                📱 Enviar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

