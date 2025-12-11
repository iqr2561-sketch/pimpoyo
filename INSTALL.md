# Guía de Instalación Rápida

## Pasos para comenzar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env`
   - Editar `.env` y configurar:
     ```
     DATABASE_URL="file:./dev.db"
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=genera-una-clave-secreta-aleatoria-aqui
     ```
   - Para generar una clave secreta, puedes usar:
     ```bash
     openssl rand -base64 32
     ```

3. **Inicializar la base de datos:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   - Ir a [http://localhost:3000](http://localhost:3000)

## Primeros pasos

1. **Registrar un usuario:**
   - En la página principal, hacer clic en "Registrarse"
   - Completar el formulario con tus datos y los de tu empresa

2. **Crear un cliente (opcional):**
   - Puedes crear clientes desde la API o directamente al crear un documento
   - Para crear un cliente, hacer una petición POST a `/api/clients` con:
     ```json
     {
       "name": "Nombre del Cliente",
       "cuit": "20-12345678-9",
       "address": "Dirección",
       "phone": "+5491112345678",
       "email": "cliente@example.com"
     }
     ```

3. **Crear tu primer documento:**
   - Ir a "Nuevo Documento" desde el sidebar
   - Seleccionar tipo de documento
   - Buscar o crear un cliente
   - Agregar items
   - Guardar

## Solución de problemas

### Error: "Prisma Client hasn't been generated"
```bash
npx prisma generate
```

### Error: "Database not found"
```bash
npx prisma db push
```

### Error de autenticación
- Verificar que `NEXTAUTH_SECRET` esté configurado en `.env`
- Verificar que `NEXTAUTH_URL` coincida con la URL del servidor

## Comandos útiles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npx prisma studio` - Abrir Prisma Studio (interfaz visual de la BD)
- `npx prisma db push` - Sincronizar schema con la BD
- `npx prisma generate` - Regenerar cliente de Prisma


