// Utilidades para simulación de AFIP (Argentina)
// TODO: Reemplazar con integración real de AFIP SDK cuando esté listo

/**
 * Determina el tipo de factura según condición IVA
 * A: Responsable Inscripto a Responsable Inscripto
 * B: Responsable Inscripto a Consumidor Final / Monotributo
 * C: Monotributo a cualquiera
 */
export function determinarTipoFactura(
  empresaCondicion: string,
  clienteCondicion: string
): 'A' | 'B' | 'C' {
  // Empresa es Responsable Inscripto
  if (empresaCondicion === 'RESPONSABLE_INSCRIPTO') {
    // Cliente es Responsable Inscripto = Factura A
    if (clienteCondicion === 'RESPONSABLE_INSCRIPTO') {
      return 'A'
    }
    // Cliente es Consumidor Final o Monotributo = Factura B
    return 'B'
  }
  
  // Empresa es Monotributo = siempre Factura C
  if (empresaCondicion === 'MONOTRIBUTO') {
    return 'C'
  }
  
  // Por defecto Factura B
  return 'B'
}

/**
 * Genera un CAE (Código de Autorización Electrónico) simulado
 * Formato real: 14 dígitos numéricos
 */
export function generarCAESimulado(): string {
  // Generar 14 dígitos aleatorios
  let cae = ''
  for (let i = 0; i < 14; i++) {
    cae += Math.floor(Math.random() * 10)
  }
  return cae
}

/**
 * Calcula la fecha de vencimiento del CAE (normalmente 10 días)
 */
export function calcularVencimientoCAE(fechaEmision: Date = new Date()): Date {
  const vencimiento = new Date(fechaEmision)
  vencimiento.setDate(vencimiento.getDate() + 10)
  return vencimiento
}

/**
 * Genera el número de factura formateado (punto de venta + número)
 * Ejemplo: 0001-00000123
 */
export function formatearNumeroFactura(
  puntoVenta: number,
  numeroSecuencial: number
): string {
  const pv = puntoVenta.toString().padStart(5, '0')
  const num = numeroSecuencial.toString().padStart(8, '0')
  return `${pv}-${num}`
}

/**
 * Genera datos de QR para factura electrónica
 * En producción esto vendría de AFIP
 */
export function generarQRData(
  cuit: string,
  tipoFactura: string,
  puntoVenta: number,
  cae: string,
  fechaEmision: Date
): string {
  // Formato simplificado para simulación
  // En producción usaríamos el formato real de AFIP
  const data = {
    ver: 1,
    fecha: fechaEmision.toISOString().split('T')[0],
    cuit: cuit.replace(/-/g, ''),
    ptoVta: puntoVenta,
    tipoCmp: tipoFactura === 'A' ? 1 : tipoFactura === 'B' ? 6 : 11,
    cae: cae,
  }
  
  return `https://www.afip.gob.ar/fe/qr/?p=${Buffer.from(
    JSON.stringify(data)
  ).toString('base64')}`
}

/**
 * Simula autorización de AFIP para factura electrónica
 * Retorna datos que serían provistos por AFIP
 */
export async function autorizarFacturaAFIP(datos: {
  tipoFactura: string
  puntoVenta: number
  numeroFactura: number
  fecha: Date
  cuitEmpresa: string
  cuitCliente?: string
  condicionIVACliente: string
  total: number
  iva: number
}): Promise<{
  success: boolean
  cae?: string
  caeVencimiento?: Date
  qrData?: string
  error?: string
}> {
  try {
    // SIMULACIÓN: En producción aquí iría la llamada real a AFIP
    // await afipSDK.solicitarCAE(datos)
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Generar datos simulados
    const cae = generarCAESimulado()
    const caeVencimiento = calcularVencimientoCAE(datos.fecha)
    const qrData = generarQRData(
      datos.cuitEmpresa,
      datos.tipoFactura,
      datos.puntoVenta,
      cae,
      datos.fecha
    )
    
    return {
      success: true,
      cae,
      caeVencimiento,
      qrData,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al conectar con AFIP (simulado)',
    }
  }
}

/**
 * Valida formato de CUIT argentino
 */
export function validarCUIT(cuit: string): boolean {
  // Remover guiones
  const cuitLimpio = cuit.replace(/-/g, '')
  
  // Debe tener 11 dígitos
  if (cuitLimpio.length !== 11 || !/^\d+$/.test(cuitLimpio)) {
    return false
  }
  
  // Validar dígito verificador
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  let suma = 0
  
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuitLimpio[i]) * multiplicadores[i]
  }
  
  const resto = suma % 11
  const digitoVerificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto
  
  return digitoVerificador === parseInt(cuitLimpio[10])
}

/**
 * Formatea CUIT con guiones: XX-XXXXXXXX-X
 */
export function formatearCUIT(cuit: string): string {
  const limpio = cuit.replace(/\D/g, '')
  if (limpio.length === 11) {
    return `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`
  }
  return cuit
}

/**
 * Obtiene el nombre legible de la condición IVA
 */
export function getNombreCondicionIVA(condicion: string): string {
  const nombres: Record<string, string> = {
    RESPONSABLE_INSCRIPTO: 'Responsable Inscripto',
    MONOTRIBUTO: 'Monotributo',
    CONSUMIDOR_FINAL: 'Consumidor Final',
    EXENTO: 'Exento',
    NO_RESPONSABLE: 'No Responsable',
  }
  return nombres[condicion] || condicion
}

/**
 * Tipos de comprobantes AFIP
 */
export const TIPOS_COMPROBANTE = {
  FACTURA_A: { codigo: 1, nombre: 'Factura A' },
  FACTURA_B: { codigo: 6, nombre: 'Factura B' },
  FACTURA_C: { codigo: 11, nombre: 'Factura C' },
  FACTURA_E: { codigo: 19, nombre: 'Factura E (Exportación)' },
  NOTA_CREDITO_A: { codigo: 3, nombre: 'Nota de Crédito A' },
  NOTA_CREDITO_B: { codigo: 8, nombre: 'Nota de Crédito B' },
  NOTA_CREDITO_C: { codigo: 13, nombre: 'Nota de Crédito C' },
  REMITO: { codigo: 999, nombre: 'Remito' }, // No es comprobante fiscal
}

