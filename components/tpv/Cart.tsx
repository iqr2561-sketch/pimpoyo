import React from 'react'
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react'
import { Button } from '../ui/Button'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col bg-slate-900/30 border-l border-slate-800/50">
        <div className="p-3 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShoppingCart className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-white">Carrito</h2>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-slate-800/30 flex items-center justify-center mb-3">
            <ShoppingCart className="w-8 h-8 text-slate-600/50" />
          </div>
          <p className="text-slate-500 text-xs">Carrito vacío</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/30 border-l border-slate-800/50">
      <div className="p-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Carrito</h2>
          </div>
          <button
            onClick={onClearCart}
            className="px-2 py-1 text-[10px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-slate-100 truncate leading-tight">
                  {item.name}
                </h3>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  {formatPrice(item.price)}
                </p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="ml-1.5 p-0.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                aria-label={`Eliminar ${item.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center bg-slate-700/40 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-medium text-slate-200 bg-slate-700/20 rounded py-0.5">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center bg-slate-700/40 hover:bg-emerald-500/15 text-slate-400 hover:text-emerald-400 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Subtotal:</p>
                <p className="text-xs font-medium text-slate-200">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800/50 bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Items:</span>
          <span className="text-slate-300 font-medium">{totalItems}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">TOTAL:</span>
          <span className="text-lg font-bold text-emerald-400">
            {formatPrice(total)}
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => {
            // Aquí iría la lógica de procesar la venta
            console.log('Procesar venta', { items, total })
          }}
        >
          Procesar Venta
        </Button>
      </div>
    </div>
  )
}
