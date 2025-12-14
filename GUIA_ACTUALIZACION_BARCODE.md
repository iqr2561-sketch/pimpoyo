# 📋 Guía de Actualización: Soporte para Código de Barras

## 🎯 Resumen

Esta guía te ayudará a actualizar tu base de datos para agregar soporte de códigos de barras al sistema TPV.

---

## 📦 Archivos Incluidos

1. **`database-update-barcode.sql`** - Para PostgreSQL (Neon - Producción)
2. **`database-update-barcode-sqlite.sql`** - Para SQLite (Desarrollo Local)

---

## 🚀 Opción 1: PostgreSQL en Neon (Producción)

### Paso 1: Obtener tu Company ID

1. Ve a https://console.neon.tech
2. Abre tu proyecto → **SQL Editor**
3. Ejecuta:
```sql
SELECT id FROM "Company" LIMIT 1;
```
4. Copia el ID (ejemplo: `clxyz123abc456def`)

### Paso 2: Preparar el Script

1. Abre el archivo `database-update-barcode.sql`
2. Busca todas las ocurrencias de `'TU_COMPANY_ID'`
3. Reemplázalas con tu ID real (ejemplo: `'clxyz123abc456def'`)
4. Guarda el archivo

### Paso 3: Ejecutar el Script

1. Copia TODO el contenido del archivo actualizado
2. Pégalo en el SQL Editor de Neon
3. Click en **"Run"** (o Ctrl+Enter)
4. Espera a que termine (verás los productos creados al final)

### Paso 4: Verificar

La última consulta del script mostrará todos los productos con código de barras:

```
code          | barcode         | name                    | price  | category
--------------|-----------------|-------------------------|--------|----------
COCA-1.5L     | 7790895001031   | Coca Cola 1.5L         | 850.00 | Bebidas
AGUA-500ML    | 7790315215012   | Agua Villa del Sur... | 350.00 | Bebidas
...
```

---

## 🏠 Opción 2: SQLite Local (Desarrollo)

### Método A: Con Prisma Studio (Recomendado)

1. Obtén tu Company ID:
```bash
npx prisma studio
```
2. Abre la tabla **Company** y copia tu `id`

3. Abre `database-update-barcode-sqlite.sql`
4. Reemplaza `'TU_COMPANY_ID'` con tu ID
5. Guarda el archivo

6. Ejecuta:
```bash
sqlite3 prisma/dev.db < database-update-barcode-sqlite.sql
```

### Método B: Manual con Prisma Studio

1. Abre Prisma Studio:
```bash
npx prisma studio
```

2. Ve a la tabla **Product**
3. Click en **"Add record"** para cada producto
4. Copia los datos del archivo `.sql` manualmente

---

## 📊 Productos de Prueba Incluidos

### Bebidas (3 productos)
- Coca Cola 1.5L - `7790895001031`
- Agua Villa del Sur 500ml - `7790315215012`
- Fanta Naranja 2L - `7790895002021`

### Lácteos (3 productos)
- Leche Serenísima 1L - `7790387100012`
- Yogur Firme Frutilla 1L - `7790387200019`
- Queso Rallado Sancor 500g - `7790742000013`

### Almacén (4 productos)
- Arroz Gallo Oro 1kg - `7790070451026`
- Aceite Cocinero 900ml - `7790260000017`
- Azúcar Ledesma 1kg - `7790040160010`
- Fideos Matarazzo 500g - `7790040065024`

### Snacks y Golosinas (4 productos)
- Oreo Original 118g - `7622210801234`
- Papas Lays 150g - `7790310450012`
- Chocolate Milka 100g - `7790580123456`
- Alfajor Jorgito - `7790040111011`

### Limpieza (3 productos)
- Lavandina Ayudín 1L - `7790070112015`
- Detergente Magistral 500ml - `7790070115016`
- Jabón Skip 800g - `7790070118017`

### Higiene Personal (3 productos)
- Shampoo Sedal 400ml - `7790070441018`
- Jabón Dove 90g - `7790070442019`
- Pasta Colgate 90g - `7790070443020`

**Total: 20 productos con stock inicial de 50 unidades cada uno**

---

## 🧪 Probar el Escaneo

### Códigos para Probar:

1. **Bebida:** `7790895001031` (Coca Cola)
2. **Lácteo:** `7790387100012` (Leche)
3. **Almacén:** `7790070451026` (Arroz)
4. **Snack:** `7622210801234` (Oreo)

### Prueba Manual (sin escáner):

1. Ve a `/tpv` en tu app
2. En el buscador, escribe: `7790895001031`
3. Presiona **Enter**
4. El producto "Coca Cola 1.5L" debería agregarse al carrito

### Prueba con Escáner:

1. Configura tu escáner para enviar Enter al final
2. Escanea cualquier código de barras de los productos
3. El producto se agrega automáticamente

---

## 🛠️ Comandos Útiles

### Ver productos con barcode:
```sql
SELECT code, barcode, name FROM "Product" WHERE barcode IS NOT NULL;
```

### Actualizar barcode de un producto existente:
```sql
UPDATE "Product" 
SET "barcode" = '7790895001031' 
WHERE "code" = 'PROD001';
```

### Agregar barcode a productos sin código:
```sql
UPDATE "Product" 
SET "barcode" = '779' || substr('0000000000' || id, -10) 
WHERE "barcode" IS NULL;
```

---

## ⚠️ Errores Comunes

### Error: "Column barcode does not exist"
**Solución:** Ejecuta primero:
```bash
npx prisma generate
npx prisma db push
```

### Error: "UNIQUE constraint failed"
**Solución:** Ya existe un producto con ese código de barras. Usa uno diferente.

### Error: "Company not found"
**Solución:** Verifica que reemplazaste `TU_COMPANY_ID` correctamente.

---

## 📱 Imprimir Etiquetas

### Opciones para Imprimir:

1. **Online:** https://barcode.tec-it.com/es/
   - Selecciona "EAN-13"
   - Ingresa el código (13 dígitos)
   - Descarga e imprime

2. **Software:** 
   - **Bartender** (Windows)
   - **BarTender Lite** (Gratis)
   - **Labeljoy** (Mac/Win)

3. **Impresora de Etiquetas:**
   - Zebra ZD220
   - Brother QL-800
   - Dymo LabelWriter

### Tamaño Recomendado:
- Ancho: 40mm
- Alto: 25mm
- Incluye número debajo del código

---

## ✅ Verificación Final

Después de ejecutar el script, verifica:

- [ ] La columna `barcode` existe en la tabla Product
- [ ] Hay al menos 11 productos con códigos de barras
- [ ] Cada producto tiene stock asignado
- [ ] No hay códigos de barras duplicados
- [ ] El TPV puede buscar por código de barras
- [ ] Presionar Enter agrega el producto al carrito

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs de Vercel (para producción)
2. Ejecuta `npx prisma studio` para ver la base de datos
3. Verifica que el schema esté sincronizado: `npx prisma generate`

---

## 🎉 ¡Listo!

Tu sistema ahora soporta códigos de barras. Puedes:
- ✅ Escanear productos en el TPV
- ✅ Buscar por código de barras manualmente
- ✅ Agregar productos al carrito con Enter
- ✅ Mejorar la velocidad de venta en 5x

**Disfruta tu TPV Profesional con escaneo de códigos de barras!** 📷💳

