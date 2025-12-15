'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface StockItem {
  id: string
  quantity: number
  minQuantity: number
  product: {
    id: string
    name: string
    code: string
    price: number
  }
}

export default function StockPage() {
  const { data: session, status } = useSession()
  const [stock, setStock] = useState<StockItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low'>('all')

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    fetchStock()
  }, [filter])

  const fetchStock = async () => {
    try {
      const url = filter === 'low' ? '/api/stock?lowStock=true' : '/api/stock'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setStock(data)
      }
    } catch (error) {
      console.error('Error fetching stock:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Stock</h1>
                <p className="text-slate-600">Gestión de inventario</p>
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex gap-2">
              {['all', 'low'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as 'all' | 'low')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === filterOption
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filterOption === 'all' ? 'Todo el Stock' : 'Stock Bajo'}
                </button>
              ))}
            </div>

            {/* Lista de Stock */}
            {stock.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay productos en stock
                </h3>
                <p className="text-slate-600">
                  Agrega productos para verlos aquí
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stock.map((item) => {
                  const isLowStock = item.quantity <= item.minQuantity
                  return (
                    <Card
                      key={item.id}
                      className={`p-6 ${
                        isLowStock
                          ? 'border-2 border-red-300 bg-red-50'
                          : 'border border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-slate-600">Código: {item.product.code}</p>
                        </div>
                        {isLowStock && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            ⚠️ BAJO
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Stock Actual:</span>
                          <span
                            className={`font-bold ${
                              isLowStock ? 'text-red-600' : 'text-slate-900'
                            }`}
                          >
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Stock Mínimo:</span>
                          <span className="font-semibold text-slate-700">
                            {item.minQuantity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Precio:</span>
                          <span className="font-bold text-indigo-600">
                            {formatCurrency(item.product.price)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

