'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DocumentForm } from '@/components/forms/DocumentForm'

export const dynamic = 'force-dynamic'

export default function NewDocument() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    // No hacer nada, la página funciona sin autenticación
  }, [status, router])

  // Modo demo - no verificar autenticación
  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div>Cargando...</div>
  //     </div>
  //   )
  // }

  // if (status === 'unauthenticated') {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Nuevo Documento
              </h2>
              <p className="text-slate-600">
                Completa el formulario para crear un nuevo documento fiscal
              </p>
            </div>
            <DocumentForm />
          </div>
        </main>
      </div>
    </div>
  )
}


