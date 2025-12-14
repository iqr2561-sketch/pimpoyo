# Guía de Despliegue - Walter Pimpoyo POS

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Acceso al servidor de producción

## Pasos para Desplegar

### 1. Preparar el Proyecto

```bash
# Instalar dependencias
npm install

# Verificar que no hay errores
npm run build
```

### 2. Configuración de Producción

Asegúrate de que `next.config.js` esté configurado correctamente:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Opcional: para despliegues optimizados
}

module.exports = nextConfig
```

### 3. Variables de Entorno (si es necesario)

Crea un archivo `.env.production` si necesitas variables de entorno:

```env
NODE_ENV=production
```

### 4. Build de Producción

```bash
# Crear build optimizado
npm run build
```

### 5. Opciones de Despliegue

#### Opción A: Vercel (Recomendado)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
vercel --prod
```

#### Opción B: Servidor Propio con PM2

1. Instala PM2:
```bash
npm install -g pm2
```

2. Inicia la aplicación:
```bash
npm run build
pm2 start npm --name "pos-app" -- start
pm2 save
pm2 startup
```

#### Opción C: Docker

1. Crea un `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Instalar dependencias
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. Build y ejecuta:
```bash
docker build -t pos-app .
docker run -p 3000:3000 pos-app
```

#### Opción D: Servidor Node.js Directo

1. En el servidor:
```bash
# Clonar o subir el proyecto
git clone <tu-repo> || scp -r . usuario@servidor:/ruta/app

# Instalar dependencias
npm install --production

# Build
npm run build

# Iniciar
npm start
```

2. Usar un proceso manager como PM2 o systemd para mantenerlo corriendo.

### 6. Configurar HTTPS (Importante para PWA)

Las PWAs requieren HTTPS en producción. Opciones:

- **Vercel/Netlify**: HTTPS automático
- **Nginx reverse proxy**: Configurar SSL con Let's Encrypt
- **Cloudflare**: Proxy con SSL automático

### 7. Verificar el Despliegue

1. Accede a la aplicación en el navegador
2. Verifica que el login funcione (admin/1234)
3. Prueba la instalación PWA
4. Verifica que el panel móvil se abra correctamente

### 8. Monitoreo

- Revisa los logs del servidor
- Verifica que el service worker se registre correctamente
- Prueba en diferentes dispositivos móviles

## Solución de Problemas

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Build failed"
```bash
npm run lint
# Corregir errores de linting
npm run build
```

### PWA no se instala
- Verifica que estés usando HTTPS
- Revisa que `manifest.json` esté accesible
- Verifica que el service worker se registre en la consola del navegador

## Notas Importantes

- **Credenciales de desarrollo**: admin/1234 (cambiar en producción)
- **Almacenamiento**: Actualmente usa localStorage (considerar base de datos en producción)
- **Service Worker**: Se registra automáticamente en `/sw.js`

## Próximos Pasos

1. Configurar base de datos real
2. Implementar autenticación robusta
3. Integrar API de AFIP
4. Configurar backup de datos
