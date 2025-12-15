'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ClientSelector } from '@/components/forms/ClientSelector'
import { DocumentForm } from '@/components/forms/DocumentForm'
import { formatCurrency } from '@/lib/utils'
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

export default function QuickSalePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([])
  const [clientId, setClientId] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'venta' | 'documento' | 'clientes'>('venta')
  const [clients, setClients] = useState<any[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [clientForm, setClientForm] = useState({
    name: '',
    cuit: '',
    email: '',
    phone: '',
  })
  const [isSavingClient, setIsSavingClient] = useState(false)
  const [clientMessage, setClientMessage] = useState('')

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    // Cargar datos siempre (modo demo)
    fetchProducts()
    fetchClients()
  }, [status, router])

  useEffect(() => {
    if (activeTab === 'clientes') {
      fetchClients()
    }
  }, [activeTab, clientSearch])

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
    const stockQty = product.stock?.quantity || 0

    if (existing) {
      if (existing.quantity + 1 > stockQty) {
        alert('Stock insuficiente')
        return
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      if (stockQty < 1) {
        alert('Stock insuficiente')
        return
      }
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
    const item = cart.find((i) => i.product.id === productId)
    if (item && item.product.stock && quantity > item.product.stock.quantity) {
      alert('Stock insuficiente')
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
        setSelectedClient(null)
        fetchProducts()
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

  const fetchClients = async () => {
    try {
      const query = clientSearch ? `?search=${encodeURIComponent(clientSearch)}` : ''
      const response = await fetch(`/api/clients${query}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleCreateClient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!clientForm.name) {
      setClientMessage('El nombre es requerido')
      return
    }
    setIsSavingClient(true)
    setClientMessage('')
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm),
      })
      if (!response.ok) {
        const data = await response.json()
        setClientMessage(data.error || 'Error al crear cliente')
      } else {
        setClientMessage('Cliente creado')
        setClientForm({ name: '', cuit: '', email: '', phone: '' })
        fetchClients()
      }
    } catch (error) {
      setClientMessage('Error al crear cliente')
    } finally {
      setIsSavingClient(false)
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

  // Modo demo - no verificar autenticación
  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div>Cargando...</div>
  //     </div>
  //   )
  // }

  // if (status === 'unauthenticated') {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -left-16 -top-16 w-96 h-96 bg-blue-600 opacity-30 blur-3xl animate-pulse" />
              <div className="absolute right-0 top-0 w-80 h-80 bg-purple-600 opacity-25 blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-500 opacity-20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Ventas rápidas + Facturación + Remitos
                  </p>
                  <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                    Panel móvil y escritorio para cobrar, facturar y remitir en segundos.
                  </h1>
                  <p className="text-slate-200/80">
                    Atajos claros, degradados y brillos modernos. Diseñado para mostrador y trabajo en campo: ventas rápidas, documentos listos y clientes al día.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" asChild>
                      <Link href="/mobile">Modo móvil express</Link>
                    </Button>
                    <Button variant="ghost" className="border border-white/20 hover:border-white/40" asChild>
                      <Link href="/documents/new">Crear factura/remito</Link>
                    </Button>
                    <Button variant="ghost" className="border border-white/20 hover:border-white/40" asChild>
                      <Link href="/dashboard">Panel escritorio</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/10 border-white/20 text-white">
                    <p className="text-sm text-slate-200/80">Venta rápida</p>
                    <p className="text-2xl font-semibold mt-1">Carrito táctil</p>
                    <p className="text-xs text-slate-200/70 mt-1">Busca, suma y cobra en segundos.</p>
                  </Card>
                  <Card className="bg-white/10 border-white/20 text-white">
                    <p className="text-sm text-slate-200/80">Documentos</p>
                    <p className="text-2xl font-semibold mt-1">Factura / Remito</p>
                    <p className="text-xs text-slate-200/70 mt-1">IVA, notas y PDF listos.</p>
                  </Card>
                  <Card className="bg-white/10 border-white/20 text-white">
                    <p className="text-sm text-slate-200/80">Clientes</p>
                    <p className="text-2xl font-semibold mt-1">Ctas. Corrientes</p>
                    <p className="text-xs text-slate-200/70 mt-1">Alta rápida y búsqueda.</p>
                  </Card>
                  <Card className="bg-white/10 border-white/20 text-white">
                    <p className="text-sm text-slate-200/80">Accesos</p>
                    <p className="text-2xl font-semibold mt-1">Atajos</p>
                    <p className="text-xs text-slate-200/70 mt-1">Documentos y panel.</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            {/* Tabs */}
            <div className="mt-6 mb-4 inline-flex bg-white/5 border border-white/10 rounded-full p-1">
              {[
                { key: 'venta', label: 'Venta rápida' },
                { key: 'documento', label: 'Facturar / Remito' },
                { key: 'clientes', label: 'Clientes y cuentas' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === tab.key
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'venta' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel de Productos */}
                <div className="lg:col-span-2">
                  <Card className="bg-white text-slate-900 shadow-2xl shadow-blue-900/30">
                    <div className="mb-4 flex flex-col gap-3">
                      <Input
                        placeholder="Buscar producto por nombre o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {session?.user?.companyId && (
                        <ClientSelector
                          value={clientId}
                          onChange={(id, client) => {
                            setClientId(id)
                            setSelectedClient(client)
                          }}
                          companyId={session.user.companyId}
                        />
                      )}
                      {selectedClient && (
                        <div className="text-xs text-emerald-600 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          Cliente seleccionado: {selectedClient.name}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto">
                      {filteredProducts.map((product) => {
                        const stockQty = product.stock?.quantity || 0
                        const inCart = cart.find((item) => item.product.id === product.id)
                        const canAdd = stockQty > 0

                        return (
                          <div
                            key={product.id}
                            className="border border-slate-200 rounded-xl p-3 bg-gradient-to-br from-white to-slate-50 hover:shadow-lg transition"
                          >
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-sm text-slate-900">{product.name}</h3>
                              <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                {product.code}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">Stock: {stockQty}</p>
                            <p className="text-lg font-bold text-blue-600 mb-2">
                              {formatCurrency(product.price)}
                            </p>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => addToCart(product)}
                              disabled={!canAdd}
                            >
                              {inCart ? `Agregar (${inCart.quantity})` : 'Agregar'}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>

                {/* Panel del Carrito */}
                <div className="lg:col-span-1">
                  <Card className="bg-white text-slate-900 shadow-2xl shadow-blue-900/30" title="Carrito de Venta">
                    {cart.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">El carrito está vacío</p>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                          {cart.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex items-center justify-between bg-slate-50 p-2 rounded"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.product.name}</p>
                                <p className="text-xs text-slate-500">
                                  {formatCurrency(item.product.price)} x {item.quantity}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center hover:bg-slate-300"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center hover:bg-slate-300"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>IVA (21%):</span>
                            <span>{formatCurrency(tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                          <Button className="w-full mt-4" onClick={handleSale} disabled={isProcessing}>
                            {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
                          </Button>
                        </div>
                      </>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'documento' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-white text-slate-900 shadow-2xl shadow-purple-900/30">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">Crear Factura, Remito o Presupuesto</h3>
                      <p className="text-sm text-slate-500">
                        Usa el formulario completo con items, IVA y notas. Perfecto para escritorio.
                      </p>
                    </div>
                    <DocumentForm />
                  </Card>
                </div>
                <div className="space-y-4">
                  <Card className="bg-white/10 text-white border-white/10">
                    <p className="text-sm text-slate-200/80">Atajos</p>
                    <div className="flex flex-col gap-3 mt-3">
                      <Button variant="secondary" asChild>
                        <Link href="/documents/new">Nueva factura/remito</Link>
                      </Button>
                      <Button variant="ghost" className="border border-white/20 hover:border-white/40" asChild>
                        <Link href="/documents">Ver documentos</Link>
                      </Button>
                      <Button variant="ghost" className="border border-white/20 hover:border-white/40" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    </div>
                  </Card>
                  <Card className="bg-white/10 text-white border-white/10">
                    <p className="text-sm text-slate-200/80 mb-2">Tips rápidos</p>
                    <ul className="text-xs text-slate-200/70 space-y-2">
                      <li>• Usa el cliente habitual para que el PDF salga listo.</li>
                      <li>• Alterna tipo: Factura, Remito o Presupuesto.</li>
                      <li>• Los items calculan IVA 21% automáticamente.</li>
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'clientes' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Buscar cliente por nombre o CUIT..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                    />
                    <Button variant="secondary" onClick={fetchClients}>
                      Buscar
                    </Button>
                  </div>
                  <Card className="bg-white text-slate-900 shadow-2xl shadow-emerald-900/30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Clientes y cuentas corrientes</h3>
                      <Link href="/clients" className="text-sm text-blue-600 hover:underline">
                        Ver más
                      </Link>
                    </div>
                    {clients.length === 0 ? (
                      <p className="text-slate-500">Sin resultados todavía.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {clients.map((client) => (
                          <div
                            key={client.id}
                            className="rounded-xl border border-slate-200 p-3 bg-gradient-to-br from-white to-slate-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-slate-900">{client.name}</p>
                                <p className="text-xs text-slate-500">CUIT: {client.cuit || '—'}</p>
                                <p className="text-xs text-slate-500">{client.email || 'Sin email'}</p>
                              </div>
                              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                Cuenta corriente
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-2">
                              Saldo: <span className="font-semibold text-slate-900">En seguimiento</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
                <Card className="bg-white text-slate-900 shadow-2xl shadow-emerald-900/30">
                  <h3 className="text-lg font-semibold mb-2">Alta rápida de cliente</h3>
                  <form className="space-y-3" onSubmit={handleCreateClient}>
                    <Input
                      label="Nombre"
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      required
                    />
                    <Input
                      label="CUIT"
                      value={clientForm.cuit}
                      onChange={(e) => setClientForm({ ...clientForm, cuit: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    />
                    <Input
                      label="Teléfono"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    />
                    {clientMessage && (
                      <p className="text-xs text-emerald-600">{clientMessage}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isSavingClient}>
                      {isSavingClient ? 'Guardando...' : 'Crear cliente'}
                    </Button>
                  </form>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

