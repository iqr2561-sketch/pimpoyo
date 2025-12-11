'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl font-semibold tracking-tight">Factura Rápida</h1>
          </div>
          {session && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-200">
                {session.user?.name || session.user?.email}
              </span>
              <Button variant="secondary" size="sm" onClick={() => signOut()}>
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


