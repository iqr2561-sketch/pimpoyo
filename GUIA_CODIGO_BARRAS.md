# 📷 Guía de Uso: Código de Barras en TPV

## 🎉 ¡Nueva Funcionalidad!

Tu TPV ahora soporta **escaneo de códigos de barras** para agregar productos al carrito de forma instantánea.

---

## 🚀 Cómo Funciona

### 1. **Escaneo Automático**
Cuando conectas un escáner de código de barras (USB o Bluetooth):

1. El escáner lee el código de barras
2. Escribe el código en el campo de búsqueda automáticamente
3. Presiona **Enter** (la mayoría de escáneres lo hacen automáticamente)
4. **¡El producto se agrega al carrito al instante!**
5. El buscador se limpia y queda listo para el siguiente escaneo

### 2. **Búsqueda Manual**
También puedes escribir el código de barras manualmente:

1. Escribe el código en el buscador
2. Presiona **Enter**
3. Si existe, se agrega al carrito automáticamente

---

## 📋 Actualizar Base de Datos

### Paso 1: Ejecutar Script SQL en Neon

1. Ve a https://console.neon.tech
2. Abre tu proyecto → **SQL Editor**
3. Copia el contenido de **`database-add-barcode.sql`**
4. Pégalo en el editor
5. Click en **Run**

Esto agregará:
- ✅ Columna `barcode` a la tabla `Product`
- ✅ Índice para búsqueda rápida
- ✅ Códigos de ejemplo para productos existentes

---

## 🏷️ Agregar Códigos de Barras a Productos

### Opción 1: Al Crear Producto Nuevo

**En el Formulario de Productos:**
1. Ve a **Productos → Nuevo Producto**
2. Completa los campos normales
3. En **"Código de Barras"**, escanea o escribe el código
4. Guarda

**En Creación Rápida (durante facturación):**
1. Click en **"⚡ Producto Nuevo"**
2. Completa código, nombre, precio
3. Escanea o escribe el código de barras
4. Crear producto

### Opción 2: Actualizar Productos Existentes

**Por SQL (múltiples productos):**
```sql
-- Ejemplo: Actualizar un producto específico
UPDATE "Product" 
SET "barcode" = '7790001234567' 
WHERE code = 'PROD001';
```

**Por aplicación (uno a uno):**
1. Ve a **Productos**
2. Edita cada producto
3. Agrega su código de barras
4. Guarda

---

## 🔢 Formatos de Códigos de Barras Soportados

### EAN-13 (Más común en Argentina)
- **Dígitos:** 13
- **Ejemplo:** 7790001234567
- **Uso:** Productos de consumo masivo

### UPC-A (Estados Unidos)
- **Dígitos:** 12
- **Ejemplo:** 012345678905
- **Uso:** Importados de USA

### EAN-8 (Productos pequeños)
- **Dígitos:** 8
- **Ejemplo:** 12345670
- **Uso:** Productos de tamaño reducido

### CODE-39 (Uso interno)
- **Caracteres:** Alfanumérico
- **Ejemplo:** ABC-123
- **Uso:** Códigos internos personalizados

---

## 🛠️ Configurar Escáner de Código de Barras

### Escáneres USB (Más comunes)

1. **Conecta el escáner** al puerto USB
2. La mayoría funciona como teclado (no necesita drivers)
3. Apunta y escanea - ¡Listo!

**Configuraciones recomendadas:**
- ✅ **Enviar Enter después de escanear:** Activado (la mayoría lo tiene por defecto)
- ✅ **Prefijo/Sufijo:** Ninguno (o solo Enter)
- ✅ **Modo:** Teclado (Keyboard Emulation)

### Escáneres Bluetooth

1. **Empareja** el escáner con tu dispositivo
2. Configura como teclado Bluetooth
3. Prueba escaneando en el TPV

### Escáneres de Smartphone

**Aplicaciones recomendadas:**
- **Android:** Barcode Scanner (Zxing)
- **iOS:** QR Code Reader
- **Web:** Usa la cámara del navegador (si el navegador lo permite)

---

## 🎯 Flujo de Trabajo con Escáner

### Caso 1: Venta Rápida en Mostrador

```
1. Cliente llega con productos
   ↓
2. Escaneas cada producto (pip, pip, pip)
   ↓
3. Productos se agregan automáticamente al carrito
   ↓
4. Click en "💰 COBRAR"
   ↓
5. Cobras y entregas
```

### Caso 2: Producto No Encontrado

Si escaneas y aparece **"⚠️ No se encontró producto":**

1. **Verifica** que el producto existe en tu sistema
2. **Revisa** que el código de barras esté registrado
3. **Opción rápida:** Busca manualmente y agrégalo
4. **Para futuro:** Agrega el código de barras a ese producto

---

## 💡 Tips Profesionales

### 1. **Configura Códigos para Todos tus Productos**
- Dedica 1 hora a agregar códigos de barras a tus productos más vendidos
- Usa Excel/CSV para importar masivamente si tienes muchos

### 2. **Etiqueta Productos Sin Código**
- Para productos a granel o sin código original
- Imprime etiquetas con código de barras personalizados
- Usa el formato que prefieras (EAN-13 para profesional)

### 3. **Prueba el Escáner**
- Escanea un producto de prueba antes de atender clientes
- Verifica que el Enter automático funciona

### 4. **Limpieza del Lector**
- Limpia la ventana del escáner semanalmente
- Mejora la precisión de lectura

### 5. **Posición del Escáner**
- Colócalo cerca del teclado
- Ángulo cómodo para tu mano dominante
- Cable sin tensión (USB) o cargado (Bluetooth)

---

## 🔧 Solución de Problemas

### Problema: El escáner no agrega productos

**Soluciones:**
1. ✅ Verifica que el cursor está en el campo de búsqueda
2. ✅ Confirma que el escáner envía Enter al final
3. ✅ Prueba escaneando en un bloc de notas primero
4. ✅ Revisa que el código de barras está registrado en el producto

### Problema: Agrega caracteres extraños

**Soluciones:**
1. ✅ Configura el escáner para modo "teclado"
2. ✅ Quita prefijos/sufijos en la configuración del escáner
3. ✅ Verifica el idioma del teclado en Windows

### Problema: No detecta Enter automático

**Soluciones:**
1. ✅ Configura el escáner para enviar CR/LF (Enter)
2. ✅ Revisa el manual del escáner
3. ✅ Consulta con el proveedor del escáner

---

## 📊 Estadísticas de Eficiencia

### Sin Escáner:
- ⏱️ 10-15 segundos por producto (buscar + click)
- 😓 Más errores de tipeo
- 👁️ Cansancio visual

### Con Escáner:
- ⚡ **1-2 segundos por producto** (escanear)
- ✅ **Cero errores** de código
- 😊 **Menos fatiga**
- 💰 **Más ventas por hora**

**Mejora estimada: 5x más rápido** ⚡

---

## 🛒 Ejemplos de Uso

### Supermercado/Almacén
```
Cliente: 10 productos
Sin escáner: ~2 minutos
Con escáner: ~20 segundos
Ahorro: 100 segundos por venta
```

### Farmacia
```
Cliente: 3 medicamentos
Sin escáner: ~45 segundos
Con escáner: ~6 segundos
Ahorro: 39 segundos por venta
```

### Ferretería
```
Cliente: 15 artículos
Sin escáner: ~3 minutos
Con escáner: ~30 segundos
Ahorro: 150 segundos por venta
```

---

## 🎓 Capacitación del Personal

### Instrucciones para tu equipo:

1. **Posición del escáner:**
   - Mantén el escáner a 10-20cm del código de barras
   - Apunta directamente, sin ángulo

2. **Si no lee:**
   - Acerca o aleja lentamente
   - Verifica que el código no esté dañado
   - Limpia el vidrio del escáner

3. **Verificación:**
   - Escucha el "beep" de confirmación
   - Mira la pantalla - el producto debe aparecer en el carrito

4. **Error común:**
   - Si escaneaste el mismo producto 2 veces por error
   - Click en el botón "−" en el carrito

---

## 📦 Recomendaciones de Hardware

### Escáneres de Nivel Básico ($50-100)
- **Honeywell Voyager 1200g**
- **Zebra DS2208**
- Ideal para: Almacenes, kioscos pequeños

### Escáneres de Nivel Medio ($100-200)
- **Honeywell Xenon 1900**
- **Datalogic QuickScan QD2430**
- Ideal para: Farmacias, supermercados medianos

### Escáneres Bluetooth ($150-300)
- **Honeywell Voyager 1472g**
- **Zebra DS2278**
- Ideal para: Mostrador grande, movilidad

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `database-add-barcode.sql` en Neon
- [ ] Conectar escáner de código de barras
- [ ] Configurar escáner (Enter automático)
- [ ] Probar escaneo en TPV
- [ ] Agregar códigos de barras a productos principales
- [ ] Capacitar al personal
- [ ] Etiquetar productos sin código original
- [ ] ¡Comenzar a vender más rápido!

---

## 🎉 ¡Listo para Vender!

**Accede al TPV:**
👉 https://pimpoyo.vercel.app/tpv

**Recuerda:**
1. Ejecuta el script SQL primero
2. Agrega códigos de barras a tus productos
3. Conecta tu escáner
4. ¡Escanea y vende!

**Mejora estimada: 5x más rápido** 🚀✨

