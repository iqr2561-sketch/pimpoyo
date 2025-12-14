import React from 'react'
import { Plus } from 'lucide-react'

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 hover:border-emerald-500/30 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/5 group">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xs font-medium text-slate-100 mb-1.5 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/40 text-slate-400 rounded">
              {product.code}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded">
              Stock: {product.stock}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/30">
          <span className="text-base font-semibold text-emerald-400">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition-all group-hover:scale-105"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
