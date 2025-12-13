'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Product {
  id: string
  code: string
  name: string
  description?: string
  price: number
  cost?: number
  category?: string
  unit: string
  stock?: {
    quantity: number
    minQuantity: number
  }
}

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || isLoading) {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
              <Link href="/products/new">
                <Button>Nuevo Producto</Button>
              </Link>
            </div>

            <div className="mb-4">
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredProducts.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No hay productos</p>
                  <Link href="/products/new">
                    <Button>Crear Primer Producto</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const stockQty = product.stock?.quantity || 0
                  const minQty = product.stock?.minQuantity || 0
                  const isLowStock = stockQty <= minQty

                  return (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-500">Código: {product.code}</p>
                          {product.category && (
                            <p className="text-xs text-gray-400">{product.category}</p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            isLowStock
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {stockQty} {product.unit}
                        </span>
                      </div>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Precio</p>
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                        {product.cost && (
                          <div>
                            <p className="text-sm text-gray-500">Costo</p>
                            <p className="text-sm text-gray-700">
                              {formatCurrency(product.cost)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/products/${product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/stock/${product.id}`} className="flex-1">
                          <Button variant="secondary" size="sm" className="w-full">
                            Stock
                          </Button>
                        </Link>
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

