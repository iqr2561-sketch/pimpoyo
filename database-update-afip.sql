-- ============================================
-- ACTUALIZACIÓN DE BASE DE DATOS - CAMPOS FISCALES AFIP
-- Sistema de Facturación Rápida
-- PostgreSQL - Neon
-- ============================================

-- 1. ACTUALIZAR TABLA Company - Agregar campos fiscales
ALTER TABLE "Company" 
ADD COLUMN IF NOT EXISTS "puntoVenta" INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS "condicionIVA" TEXT DEFAULT 'RESPONSABLE_INSCRIPTO',
ADD COLUMN IF NOT EXISTS "ingresosBrutos" TEXT,
ADD COLUMN IF NOT EXISTS "inicioActividad" TIMESTAMP(3);

-- 2. ACTUALIZAR TABLA Client - Agregar condición IVA
ALTER TABLE "Client"
ADD COLUMN IF NOT EXISTS "condicionIVA" TEXT DEFAULT 'CONSUMIDOR_FINAL',
ADD COLUMN IF NOT EXISTS "tipoDocumento" TEXT DEFAULT 'CUIT';

-- 3. ACTUALIZAR TABLA Document - Agregar campos AFIP
ALTER TABLE "Document"
ADD COLUMN IF NOT EXISTS "tipoFactura" TEXT,
ADD COLUMN IF NOT EXISTS "puntoVenta" INTEGER,
ADD COLUMN IF NOT EXISTS "numeroFactura" INTEGER,
ADD COLUMN IF NOT EXISTS "cae" TEXT,
ADD COLUMN IF NOT EXISTS "caeVencimiento" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "qrData" TEXT;

-- 4. ACTUALIZAR TABLA Sale - Agregar campos facturación
ALTER TABLE "Sale"
ADD COLUMN IF NOT EXISTS "tipoFactura" TEXT,
ADD COLUMN IF NOT EXISTS "facturaGenerada" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "facturaId" TEXT;

-- ============================================
-- ACTUALIZAR DATOS EXISTENTES
-- ============================================

-- Actualizar empresa demo con datos fiscales
UPDATE "Company" 
SET 
  "puntoVenta" = 1,
  "condicionIVA" = 'RESPONSABLE_INSCRIPTO',
  "ingresosBrutos" = '901-123456-7',
  "inicioActividad" = '2020-01-15'
WHERE id = 'company_demo_001';

-- Actualizar clientes con condición IVA
UPDATE "Client" 
SET "condicionIVA" = 'RESPONSABLE_INSCRIPTO', "tipoDocumento" = 'CUIT'
WHERE id = 'client_001'; -- Supermercado

UPDATE "Client" 
SET "condicionIVA" = 'MONOTRIBUTO', "tipoDocumento" = 'CUIT'
WHERE id = 'client_002'; -- Restaurante

UPDATE "Client" 
SET "condicionIVA" = 'CONSUMIDOR_FINAL', "tipoDocumento" = 'DNI'
WHERE id = 'client_003'; -- Almacén Don José

-- Actualizar documento existente con datos AFIP simulados
UPDATE "Document"
SET
  "tipoFactura" = 'B',
  "puntoVenta" = 1,
  "numeroFactura" = 1,
  "cae" = '74185296374125',
  "caeVencimiento" = CURRENT_TIMESTAMP + INTERVAL '10 days',
  "qrData" = 'https://www.afip.gob.ar/fe/qr/?p=eyJ2ZXIiOjEsImZlY2hhIjoiMjAyNC0wMS0xNSJ9'
WHERE id = 'doc_001';

-- Actualizar venta existente
UPDATE "Sale"
SET
  "tipoFactura" = 'B',
  "facturaGenerada" = false
WHERE id = 'sale_001';

-- ============================================
-- CREAR ÍNDICES PARA MEJOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS "Company_cuit_idx" ON "Company"("cuit");
CREATE INDEX IF NOT EXISTS "Client_cuit_idx" ON "Client"("cuit");
CREATE INDEX IF NOT EXISTS "Document_cae_idx" ON "Document"("cae");
CREATE INDEX IF NOT EXISTS "Document_tipoFactura_idx" ON "Document"("tipoFactura");

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver empresas con datos fiscales
SELECT id, name, cuit, "puntoVenta", "condicionIVA" FROM "Company";

-- Ver clientes con condición IVA
SELECT id, name, cuit, "condicionIVA", "tipoDocumento" FROM "Client";

-- Ver documentos con datos AFIP
SELECT id, number, "tipoFactura", "puntoVenta", cae FROM "Document";

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

