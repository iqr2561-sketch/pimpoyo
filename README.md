# Factura Rápida

Sistema de facturación web full-stack desarrollado con Next.js 14, TypeScript, Tailwind CSS, Prisma y NextAuth.

## Características

- ✅ Autenticación de usuarios con NextAuth.js
- ✅ Gestión de empresas y clientes
- ✅ Creación de Facturas, Remitos y Presupuestos
- ✅ Generación de PDFs con react-pdf
- ✅ Envío por WhatsApp
- ✅ Diseño mobile-first con Tailwind CSS
- ✅ Base de datos SQLite (fácil migración a PostgreSQL)

## Requisitos Previos

- Node.js 18+ 
- npm o yarn

## Instalación

1. Clonar el repositorio o navegar al directorio del proyecto

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` y configurar:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-aqui
```

4. Inicializar la base de datos:
```bash
npx prisma generate
npx prisma db push
```

5. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

6. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Uso

### Registro de Usuario

1. En la página principal, hacer clic en "Registrarse"
2. Completar el formulario con:
   - Nombre
   - Email
   - Contraseña
   - Nombre de la empresa
   - CUIT de la empresa

### Crear un Documento

1. Iniciar sesión
2. Ir a "Nuevo Documento" desde el sidebar
3. Seleccionar el tipo de documento (Factura, Remito o Presupuesto)
4. Buscar y seleccionar un cliente (o crear uno nuevo desde la API)
5. Agregar items con descripción, cantidad y precio unitario
6. El sistema calculará automáticamente subtotal, IVA (21%) y total
7. Guardar el documento

### Gestionar Documentos

- Ver todos los documentos en el Dashboard
- Hacer clic en un documento para ver detalles
- Descargar PDF
- Enviar por WhatsApp (si el cliente tiene teléfono registrado)

## Estructura del Proyecto

```
/app
  /api          # Rutas API
  /dashboard    # Página del dashboard
  /documents    # Páginas de documentos
/components
  /ui           # Componentes UI reutilizables
  /forms        # Componentes de formularios
  /layout       # Componentes de layout
  /documents    # Componentes de documentos
/lib
  prisma.ts     # Cliente de Prisma
  auth.ts       # Configuración de NextAuth
  utils.ts      # Utilidades
/prisma
  schema.prisma # Schema de la base de datos
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run db:push` - Sincroniza el schema con la base de datos
- `npm run db:generate` - Genera el cliente de Prisma
- `npm run db:studio` - Abre Prisma Studio para ver/editar datos

## Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Prisma** - ORM para la base de datos
- **NextAuth.js** - Autenticación
- **react-pdf** - Generación de PDFs
- **SQLite** - Base de datos (desarrollo)

## Notas

- La base de datos SQLite es perfecta para desarrollo. Para producción, considera migrar a PostgreSQL.
- El archivo `.env` no debe ser commiteado (está en `.gitignore`)
- Los PDFs se generan en el cliente. Para producción, considera generar PDFs en el servidor.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.


