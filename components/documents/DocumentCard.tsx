'use client'

import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

interface DocumentCardProps {
  id: string
  type: string
  number: string
  date: Date | string
  clientName: string
  total: number
  status: string
}

const typeLabels: Record<string, string> = {
  INVOICE: 'Factura',
  REMITO: 'Remito',
  QUOTE: 'Presupuesto',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  SENT: 'Enviado',
  PAID: 'Pagado',
  CANCELLED: 'Cancelado',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export function DocumentCard({
  id,
  type,
  number,
  date,
  clientName,
  total,
  status,
}: DocumentCardProps) {
  return (
    <Link href={`/documents/${id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">
              {typeLabels[type] || type} {number}
            </h3>
            <p className="text-sm text-gray-600">{clientName}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.DRAFT}`}
          >
            {statusLabels[status] || status}
          </span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">{formatDate(date)}</span>
          <span className="text-lg font-bold">{formatCurrency(total)}</span>
        </div>
      </Card>
    </Link>
  )
}


