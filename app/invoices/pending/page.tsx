'use client'

import React, { useState, useEffect } from 'react'
import { FileText, User, Phone, Calendar, Trash2, Check, Send, Settings } from 'lucide-react'
import { getPendingInvoices, deletePendingInvoice, markInvoiceAsInvoiced, updatePendingInvoice, PendingInvoice, getConfig } from '@/lib/storage'
import { Button } from '@/components/ui/Button'
import { QuickClientSelector } from '@/components/invoices/QuickClientSelector'
import { Client } from '@/lib/storage'
import AuthGuard from '@/components/auth/AuthGuard'
import Link from 'next/link'

export default function PendingInvoicesPage() {
  const [invoices, setInvoices] = useState<PendingInvoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<PendingInvoice | null>(null)
  const [showClientSelector, setShowClientSelector] = useState(false)
  const [config, setConfig] = useState(getConfig())

  useEffect(() => {
    loadInvoices()
    const stored = getConfig()
    if (stored) {
      setConfig(stored)
    }
  }, [])

  const loadInvoices = () => {
    const pending = getPendingInvoices().filter((inv) => inv.status === 'pending')
    setInvoices(pending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleInvoice = (invoice: PendingInvoice) => {
    setSelectedInvoice(invoice)
    if (!invoice.clientId) {
      setShowClientSelector(true)
    } else {
      // Aquí se procesaría la facturación con AFIP
      processInvoice(invoice)
    }
  }

  const processInvoice = (invoice: PendingInvoice) => {
    // Marcar como facturada
    markInvoiceAsInvoiced(invoice.id)
    loadInvoices()
    
    // Aquí iría la lógica de facturación con AFIP
    alert(`Factura ${invoice.id} procesada exitosamente`)
  }

  const handleSendWhatsApp = (invoice: PendingInvoice) => {
    if (!config?.whatsapp.number || !invoice.clientPhone) {
      alert('Configura el número de WhatsApp y asigna un cliente a la factura')
      return
    }

    const message = config.whatsapp.messageTemplate
      .replace('{total}', formatPrice(invoice.total))
      .replace('{clientName}', invoice.clientName || 'Cliente')
      .replace('{invoiceNumber}', invoice.id)

    const phone = invoice.clientPhone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta factura pendiente?')) {
      deletePendingInvoice(id)
      loadInvoices()
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>Facturas Pendientes</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Facturas por crear y facturar desde la app móvil
            </p>
          </div>
          <Link href="/config">
            <Button variant="secondary" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-slate-800/40 rounded-lg p-12 border border-slate-700/30 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No hay facturas pendientes</p>
            <p className="text-slate-500 text-sm">
              Las ventas desde la app móvil aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">ID: {invoice.id.slice(-8)}</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      {formatPrice(invoice.total)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {invoice.clientName ? (
                    <>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">{invoice.clientName}</span>
                      </div>
                      {invoice.clientPhone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400">{invoice.clientPhone}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">Sin cliente asignado</p>
                  )}
                  <div className="flex items-center space-x-2 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500">{formatDate(invoice.createdAt)}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Items: {invoice.items.length}</p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {invoice.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-400">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                    {invoice.items.length > 3 && (
                      <p className="text-xs text-slate-500">
                        +{invoice.items.length - 3} más
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {invoice.clientId && config?.whatsapp.number && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSendWhatsApp(invoice)}
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleInvoice(invoice)}
                    className="flex-1 flex items-center justify-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Facturar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selector de Cliente */}
      {showClientSelector && selectedInvoice && (
        <QuickClientSelector
          onSelect={(client) => {
            // Actualizar factura con cliente
            selectedInvoice.clientId = client.id
            selectedInvoice.clientName = client.name
            selectedInvoice.clientPhone = client.phone
            // Aquí se guardaría la actualización
            setShowClientSelector(false)
            loadInvoices()
            // Procesar factura
            processInvoice(selectedInvoice)
          }}
          onClose={() => {
            setShowClientSelector(false)
            setSelectedInvoice(null)
          }}
          initialPhone={selectedInvoice.clientPhone}
        />
      )}
      </div>
    </AuthGuard>
  )
}
