'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export const dynamic = 'force-dynamic'

export default function NewProduct() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    cost: '',
    category: '',
    unit: 'UN',
    initialStock: '0',
    minQuantity: '0',
    maxQuantity: '',
    location: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('📝 Iniciando creación de producto con datos:', formData)

    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        category: formData.category || null,
        unit: formData.unit,
        initialStock: parseFloat(formData.initialStock) || 0,
        minQuantity: parseFloat(formData.minQuantity) || 0,
        maxQuantity: formData.maxQuantity ? parseFloat(formData.maxQuantity) : null,
        location: formData.location || null,
      }

      console.log('📤 Enviando payload:', payload)

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('📩 Respuesta recibida - Status:', response.status)

      if (response.ok) {
        const product = await response.json()
        console.log('✅ Producto creado exitosamente:', product)
        alert('✅ Producto creado exitosamente')
        router.push('/products')
      } else {
        const error = await response.json()
        console.error('❌ Error del servidor:', error)
        alert(`❌ Error: ${error.error || 'Error al crear producto'}${error.details ? '\n\nDetalles: ' + error.details : ''}`)
      }
    } catch (error) {
      console.error('❌ Error en la solicitud:', error)
      alert(`❌ Error al conectar con el servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Nuevo Producto</h2>
              <p className="text-slate-600">
                Agrega un nuevo producto al inventario
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Código *"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Nombre *"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Descripción"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Input
                    label="Precio *"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Costo"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1">
                      Unidad
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 cursor-pointer"
                    >
                      <option value="UN">Unidad</option>
                      <option value="KG">Kilogramo</option>
                      <option value="L">Litro</option>
                      <option value="M">Metro</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <Input
                    label="Categoría"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
              </Card>

              <Card title="Stock Inicial">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Stock Inicial"
                    type="number"
                    step="0.01"
                    value={formData.initialStock}
                    onChange={(e) =>
                      setFormData({ ...formData, initialStock: e.target.value })
                    }
                  />
                  <Input
                    label="Stock Mínimo"
                    type="number"
                    step="0.01"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minQuantity: e.target.value })
                    }
                  />
                  <Input
                    label="Stock Máximo"
                    type="number"
                    step="0.01"
                    value={formData.maxQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, maxQuantity: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Ubicación en Almacén"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

