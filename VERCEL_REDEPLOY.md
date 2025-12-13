# 🚨 INSTRUCCIONES CRÍTICAS PARA REDEPLOY EN VERCEL

## ❌ PROBLEMA: Vercel está usando un commit viejo con caché

Tu log muestra:
```
Cloning github.com/iqr2561-sketch/pimpoyo (Branch: master, Commit: 7549c01)
```

Pero el commit actual es: **881c977**

## ✅ SOLUCIÓN: Redeploy SIN CACHÉ

### OPCIÓN 1: Redeploy desde la interfaz (RECOMENDADO)

1. Ve a tu proyecto en **Vercel**
2. Click en **Settings** (arriba)
3. Busca la sección **"Git"**
4. **DESCONECTA** temporalmente el repositorio (Disconnect)
5. **VUELVE A CONECTAR** el repositorio (Connect Git Repository)
6. Esto forzará un nuevo deployment fresco

### OPCIÓN 2: Deploy Manual desde terminal

```bash
# Instala Vercel CLI si no lo tienes
npm i -g vercel

# Login
vercel login

# Deploy forzando sin caché
vercel --force
```

### OPCIÓN 3: Trigger desde GitHub

1. Ve a tu repositorio en GitHub
2. Haz un cambio mínimo (por ejemplo, agrega un espacio en README.md)
3. Commit y push
4. Esto disparará un nuevo deployment

### OPCIÓN 4: Borrar y recrear proyecto en Vercel

1. En Vercel → Settings → Danger Zone
2. "Delete Project"
3. Importa de nuevo el proyecto desde GitHub
4. Configura las variables de entorno de nuevo

## 🔑 Variables de Entorno Requeridas

Después del redeploy, asegúrate de tener:

```
DATABASE_URL=postgresql://... (de Neon)
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=(genera con: openssl rand -base64 32)
```

## 📋 Checklist Post-Deploy

- [ ] Variables de entorno configuradas
- [ ] Deployment usa commit 881c977 o más reciente
- [ ] Build completa sin errores
- [ ] Ejecutaste: `DATABASE_URL="..." npx prisma db push`
- [ ] Puedes acceder a la app en el navegador

## ⚡ Deploy Exitoso Se Ve Así:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (18/18)
✓ Finalizing page optimization
```

NO debe decir "Error occurred prerendering page"

---

## 🆘 Si Aún Falla

Envíame el nuevo log COMPLETO del deployment para diagnosticar.

