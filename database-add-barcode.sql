-- ============================================
-- AGREGAR CÓDIGO DE BARRAS A PRODUCTOS
-- Sistema TPV - Soporte para escáner de código de barras
-- PostgreSQL - Neon
-- ============================================

-- 1. Agregar columna barcode a tabla Product
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "barcode" TEXT;

-- 2. Crear índice para búsqueda rápida por código de barras
CREATE INDEX IF NOT EXISTS "Product_barcode_idx" ON "Product"("barcode");

-- ============================================
-- AGREGAR CÓDIGOS DE BARRAS DE EJEMPLO
-- (Reemplazar con códigos reales en producción)
-- ============================================

-- Actualizar productos existentes con códigos EAN13 de ejemplo
UPDATE "Product" 
SET "barcode" = '7790001234567'
WHERE code = 'ACE001';

UPDATE "Product" 
SET "barcode" = '7790001234574'
WHERE code = 'ARZ001';

UPDATE "Product" 
SET "barcode" = '7790001234581'
WHERE code = 'AZU001';

UPDATE "Product" 
SET "barcode" = '7790001234598'
WHERE code = 'LAV001';

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver productos con códigos de barras
SELECT id, code, barcode, name, price 
FROM "Product" 
WHERE barcode IS NOT NULL;

-- Contar productos con y sin código de barras
SELECT 
  COUNT(*) as total,
  COUNT(barcode) as con_barcode,
  COUNT(*) - COUNT(barcode) as sin_barcode
FROM "Product";

-- ============================================
-- NOTAS DE USO
-- ============================================

-- Para agregar código de barras a un producto específico:
-- UPDATE "Product" SET "barcode" = 'TU_CODIGO_AQUI' WHERE code = 'CODIGO_PRODUCTO';

-- Formatos comunes de códigos de barras:
-- EAN-13: 13 dígitos (ej: 7790001234567) - Más común en Argentina
-- UPC-A: 12 dígitos (ej: 012345678905) - Común en USA
-- EAN-8: 8 dígitos (ej: 12345670) - Para productos pequeños
-- CODE-39: Alfanumérico - Para uso interno

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

