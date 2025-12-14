-- ============================================
-- Esquema de Base de Datos - Walter Pimpoyo POS
-- PostgreSQL
-- ============================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tabla: Usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'cashier')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Índice para búsqueda rápida por username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- Tabla: Configuración de la Aplicación
-- ============================================
CREATE TABLE IF NOT EXISTS app_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Configuración AFIP
    afip_cuit VARCHAR(20),
    afip_cert_path TEXT,
    afip_key_path TEXT,
    afip_environment VARCHAR(20) DEFAULT 'testing' CHECK (afip_environment IN ('testing', 'production')),
    afip_point_of_sale VARCHAR(10) DEFAULT '1',
    
    -- Configuración WhatsApp
    whatsapp_number VARCHAR(20),
    whatsapp_message_template TEXT DEFAULT 'Hola! Tu factura está lista. Total: {total}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- ============================================
-- Tabla: Clientes
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    cuit VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- ============================================
-- Tabla: Productos
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cost DECIMAL(10, 2) CHECK (cost >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER DEFAULT 0 CHECK (min_stock >= 0),
    category VARCHAR(100),
    barcode VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock) WHERE stock < (SELECT min_stock FROM products WHERE products.id = products.id);

-- ============================================
-- Tabla: Facturas Pendientes
-- ============================================
CREATE TABLE IF NOT EXISTS pending_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_phone VARCHAR(20),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    invoiced_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pending_invoices_status ON pending_invoices(status);
CREATE INDEX IF NOT EXISTS idx_pending_invoices_client_id ON pending_invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_pending_invoices_created_at ON pending_invoices(created_at DESC);

-- ============================================
-- Tabla: Items de Facturas Pendientes
-- ============================================
CREATE TABLE IF NOT EXISTS pending_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES pending_invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pending_invoice_items_invoice_id ON pending_invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_pending_invoice_items_product_id ON pending_invoice_items(product_id);

-- ============================================
-- Tabla: Facturas (Completadas)
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_cuit VARCHAR(20),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax DECIMAL(10, 2) DEFAULT 0 CHECK (tax >= 0),
    invoice_type VARCHAR(20) DEFAULT 'A' CHECK (invoice_type IN ('A', 'B', 'C')),
    point_of_sale VARCHAR(10) NOT NULL,
    cae VARCHAR(50),
    cae_expiration_date DATE,
    afip_status VARCHAR(50),
    pdf_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_cae ON invoices(cae);

-- ============================================
-- Tabla: Items de Facturas
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax DECIMAL(10, 2) DEFAULT 0 CHECK (tax >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON invoice_items(product_id);

-- ============================================
-- Tabla: Sesiones de Usuario
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ============================================
-- Triggers para updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON app_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pending_invoices_updated_at BEFORE UPDATE ON pending_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Datos Iniciales
-- ============================================

-- Insertar usuario administrador por defecto
-- NOTA: La contraseña debe ser hasheada con bcrypt antes de insertar
-- Ejemplo: '1234' hasheado sería '$2b$10$...'
-- Por ahora se inserta un placeholder, debe actualizarse después
INSERT INTO users (username, password_hash, role, full_name)
VALUES ('admin', '$2b$10$PLACEHOLDER_PASSWORD_HASH', 'admin', 'Administrador')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Vistas Útiles
-- ============================================

-- Vista: Productos con stock bajo
CREATE OR REPLACE VIEW products_low_stock AS
SELECT 
    id,
    name,
    code,
    stock,
    min_stock,
    category,
    (min_stock - stock) as stock_needed
FROM products
WHERE stock <= min_stock AND is_active = true
ORDER BY (min_stock - stock) DESC;

-- Vista: Resumen de facturas pendientes
CREATE OR REPLACE VIEW pending_invoices_summary AS
SELECT 
    pi.id,
    pi.client_name,
    pi.client_phone,
    pi.total,
    pi.status,
    pi.created_at,
    COUNT(pii.id) as items_count
FROM pending_invoices pi
LEFT JOIN pending_invoice_items pii ON pi.id = pii.invoice_id
WHERE pi.status = 'pending'
GROUP BY pi.id, pi.client_name, pi.client_phone, pi.total, pi.status, pi.created_at
ORDER BY pi.created_at DESC;

-- ============================================
-- Comentarios en Tablas
-- ============================================
COMMENT ON TABLE users IS 'Usuarios del sistema con autenticación';
COMMENT ON TABLE app_config IS 'Configuración de AFIP y WhatsApp por usuario';
COMMENT ON TABLE clients IS 'Clientes del negocio';
COMMENT ON TABLE products IS 'Catálogo de productos';
COMMENT ON TABLE pending_invoices IS 'Facturas pendientes de procesar desde app móvil';
COMMENT ON TABLE invoices IS 'Facturas completadas y procesadas';
COMMENT ON TABLE user_sessions IS 'Sesiones activas de usuarios';
