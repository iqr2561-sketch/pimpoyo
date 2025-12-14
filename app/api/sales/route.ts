import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateDocumentNumber } from '@/lib/utils'

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

    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')

    const where: any = {
      companyId: companyId,
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    if (status) {
      where.status = status
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Error al obtener ventas' },
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
    const { items, clientId, paymentMethod } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Debe incluir al menos un item' },
        { status: 400 }
      )
    }

    // Verificar stock y calcular totales
    let subtotal = 0
    const saleItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { stock: true },
      })

      if (!product || product.companyId !== companyId) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 400 }
        )
      }

      if (!product.stock || product.stock.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        )
      }

      const itemSubtotal = item.quantity * item.unitPrice
      subtotal += itemSubtotal
      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: itemSubtotal,
      })
    }

    const tax = subtotal * 0.21
    const total = subtotal + tax

    // Crear venta
    const sale = await prisma.sale.create({
      data: {
        number: generateDocumentNumber('SALE'),
        clientId,
        companyId: companyId,
        subtotal,
        tax,
        total,
        paymentMethod,
        status: 'COMPLETED',
        items: {
          create: saleItems,
        },
      },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Actualizar stock
    for (const item of items) {
      const stock = await prisma.stock.findUnique({
        where: { productId: item.productId },
      })

      if (stock) {
        await prisma.stock.update({
          where: { productId: item.productId },
          data: {
            quantity: stock.quantity - item.quantity,
            movements: {
              create: {
                type: 'OUT',
                quantity: item.quantity,
                reason: 'Venta',
                reference: sale.id,
                userId: session.user.id,
              },
            },
          },
        })
      }
    }

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: 'Error al crear venta' },
      { status: 500 }
    )
  }
}

