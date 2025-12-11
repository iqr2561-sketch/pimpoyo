import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const DEV_EMAIL = 'demo@factura.dev'
const DEV_PASSWORD = 'demo1234'
const DEV_CUIT = '00-00000000-0'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Modo demo deshabilitado en producción' },
      { status: 403 }
    )
  }

  const hashed = await bcrypt.hash(DEV_PASSWORD, 10)

  const company = await prisma.company.upsert({
    where: { cuit: DEV_CUIT },
    update: { name: 'Demo Express' },
    create: {
      name: 'Demo Express',
      cuit: DEV_CUIT,
      address: 'Av. Demo 123',
      phone: '+54 11 5555-5555',
      email: DEV_EMAIL,
    },
  })

  await prisma.user.upsert({
    where: { email: DEV_EMAIL },
    update: {
      name: 'Demo Rápida',
      password: hashed,
      companyId: company.id,
    },
    create: {
      email: DEV_EMAIL,
      name: 'Demo Rápida',
      password: hashed,
      companyId: company.id,
    },
  })

  return NextResponse.json({
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
  })
}

