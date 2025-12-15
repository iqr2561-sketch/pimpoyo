import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
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
      return NextResponse.json({ error: 'No hay empresas registradas' }, { status: 404 })
    }

    const sale = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!sale || sale.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error fetching sale:', error)
    return NextResponse.json(
      { error: 'Error al obtener venta' },
      { status: 500 }
    )
  }
}

