'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Venta Rápida', href: '/sales/quick', icon: '⚡' },
  { name: 'Productos', href: '/products', icon: '📦' },
  { name: 'Stock', href: '/stock', icon: '📋' },
  { name: 'Ventas', href: '/sales', icon: '💰' },
  { name: 'Documentos', href: '/documents', icon: '📄' },
  { name: 'Nuevo Documento', href: '/documents/new', icon: '➕' },
  { name: 'Móvil', href: '/mobile', icon: '📱' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 border-r border-white/10 shadow-xl shadow-slate-900/40">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}


