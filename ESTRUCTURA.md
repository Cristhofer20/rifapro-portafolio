# 📋 Estructura del Proyecto - App de Rifas

## 📁 Archivos Principales

### index.html
Contiene la estructura HTML completa, organizada en **8 secciones principales**:

1. **TOPBAR** - Encabezado con título y acciones del usuario
2. **AUTENTICACIÓN** - Formulario de login/registro
3. **DASHBOARD** - Panel general con resumen (admin/cliente)
4. **RESUMEN DE PAGOS** - Historial de transacciones
5. **GESTIÓN DE CLIENTES** - Panel ADMIN: crear, editar, eliminar y buscar clientes
6. **GESTIÓN DE EVENTOS** - Panel ADMIN: crear rifas, marcar ganadores
7. **PERFIL DE CLIENTE** - Panel CLIENTE: editar datos, foto, contraseña
8. **MIS EVENTOS** - Panel CLIENTE: ver eventos disponibles y pagar participación
9. **PANEL DE PAGO** - QR con Yape/Plin para participación

---

## 🎨 Estilos CSS (styles.css)

El CSS está organizado en **secciones comentadas**:

- **Variables de Color** - Paleta azul marino/plateado
- **Estilos Base** - Reset, body, app-shell
- **Topbar/Header** - Barra superior
- **Contenedor Principal** - Máximo ancho y espaciado
- **Tarjetas** - .card y variantes
- **Tabs** - Navegación por pestañas
- **Formularios** - Inputs, textareas, selects
- **Botones** - Primarios, secundarios, peligro
- **Upload de Fotos** - .file-upload y preview
- **Carousel** - Eventos con scroll
- **Panel de Pago** - QR y botones de método
- **Dashboard** - Resumen con tarjetas
- **Grid de Clientes** - Layout responsive
- **Tablas** - Para listados
- **Badges** - Estados de eventos
- **Toast** - Notificaciones
- **Responsive** - Breakpoints para móvil

---

## 🔧 Script JavaScript (script.js)

### Estructura Global
```javascript
// 1. Constantes (STORAGE_KEYS, elements)
// 2. Estado (state object)
// 3. Funciones de Storage (loadJson, saveJson, etc)
// 4. Funciones de Utilidad (showToast, formatDate, etc)
// 5. Funciones de Auth (authSubmit, toggleAuthMode, etc)
// 6. Funciones de Admin (renderClientList, saveClient, renderAdminEvents, etc)
// 7. Funciones de Cliente (renderClientEvents, showPaymentForEvent, etc)
// 8. Funciones de Pago (showPaymentMethod) ← NUEVA Y MEJORADA
// 9. Event Listeners (bindEvents)
// 10. Inicialización (initialize)
```

---

## ✅ QR - ¿Cómo Funciona Ahora?

### El Problema Original
El QR no aparecía porque:
- Los botones Yape/Plin no tenían estilos visuales claros
- La función `showPaymentMethod()` no regeneraba bien el contenido
- No había un flujo visual claro de "selecciona método → ve QR → confirma"

### La Solución
1. **Botones mejorados** - Ahora son más visibles con estilos `.payment-btn`
2. **Función `showPaymentMethod()` reforzada** - Genera QR dinámico con API real
3. **QR real** - Usa `qrserver.com` en lugar de placeholder
4. **Layout claro** - Container `.qr-container` con imagen, información y botón

### Flujo Paso a Paso
```
1. Cliente hace click en "Pagar S/10 para participar"
   ↓
2. Se abre el panel de pago (paymentSection)
   ↓
3. Cliente elige Yape o Plin
   ↓
4. showPaymentMethod() se ejecuta:
   - Genera QR real con el número
   - Muestra el código QR escaneablee
   - Muestra información clara del pago
   ↓
5. Cliente hace click en "Confirmar pago"
   ↓
6. Se registra el pago, se añade como participante, se actualiza todo
```

### Código del QR (showPaymentMethod)
```javascript
// Genera QR usando API pública
img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=..."

// Estructura clara con:
- Imagen QR
- Nombre del método (YAPE/PLIN)
- Número de cuenta
- Monto exacto
- Instrucción de pago
- Botón confirmar
```

---

## 🎯 Mejoras de Organización

### Antes
- Estilos esparcidos sin orden
- Secciones HTML sin comentarios
- No había separación clara de responsabilidades

### Ahora
✅ CSS dividido en **categorías lógicas**
✅ HTML con **comentarios que indican cada sección**
✅ Código más **mantenible y escalable**
✅ Nombres de clases **descriptivos y consistentes**
✅ Sistema de **variables CSS** centralizadas

---

## 🚀 Roles y Funcionalidades

### 👑 ADMIN
- ✅ Ver dashboard con estadísticas
- ✅ Crear/editar/eliminar clientes
- ✅ Buscar clientes (nombre, email, DNI)
- ✅ Ver foto, datos y rifas participadas de cada cliente
- ✅ Crear/editar/eliminar eventos
- ✅ Seleccionar ganadores manualmente
- ✅ Ver resumen de pagos

### 👤 CLIENTE
- ✅ Ver perfil y editarlo
- ✅ Subir foto de perfil
- ✅ Ver eventos disponibles
- ✅ Pagar S/10 por participación (Yape/Plin)
- ✅ Ver su historial de pagos
- ✅ Recibir notificaciones de ganadores

---

## 💾 Datos que se Guardan

```javascript
state = {
  users: [],        // Admin + Clientes
  events: [],       // Rifas creadas
  payments: [],     // Transacciones (NUEVO: cantidad S/10 fijo)
  currentUser: {},  // Usuario logueado
  ...
}
```

Cada usuario cliente tiene:
- id, name, email, password, dni, photo, role, createdAt

Cada evento tiene:
- id, title, date, description, image, winnersCount, 
- participants[], winners[], status, createdAt

Cada pago tiene:
- id, eventId, userId, method (yape/plin), amount (10), date

---

## 🔐 Credenciales Por Defecto

```
Email: admin@example.com
Contraseña: admin123
Rol: Administrador
```

---

## 📱 Responsive

- ✅ Desktop (1140px max)
- ✅ Tablet (960px)
- ✅ Mobile (720px)
- ✅ Small Mobile (480px)

---

## 🎨 Paleta de Colores

```css
--bg: #081028                 (Azul muy oscuro - fondo)
--surface: #101e3d            (Azul oscuro - superficies)
--primary: #0f172a            (Azul marino primario)
--accent: #3b82f6             (Azul brillante - botones)
--sky: #1e40af                (Azul cielo - hover)
--silver: #bcccdc             (Plateado - texto secundario)
--text: #e2e8f0               (Gris claro - texto principal)
--muted: #94a3b8              (Gris - texto muted)
--success: #22c55e            (Verde - éxito)
--error: #ef4444              (Rojo - error)
```

---

**Última actualización:** 2026-08-12
