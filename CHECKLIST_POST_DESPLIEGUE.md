# ✅ Checklist Post-Despliegue

## Verificaciones Inmediatas

### 1. Acceso y Autenticación
- [ ] La aplicación carga correctamente
- [ ] El login funciona (admin/1234)
- [ ] Las rutas protegidas redirigen al login
- [ ] El logout funciona correctamente

### 2. PWA (Progressive Web App)
- [ ] El manifest.json es accesible
- [ ] El service worker se registra (ver consola del navegador)
- [ ] El modal de instalación aparece en móvil
- [ ] La app se puede instalar en Android
- [ ] La app se puede instalar en iOS (con instrucciones)

### 3. Funcionalidades Principales
- [ ] Dashboard carga correctamente
- [ ] Las estadísticas se muestran
- [ ] El botón "Carrito táctil" abre el panel móvil
- [ ] El modal de instalación aparece al abrir panel móvil
- [ ] TPV desktop funciona (búsqueda, filtros, carrito)
- [ ] App móvil funciona (crear facturas pendientes)

### 4. Facturación
- [ ] Se pueden crear facturas pendientes desde móvil
- [ ] Las facturas aparecen en `/invoices/pending`
- [ ] Se puede seleccionar/crear cliente rápidamente
- [ ] La configuración de AFIP se guarda
- [ ] La configuración de WhatsApp se guarda
- [ ] El envío por WhatsApp funciona (abre WhatsApp Web)

### 5. Almacenamiento
- [ ] Los datos se guardan en localStorage
- [ ] Los clientes se crean y guardan
- [ ] Las facturas pendientes se guardan
- [ ] La configuración persiste después de recargar

### 6. Performance
- [ ] La aplicación carga rápido
- [ ] No hay errores en la consola
- [ ] Las transiciones son suaves
- [ ] El diseño responsive funciona

## Problemas Comunes y Soluciones

### Si el Service Worker no se registra:
1. Verificar que estés usando HTTPS
2. Verificar que `/sw.js` sea accesible
3. Revisar la consola del navegador para errores
4. Limpiar cache del navegador

### Si el PWA no se instala:
1. Verificar HTTPS (requerido)
2. Verificar que el manifest.json sea válido
3. En iOS: seguir instrucciones del modal
4. En Android: debería aparecer banner automático

### Si los datos no persisten:
1. Verificar que localStorage esté habilitado
2. Verificar que no estés en modo incógnito
3. Revisar permisos del navegador

## Próximos Pasos Recomendados

1. **Probar en diferentes dispositivos**
   - Móvil Android
   - Móvil iOS
   - Tablet
   - Desktop

2. **Configurar dominio personalizado** (si aplica)
   - Configurar DNS
   - Configurar SSL/HTTPS

3. **Monitoreo**
   - Configurar logs
   - Monitorear errores
   - Revisar uso

4. **Mejoras**
   - Integrar AFIP real
   - Configurar base de datos
   - Mejorar autenticación

## Contacto y Soporte

Si encuentras problemas:
1. Revisa los logs del servidor
2. Revisa la consola del navegador
3. Verifica que todas las dependencias estén instaladas
4. Revisa la documentación en `DEPLOY.md`
