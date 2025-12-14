-- ============================================
-- Datos de Prueba - Walter Pimpoyo POS
-- ============================================
-- NOTA: Solo usar en desarrollo/testing
-- NO ejecutar en producción sin revisar

-- ============================================
-- Usuario Administrador
-- ============================================
-- IMPORTANTE: Cambiar la contraseña después de crear
-- Para generar hash de contraseña, usar: node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('1234', 10));"
INSERT INTO users (username, password_hash, role, full_name, email)
VALUES ('admin', '$2b$10$PLACEHOLDER_REPLACE_WITH_REAL_HASH', 'admin', 'Administrador', 'admin@walter-pimpoyo.com')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Productos de Ejemplo
-- ============================================
INSERT INTO products (name, code, price, stock, category, description) VALUES
('Aceite de Girasol 900ml', 'ACE001', 1250.00, 74, 'Almacén', 'Aceite de girasol marca líder'),
('Arroz Grano Largo 1kg', 'ARR001', 850.50, 45, 'Almacén', 'Arroz de grano largo premium'),
('Detergente Líquido 1L', 'DET001', 650.00, 32, 'Limpieza', 'Detergente líquido concentrado'),
('Jabón en Polvo 800g', 'JAB001', 420.75, 28, 'Limpieza', 'Jabón en polvo para ropa'),
('Aceite de Oliva Extra Virgen 500ml', 'ACE002', 1850.00, 15, 'Productos Especiales', 'Aceite de oliva extra virgen premium')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- Clientes de Ejemplo
-- ============================================
INSERT INTO clients (name, phone, email, address) VALUES
('Cliente Ejemplo 1', '5491123456789', 'cliente1@example.com', 'Calle Falsa 123'),
('Cliente Ejemplo 2', '5491123456790', 'cliente2@example.com', 'Av. Principal 456')
ON CONFLICT DO NOTHING;

-- ============================================
-- Configuración por Defecto
-- ============================================
-- Asociar configuración al usuario admin
INSERT INTO app_config (user_id, afip_environment, afip_point_of_sale, whatsapp_message_template)
SELECT 
    u.id,
    'testing',
    '1',
    'Hola! Tu factura está lista. Total: {total}'
FROM users u
WHERE u.username = 'admin'
ON CONFLICT (user_id) DO NOTHING;
