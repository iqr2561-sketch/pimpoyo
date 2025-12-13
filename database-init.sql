-- ============================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- Sistema de Facturación Rápida
-- PostgreSQL
-- ============================================

-- Crear tablas en el orden correcto (respetando dependencias)

-- 1. TABLA: Company
CREATE TABLE IF NOT EXISTS "Company" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cuit" TEXT UNIQUE NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 2. TABLA: User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 3. TABLA: Client
CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cuit" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. TABLA: Product
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION,
    "category" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'UN',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. TABLA: Stock
CREATE TABLE IF NOT EXISTS "Stock" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT UNIQUE NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxQuantity" DOUBLE PRECISION,
    "location" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Stock_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6. TABLA: StockMovement
CREATE TABLE IF NOT EXISTS "StockMovement" (
    "id" TEXT PRIMARY KEY,
    "stockId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockMovement_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. TABLA: Document
CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "number" TEXT UNIQUE NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "pdfUrl" TEXT,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Document_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Document_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 8. TABLA: DocumentItem
CREATE TABLE IF NOT EXISTS "DocumentItem" (
    "id" TEXT PRIMARY KEY,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "productId" TEXT,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DocumentItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DocumentItem_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. TABLA: Sale
CREATE TABLE IF NOT EXISTS "Sale" (
    "id" TEXT PRIMARY KEY,
    "number" TEXT UNIQUE NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "clientId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Sale_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 10. TABLA: SaleItem
CREATE TABLE IF NOT EXISTS "SaleItem" (
    "id" TEXT PRIMARY KEY,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- 1. EMPRESA DE PRUEBA
INSERT INTO "Company" ("id", "name", "cuit", "address", "phone", "email", "createdAt", "updatedAt")
VALUES (
    'company_demo_001',
    'Distribuidora Walter Pimpoyo',
    '20-12345678-9',
    'Av. Corrientes 1234, CABA',
    '+54 11 4567-8900',
    'info@walterpimpoyo.com',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. USUARIO DE PRUEBA
-- Email: test@example.com
-- Password: password123 (hasheado con bcrypt)
INSERT INTO "User" ("id", "email", "name", "password", "companyId", "createdAt", "updatedAt")
VALUES (
    'user_demo_001',
    'test@example.com',
    'Usuario Demo',
    '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    'company_demo_001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 3. CLIENTES DE PRUEBA
INSERT INTO "Client" ("id", "name", "cuit", "address", "phone", "email", "companyId", "createdAt", "updatedAt")
VALUES
    ('client_001', 'Supermercado El Ahorro', '30-98765432-1', 'Calle Falsa 123', '11-5555-1234', 'compras@elahorro.com', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('client_002', 'Restaurante La Esquina', '33-11223344-5', 'Av. Santa Fe 4567', '11-5555-5678', 'admin@laesquina.com', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('client_003', 'Almacén Don José', '20-55667788-9', 'San Martín 890', '11-5555-9012', 'donjose@almacen.com', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. PRODUCTOS DE PRUEBA
INSERT INTO "Product" ("id", "code", "name", "description", "price", "cost", "category", "unit", "companyId", "createdAt", "updatedAt")
VALUES
    ('prod_001', 'MAU001', 'Mauricio', 'Producto premium de alta calidad', 500.00, 350.00, 'Productos Especiales', 'UN', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('prod_002', 'ARZ001', 'Arroz Grano Largo 1kg', 'Arroz de primera calidad', 850.50, 600.00, 'Almacén', 'KG', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('prod_003', 'ACE001', 'Aceite de Girasol 900ml', 'Aceite vegetal refinado', 1250.00, 900.00, 'Almacén', 'UN', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('prod_004', 'AZU001', 'Azúcar 1kg', 'Azúcar refinada', 680.00, 480.00, 'Almacén', 'KG', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('prod_005', 'LAV001', 'Lavandina 1L', 'Desinfectante líquido', 450.00, 320.00, 'Limpieza', 'L', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. STOCK DE PRODUCTOS
INSERT INTO "Stock" ("id", "productId", "quantity", "minQuantity", "maxQuantity", "location", "companyId", "createdAt", "updatedAt")
VALUES
    ('stock_001', 'prod_001', 494, 10, 500, 'Estante A1', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('stock_002', 'prod_002', 150, 20, 200, 'Estante B2', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('stock_003', 'prod_003', 85, 15, 100, 'Estante B3', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('stock_004', 'prod_004', 120, 25, 150, 'Estante C1', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('stock_005', 'prod_005', 60, 10, 80, 'Estante D1', 'company_demo_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. VENTA DE EJEMPLO
INSERT INTO "Sale" ("id", "number", "date", "subtotal", "tax", "total", "status", "paymentMethod", "clientId", "companyId", "createdAt", "updatedAt")
VALUES (
    'sale_001',
    'V-001',
    CURRENT_TIMESTAMP,
    3000.00,
    630.00,
    3630.00,
    'COMPLETED',
    'CASH',
    'client_001',
    'company_demo_001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Items de la venta
INSERT INTO "SaleItem" ("id", "saleId", "productId", "quantity", "unitPrice", "subtotal", "createdAt", "updatedAt")
VALUES
    ('saleitem_001', 'sale_001', 'prod_001', 6, 500.00, 3000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 7. DOCUMENTO/FACTURA DE EJEMPLO
INSERT INTO "Document" ("id", "type", "number", "date", "subtotal", "tax", "total", "status", "notes", "companyId", "clientId", "createdAt", "updatedAt")
VALUES (
    'doc_001',
    'INVOICE',
    'FAC-0001',
    CURRENT_TIMESTAMP,
    2550.50,
    535.61,
    3086.11,
    'SENT',
    'Factura de primera compra',
    'company_demo_001',
    'client_002',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Items del documento
INSERT INTO "DocumentItem" ("id", "description", "quantity", "unitPrice", "productId", "documentId", "createdAt", "updatedAt")
VALUES
    ('docitem_001', 'Arroz Grano Largo 1kg', 2, 850.50, 'prod_002', 'doc_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('docitem_002', 'Aceite de Girasol 900ml', 1, 1250.00, 'prod_003', 'doc_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- ÍNDICES PARA MEJOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_companyId_idx" ON "User"("companyId");
CREATE INDEX IF NOT EXISTS "Client_companyId_idx" ON "Client"("companyId");
CREATE INDEX IF NOT EXISTS "Product_code_idx" ON "Product"("code");
CREATE INDEX IF NOT EXISTS "Product_companyId_idx" ON "Product"("companyId");
CREATE INDEX IF NOT EXISTS "Sale_companyId_idx" ON "Sale"("companyId");
CREATE INDEX IF NOT EXISTS "Document_companyId_idx" ON "Document"("companyId");

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- RESUMEN DE DATOS INSERTADOS:
-- ✓ 1 Empresa: Distribuidora Walter Pimpoyo
-- ✓ 1 Usuario: test@example.com (password: password123)
-- ✓ 3 Clientes
-- ✓ 5 Productos con stock
-- ✓ 1 Venta completada
-- ✓ 1 Factura enviada

