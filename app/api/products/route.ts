import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')

    const products = await prisma.product.findMany({
      where: {
        companyId: session.user.companyId,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { code: { contains: search } },
            { description: { contains: search } },
          ],
        }),
        ...(category && { category }),
      },
      include: {
        stock: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { code, name, description, price, cost, category, unit, initialStock, minQuantity, maxQuantity, location } = body

    if (!code || !name || price === undefined) {
      return NextResponse.json(
        { error: 'Código, nombre y precio son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el código ya existe
    const existing = await prisma.product.findUnique({
      where: { code },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'El código de producto ya existe' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        code,
        name,
        description,
        price,
        cost,
        category,
        unit: unit || 'UN',
        companyId: session.user.companyId,
        stock: {
          create: {
            quantity: initialStock || 0,
            minQuantity: minQuantity || 0,
            maxQuantity,
            location,
            companyId: session.user.companyId,
          },
        },
      },
      include: {
        stock: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}

