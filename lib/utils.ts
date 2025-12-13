import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Genera mensaje de WhatsApp para enviar factura/documento
 */
export function generarMensajeFacturaWhatsApp(datos: {
  tipoDocumento: string
  numeroFactura: string
  nombreCliente: string
  nombreEmpresa: string
  fecha: Date | string
  total: number
  cae?: string
  caeVencimiento?: Date | string
  tipoFactura?: string
  qrLink?: string
}): string {
  const {
    tipoDocumento,
    numeroFactura,
    nombreCliente,
    nombreEmpresa,
    fecha,
    total,
    cae,
    caeVencimiento,
    tipoFactura,
    qrLink,
  } = datos

  const tipoDoc =
    tipoDocumento === 'INVOICE'
      ? 'Factura'
      : tipoDocumento === 'REMITO'
      ? 'Remito'
      : 'Presupuesto'

  let mensaje = `🧾 *${tipoDoc} Electrónica*\n\n`
  mensaje += `Estimado/a *${nombreCliente}*,\n\n`
  mensaje += `Le enviamos su ${tipoDoc.toLowerCase()} generada por *${nombreEmpresa}*\n\n`
  mensaje += `📄 *Detalles:*\n`
  mensaje += `• Número: ${numeroFactura}\n`
  
  if (tipoFactura) {
    mensaje += `• Tipo: Factura ${tipoFactura}\n`
  }
  
  mensaje += `• Fecha: ${formatDate(fecha)}\n`
  mensaje += `• Total: ${formatCurrency(total)}\n\n`

  // Datos fiscales AFIP (si existen)
  if (cae) {
    mensaje += `🔐 *Datos Fiscales AFIP:*\n`
    mensaje += `• CAE: ${cae}\n`
    if (caeVencimiento) {
      mensaje += `• Vencimiento CAE: ${formatDate(caeVencimiento)}\n`
    }
    mensaje += `\n`
  }

  // Link al QR de AFIP (si existe)
  if (qrLink) {
    mensaje += `📱 Código QR AFIP:\n${qrLink}\n\n`
  }

  mensaje += `Gracias por su preferencia.\n\n`
  mensaje += `_Este mensaje fue generado automáticamente por el sistema de facturación._`

  return mensaje
}

/**
 * Genera mensaje simplificado para ventas rápidas
 */
export function generarMensajeVentaWhatsApp(datos: {
  numeroVenta: string
  nombreCliente?: string
  nombreEmpresa: string
  total: number
  items: Array<{ nombre: string; cantidad: number; precio: number }>
}): string {
  const { numeroVenta, nombreCliente, nombreEmpresa, total, items } = datos

  let mensaje = `🛒 *Comprobante de Venta*\n\n`
  
  if (nombreCliente) {
    mensaje += `Cliente: *${nombreCliente}*\n`
  }
  
  mensaje += `Comercio: *${nombreEmpresa}*\n`
  mensaje += `Nº Venta: ${numeroVenta}\n\n`
  mensaje += `📦 *Productos:*\n`

  items.forEach((item) => {
    mensaje += `• ${item.nombre}\n`
    mensaje += `  ${item.cantidad} x ${formatCurrency(item.precio)} = ${formatCurrency(
      item.cantidad * item.precio
    )}\n`
  })

  mensaje += `\n💰 *Total: ${formatCurrency(total)}*\n\n`
  mensaje += `Gracias por su compra.`

  return mensaje
}

export function generateDocumentNumber(type: string): string {
  const prefixes: Record<string, string> = {
    INVOICE: 'FC',
    REMITO: 'RM',
    QUOTE: 'PR',
    SALE: 'VT',
  }
  const prefix = prefixes[type] || 'DOC'
  const timestamp = Date.now().toString().slice(-8)
  return `${prefix}-${timestamp}`
}


