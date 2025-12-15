'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    // Modo demo - permitir acceso sin autenticación
    // Cargar usuarios siempre (modo demo)
    fetchUsers()
  }, [status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(editingUser ? 'Usuario actualizado' : 'Usuario creado')
        setFormData({ name: '', email: '', password: '' })
        setShowCreateForm(false)
        setEditingUser(null)
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar usuario')
      }
    } catch (error) {
      alert('Error al guardar usuario')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Usuario eliminado')
        fetchUsers()
      } else {
        alert('Error al eliminar usuario')
      }
    } catch (error) {
      alert('Error al eliminar usuario')
    }
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  // Modo demo - no verificar autenticación
  // if (status === 'unauthenticated') {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Gestión de Usuarios
                </h1>
                <p className="text-slate-600">
                  Administra los usuarios que pueden acceder al sistema
                </p>
              </div>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  + Nuevo Usuario
                </Button>
              )}
            </div>

            {/* Formulario de Creación/Edición */}
            {showCreateForm && (
              <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
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
                      label="Email *"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={!!editingUser}
                    />
                  </div>
                  <Input
                    label={
                      editingUser
                        ? 'Nueva Contraseña (dejar vacío para mantener actual)'
                        : 'Contraseña *'
                    }
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                    minLength={6}
                  />
                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingUser ? 'Actualizar' : 'Crear Usuario'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Lista de Usuarios */}
            <div className="grid gap-4">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {user.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-1">
                        📧 {user.email}
                      </p>
                      <p className="text-xs text-slate-500">
                        Creado: {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {users.length === 0 && !showCreateForm && (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay usuarios registrados
                </h3>
                <p className="text-slate-600 mb-6">
                  Crea el primer usuario para comenzar
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Crear Primer Usuario
                </Button>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

