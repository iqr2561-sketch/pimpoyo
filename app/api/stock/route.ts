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
    const lowStock = searchParams.get('lowStock') === 'true'

    const where: any = {
      companyId: session.user.companyId,
    }

    if (lowStock) {
      where.quantity = { lte: prisma.stock.fields.minQuantity }
    }

    let stock = await prisma.stock.findMany({
      where: {
        companyId: session.user.companyId,
      },
      include: {
        product: true,
      },
      orderBy: {
        product: {
          name: 'asc',
        },
      },
    })

    // Filtrar stock bajo si es necesario
    if (lowStock) {
      stock = stock.filter((s) => s.quantity <= s.minQuantity)
    }

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json(
      { error: 'Error al obtener stock' },
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
    const { productId, type, quantity, reason, reference } = body

    if (!productId || !type || quantity === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const stock = await prisma.stock.findUnique({
      where: { productId },
      include: { product: true },
    })

    if (!stock || stock.companyId !== session.user.companyId) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    let newQuantity = stock.quantity
    if (type === 'IN') {
      newQuantity += quantity
    } else if (type === 'OUT') {
      newQuantity -= quantity
      if (newQuantity < 0) {
        return NextResponse.json(
          { error: 'Stock insuficiente' },
          { status: 400 }
        )
      }
    } else if (type === 'ADJUSTMENT') {
      newQuantity = quantity
    }

    // Actualizar stock y crear movimiento
    const updated = await prisma.stock.update({
      where: { productId },
      data: {
        quantity: newQuantity,
        movements: {
          create: {
            type,
            quantity: Math.abs(quantity),
            reason,
            reference,
            userId: session.user.id,
          },
        },
      },
      include: {
        product: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json(
      { error: 'Error al actualizar stock' },
      { status: 500 }
    )
  }
}

