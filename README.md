# Walter Pimpoyo - Sistema POS

Sistema de punto de venta profesional con diseño moderno y delicado, PWA (Progressive Web App) y facturación integrada.

## Características

- **TPV (Terminal Punto de Venta)**: Interfaz compacta y delicada para ventas rápidas
- **App Móvil PWA**: Instalable en dispositivos móviles, funciona offline
- **Carrito de Compras**: Visualización mejorada con controles intuitivos
- **Dashboard**: Panel de control con estadísticas y accesos rápidos
- **Facturas Pendientes**: Sistema de facturación desde app móvil
- **Configuración AFIP**: Integración con API de AFIP para facturación
- **WhatsApp Integration**: Envío de facturas por WhatsApp
- **Autenticación**: Sistema de login simple (admin/1234)
- **Diseño Moderno**: Interfaz oscura con elementos sutiles y elegantes

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (iconos)

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
├── app/
│   ├── dashboard/      # Página del dashboard
│   ├── tpv/            # Página del terminal punto de venta
│   └── layout.tsx      # Layout principal
├── components/
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de layout (Header, etc.)
│   ├── tpv/            # Componentes del TPV (ProductCard, Cart)
│   └── ui/             # Componentes UI reutilizables
└── app/globals.css     # Estilos globales
```

## Páginas Principales

- `/` - Redirige según dispositivo (móvil → `/mobile`, desktop → `/dashboard`)
- `/login` - Página de inicio de sesión (admin/1234)
- `/dashboard` - Panel de control principal
- `/tpv` - Terminal punto de venta
- `/mobile` - Interfaz móvil para ventas
- `/invoices/pending` - Facturas pendientes por facturar
- `/config` - Configuración de AFIP y WhatsApp

## Características de Diseño

- **Diseño Delicado**: Elementos más compactos, fuentes más pequeñas, espaciado reducido
- **Tema Oscuro**: Fondo oscuro con acentos sutiles en verde esmeralda
- **Transiciones Suaves**: Animaciones sutiles en hover y estados
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## Despliegue

Ver `INSTRUCCIONES_DESPLIEGUE.md` para guía completa de despliegue.

### Quick Start

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Iniciar servidor
npm start
```

### Opciones de Despliegue

- **Vercel** (Recomendado): `vercel --prod`
- **PM2**: `pm2 start ecosystem.config.js`
- **Docker**: `docker build -t pos-app . && docker run -p 3000:3000 pos-app`
- **Script Automático**: `.\deploy.ps1` (Windows) o `./deploy.sh` (Linux/Mac)

## Credenciales de Desarrollo

- **Usuario:** `admin`
- **Contraseña:** `1234`

⚠️ Cambiar en producción.

## Funcionalidades Implementadas

✅ Sistema de autenticación simple  
✅ PWA instalable en móviles  
✅ Panel móvil de ventas  
✅ Facturas pendientes desde app móvil  
✅ Configuración de AFIP y WhatsApp  
✅ Selección rápida de clientes  
✅ Envío de facturas por WhatsApp  
✅ Protección de rutas  
✅ Service Worker para offline  

## Próximos Pasos

- [ ] Integración real con API de AFIP
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación robusta (JWT, OAuth)
- [ ] Gestión completa de productos
- [ ] Reportes y estadísticas avanzadas
- [ ] Backup automático de datos
