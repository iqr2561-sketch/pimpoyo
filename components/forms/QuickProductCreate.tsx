'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface QuickProductCreateProps {
  onProductCreated: (product: any) => void
  onCancel: () => void
  companyId: string
}

export function QuickProductCreate({
  onProductCreated,
  onCancel,
  companyId,
}: QuickProductCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    initialStock: '0',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          price: parseFloat(formData.price),
          unit: 'UN',
          initialStock: parseFloat(formData.initialStock) || 0,
        }),
      })

      if (response.ok) {
        const product = await response.json()
        onProductCreated(product)
        setFormData({ code: '', name: '', price: '', initialStock: '0' })
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear producto')
      }
    } catch (error) {
      alert('Error al crear producto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            ⚡ Crear Producto Rápido
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Solo completa los campos básicos. Podrás
              editarlo después con más detalles.
            </p>
          </div>

          <Input
            label="Código del Producto *"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Ej: PROD001"
            required
          />

          <Input
            label="Nombre del Producto *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Arroz 1kg"
            required
          />

          <Input
            label="Precio de Venta *"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Ej: 1500.00"
            required
          />

          <Input
            label="Stock Inicial"
            type="number"
            step="0.01"
            value={formData.initialStock}
            onChange={(e) =>
              setFormData({ ...formData, initialStock: e.target.value })
            }
            placeholder="Ej: 100"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creando...' : '✓ Crear Producto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

