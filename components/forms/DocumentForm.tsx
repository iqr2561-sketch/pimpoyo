'use client'

import { useState, FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ClientSelector } from './ClientSelector'
import { ItemList, DocumentItem } from './ItemList'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { generateDocumentNumber } from '@/lib/utils'

interface DocumentFormProps {
  initialData?: {
    type?: string
    clientId?: string
    items?: DocumentItem[]
    notes?: string
  }
  documentId?: string
}

export function DocumentForm({ initialData, documentId }: DocumentFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [type, setType] = useState(initialData?.type || 'INVOICE')
  const [clientId, setClientId] = useState(initialData?.clientId || '')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [items, setItems] = useState<DocumentItem[]>(
    initialData?.items || [{ description: '', quantity: 1, unitPrice: 0 }]
  )
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClientChange = (id: string, client: any) => {
    setClientId(id)
    setSelectedClient(client)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!clientId || items.length === 0 || !session?.user?.companyId) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setIsSubmitting(true)

    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )
    const tax = subtotal * 0.21
    const total = subtotal + tax

    const documentData = {
      type,
      number: generateDocumentNumber(type),
      clientId,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      subtotal,
      tax,
      total,
      notes,
    }

    try {
      const url = documentId ? `/api/documents/${documentId}` : '/api/documents'
      const method = documentId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        throw new Error('Error al guardar el documento')
      }

      const result = await response.json()
      router.push(`/documents/${result.id}`)
    } catch (error) {
      console.error(error)
      alert('Error al guardar el documento')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session?.user?.companyId) {
    return <div>Cargando...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Tipo de Documento
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 cursor-pointer"
            >
              <option value="INVOICE">Factura</option>
              <option value="REMITO">Remito</option>
              <option value="QUOTE">Presupuesto</option>
            </select>
          </div>
          <ClientSelector
            value={clientId}
            onChange={handleClientChange}
            companyId={session.user.companyId}
          />
        </div>
      </Card>

      <Card>
        <ItemList items={items} onChange={setItems} />
      </Card>

      <Card>
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 resize-none"
            placeholder="Notas adicionales..."
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
          {isSubmitting ? 'Guardando...' : documentId ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}


