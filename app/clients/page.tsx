'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Client {
  id: string
  name: string
  cuit?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  createdAt: string
}

export default function ClientsPage() {
  const { data: session, status } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    cuit: '',
    phone: '',
    email: '',
    address: '',
  })

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients'
      const method = editingClient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(editingClient ? 'Cliente actualizado' : 'Cliente creado')
        setFormData({ name: '', cuit: '', phone: '', email: '', address: '' })
        setShowCreateForm(false)
        setEditingClient(null)
        fetchClients()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar cliente')
      }
    } catch (error) {
      alert('Error al guardar cliente')
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      cuit: client.cuit || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (clientId: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Cliente eliminado')
        fetchClients()
      } else {
        alert('Error al eliminar cliente')
      }
    } catch (error) {
      alert('Error al eliminar cliente')
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cuit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Clientes</h1>
                <p className="text-slate-600">Gestión de clientes y cuentas corrientes</p>
              </div>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  + Nuevo Cliente
                </Button>
              )}
            </div>

            {/* Búsqueda */}
            <div className="mb-6">
              <Input
                placeholder="🔍 Buscar por nombre, CUIT o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Formulario de Creación/Edición */}
            {showCreateForm && (
              <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="CUIT"
                      value={formData.cuit}
                      onChange={(e) =>
                        setFormData({ ...formData, cuit: e.target.value })
                      }
                    />
                    <Input
                      label="Teléfono"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <Input
                      label="Dirección"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingClient(null)
                        setFormData({ name: '', cuit: '', phone: '', email: '', address: '' })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingClient ? 'Actualizar' : 'Crear Cliente'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Lista de Clientes */}
            {filteredClients.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay clientes registrados
                </h3>
                <p className="text-slate-600 mb-6">
                  Crea el primer cliente para comenzar
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Crear Primer Cliente
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => (
                  <Card
                    key={client.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {client.name}
                      </h3>
                      <div className="space-y-1 text-sm text-slate-600 mb-4">
                        {client.cuit && (
                          <p>
                            <span className="font-medium">CUIT:</span> {client.cuit}
                          </p>
                        )}
                        {client.phone && (
                          <p>
                            <span className="font-medium">📱:</span> {client.phone}
                          </p>
                        )}
                        {client.email && (
                          <p>
                            <span className="font-medium">✉️:</span> {client.email}
                          </p>
                        )}
                        {client.address && (
                          <p>
                            <span className="font-medium">📍:</span> {client.address}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          Creado: {formatDate(client.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(client)}
                        >
                          ✏️ Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(client.id)}
                        >
                          🗑️ Eliminar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

