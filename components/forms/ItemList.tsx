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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button type="button" onClick={addItem} size="sm">
          Agregar Item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg"
          >
            <div className="md:col-span-5">
              <Input
                placeholder="Descripción"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, 'description', e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder="Cantidad"
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
            <div className="md:col-span-2 flex items-center">
              <span className="font-medium">
                {formatCurrency(calculateSubtotal(item))}
              </span>
            </div>
            <div className="md:col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
              >
                ✕
              </Button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">IVA (21%):</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <input type="hidden" name="subtotal" value={subtotal} />
      <input type="hidden" name="tax" value={tax} />
      <input type="hidden" name="total" value={total} />
    </div>
  )
}


