# Base de Datos - Walter Pimpoyo POS

## Estructura

- `schema.sql` - Esquema completo de la base de datos
- `migrations/` - Migraciones incrementales
- `seed.sql` - Datos de prueba para desarrollo

## Instalación

### 1. Crear la base de datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE walter_pimpoyo;

# Salir
\q
```

### 2. Aplicar el esquema

```bash
psql -U postgres -d walter_pimpoyo -f database/schema.sql
```

### 3. (Opcional) Cargar datos de prueba

```bash
psql -U postgres -d walter_pimpoyo -f database/seed.sql
```

## Variables de Entorno

Configurar en `.env` o `.env.production`:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/walter_pimpoyo
```

## Seguridad

⚠️ **IMPORTANTE:**

1. **Cambiar contraseña del usuario admin** después de crear la base de datos
2. **NO usar seed.sql en producción**
3. **Usar contraseñas seguras** para usuarios de base de datos
4. **Habilitar SSL** para conexiones remotas

## Generar Hash de Contraseña

Para generar el hash de la contraseña del usuario admin:

```bash
# Con Node.js y bcrypt
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('tu_password', 10));"

# O usar una herramienta online de bcrypt
```

Luego actualizar en la base de datos:

```sql
UPDATE users 
SET password_hash = 'hash_generado_aqui' 
WHERE username = 'admin';
```

## Backup

```bash
# Crear backup
pg_dump -U postgres walter_pimpoyo > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres -d walter_pimpoyo < backup_20240101.sql
```
