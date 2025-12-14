'use client'

import React, { useState, useEffect } from 'react'
import { Search, UserPlus, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { searchClients, createClient, Client, getClients } from '@/lib/storage'

interface QuickClientSelectorProps {
  onSelect: (client: Client) => void
  onClose: () => void
  initialPhone?: string
}

export const QuickClientSelector: React.FC<QuickClientSelectorProps> = ({
  onSelect,
  onClose,
  initialPhone = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    phone: initialPhone,
    email: '',
  })

  useEffect(() => {
    if (searchQuery) {
      const results = searchClients(searchQuery)
      setClients(results)
    } else {
      setClients(getClients().slice(0, 5))
    }
  }, [searchQuery])

  useEffect(() => {
    if (initialPhone) {
      setShowNewClient(true)
    }
  }, [initialPhone])

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.phone) {
      return
    }
    const client = createClient(
      newClient.name,
      newClient.phone,
      newClient.email || undefined
    )
    onSelect(client)
  }

  const handleSelectClient = (client: Client) => {
    onSelect(client)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Seleccionar Cliente</h2>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {!showNewClient ? (
            <>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{client.name}</p>
                          <p className="text-xs text-slate-400">{client.phone}</p>
                        </div>
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No se encontraron clientes
                  </p>
                )}
              </div>

              <Button
                variant="secondary"
                onClick={() => setShowNewClient(true)}
                className="w-full flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Nuevo Cliente</span>
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Nuevo Cliente</h3>
              <Input
                label="Nombre"
                type="text"
                placeholder="Nombre completo"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                placeholder="5491123456789"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                required
              />
              <Input
                label="Email (opcional)"
                type="email"
                placeholder="cliente@email.com"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewClient(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateClient}
                  className="flex-1"
                  disabled={!newClient.name || !newClient.phone}
                >
                  Crear y Seleccionar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
