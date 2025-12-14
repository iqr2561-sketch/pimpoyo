-- ================================================
-- ACTUALIZACIÓN BASE DE DATOS: SQLite (Desarrollo Local)
-- Agregar Soporte para Código de Barras
-- ================================================

-- PASO 1: Agregar columna barcode
ALTER TABLE "Product" ADD COLUMN "barcode" TEXT;
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- PASO 2: Productos de prueba con códigos de barras
-- Nota: Reemplaza 'TU_COMPANY_ID' con tu ID real (ver abajo cómo obtenerlo)

-- Para obtener tu COMPANY_ID, ejecuta primero:
-- SELECT id FROM "Company" LIMIT 1;

-- Bebidas
INSERT INTO "Product" ("id", "code", "barcode", "name", "description", "price", "cost", "category", "unit", "companyId", "createdAt", "updatedAt")
VALUES 
  ('prod-coca-001', 'COCA-1.5L', '7790895001031', 'Coca Cola 1.5L', 'Gaseosa Coca Cola 1.5L', 850.00, 600.00, 'Bebidas', 'UN', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-agua-001', 'AGUA-500ML', '7790315215012', 'Agua Villa del Sur 500ml', 'Agua mineral 500ml', 350.00, 200.00, 'Bebidas', 'UN', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-fanta-001', 'FANTA-2L', '7790895002021', 'Fanta Naranja 2L', 'Gaseosa Fanta 2L', 950.00, 650.00, 'Bebidas', 'UN', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  
  -- Lácteos
  ('prod-leche-001', 'LECHE-1L', '7790387100012', 'Leche Serenísima 1L', 'Leche entera 1L', 650.00, 450.00, 'Lácteos', 'L', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-yogur-001', 'YOGUR-1L', '7790387200019', 'Yogur Firme Frutilla 1L', 'Yogur frutilla 1L', 850.00, 600.00, 'Lácteos', 'L', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  
  -- Almacén
  ('prod-arroz-001', 'ARROZ-1KG', '7790070451026', 'Arroz Gallo Oro 1kg', 'Arroz largo fino 1kg', 950.00, 650.00, 'Almacén', 'KG', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-aceite-001', 'ACEITE-900ML', '7790260000017', 'Aceite Cocinero 900ml', 'Aceite de girasol', 1200.00, 850.00, 'Almacén', 'L', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-azucar-001', 'AZUCAR-1KG', '7790040160010', 'Azúcar Ledesma 1kg', 'Azúcar blanca 1kg', 800.00, 550.00, 'Almacén', 'KG', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  
  -- Snacks
  ('prod-oreo-001', 'GALLETITAS', '7622210801234', 'Oreo Original 118g', 'Galletas Oreo', 950.00, 650.00, 'Snacks', 'UN', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-papas-001', 'PAPAS-150G', '7790310450012', 'Papas Lays 150g', 'Papas fritas', 1200.00, 850.00, 'Snacks', 'UN', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('prod-alfajor-001', 'ALFAJOR', '7790040111011', 'Alfajor Jorgito', 'Alfajor chocolate', 450.00, 300.00, 'Golosinas', 'UN', 'TU_COMPANY_ID', datetime('now'), datetime('now'));

-- PASO 3: Crear stock para productos
INSERT INTO "Stock" ("id", "productId", "quantity", "minQuantity", "maxQuantity", "location", "companyId", "createdAt", "updatedAt")
VALUES 
  ('stock-001', 'prod-coca-001', 50, 10, 200, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-002', 'prod-agua-001', 80, 20, 300, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-003', 'prod-fanta-001', 40, 10, 150, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-004', 'prod-leche-001', 60, 15, 200, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-005', 'prod-yogur-001', 45, 10, 150, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-006', 'prod-arroz-001', 70, 20, 250, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-007', 'prod-aceite-001', 55, 15, 180, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-008', 'prod-azucar-001', 65, 20, 220, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-009', 'prod-oreo-001', 90, 25, 300, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-010', 'prod-papas-001', 75, 20, 250, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now')),
  ('stock-011', 'prod-alfajor-001', 120, 30, 400, 'Depósito', 'TU_COMPANY_ID', datetime('now'), datetime('now'));

-- Verificar productos creados
SELECT code, barcode, name, price, category FROM "Product" WHERE barcode IS NOT NULL;

