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
    const period = searchParams.get('period') || 'month' // day, week, month, year

    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Estadísticas de ventas
    const sales = await prisma.sale.findMany({
      where: {
        companyId: session.user.companyId,
        createdAt: { gte: startDate },
        status: 'COMPLETED',
      },
    })

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    const salesCount = sales.length

    // Estadísticas de documentos
    const documents = await prisma.document.findMany({
      where: {
        companyId: session.user.companyId,
        createdAt: { gte: startDate },
      },
    })

    const invoices = documents.filter((d) => d.type === 'INVOICE' && d.status === 'PAID')
    const totalInvoices = invoices.reduce((sum, doc) => sum + doc.total, 0)

    // Productos con stock bajo
    const allStock = await prisma.stock.findMany({
      where: {
        companyId: session.user.companyId,
      },
      include: {
        product: true,
      },
    })

    const lowStock = allStock.filter((s) => s.quantity <= s.minQuantity)

    // Top productos vendidos
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          companyId: session.user.companyId,
          createdAt: { gte: startDate },
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    })

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })
        return {
          product,
          quantity: item._sum.quantity || 0,
          total: item._sum.subtotal || 0,
        }
      })
    )

    return NextResponse.json({
      sales: {
        total: totalSales,
        count: salesCount,
      },
      invoices: {
        total: totalInvoices,
        count: invoices.length,
      },
      documents: {
        total: documents.length,
      },
      lowStock: lowStock.length,
      lowStockItems: lowStock,
      topProducts: topProductsWithDetails,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}

