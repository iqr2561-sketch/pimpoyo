// Script para preparar el schema de Prisma antes del build
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

try {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Detectar si estamos en producción
  const databaseUrl = process.env.DATABASE_URL || '';
  const isProduction = databaseUrl.includes('postgres') || 
                       databaseUrl.includes('postgresql') || 
                       process.env.VERCEL === '1' ||
                       process.env.NODE_ENV === 'production';

  if (isProduction) {
    console.log('🔄 Configurando Prisma para PostgreSQL (producción)...');
    
    // Cambiar SQLite por PostgreSQL
    const updatedSchema = schemaContent.replace(
      /provider\s*=\s*"sqlite"/g,
      'provider = "postgresql"'
    );
    
    fs.writeFileSync(schemaPath, updatedSchema);
    console.log('✅ Schema actualizado para PostgreSQL');
  } else {
    console.log('✅ Usando SQLite para desarrollo local');
  }
} catch (error) {
  console.error('❌ Error preparando el schema:', error.message);
  // No fallar el build si hay error
  process.exit(0);
}

