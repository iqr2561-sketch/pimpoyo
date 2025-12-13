# 🚀 DEPLOY EN VERCEL - GUÍA SIMPLE

## ✅ PASO 1: Crear Base de Datos en Neon (2 minutos)

1. Ve a **https://neon.tech**
2. Crea una cuenta (gratis)
3. Click en **"Create a project"**
4. Dale un nombre: `pimpoyo-db`
5. **COPIA LA CONNECTION STRING** que aparece (empieza con `postgresql://`)

## ✅ PASO 2: Configurar Vercel (3 minutos)

1. Ve a tu proyecto en Vercel
2. Click en **Settings** → **Environment Variables**
3. Agrega estas 3 variables:

### Variable 1: DATABASE_URL
```
Nombre: DATABASE_URL
Valor: (pega aquí la URL de Neon que copiaste)
Ejemplo: postgresql://usuario:password@ep-xxx.region.neon.tech/neondb?sslmode=require
```

### Variable 2: NEXTAUTH_URL
```
Nombre: NEXTAUTH_URL
Valor: https://tu-proyecto.vercel.app
(Cambia "tu-proyecto" por el nombre real de tu app en Vercel)
```

### Variable 3: NEXTAUTH_SECRET
```
Nombre: NEXTAUTH_SECRET
Valor: (genera uno ejecutando este comando en tu terminal)

Windows PowerShell:
$bytes = New-Object Byte[] 32; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)

O usa este generador online:
https://generate-secret.vercel.app/32
```

## ✅ PASO 3: Redeploy

1. Ve a **Deployments** en Vercel
2. Click en los **3 puntos** del último deployment
3. Click en **"Redeploy"**
4. Espera 2-3 minutos

## ✅ PASO 4: Inicializar Base de Datos (1 minuto)

En tu computadora, ejecuta:

```bash
DATABASE_URL="(pega aquí la URL de Neon)" npx prisma db push
```

Esto creará todas las tablas.

## ✅ PASO 5: Crear Usuario de Prueba (Opcional)

```bash
DATABASE_URL="(URL de Neon)" npx ts-node scripts/create-test-user.ts
```

O crea uno desde la aplicación usando el botón de registro.

## 🎉 ¡LISTO!

Tu aplicación debería estar funcionando en:
**https://tu-proyecto.vercel.app**

Credenciales de prueba (si usaste el script):
- Email: `test@example.com`
- Password: `password123`

---

## ❓ ¿Problemas?

### Error: "Failed to connect to database"
- Verifica que la DATABASE_URL esté correcta en Vercel
- Asegúrate de que incluye `?sslmode=require` al final

### Error: "NEXTAUTH_SECRET not found"
- Verifica que agregaste las 3 variables en Vercel
- Haz un redeploy después de agregar las variables

### La app carga pero no puedo iniciar sesión
- Ejecuta `prisma db push` con la URL de Neon
- Crea un usuario desde la página de registro

