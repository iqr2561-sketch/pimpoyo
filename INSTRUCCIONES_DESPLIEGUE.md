# 🚀 Instrucciones de Despliegue - Walter Pimpoyo POS

## ✅ Estado del Proyecto

Todos los cambios han sido aplicados y el proyecto está listo para desplegarse.

## 📋 Pasos para Desplegar

### 1. Instalar Dependencias

```powershell
npm install
```

### 2. Verificar que Todo Funciona

```powershell
# Build de desarrollo (verifica errores)
npm run build
```

Si hay errores, corrígelos antes de continuar.

### 3. Opciones de Despliegue

#### Opción A: Vercel (Más Fácil - Recomendado)

1. **Instalar Vercel CLI:**
```powershell
npm install -g vercel
```

2. **Desplegar:**
```powershell
vercel --prod
```

3. Sigue las instrucciones en pantalla. Vercel configurará HTTPS automáticamente.

#### Opción B: Script Automático (Windows)

```powershell
.\deploy.ps1
```

Este script:
- Verifica Node.js y npm
- Limpia builds anteriores
- Instala dependencias
- Hace el build de producción
- Te indica cómo iniciar la app

#### Opción C: Manual

```powershell
# 1. Instalar dependencias
npm install

# 2. Build de producción
npm run build

# 3. Iniciar servidor
npm start
```

#### Opción D: Con PM2 (Para mantener corriendo)

```powershell
# 1. Instalar PM2 globalmente
npm install -g pm2

# 2. Build
npm run build

# 3. Iniciar con PM2
pm2 start ecosystem.config.js

# 4. Guardar configuración
pm2 save

# 5. Configurar inicio automático
pm2 startup
```

#### Opción E: Docker

```powershell
# 1. Build de la imagen
docker build -t walter-pimpoyo-pos .

# 2. Ejecutar contenedor
docker run -p 3000:3000 walter-pimpoyo-pos
```

## 🔐 Credenciales de Acceso

**Usuario:** `admin`  
**Contraseña:** `1234`

⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción.

## 🌐 Configuración de Dominio y HTTPS

### Para PWA (Requerido)

Las Progressive Web Apps **requieren HTTPS** en producción. Opciones:

1. **Vercel/Netlify:** HTTPS automático
2. **Nginx con Let's Encrypt:**
   ```bash
   # Instalar certbot
   sudo apt-get install certbot python3-certbot-nginx
   
   # Obtener certificado
   sudo certbot --nginx -d tudominio.com
   ```

3. **Cloudflare:** Proxy con SSL automático

### Configuración Nginx (Ejemplo)

```nginx
server {
    listen 80;
    server_name tudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ Verificación Post-Despliegue

1. ✅ Acceder a la aplicación
2. ✅ Probar login con admin/1234
3. ✅ Verificar que el dashboard carga
4. ✅ Probar el botón "Carrito táctil" (debe abrir panel móvil)
5. ✅ Verificar que aparece el modal de instalación PWA
6. ✅ Probar crear una factura pendiente desde móvil
7. ✅ Verificar que las facturas pendientes aparecen en `/invoices/pending`
8. ✅ Probar configuración en `/config`

## 📱 Probar PWA

1. Abre la app en un dispositivo móvil
2. Debe aparecer el modal de instalación
3. En Android: botón "Instalar"
4. En iOS: Compartir > "Agregar a pantalla de inicio"

## 🐛 Solución de Problemas

### Error: "Module not found"
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Error: "Build failed"
```powershell
npm run lint
# Corregir errores mostrados
npm run build
```

### PWA no se instala
- ✅ Verificar HTTPS está activo
- ✅ Verificar que `/manifest.json` es accesible
- ✅ Verificar que `/sw.js` se registra (consola del navegador)
- ✅ Verificar que el service worker está en `/public/sw.js`

### Puerto ya en uso
```powershell
# Cambiar puerto en package.json o usar variable de entorno
$env:PORT=3001
npm start
```

## 📊 Monitoreo

### Con PM2
```powershell
pm2 status          # Ver estado
pm2 logs            # Ver logs
pm2 monit           # Monitor en tiempo real
pm2 restart all     # Reiniciar
```

### Logs
- PM2: `./logs/out.log` y `./logs/err.log`
- Next.js: salida estándar

## 🔄 Actualizaciones Futuras

1. Hacer cambios en el código
2. Ejecutar `npm run build`
3. Reiniciar el servidor:
   - PM2: `pm2 restart walter-pimpoyo-pos`
   - Manual: Detener (Ctrl+C) y `npm start`
   - Docker: Rebuild y restart contenedor

## 📝 Notas Importantes

- **Almacenamiento:** Actualmente usa `localStorage` (solo navegador)
- **Base de datos:** No implementada aún (usar en producción)
- **Autenticación:** Simple (admin/1234) - mejorar en producción
- **Service Worker:** Se registra automáticamente

## 🎯 Próximos Pasos Recomendados

1. ✅ Configurar base de datos (PostgreSQL/MongoDB)
2. ✅ Implementar autenticación robusta
3. ✅ Integrar API real de AFIP
4. ✅ Configurar backups automáticos
5. ✅ Implementar logging profesional
6. ✅ Configurar monitoreo (Sentry, etc.)

## 📞 Soporte

Si encuentras problemas durante el despliegue:
1. Revisa los logs del servidor
2. Verifica la consola del navegador
3. Revisa `DEPLOY.md` para más detalles

---

**¡Listo para desplegar! 🚀**
