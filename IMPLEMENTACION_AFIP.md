# 🇦🇷 Sistema de Facturación Electrónica AFIP - Implementación

## ✅ Lo que se Implementó

### 1. **Campos Fiscales en Base de Datos**

#### Company (Empresa):
- `puntoVenta`: Punto de venta AFIP (default: 1)
- `condicionIVA`: RESPONSABLE_INSCRIPTO, MONOTRIBUTO, EXENTO
- `ingresosBrutos`: Número de Ingresos Brutos
- `inicioActividad`: Fecha de inicio de actividades

#### Client (Cliente):
- `condicionIVA`: RESPONSABLE_INSCRIPTO, MONOTRIBUTO, CONSUMIDOR_FINAL, EXENTO
- `tipoDocumento`: CUIT, CUIL, DNI, PASAPORTE

#### Document (Factura/Remito):
- `tipoFactura`: A, B, C, E (según condición IVA)
- `puntoVenta`: Punto de venta usado
- `numeroFactura`: Número secuencial
- `cae`: Código de Autorización Electrónico (14 dígitos)
- `caeVencimiento`: Fecha de vencimiento del CAE
- `qrData`: URL para código QR de AFIP

#### Sale (Venta):
- `tipoFactura`: Tipo de factura a generar
- `facturaGenerada`: Si ya se emitió comprobante fiscal
- `facturaId`: Referencia al documento fiscal generado

---

### 2. **Biblioteca AFIP** (`lib/afip.ts`)

#### Funciones Principales:

**`determinarTipoFactura(empresaCondicion, clienteCondicion)`**
- Determina automáticamente si es Factura A, B o C
- Reglas:
  - RI → RI = Factura A
  - RI → CF/Monotributo = Factura B  
  - Monotributo → Cualquiera = Factura C

**`generarCAESimulado()`**
- Genera CAE de 14 dígitos
- En producción se reemplaza con llamada real a AFIP

**`autorizarFacturaAFIP(datos)`**
- Simula autorización de AFIP
- Retorna: CAE, vencimiento, código QR
- Preparado para reemplazar con SDK real de AFIP

**`validarCUIT(cuit)`**
- Valida CUIT argentino con dígito verificador
- Formato: XX-XXXXXXXX-X

**`formatearCUIT(cuit)`**
- Formatea CUIT con guiones

---

### 3. **Mejoras en WhatsApp** (`lib/utils.ts`)

**`generarMensajeFacturaWhatsApp(datos)`**
- Genera mensaje completo con datos de factura
- Incluye: Tipo factura, CAE, vencimiento CAE, QR AFIP
- Formato profesional con emojis

**`generarMensajeVentaWhatsApp(datos)`**
- Mensaje simplificado para ventas rápidas
- Detalle de productos con cantidades y precios

---

## 📋 Actualizar Base de Datos en Neon

### Paso 1: Ir a Neon Console

1. Ve a https://console.neon.tech
2. Abre tu proyecto `pimpoyo-db`
3. Click en **SQL Editor**

### Paso 2: Ejecutar Script de Actualización

1. Abre el archivo `database-update-afip.sql` en tu proyecto
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Neon
4. Click en **Run** (o Ctrl+Enter)

Esto agregará todos los campos fiscales a tus tablas existentes.

---

## 🔄 Actualizar Deployment en Vercel

El código ya está en GitHub. Solo necesitas:

```bash
# Ya lo hicimos - solo confirma que se deployó
```

Vercel detectará el push automáticamente y redeployará.

---

## 📱 Cómo Usar el Sistema Fiscal

### Crear Factura Electrónica:

1. Ve a **Documentos → Nuevo Documento**
2. Selecciona tipo: **INVOICE** (Factura)
3. Selecciona cliente
4. El sistema automáticamente:
   - Determina si es Factura A, B o C (según condición IVA)
   - Genera CAE simulado de 14 dígitos
   - Calcula vencimiento del CAE (10 días)
   - Genera código QR para AFIP
   - Formatea número: 00001-00000001

### Enviar Factura por WhatsApp:

1. Abre la factura creada
2. Click en **"Enviar por WhatsApp"**
3. El mensaje incluirá:
   - Número de factura
   - Tipo (A, B o C)
   - CAE y vencimiento
   - Link al QR de AFIP
   - Total

---

## 🔮 Próxima Integración Real con AFIP

Cuando estés listo para conectar con AFIP real:

### Necesitarás:

1. **Certificado Digital** de AFIP
2. **Clave Fiscal** nivel 4 o superior
3. **SDK de AFIP** para Node.js

### Reemplazar en `lib/afip.ts`:

```typescript
// Cambiar función simulada:
export async function autorizarFacturaAFIP(datos) {
  // ❌ QUITAR simulación
  // ✅ AGREGAR:
  const afip = new AfipSDK({
    cert: process.env.AFIP_CERT,
    key: process.env.AFIP_KEY,
    cuit: process.env.COMPANY_CUIT,
  })
  
  const resultado = await afip.solicitarCAE(datos)
  return resultado
}
```

---

## ✅ Resumen de Funcionalidades

- ✅ Sistema de tipos de factura (A, B, C)
- ✅ CAE simulado de 14 dígitos
- ✅ Vencimiento de CAE (10 días)
- ✅ Código QR para AFIP
- ✅ Validación de CUIT
- ✅ Determinación automática de tipo de factura
- ✅ Envío por WhatsApp con datos fiscales completos
- ✅ Preparado para integración real con AFIP

---

## 🎯 Próximos Pasos

1. **Ejecuta `database-update-afip.sql` en Neon**
2. **Redeploy completará automáticamente**
3. **Crea tu primera factura electrónica desde la app**
4. **Prueba el envío por WhatsApp**

¿Necesitas ayuda con algún paso específico?

