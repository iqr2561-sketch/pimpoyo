'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  // Modo demo - permitir acceso sin autenticación
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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Configuración</h1>
              <p className="text-slate-600">Gestiona los datos de tu empresa</p>
            </div>

            {/* Datos Fiscales */}
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Datos Fiscales</h2>
                <p className="text-slate-600 mb-6">
                  Completa estos datos para poder generar facturas electrónicas.
                </p>
                <div className="space-y-4">
                  <Input label="Razón Social" placeholder="Nombre de la empresa" />
                  <Input label="CUIT" placeholder="20-12345678-9" />
                  <Input label="Condición IVA" placeholder="Responsable Inscripto" />
                  <Input label="Domicilio Fiscal" placeholder="Calle y número" />
                  <Input label="Punto de Venta AFIP" placeholder="0001" />
                  <Button className="w-full">Guardar Datos Fiscales</Button>
                </div>
              </div>
            </Card>

            {/* Configuración General */}
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Configuración General</h2>
                <div className="space-y-4">
                  <Input label="Nombre del Comercio" placeholder="Mi Comercio" />
                  <Input label="Email de Contacto" type="email" placeholder="contacto@empresa.com" />
                  <Input label="Teléfono" placeholder="+54 9 11 1234-5678" />
                  <Button className="w-full">Guardar Configuración</Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

