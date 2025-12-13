'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Sale {
  id: string
  number: string
  date: string
  total: number
  status: string
  paymentMethod?: string
  client?: {
    name: string
  }
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

export default function SalesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchSales()
    }
  }, [status, router, filter])

  const fetchSales = async () => {
    try {
      const url = filter === 'all' ? '/api/sales' : `/api/sales?status=${filter}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setSales(data)
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-700'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completada'
      case 'PENDING':
        return 'Pendiente'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Ventas</h1>
                <p className="text-slate-600">Historial completo de ventas</p>
              </div>
              <Link href="/sales/quick">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  + Nueva Venta
                </button>
              </Link>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex gap-2">
              {['all', 'COMPLETED', 'PENDING', 'CANCELLED'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === filterOption
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filterOption === 'all' ? 'Todas' : getStatusText(filterOption)}
                </button>
              ))}
            </div>

            {/* Lista de Ventas */}
            {sales.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay ventas registradas
                </h3>
                <p className="text-slate-600 mb-6">
                  Comienza a registrar tus ventas para verlas aquí
                </p>
                <Link href="/sales/quick">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold">
                    Crear Primera Venta
                  </button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {sales.map((sale) => (
                  <Card
                    key={sale.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {sale.number}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              sale.status
                            )}`}
                          >
                            {getStatusText(sale.status)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>
                            <span className="font-medium">Cliente:</span>{' '}
                            {sale.client?.name || 'Venta directa'}
                          </p>
                          <p>
                            <span className="font-medium">Fecha:</span>{' '}
                            {formatDate(sale.date)}
                          </p>
                          <p>
                            <span className="font-medium">Items:</span>{' '}
                            {sale.items.length} producto(s)
                          </p>
                          {sale.paymentMethod && (
                            <p>
                              <span className="font-medium">Pago:</span>{' '}
                              {sale.paymentMethod === 'CASH'
                                ? 'Efectivo'
                                : sale.paymentMethod === 'CARD'
                                ? 'Tarjeta'
                                : sale.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">
                          {formatCurrency(sale.total)}
                        </div>
                        <Link href={`/sales/${sale.id}`}>
                          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                            Ver Detalle
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Resumen */}
            {sales.length > 0 && (
              <Card className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Ventas</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {sales.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Completadas</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {sales.filter((s) => s.status === 'COMPLETED').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Ingresos</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(
                        sales
                          .filter((s) => s.status === 'COMPLETED')
                          .reduce((sum, s) => sum + s.total, 0)
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

