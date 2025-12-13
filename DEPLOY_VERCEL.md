# Guía de Deploy en Vercel

## ⚠️ Importante: Base de Datos

Este proyecto usa **PostgreSQL** para producción. SQLite no funciona en Vercel.

## Paso 1: Crear Base de Datos PostgreSQL

### Opción A: Vercel Postgres (Recomendado)

1. Ve a tu proyecto en Vercel
2. Click en la pestaña **Storage**
3. Click en **Create Database**
4. Selecciona **Postgres**
5. Copia la variable `POSTGRES_PRISMA_URL` que te da Vercel

### Opción B: Supabase (Gratis)

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto nuevo
3. Ve a Settings → Database
4. Copia la **Connection String** en modo **Session**
5. Formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Opción C: Neon (Gratis)

1. Ve a [neon.tech](https://neon.tech)
2. Crea un proyecto nuevo
3. Copia la **Connection String**

## Paso 2: Configurar Variables de Entorno en Vercel

Ve a **Settings → Environment Variables** y agrega:

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=tu-secreto-generado
```

### Generar NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

O usa: https://generate-secret.vercel.app/32

## Paso 3: Aplicar Migraciones

Después del primer deploy exitoso, necesitas aplicar las migraciones a tu base de datos:

### Desde tu computadora:

1. Crea un archivo `.env` con la URL de tu base de datos de Vercel:
   ```env
   DATABASE_URL="postgresql://..."
   ```

2. Ejecuta las migraciones:
   ```bash
   npx prisma db push
   ```

3. Crea un usuario de prueba (opcional):
   ```bash
   npx ts-node scripts/create-test-user.ts
   ```

## Paso 4: Redeploy

1. Ve a **Deployments** en Vercel
2. Click en los 3 puntos del último deployment
3. Selecciona **Redeploy**

## Paso 5: Verificar

1. Visita tu aplicación: `https://tu-app.vercel.app`
2. Intenta iniciar sesión con:
   - Email: `test@example.com`
   - Password: `password123`

## Solución de Problemas

### Error: "Failed to collect page data"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de haber ejecutado `prisma db push`
- Redeploy después de agregar las variables

### Error de conexión a la base de datos
- Verifica que la URL de la base de datos sea correcta
- Asegúrate de que la base de datos PostgreSQL esté activa
- Verifica que el formato de la URL incluya `?schema=public` al final si es necesario

### Cambiar de SQLite a PostgreSQL en desarrollo local

Si quieres usar PostgreSQL también en desarrollo:

1. Instala PostgreSQL localmente
2. Cambia `DATABASE_URL` en tu `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/factura_rapida"
   ```
3. Ejecuta:
   ```bash
   npx prisma db push
   ```

