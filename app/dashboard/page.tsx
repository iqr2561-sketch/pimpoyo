'use client'

import React, { useState } from 'react'
import { ShoppingCart, FileText, Users, Zap, ChevronDown, TrendingUp, DollarSign, FileCheck, Package } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickAccessCard } from '@/components/dashboard/QuickAccessCard'
import AuthGuard from '@/components/auth/AuthGuard'
import { InstallModal } from '@/components/pwa/InstallModal'
import { useRouter } from 'next/navigation'

const timeFilters = ['Este Mes', 'Esta Semana', 'Hoy', 'Este Año']

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('Este Mes')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showMobilePanel, setShowMobilePanel] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const router = useRouter()

  const handleMobileSale = () => {
    setShowMobilePanel(true)
    // Mostrar modal de instalación después de un breve delay
    setTimeout(() => {
      setShowInstallModal(true)
    }, 500)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Título y descripción */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1.5">
              Panel de Control
            </h1>
            <p className="text-slate-500 text-sm">
              Accesos rápidos y resumen de tu negocio
            </p>
          </div>

          {/* Tarjetas de acceso rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <div onClick={handleMobileSale} className="cursor-pointer">
              <QuickAccessCard
                title="Carrito táctil"
                subtitle="Venta Rápida"
                description="Busca, suma y cobra en segundos."
                href="#"
                gradient="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
                icon={<ShoppingCart className="w-20 h-20 text-emerald-400/20" />}
              />
            </div>
            <QuickAccessCard
              title="Factura / Remito"
              subtitle="Documentos"
              description="IVA, notas y PDF listos."
              href="/documents"
              gradient="bg-gradient-to-br from-blue-500/20 to-purple-600/10"
              icon={<FileText className="w-20 h-20 text-blue-400/20" />}
            />
            <QuickAccessCard
              title="Ctas. Corrientes"
              subtitle="Clientes"
              description="Alta rápida y búsqueda."
              href="/clients"
              gradient="bg-gradient-to-br from-cyan-500/20 to-teal-600/10"
              icon={<Users className="w-20 h-20 text-cyan-400/20" />}
            />
            <QuickAccessCard
              title="Atajos"
              subtitle="Accesos"
              description="Documentos y panel."
              href="/shortcuts"
              gradient="bg-gradient-to-br from-orange-500/20 to-amber-600/10"
              icon={<Zap className="w-20 h-20 text-orange-400/20" />}
            />
          </div>

          {/* Sección de estadísticas */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">
                Estadísticas del Negocio
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30 rounded-lg text-xs text-slate-400 transition-colors"
                >
                  <span>{selectedFilter}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg z-10">
                    {timeFilters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter)
                          setShowFilterDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          selectedFilter === filter
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatsCard
                title="Ventas Totales"
                value="$ 36.366,55"
                icon={<DollarSign className="w-5 h-5" />}
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatsCard
                title="Facturas Pagadas"
                value="$ 0,00"
                icon={<FileCheck className="w-5 h-5" />}
              />
              <StatsCard
                title="Documentos"
                value="1"
                icon={<FileText className="w-5 h-5" />}
              />
              <StatsCard
                title="Stock Bajo"
                value="0"
                icon={<Package className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel Móvil */}
      {showMobilePanel && (
        <div className="fixed inset-0 z-50 bg-slate-950">
          <iframe
            src="/mobile"
            className="w-full h-full border-0"
            title="Venta Móvil"
          />
          <button
            onClick={() => {
              setShowMobilePanel(false)
              setShowInstallModal(false)
            }}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Modal de Instalación */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
      </div>
    </AuthGuard>
  )
}
