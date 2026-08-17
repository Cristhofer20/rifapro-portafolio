# 📚 Documentación Técnica - Nuevas Características

## 1. Scroll Automático

### ¿Qué es?
El scroll automático es una característica que lleva automáticamente al usuario a la sección de edición cuando hace clic en un botón de editar.

### ¿Cómo funciona?

#### En el Frontend (autoScroll.js)
```javascript
// Importar en main.js
import { initAutoScroll } from './autoScroll.js';

// Inicializar en la función initialize()
initAutoScroll();
```

#### Botones que activan scroll
- Editar cliente: `editClientBtn`
- Editar evento: `editEventBtn`
- Crear evento: `createEventBtn`
- Editar perfil: `editProfileBtn`
- Pagar: `paymentBtn`

#### Ejemplo en HTML
```html
<button id="editEventBtn" class="edit-btn">✏️ Editar</button>

<!-- Sección a la que irá -->
<section id="adminEventsSection" class="card">
  ...formulario...
</section>
```

### API disponible

```javascript
// Scroll a una sección con animación
scrollToSection('#sectionId');

// Scroll con offset personalizado
scrollToSectionWithOffset('#sectionId', 100);

// Detectar errores en formulario y scroll a error
scrollOnFormError(formElement);
```

### Animación de Highlight
Cuando se hace scroll a una sección, se muestra una animación de highlight:
```css
.card.scroll-highlight {
  animation: highlightFocus 1.5s ease-out;
}
```

---

## 2. Imagen de Fondo

### Configuración

#### Paso 1: Crear/Colocar Imagen
La imagen debe estar en:
```
assets/images/backgrounds/raffle-bg.jpg
```

#### Paso 2: Especificaciones
- **Resolución**: 1920x1080px o superior
- **Formato**: JPG o PNG
- **Tamaño**: Máximo 500KB
- **Tema**: Relacionada con sorteos/rifas
- **Recomendación**: Fondo oscuro para mejor legibilidad

#### Paso 3: CSS aplicado
```css
.container::before {
  background-image: url('../assets/images/backgrounds/raffle-bg.jpg');
  background-attachment: fixed;
  opacity: 0.08;  /* Muy sutil para no interferir */
}
```

### Generar Automáticamente
Si no tienes imagen, puedes generar una:
```bash
node scripts/generate-background.js
```

Esto crea una imagen con:
- Gradiente azul-oscuro (tema de la app)
- Patrón de puntos (números)
- Líneas decorativas (conexiones)
- Círculos decorativos

### Personalizar
Editar `scripts/generate-background.js` para cambiar:
```javascript
// Colores
gradient.addColorStop(0, '#081028');  // Cambiar aquí

// Cantidad de puntos
for (let i = 0; i < 100; i++) {  // Cambiar cantidad

// Opacidad en CSS
opacity: 0.08;  // Cambiar en styles.css
```

---

## 3. Base de Datos

### Esquema Completo
El archivo `database/schema.sql` contiene:

#### Tablas principales
1. **usuarios** - Clientes y administradores
2. **rifas** - Eventos de rifas
3. **numeros_rifa** - Números individuales
4. **pagos** - Transacciones
5. **participantes** - Relación cliente-rifa
6. **ganadores** - Resultados de rifas
7. **auditoria** - Log de operaciones

#### Vistas
```sql
-- Resumen de rifas con estadísticas
vista_resumen_rifas

-- Reporte de pagos por rifa
vista_reporte_pagos
```

#### Procedimientos almacenados
```sql
-- Vender número de forma segura
sp_vender_numero(rifa_id, numero, cliente_id)
```

### Usar Base de Datos

#### 1. Inicializar
```bash
npm run db:init
```

#### 2. Conectar en aplicación
Actualizar `storage.js` para usar API en lugar de localStorage:
```javascript
// En producción
import { dbConnection } from './database.js';

export async function saveUsers(state) {
  return await dbConnection.query('INSERT INTO usuarios...');
}
```

#### 3. Migrations (opcional)
```bash
npm run db:migrate
```

---

## 4. Estructura de Carpetas para Imágenes

```
assets/
├── images/
│   ├── backgrounds/
│   │   └── raffle-bg.jpg          # Fondo principal
│   ├── events/
│   │   └── evento-123.jpg         # Imágenes de eventos
│   ├── logos/
│   │   ├── logo.svg               # Logo principal
│   │   └── logo-white.svg         # Logo blanco
│   └── ui/
│       └── icons/                 # Iconos si necesitas
├── placeholders/
│   ├── user-default.png           # Avatar por defecto
│   └── event-default.png          # Evento por defecto
└── README.md
```

---

## 5. Variables de Entorno (.env)

### Configuración recomendada
```env
# Desarrollo
DB_TYPE=sqlite
DB_DATABASE=./data/rifapro.db
APP_ENV=development

# Producción
DB_TYPE=mysql
DB_HOST=db-server.com
DB_USER=rifapro
DB_PASSWORD=segura_contraseña
DB_DATABASE=rifapro_prod
APP_ENV=production
```

Ver `.env.example` para todas las opciones.

---

## 6. Migración de Datos

### Para trasladar a otro ordenador

**Paso 1: Hacer backup**
```bash
mysqldump -u user -p database > backup.sql
```

**Paso 2: Copiar archivos**
```bash
# Copiar proyecto completo
cp -r APP\ RIFAS /media/usb/

# O usar GitHub
git push origin main
```

**Paso 3: En nuevo ordenador**
```bash
# Clonar/copiar
git clone ...

# Instalar
npm install

# Configurar .env
nano .env

# Restaurar BD
mysql -u user -p database < backup.sql

# Iniciar
npm start
```

Ver `MIGRATION.md` para más detalles.

---

## 7. Ciclo de Edición Completo

### Flujo de usuario:

```
Usuario hace clic en "Editar"
         ↓
Scroll automático a la sección
         ↓
Se muestra formulario
         ↓
Usuario completa datos
         ↓
Hace clic en "Guardar"
         ↓
Datos se guardan
         ↓
Se muestra confirmación (Toast)
```

### En el código:

```javascript
// 1. Detectar clic en editar
editClientBtn.addEventListener('click', () => {
  // 2. Scroll automático
  scrollToSection('#adminClientsSection');
  
  // 3. Cargar datos en formulario
  clientForm.elements.clientName.value = client.nombre;
  
  // 4. Cambiar botón a "Guardar cambios"
  saveClientBtn.textContent = 'Guardar cambios';
});

// 5. Guardar
saveClientBtn.addEventListener('click', () => {
  // Validar, enviar, etc.
  // 6. Mostrar confirmación
  showToast('Cliente actualizado');
});
```

---

## 8. Testing

### Probar scroll automático
```javascript
// En consola del navegador
import { scrollToSection } from './autoScroll.js';
scrollToSection('#adminClientsSection');
```

### Probar base de datos
```bash
npm test
```

### Probar migraciones
```bash
npm run test:migration
```

---

## 9. Troubleshooting

### Scroll no funciona
- Verificar que el ID de la sección existe
- Verificar que `initAutoScroll()` se llamó en `initialize()`
- Revisar consola del navegador (F12)

### Imagen de fondo no se ve
- Verificar archivo existe: `assets/images/backgrounds/raffle-bg.jpg`
- Verificar permisos de archivo
- Verificar opacidad (podría ser muy baja): cambiar `opacity: 0.08`
- Limpiar caché: Ctrl+Shift+R

### BD no conecta
- Verificar credenciales en `.env`
- Verificar BD está corriendo
- Verificar puerto (3306 para MySQL, 5432 para PostgreSQL)

---

## 10. Recursos Adicionales

- 📖 [INSTALL.md](INSTALL.md) - Guía de instalación completa
- 🔄 [MIGRATION.md](MIGRATION.md) - Guía de migración entre ordenadores
- 📁 [assets/images/README.md](assets/images/README.md) - Gestión de imágenes
- 📋 [.env.example](.env.example) - Variables de entorno

---

## 🎯 Próximas Mejoras Planeadas

- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Notificaciones por email
- [ ] Integración con Stripe/PayPal
- [ ] API REST completa
- [ ] Mobile app (React Native)
- [ ] Análitica y reportes avanzados

---

**Última actualización**: 2024-01-15  
**Versión**: 1.1.0  
**Mantenedor**: Tu nombre
