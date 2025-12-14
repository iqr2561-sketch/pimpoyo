// Middleware desactivado temporalmente - venta móvil sin login
// export { default } from 'next-auth/middleware'

// export const config = {
//   matcher: ['/dashboard/:path*', '/documents/:path*'],
// }

export function middleware() {
  // Sin protección - acceso libre
  return null
}


