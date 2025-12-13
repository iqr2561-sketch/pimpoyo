'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Document {
  id: string
  type: string
  number: string
  date: string
  total: number
  status: string
  client: {
    name: string
  }
  items: Array<{
    description: string
  }>
}

export default function DocumentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchDocuments()
    }
  }, [status, router, filter])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        const filtered =
          filter === 'all'
            ? data
            : data.filter((doc: Document) => doc.type === filter)
        setDocuments(filtered)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INVOICE':
        return 'bg-blue-100 text-blue-700'
      case 'REMITO':
        return 'bg-purple-100 text-purple-700'
      case 'QUOTE':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'INVOICE':
        return 'Factura'
      case 'REMITO':
        return 'Remito'
      case 'QUOTE':
        return 'Presupuesto'
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700'
      case 'SENT':
        return 'bg-blue-100 text-blue-700'
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pagado'
      case 'SENT':
        return 'Enviado'
      case 'DRAFT':
        return 'Borrador'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  if (status === 'loading' || isLoading) {
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Documentos Fiscales
                </h1>
                <p className="text-slate-600">
                  Facturas, remitos y presupuestos
                </p>
              </div>
              <Link href="/documents/new">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  + Nuevo Documento
                </button>
              </Link>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex gap-2">
              {['all', 'INVOICE', 'REMITO', 'QUOTE'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === filterOption
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {filterOption === 'all' ? 'Todos' : getTypeText(filterOption)}
                </button>
              ))}
            </div>

            {/* Lista de Documentos */}
            {documents.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay documentos registrados
                </h3>
                <p className="text-slate-600 mb-6">
                  Crea facturas, remitos o presupuestos para verlos aquí
                </p>
                <Link href="/documents/new">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold">
                    Crear Primer Documento
                  </button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {doc.number}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                              doc.type
                            )}`}
                          >
                            {getTypeText(doc.type)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            {getStatusText(doc.status)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>
                            <span className="font-medium">Cliente:</span>{' '}
                            {doc.client.name}
                          </p>
                          <p>
                            <span className="font-medium">Fecha:</span>{' '}
                            {formatDate(doc.date)}
                          </p>
                          <p>
                            <span className="font-medium">Items:</span>{' '}
                            {doc.items.length} producto(s)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">
                          {formatCurrency(doc.total)}
                        </div>
                        <Link href={`/documents/${doc.id}`}>
                          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                            Ver Detalle
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Resumen */}
            {documents.length > 0 && (
              <Card className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {documents.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Facturas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {documents.filter((d) => d.type === 'INVOICE').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Remitos</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {documents.filter((d) => d.type === 'REMITO').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Monto Total</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(
                        documents.reduce((sum, d) => sum + d.total, 0)
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

