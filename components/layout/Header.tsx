'use client'

import React from 'react'
import { ShoppingCart, LayoutDashboard, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/auth'

export const Header: React.FC = () => {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <h1 className="text-base font-semibold text-white">Terminal Punto de Venta</h1>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Sistema de cobro profesional
            </span>
          </div>
          
          <nav className="flex items-center space-x-1.5">
            <Link
              href="/sales"
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
            >
              Ventas
            </Link>
            <Link
              href="/dashboard"
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors flex items-center space-x-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <div className="flex items-center space-x-1.5 ml-3 pl-3 border-l border-slate-700/50">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-400">{user?.username || 'Usuario'}</span>
              <button
                onClick={handleLogout}
                className="p-1 text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
