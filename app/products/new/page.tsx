'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export const dynamic = 'force-dynamic'

interface Category {
  id: string
  name: string
}

export default function NewProduct() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    cost: '',
    margin: '',
    categoryId: '',
    imageUrl: '',
    unit: 'UN',
    initialStock: '0',
    minQuantity: '0',
    maxQuantity: '',
    location: '',
  })

  // Cargar categorías
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Calcular precio por margen
  const calculatePriceByMargin = (cost: string, margin: string) => {
    const costNum = parseFloat(cost)
    const marginNum = parseFloat(margin)
    
    if (!costNum || !marginNum || costNum <= 0 || marginNum < 0) return ''
    
    const price = costNum * (1 + marginNum / 100)
    return price.toFixed(2)
  }

  // Calcular margen por precio
  const calculateMarginByPrice = (cost: string, price: string) => {
    const costNum = parseFloat(cost)
    const priceNum = parseFloat(price)
    
    if (!costNum || !priceNum || costNum <= 0 || priceNum < costNum) return ''
    
    const margin = ((priceNum - costNum) / costNum) * 100
    return margin.toFixed(2)
  }

  const handleCostChange = (value: string) => {
    setFormData({ ...formData, cost: value })
    
    // Si hay margen y costo nuevo, recalcular precio
    if (formData.margin && value) {
      const newPrice = calculatePriceByMargin(value, formData.margin)
      if (newPrice) {
        setFormData(prev => ({ ...prev, price: newPrice }))
      }
    }
  }

  const handleMarginChange = (value: string) => {
    setFormData({ ...formData, margin: value })
    
    // Si hay costo y margen nuevo, recalcular precio
    if (formData.cost && value) {
      const newPrice = calculatePriceByMargin(formData.cost, value)
      if (newPrice) {
        setFormData(prev => ({ ...prev, price: newPrice }))
      }
    }
  }

  const handlePriceChange = (value: string) => {
    setFormData({ ...formData, price: value })
    
    // Si hay costo y precio nuevo, recalcular margen
    if (formData.cost && value) {
      const newMargin = calculateMarginByPrice(formData.cost, value)
      if (newMargin) {
        setFormData(prev => ({ ...prev, margin: newMargin }))
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImagePreview(base64)
        setFormData({ ...formData, imageUrl: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

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
        margin: formData.margin ? parseFloat(formData.margin) : null,
        categoryId: formData.categoryId || null,
        imageUrl: formData.imageUrl || null,
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
                    label="Precio de Venta *"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                  />
                  <Input
                    label="Costo"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleCostChange(e.target.value)}
                  />
                  <Input
                    label="Margen (%)"
                    type="number"
                    step="0.1"
                    value={formData.margin}
                    onChange={(e) => handleMarginChange(e.target.value)}
                    placeholder="Ej: 30 = 30%"
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Cómo funciona:</strong> Completa Costo y Margen para calcular Precio, o completa Costo y Precio para calcular el Margen automáticamente.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Seleccionar Categoría --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      <a href="/products/categories" className="text-indigo-600 hover:underline">
                        + Crear nueva categoría
                      </a>
                    </p>
                  </div>
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
              </Card>

              {/* Imagen del Producto */}
              <Card title="📸 Imagen del Producto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      Subir Imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF (máx 5MB)</p>
                  </div>
                  {imagePreview && (
                    <div className="flex items-center justify-center">
                      <div className="rounded-lg border-2 border-indigo-200 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          className="h-40 w-40 object-cover"
                        />
                      </div>
                    </div>
                  )}
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

