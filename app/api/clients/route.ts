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

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    companyId = searchParams.get('companyId') || companyId

    const clients = await prisma.client.findMany({
      where: {
        companyId,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { cuit: { contains: search } },
          ],
        }),
      },
      take: 10,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
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
    const { name, cuit, address, phone, email, condicionIVA, tipoDocumento } = body

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        name,
        cuit,
        address,
        phone,
        email,
        ...(condicionIVA && { condicionIVA }),
        ...(tipoDocumento && { tipoDocumento }),
        companyId: companyId,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}


