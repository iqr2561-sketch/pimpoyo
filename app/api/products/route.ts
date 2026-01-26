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
    const categoryId = searchParams.get('categoryId')

    const products = await prisma.product.findMany({
      where: {
        companyId: companyId,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { code: { contains: search } },
            { description: { contains: search } },
          ],
        }),
        ...(categoryId && { categoryId }),
      },
      include: {
        stock: true,
        category: true,
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
    const { code, barcode, name, description, price, cost, margin, categoryId, imageUrl, unit, initialStock, minQuantity, maxQuantity, location } = body

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

    // Crear producto primero
    const product = await prisma.product.create({
      data: {
        code,
        barcode,
        name,
        description,
        price: parseFloat(String(price)),
        cost: cost ? parseFloat(String(cost)) : null,
        margin: margin ? parseFloat(String(margin)) : null,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        unit: unit || 'UN',
        companyId: companyId,
      },
    })

    // Crear stock después
    const stock = await prisma.stock.create({
      data: {
        productId: product.id,
        quantity: parseFloat(String(initialStock)) || 0,
        minQuantity: parseFloat(String(minQuantity)) || 0,
        maxQuantity: maxQuantity ? parseFloat(String(maxQuantity)) : null,
        location,
        companyId: companyId,
      },
    })

    const productWithStock = {
      ...product,
      stock,
    }

    console.log('✅ Producto creado exitosamente:', product.id)
    return NextResponse.json(productWithStock, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating product:', error)
    
    // Loguear detalles específicos del error
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Error al crear producto',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

