'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export const dynamic = 'force-dynamic'

interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('El nombre de la categoría es requerido')
      return
    }

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(editingCategory ? '✅ Categoría actualizada' : '✅ Categoría creada')
        setFormData({ name: '', description: '' })
        setShowCreateForm(false)
        setEditingCategory(null)
        fetchCategories()
      } else {
        const error = await response.json()
        alert(`❌ Error: ${error.error || 'Error al guardar'}`)
      }
    } catch (error) {
      alert('❌ Error al guardar categoría')
      console.error(error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('✅ Categoría eliminada')
        fetchCategories()
      } else {
        const error = await response.json()
        alert(`❌ Error: ${error.error || 'Error al eliminar'}`)
      }
    } catch (error) {
      alert('❌ Error al eliminar categoría')
      console.error(error)
    }
  }

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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">📂 Categorías de Productos</h1>
                <p className="text-slate-600">Administra las categorías de tu inventario</p>
              </div>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  + Nueva Categoría
                </Button>
              )}
            </div>

            {/* Formulario de Creación/Edición */}
            {showCreateForm && (
              <Card className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nombre de la Categoría *"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Bebidas, Alimentos, Electrónica, etc."
                    required
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Descripción (opcional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Descripción de la categoría..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingCategory(null)
                        setFormData({ name: '', description: '' })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {editingCategory ? 'Actualizar' : 'Crear Categoría'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Lista de Categorías */}
            {categories.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No hay categorías registradas
                </h3>
                <p className="text-slate-600 mb-6">
                  Crea la primera categoría para comenzar a organizar tus productos
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Crear Primera Categoría
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-shadow duration-200 flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        📂 {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-slate-600 mb-4">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(category)}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(category.id)}
                      >
                        🗑️ Eliminar
                      </Button>
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
