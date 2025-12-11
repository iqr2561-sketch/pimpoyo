'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'

interface Client {
  id: string
  name: string
  cuit?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
}

interface ClientSelectorProps {
  value?: string
  onChange: (clientId: string, client: Client) => void
  companyId: string
}

export function ClientSelector({ value, onChange, companyId }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetch(`/api/clients?search=${encodeURIComponent(searchTerm)}&companyId=${companyId}`)
        .then((res) => res.json())
        .then((data) => setClients(data))
        .catch(console.error)
    } else {
      setClients([])
    }
  }, [searchTerm, companyId])

  const handleSelect = (client: Client) => {
    setSelectedClient(client)
    setSearchTerm(client.name)
    setShowDropdown(false)
    onChange(client.id, client)
  }

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative">
      <Input
        label="Cliente"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setShowDropdown(true)
          if (!e.target.value) {
            setSelectedClient(null)
            onChange('', {} as Client)
          }
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Buscar cliente..."
      />
      {showDropdown && filteredClients.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredClients.map((client) => (
            <button
              key={client.id}
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleSelect(client)}
            >
              <div className="font-medium">{client.name}</div>
              {client.cuit && (
                <div className="text-sm text-gray-500">CUIT: {client.cuit}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


