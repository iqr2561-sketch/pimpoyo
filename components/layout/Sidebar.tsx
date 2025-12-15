'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: '💳 TPV PROFESIONAL', href: '/tpv', icon: '💳', highlight: true, badge: 'NUEVO' },
  { name: 'Venta Rápida', href: '/sales/quick', icon: '⚡' },
  { name: 'Productos', href: '/products', icon: '📦' },
  { name: 'Stock', href: '/stock', icon: '📋' },
  { name: 'Ventas', href: '/sales', icon: '💰' },
  { name: 'Documentos', href: '/documents', icon: '📄' },
  { name: 'Nuevo Documento', href: '/documents/new', icon: '➕' },
  { name: 'Usuarios', href: '/users', icon: '👥' },
  { name: 'Móvil', href: '/mobile', icon: '📱' },
  { name: 'Configuración', href: '/settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 border-r border-white/10 shadow-xl shadow-slate-900/40">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isHighlight = 'highlight' in item && item.highlight
            const badge = 'badge' in item ? item.badge : null
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 relative group',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/30'
                      : isHighlight
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:scale-105 ring-2 ring-emerald-400/50 animate-pulse'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={cn("font-medium text-sm", isHighlight && "font-extrabold")}>
                    {item.name}
                  </span>
                  {badge && !isActive && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full animate-bounce shadow-lg">
                      {badge}
                    </span>
                  )}
                  {isHighlight && !isActive && (
                    <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}


