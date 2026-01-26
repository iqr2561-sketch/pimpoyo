import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Modo demo: usar primera empresa si no hay sesión
    let companyId = session?.user?.companyId
    
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst()
      companyId = firstCompany?.id
    }

    if (!companyId) {
      return NextResponse.json({ error: 'No hay empresas registradas' }, { status: 404 })
    }

    const categories = await prisma.category.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Modo demo: usar primera empresa si no hay sesión
    let companyId = session?.user?.companyId
    
    if (!companyId) {
      const firstCompany = await prisma.company.findFirst()
      companyId = firstCompany?.id
    }

    if (!companyId) {
      return NextResponse.json({ error: 'No hay empresas registradas' }, { status: 404 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es requerido' },
        { status: 400 }
      )
    }

    // Verificar si ya existe
    const existing = await prisma.category.findUnique({
      where: {
        companyId_name: {
          companyId,
          name: name.trim(),
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Esta categoría ya existe' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description || null,
        companyId,
      },
    })

    console.log('✅ Categoría creada:', category.id)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating category:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    
    return NextResponse.json(
      { 
        error: 'Error al crear categoría',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
