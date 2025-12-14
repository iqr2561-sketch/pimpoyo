-- ================================================
-- ACTUALIZACIÓN BASE DE DATOS: Agregar Soporte para Código de Barras
-- ================================================
-- Fecha: Diciembre 2024
-- Propósito: Agregar campo barcode a tabla Product y datos de prueba
-- Compatible con: PostgreSQL (Neon) y SQLite

-- ================================================
-- PASO 1: Agregar columna barcode a tabla Product
-- ================================================

-- Agregar columna barcode (si no existe)
-- Para PostgreSQL:
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='Product' AND column_name='barcode'
    ) THEN
        ALTER TABLE "Product" ADD COLUMN "barcode" TEXT UNIQUE;
    END IF;
END $$;

-- Para SQLite (descomentar si usas SQLite en desarrollo):
-- ALTER TABLE "Product" ADD COLUMN "barcode" TEXT;
-- CREATE UNIQUE INDEX IF NOT EXISTS "Product_barcode_key" ON "Product"("barcode");

-- ================================================
-- PASO 2: Actualizar productos existentes con códigos de barras de ejemplo
-- ================================================

-- Nota: Ajusta los códigos (code) según los productos que ya tengas en tu base de datos

-- Ejemplo: Si tienes productos con estos códigos, les asignaremos barcodes
UPDATE "Product" SET "barcode" = '7790001234567' WHERE "code" = 'PROD001';
UPDATE "Product" SET "barcode" = '7790001234574' WHERE "code" = 'PROD002';
UPDATE "Product" SET "barcode" = '7790001234581' WHERE "code" = 'PROD003';

-- ================================================
-- PASO 3: Insertar productos de prueba con códigos de barras
-- ================================================

-- IMPORTANTE: Reemplaza 'TU_COMPANY_ID' con el ID real de tu empresa
-- Puedes obtenerlo con: SELECT id FROM "Company" LIMIT 1;

-- Productos de Almacén/Supermercado
INSERT INTO "Product" ("id", "code", "barcode", "name", "description", "price", "cost", "category", "unit", "companyId", "createdAt", "updatedAt")
VALUES 
  -- Bebidas
  (gen_random_uuid(), 'COCA-1.5L', '7790895001031', 'Coca Cola 1.5L', 'Gaseosa Coca Cola sabor original 1.5 litros', 850.00, 600.00, 'Bebidas', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'AGUA-500ML', '7790315215012', 'Agua Villa del Sur 500ml', 'Agua mineral sin gas 500ml', 350.00, 200.00, 'Bebidas', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'FANTA-2L', '7790895002021', 'Fanta Naranja 2L', 'Gaseosa Fanta sabor naranja 2 litros', 950.00, 650.00, 'Bebidas', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  
  -- Lácteos
  (gen_random_uuid(), 'LECHE-1L', '7790387100012', 'Leche La Serenísima 1L', 'Leche entera fortificada 1 litro', 650.00, 450.00, 'Lácteos', 'L', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'YOGUR-1L', '7790387200019', 'Yogur Serenísima Firme Frutilla 1L', 'Yogur entero sabor frutilla', 850.00, 600.00, 'Lácteos', 'L', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'QUESO-500G', '7790742000013', 'Queso Rallado Sancor 500g', 'Queso rallado tipo parmesano', 2500.00, 1800.00, 'Lácteos', 'KG', 'TU_COMPANY_ID', NOW(), NOW()),
  
  -- Almacén
  (gen_random_uuid(), 'ARROZ-1KG', '7790070451026', 'Arroz Gallo Oro 1kg', 'Arroz blanco largo fino', 950.00, 650.00, 'Almacén', 'KG', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'ACEITE-900ML', '7790260000017', 'Aceite Girasol Cocinero 900ml', 'Aceite de girasol refinado', 1200.00, 850.00, 'Almacén', 'L', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'AZUCAR-1KG', '7790040160010', 'Azúcar Ledesma 1kg', 'Azúcar blanca refinada', 800.00, 550.00, 'Almacén', 'KG', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'FIDEOS-500G', '7790040065024', 'Fideos Matarazzo 500g', 'Fideos secos tipo guiseros', 650.00, 450.00, 'Almacén', 'KG', 'TU_COMPANY_ID', NOW(), NOW()),
  
  -- Snacks y Golosinas
  (gen_random_uuid(), 'GALLETITAS', '7622210801234', 'Oreo Original 118g', 'Galletas de chocolate rellenas', 950.00, 650.00, 'Snacks', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'PAPAS-150G', '7790310450012', 'Papas Fritas Lays Original 150g', 'Papas fritas sabor original', 1200.00, 850.00, 'Snacks', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'CHOCOLATE', '7790580123456', 'Chocolate Milka 100g', 'Chocolate con leche', 1500.00, 1050.00, 'Golosinas', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'ALFAJOR', '7790040111011', 'Alfajor Jorgito Chocolate', 'Alfajor de chocolate con dulce de leche', 450.00, 300.00, 'Golosinas', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  
  -- Limpieza
  (gen_random_uuid(), 'LAVANDINA-1L', '7790070112015', 'Lavandina Ayudín 1L', 'Lavandina concentrada tradicional', 650.00, 450.00, 'Limpieza', 'L', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'DETERGENTE', '7790070115016', 'Detergente Magistral 500ml', 'Detergente concentrado limón', 850.00, 600.00, 'Limpieza', 'L', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'JABON-POLVO', '7790070118017', 'Jabón en Polvo Skip 800g', 'Jabón en polvo para ropa', 1800.00, 1300.00, 'Limpieza', 'KG', 'TU_COMPANY_ID', NOW(), NOW()),
  
  -- Higiene Personal
  (gen_random_uuid(), 'SHAMPOO-400ML', '7790070441018', 'Shampoo Sedal 400ml', 'Shampoo hidratación', 1650.00, 1200.00, 'Higiene', 'L', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'JABON-TOCADOR', '7790070442019', 'Jabón Dove Original 90g', 'Jabón en barra hidratante', 750.00, 550.00, 'Higiene', 'UN', 'TU_COMPANY_ID', NOW(), NOW()),
  (gen_random_uuid(), 'PASTA-DENTAL', '7790070443020', 'Pasta Dental Colgate 90g', 'Pasta dental triple acción', 950.00, 700.00, 'Higiene', 'UN', 'TU_COMPANY_ID', NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

-- ================================================
-- PASO 4: Crear stock para los productos nuevos
-- ================================================

-- Asignar stock inicial a los productos nuevos
INSERT INTO "Stock" ("id", "productId", "quantity", "minQuantity", "maxQuantity", "location", "companyId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  p.id,
  50.0, -- Cantidad inicial
  10.0, -- Stock mínimo
  200.0, -- Stock máximo
  'Depósito Principal',
  p."companyId",
  NOW(),
  NOW()
FROM "Product" p
WHERE p.barcode IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM "Stock" s WHERE s."productId" = p.id);

-- ================================================
-- PASO 5: Verificación
-- ================================================

-- Mostrar productos con código de barras
SELECT 
  code,
  barcode,
  name,
  price,
  category
FROM "Product" 
WHERE barcode IS NOT NULL
ORDER BY category, name;

-- ================================================
-- PASO 6: Códigos de barras personalizados (OPCIONAL)
-- ================================================

-- Si quieres generar códigos de barras personalizados para productos existentes
-- Puedes usar este patrón: 779XXXXXXXXXX (donde X son números secuenciales)

-- Ejemplo para generar códigos automáticos:
-- UPDATE "Product" 
-- SET "barcode" = '779' || LPAD(ROW_NUMBER() OVER (ORDER BY "createdAt")::text, 10, '0')
-- WHERE "barcode" IS NULL;

-- ================================================
-- INSTRUCCIONES DE USO
-- ================================================

/*
IMPORTANTE - ANTES DE EJECUTAR:

1. Reemplaza 'TU_COMPANY_ID' con tu ID real de empresa:
   - Ejecuta primero: SELECT id FROM "Company" LIMIT 1;
   - Copia el ID
   - Reemplaza todas las ocurrencias de 'TU_COMPANY_ID' en este script

2. Si estás en Neon (PostgreSQL):
   - Copia y pega TODO este script en el SQL Editor
   - Click en "Run"

3. Si estás en desarrollo local (SQLite):
   - Comenta las secciones de PostgreSQL
   - Descomenta las secciones de SQLite
   - Ejecuta con: npx prisma db execute --file database-update-barcode.sql

4. Verifica los resultados:
   - La consulta SELECT al final mostrará todos los productos con barcode

5. Para tu escáner:
   - Imprime etiquetas con los códigos de barras EAN-13
   - O usa estos códigos para probar el escaneo
*/

-- ================================================
-- FIN DEL SCRIPT
-- ================================================

