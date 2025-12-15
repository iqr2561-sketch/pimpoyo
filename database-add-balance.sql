-- Migración para agregar campo balance (cuenta corriente) a la tabla Client
-- Ejecutar este script en la base de datos SQLite

-- Agregar columna balance si no existe
ALTER TABLE Client ADD COLUMN balance REAL DEFAULT 0;

-- Actualizar balance existente a 0 si es NULL
UPDATE Client SET balance = 0 WHERE balance IS NULL;

