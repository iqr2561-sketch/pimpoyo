'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export interface DocumentItem {
  id?: string
  description: string
  quantity: number
  unitPrice: number
}

interface ItemListProps {
  items: DocumentItem[]
  onChange: (items: DocumentItem[]) => void
}

export function ItemList({ items, onChange }: ItemListProps) {
  const addItem = () => {
    onChange([
      ...items,
      { description: '', quantity: 1, unitPrice: 0 },
    ])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof DocumentItem, value: string | number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const calculateSubtotal = (item: DocumentItem) => {
    return item.quantity * item.unitPrice
  }

  const subtotal = items.reduce((sum, item) => sum + calculateSubtotal(item), 0)
  const tax = subtotal * 0.21 // IVA 21%
  const total = subtotal + tax

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Items del Documento</h3>
        <Button type="button" onClick={addItem} size="sm">
          + Agregar Item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150"
          >
            <div className="md:col-span-5">
              <Input
                placeholder="Descripción del producto o servicio"
                value={item.description}
                align="left"
                onChange={(e) =>
                  updateItem(index, 'description', e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder="Cant."
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder="Precio Unit."
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end">
              <span className="font-semibold text-slate-900 text-lg">
                {formatCurrency(calculateSubtotal(item))}
              </span>
            </div>
            <div className="md:col-span-1 flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                title="Eliminar item"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
          <div className="flex justify-between mb-3 text-slate-700">
            <span className="font-medium">Subtotal:</span>
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-3 text-slate-700">
            <span className="font-medium">IVA (21%):</span>
            <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-900 border-t border-indigo-200 pt-3 mt-3">
            <span>Total:</span>
            <span className="text-indigo-600">{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <input type="hidden" name="subtotal" value={subtotal} />
      <input type="hidden" name="tax" value={tax} />
      <input type="hidden" name="total" value={total} />
    </div>
  )
}


