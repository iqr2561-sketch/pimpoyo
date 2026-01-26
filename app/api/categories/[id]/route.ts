import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Modo demo: usar primera empresa si no hay sesión
    let companyId = session?.user?.companyId
    
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst()
      companyId = firstCompany?.id
    }

    if (!companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es requerido' },
        { status: 400 }
      )
    }

    // Verificar que la categoría pertenece a esta empresa
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category || category.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        description: description || null,
      },
    })

    console.log('✅ Categoría actualizada:', params.id)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('❌ Error updating category:', error)
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Modo demo: usar primera empresa si no hay sesión
    let companyId = session?.user?.companyId
    
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst()
      companyId = firstCompany?.id
    }

    if (!companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que la categoría pertenece a esta empresa
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category || category.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    // Verificar si hay productos usando esta categoría
    const productsCount = await prisma.product.count({
      where: { categoryId: params.id },
    })

    if (productsCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar. Hay ${productsCount} producto(s) usando esta categoría.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    console.log('✅ Categoría eliminada:', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error deleting category:', error)
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    )
  }
}
