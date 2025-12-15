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

    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        company: true,
        items: true,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      )
    }

    if (document.companyId !== companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Error al obtener documento' },
      { status: 500 }
    )
  }
}

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
      return NextResponse.json({ error: 'No hay empresas registradas' }, { status: 404 })
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      )
    }

    if (document.companyId !== companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { type, clientId, items, subtotal, tax, total, notes, status } = body

    // Eliminar items existentes
    await prisma.documentItem.deleteMany({
      where: { documentId: params.id },
    })

    // Actualizar documento
    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...(type && { type }),
        ...(clientId && { clientId }),
        ...(subtotal !== undefined && { subtotal }),
        ...(tax !== undefined && { tax }),
        ...(total !== undefined && { total }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
        items: {
          create: items?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        client: true,
        company: true,
        items: true,
      },
    })

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Error al actualizar documento' },
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
      return NextResponse.json({ error: 'No hay empresas registradas' }, { status: 404 })
    }

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      )
    }

    if (document.companyId !== companyId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await prisma.document.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Documento eliminado' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Error al eliminar documento' },
      { status: 500 }
    )
  }
}


