'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, generateWhatsAppLink, generarMensajeVentaWhatsApp } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Sale {
  id: string
  number: string
  date: string
  subtotal: number
  tax: number
  total: number
  status: string
  paymentMethod?: string
  facturaGenerada?: boolean
  client?: {
    id: string
    name: string
    phone?: string | null
    email?: string | null
  }
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    subtotal: number
    product: {
      id: string
      name: string
      code: string
    }
  }>
}

export default function SaleDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [sale, setSale] = useState<Sale | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    if (params.id) {
      fetchSale()
    }
  }, [params.id])

  const fetchSale = async () => {
    try {
      const response = await fetch(`/api/sales/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSale(data)
      } else {
        router.push('/sales')
      }
    } catch (error) {
      console.error('Error fetching sale:', error)
      router.push('/sales')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsApp = () => {
    if (!sale?.client?.phone) {
      alert('El cliente no tiene número de teléfono registrado')
      return
    }

    const message = generarMensajeVentaWhatsApp({
      numeroVenta: sale.number,
      nombreCliente: sale.client.name,
      nombreEmpresa: 'Mi Empresa', // TODO: obtener de la empresa
      total: sale.total,
      items: sale.items.map(item => ({
        nombre: item.product.name,
        cantidad: item.quantity,
        precio: item.unitPrice,
      })),
    })

    const whatsappLink = generateWhatsAppLink(sale.client.phone, message)
    window.open(whatsappLink, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  if (!sale) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Link href="/sales">
                  <Button variant="outline" size="sm" className="mb-2">
                    ← Volver a Ventas
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">
                  Venta {sale.number}
                </h1>
              </div>
              {sale.client?.phone && (
                <Button
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  📱 Enviar por WhatsApp
                </Button>
              )}
            </div>

            {/* Información del Cliente */}
            {sale.client && (
              <Card className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Cliente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Nombre</p>
                    <p className="text-lg font-semibold text-slate-900">{sale.client.name}</p>
                  </div>
                  {sale.client.phone && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Teléfono</p>
                      <p className="text-lg font-semibold text-slate-900">📱 {sale.client.phone}</p>
                    </div>
                  )}
                  {sale.client.email && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Email</p>
                      <p className="text-lg font-semibold text-slate-900">✉️ {sale.client.email}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Detalles de la Venta */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Fecha</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {formatDate(sale.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Estado</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        sale.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : sale.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {sale.status === 'COMPLETED'
                        ? 'Completada'
                        : sale.status === 'PENDING'
                        ? 'Pendiente'
                        : 'Cancelada'}
                    </span>
                    {!sale.facturaGenerada && sale.status === 'COMPLETED' && (
                      <span className="ml-2 px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                        ⚠️ Sin Facturar
                      </span>
                    )}
                  </div>
                  {sale.paymentMethod && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Método de Pago</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {sale.paymentMethod === 'CASH'
                          ? 'Efectivo'
                          : sale.paymentMethod === 'CARD'
                          ? 'Tarjeta'
                          : sale.paymentMethod}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Productos</h3>
                  <div className="space-y-2">
                    {sale.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{item.product.name}</p>
                          <p className="text-sm text-slate-600">Código: {item.product.code}</p>
                          <p className="text-sm text-slate-600">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-indigo-600">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="border-t-2 border-slate-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(sale.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">IVA (21%):</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(sale.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-indigo-600 pt-2 border-t-2 border-indigo-200">
                    <span>Total:</span>
                    <span>{formatCurrency(sale.total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

