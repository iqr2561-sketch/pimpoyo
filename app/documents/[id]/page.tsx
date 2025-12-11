'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { DocumentPreview } from '@/components/documents/DocumentPreview'
import { Button } from '@/components/ui/Button'

interface Document {
  id: string
  type: string
  number: string
  date: Date | string
  subtotal: number
  tax: number
  total: number
  notes?: string | null
  company: {
    name: string
    cuit?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
  }
  client: {
    name: string
    cuit?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
}

export default function DocumentDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated' && params.id) {
      fetchDocument()
    }
  }, [status, router, params.id])

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDocument(data)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        alert('Error al eliminar el documento')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error al eliminar el documento')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !document) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Documento {document.number}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                  Volver
                </Button>
                <Button variant="secondary" onClick={handleDelete}>
                  Eliminar
                </Button>
              </div>
            </div>
            <DocumentPreview document={document} />
          </div>
        </main>
      </div>
    </div>
  )
}


