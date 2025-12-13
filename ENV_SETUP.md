# Variables de Entorno Requeridas

Este proyecto requiere las siguientes variables de entorno para funcionar correctamente:

## Para Desarrollo Local

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth - REQUERIDO
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-aqui-cambiar-en-produccion"

# Environment
NODE_ENV="development"
```

## Para Producción (Vercel)

Configura las siguientes variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las siguientes variables:

### Variables Requeridas:

- **NEXTAUTH_URL**: La URL de tu aplicación en producción (ej: `https://tu-app.vercel.app`)
- **NEXTAUTH_SECRET**: Genera una clave secreta ejecutando:
  ```bash
  openssl rand -base64 32
  ```
  O usa: https://generate-secret.vercel.app/32

- **DATABASE_URL**: URL de tu base de datos PostgreSQL en producción
  - Puedes usar Vercel Postgres, Supabase, Neon, etc.
  - Ejemplo: `postgresql://user:password@host:5432/database?schema=public`

## Generar NEXTAUTH_SECRET

Opción 1 - En terminal:
```bash
openssl rand -base64 32
```

Opción 2 - En Node.js:
```javascript
require('crypto').randomBytes(32).toString('base64')
```

Opción 3 - Online:
https://generate-secret.vercel.app/32

