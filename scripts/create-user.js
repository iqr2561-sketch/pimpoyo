const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Crear empresa de prueba
    const company = await prisma.company.upsert({
      where: { cuit: '20-12345678-9' },
      update: {},
      create: {
        name: 'Empresa de Prueba',
        cuit: '20-12345678-9',
        address: 'Calle Falsa 123',
        phone: '+5491112345678',
        email: 'empresa@prueba.com',
      },
    })

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Usuario de Prueba',
        password: hashedPassword,
        companyId: company.id,
      },
    })

    console.log('\n✅ Usuario de prueba creado exitosamente!\n')
    console.log('📧 Email: test@example.com')
    console.log('🔑 Contraseña: password123')
    console.log('🏢 Empresa:', company.name)
    console.log('\n')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()


