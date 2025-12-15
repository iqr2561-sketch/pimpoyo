'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Document {
  id: string
  type: string
  number: string
  date: Date | string
  total: number
  status: string
  client: {
    name: string
  }
}

interface Stats {
  sales: { total: number; count: number }
  invoices: { total: number; count: number }
  documents: { total: number }
  lowStock: number
  lowStockItems: Array<{ product: { name: string }; quantity: number; minQuantity: number }>
  topProducts: Array<{ product: { name: string }; quantity: number; total: number }>
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  // const router = useRouter() // No usado en modo demo
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  const [unfacturedSales, setUnfacturedSales] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      const [docsRes, statsRes, salesRes] = await Promise.all([
        fetch('/api/documents'),
        fetch(`/api/stats?period=${period}`),
        fetch('/api/sales'),
      ])

      if (docsRes.ok) {
        const docs = await docsRes.json()
        setDocuments(docs.slice(0, 6)) // Últimos 6 documentos
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json()
        // Contar ventas completadas sin facturar
        const unfactured = salesData.filter(
          (sale: any) => sale.status === 'COMPLETED' && !sale.facturaGenerada
        ).length
        setUnfacturedSales(unfactured)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    // Cargar datos siempre (modo demo)
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  // Modo demo - no verificar autenticación
  // if (status === 'unauthenticated') {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-white mb-2">Panel de Control</h1>
              <p className="text-slate-300 text-lg">
                Accesos rápidos y resumen de tu negocio
              </p>
            </div>

            {/* Recordatorio de Datos Fiscales */}
            <div className="mb-6 p-4 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-200 mb-1">Datos Fiscales Pendientes</h3>
                  <p className="text-yellow-100 text-sm">
                    Completa tus datos fiscales para poder generar facturas electrónicas. 
                    <Link href="/settings" className="underline ml-1">Configurar ahora →</Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Notificación de Ventas Sin Facturar */}
            {unfacturedSales > 0 && (
              <div className="mb-6 p-4 bg-orange-500/20 border-2 border-orange-500/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-200 mb-1">
                      {unfacturedSales} {unfacturedSales === 1 ? 'venta pendiente' : 'ventas pendientes'} de facturar
                    </h3>
                    <p className="text-orange-100 text-sm mb-2">
                      Tienes ventas completadas que aún no han sido facturadas.
                    </p>
                    <Link href="/sales">
                      <Button variant="secondary" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Ver Ventas Pendientes →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Acceso Rápido - Tipo Imagen del Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* TPV Profesional */}
              <Link href="/tpv">
                <div className="group relative bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-emerald-300/50 overflow-hidden h-48 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-emerald-100 mb-2 uppercase tracking-wider">
                      Venta rápida
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight break-words">
                      Carrito táctil
                    </h3>
                    <p className="text-emerald-50 text-xs font-medium mt-auto line-clamp-2">
                      Busca, suma y cobra en segundos.
                    </p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-white/10 text-9xl">💳</div>
                </div>
              </Link>

              {/* Facturar/Remito */}
              <Link href="/documents/new">
                <div className="group relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-blue-300/50 overflow-hidden h-48 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-blue-100 mb-2 uppercase tracking-wider">
                      Documentos
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight break-words">
                      Factura / Remito
                    </h3>
                    <p className="text-blue-50 text-xs font-medium mt-auto line-clamp-2">
                      IVA, notas y PDF listos.
                    </p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-white/10 text-9xl">📄</div>
                </div>
              </Link>

              {/* Clientes */}
              <Link href="/clients">
                <div className="group relative bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-cyan-300/50 overflow-hidden h-48 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-cyan-100 mb-2 uppercase tracking-wider">
                      Clientes
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight break-words">
                      Ctas. Corrientes
                    </h3>
                    <p className="text-cyan-50 text-xs font-medium mt-auto line-clamp-2">
                      Alta rápida y búsqueda.
                    </p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-white/10 text-9xl">👥</div>
                </div>
              </Link>

              {/* Configuración */}
              <Link href="/settings">
                <div className="group relative bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-purple-300/50 overflow-hidden h-48 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-purple-100 mb-2 uppercase tracking-wider">
                      Sistema
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight break-words">
                      Configuración
                    </h3>
                    <p className="text-purple-50 text-xs font-medium mt-auto line-clamp-2">
                      Datos fiscales y ajustes.
                    </p>
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-white/10 text-9xl">⚙️</div>
                </div>
              </Link>
            </div>

            {/* Header de Estadísticas */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Estadísticas del Negocio</h2>
              <div className="flex gap-2">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 border border-slate-600 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="day">Hoy</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mes</option>
                  <option value="year">Este Año</option>
                </select>
              </div>
            </div>

            {/* Estadísticas */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard
                  title="Ventas Totales"
                  value={formatCurrency(stats.sales.total)}
                  subtitle={`${stats.sales.count} ventas`}
                />
                <StatsCard
                  title="Facturas Pagadas"
                  value={formatCurrency(stats.invoices.total)}
                  subtitle={`${stats.invoices.count} facturas`}
                />
                <StatsCard
                  title="Documentos"
                  value={stats.documents.total}
                  subtitle="Total generados"
                />
                <StatsCard
                  title="Stock Bajo"
                  value={stats.lowStock}
                  subtitle="Productos"
                  trend={
                    stats.lowStock > 0
                      ? { value: stats.lowStock, isPositive: false }
                      : undefined
                  }
                />
              </div>
            )}

            {/* Stock Bajo y Top Productos */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Stock Bajo */}
                {stats.lowStockItems.length > 0 && (
                  <Card title="Productos con Stock Bajo">
                    <div className="space-y-2">
                      {stats.lowStockItems.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2 bg-red-50 rounded"
                        >
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-red-600 font-bold">
                            {item.quantity} / {item.minQuantity} min
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link href="/products">
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Ver Todos los Productos
                      </Button>
                    </Link>
                  </Card>
                )}

                {/* Top Productos */}
                {stats.topProducts.length > 0 && (
                  <Card title="Productos Más Vendidos">
                    <div className="space-y-2">
                      {stats.topProducts.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <span className="font-medium">{item.product.name}</span>
                            <p className="text-sm text-gray-500">
                              {item.quantity} unidades
                            </p>
                          </div>
                          <span className="font-bold">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Documentos Recientes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Documentos Recientes</h3>
                <Link href="/documents">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </div>

              {documents.length === 0 ? (
                <Card>
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No hay documentos aún</p>
                    <Link href="/documents/new">
                      <Button>Crear Primer Documento</Button>
                    </Link>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      type={doc.type}
                      number={doc.number}
                      date={doc.date}
                      clientName={doc.client.name}
                      total={doc.total}
                      status={doc.status}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
