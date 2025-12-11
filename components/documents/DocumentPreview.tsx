'use client'

import { Document, View, Text, Page, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { formatCurrency, formatDate, generateWhatsAppLink } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e0e0e0',
  },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '25%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 5,
    width: 200,
  },
  totalLabel: {
    width: 120,
    textAlign: 'right',
  },
  totalValue: {
    width: 80,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: '1 solid #e0e0e0',
    fontSize: 10,
    color: '#666',
  },
})

interface DocumentPreviewProps {
  document: {
    id: string
    type: string
    number: string
    date: Date | string
    subtotal: number
    tax: number
    total: number
    notes?: string | null
    company: {
      name: string
      cuit?: string | null
      address?: string | null
      phone?: string | null
      email?: string | null
    }
    client: {
      name: string
      cuit?: string | null
      address?: string | null
      phone?: string | null
      email?: string | null
    }
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
    }>
  }
}

const PDFDocument = ({ document }: DocumentPreviewProps) => {
  const typeLabels: Record<string, string> = {
    INVOICE: 'FACTURA',
    REMITO: 'REMITO',
    QUOTE: 'PRESUPUESTO',
  }

  // Formatear valores para el PDF
  const formatCurrencyPDF = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
  }

  const formatDatePDF = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{typeLabels[document.type] || document.type}</Text>
          <Text>Número: {document.number}</Text>
          <Text>Fecha: {formatDatePDF(document.date)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Emisor:</Text>
          <Text>{document.company.name}</Text>
          {document.company.cuit && <Text>CUIT: {document.company.cuit}</Text>}
          {document.company.address && <Text>{document.company.address}</Text>}
          {document.company.phone && <Text>Tel: {document.company.phone}</Text>}
          {document.company.email && <Text>Email: {document.company.email}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Cliente:</Text>
          <Text>{document.client.name}</Text>
          {document.client.cuit && <Text>CUIT: {document.client.cuit}</Text>}
          {document.client.address && <Text>{document.client.address}</Text>}
          {document.client.phone && <Text>Tel: {document.client.phone}</Text>}
          {document.client.email && <Text>Email: {document.client.email}</Text>}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Descripción</Text>
            <Text style={styles.col2}>Cantidad</Text>
            <Text style={styles.col3}>Precio Unit.</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {document.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity.toString()}</Text>
              <Text style={styles.col3}>{formatCurrencyPDF(item.unitPrice)}</Text>
              <Text style={styles.col4}>
                {formatCurrencyPDF(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrencyPDF(document.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (21%):</Text>
            <Text style={styles.totalValue}>{formatCurrencyPDF(document.tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrencyPDF(document.total)}</Text>
          </View>
        </View>

        {document.notes && (
          <View style={styles.footer}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notas:</Text>
            <Text>{document.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  const handleWhatsApp = () => {
    if (!document.client.phone) {
      alert('El cliente no tiene número de teléfono registrado')
      return
    }

    const message = `Hola ${document.client.name},\n\nTe envío el ${document.type === 'INVOICE' ? 'factura' : document.type === 'REMITO' ? 'remito' : 'presupuesto'} ${document.number}.\n\nTotal: ${formatCurrency(document.total)}\n\nGracias por tu preferencia.`
    const whatsappLink = generateWhatsAppLink(document.client.phone, message)
    window.open(whatsappLink, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <PDFDownloadLink
          document={<PDFDocument document={document} />}
          fileName={`${document.number}.pdf`}
          className="inline-block"
        >
          {({ blob, url, loading, error }) => (
            <Button disabled={loading}>
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
        {document.client.phone && (
          <Button variant="secondary" onClick={handleWhatsApp}>
            Enviar por WhatsApp
          </Button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">
          {document.type === 'INVOICE' ? 'Factura' : document.type === 'REMITO' ? 'Remito' : 'Presupuesto'}{' '}
          {document.number}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Emisor</h3>
            <p>{document.company.name}</p>
            {document.company.cuit && <p>CUIT: {document.company.cuit}</p>}
            {document.company.address && <p>{document.company.address}</p>}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p>{document.client.name}</p>
            {document.client.cuit && <p>CUIT: {document.client.cuit}</p>}
            {document.client.address && <p>{document.client.address}</p>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Descripción</th>
                <th className="border p-2 text-right">Cantidad</th>
                <th className="border p-2 text-right">Precio Unit.</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {document.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(document.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>IVA (21%):</span>
              <span>{formatCurrency(document.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(document.total)}</span>
            </div>
          </div>
        </div>
        {document.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="font-semibold mb-2">Notas:</p>
            <p>{document.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

