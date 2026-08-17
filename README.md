# 🎟️ RifaPro — Plataforma Profesional de Rifas

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-v14%2B-green.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v6%2B-red.svg)](https://www.npmjs.com/)

Aplicación web profesional, responsive e intuitiva para gestionar rifas, clientes, eventos, pagos, números y ganadores. Diseñada para pequeños y medianos negocios de rifas.

## ✨ Características Principales

### Gestión de Eventos
- ✅ Crear, editar y eliminar rifas/eventos
- ✅ Imágenes personalizadas por evento
- ✅ Múltiples ganadores configurables
- ✅ Fechas de evento y estados
- ✅ Descripción detallada de premios

### Gestión de Clientes
- ✅ Registro y login de clientes
- ✅ Panel administrativo para usuarios
- ✅ Perfiles de cliente con foto
- ✅ Historial de participaciones
- ✅ Resumen de pagos

### Sistema de Números
- ✅ Gestión de números por rifa (1-100+)
- ✅ Estados: disponible, vendido, bloqueado
- ✅ Selección visual interactiva
- ✅ Búsqueda y filtrado
- ✅ Reserva automática

### Sistema de Pagos
- ✅ Simulación de pagos (Yape, Plin)
- ✅ Generación de QR
- ✅ Comprobantes en PDF
- ✅ Historial de pagos
- ✅ Estados de transacción

### Dashboard Administrativo
- ✅ Resumen de estadísticas
- ✅ Total de clientes y rifas
- ✅ Próximas rifas
- ✅ Reporte de pagos
- ✅ Gráficos interactivos

### Diseño y UX
- ✅ **Diseño comercial moderno** con gradientes y efectos
- ✅ **100% Responsivo** - Funciona en cualquier dispositivo
- ✅ **Animaciones suaves** - Transiciones fluidas
- ✅ **Tema oscuro** - Paleta azul/plateado profesional
- ✅ **Scroll automático** - Navegación intuitiva al editar
- ✅ **Fondo temático** - Imagen de sorteos personalizable

### Datos y Persistencia
- ✅ Base de datos completa (MySQL, PostgreSQL, SQLite)
- ✅ LocalStorage para demostración
- ✅ Auditoría de operaciones
- ✅ Backup y restore automático
- ✅ Migraciones de datos

## 🚀 Instalación Rápida

### Requisitos Previos
```
- Node.js v14+
- npm v6+
- Base de datos (MySQL, PostgreSQL o SQLite)
```

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/tuusuario/RifaPro.git
cd RifaPro/APP\ RIFAS
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Base de Datos
```bash
# Copiar ejemplo de configuración
cp .env.example .env

# Editar con tus credenciales
nano .env

# Crear tablas
npm run db:init
```

### Paso 4: Generar Imagen de Fondo (Opcional)
```bash
node scripts/generate-background.js
```

### Paso 5: Iniciar la Aplicación
```bash
npm start
```

Accede a `http://localhost:3000` en tu navegador.

## 📁 Estructura del Proyecto

```
APP RIFAS/
├── src/
│   ├── main.js                 # Lógica principal
│   ├── config.js               # Configuración
│   ├── state.js                # Estado global
│   ├── storage.js              # Manejo de datos
│   ├── helpers.js              # Funciones auxiliares
│   ├── autoScroll.js           # Scroll automático 🆕
│   ├── raffleNumbers.js        # Lógica de números
│   ├── imageUtils.js           # Procesamiento de imágenes
│   └── styles.css              # Estilos CSS (mejorados)
├── database/
│   ├── schema.sql              # Esquema de BD completo 🆕
│   └── seeds.sql               # Datos iniciales
├── assets/
│   └── images/                 # Imágenes y fondos 🆕
│       ├── backgrounds/        # Fondos
│       ├── events/             # Eventos
│       └── logos/              # Logos
├── scripts/
│   └── generate-background.js  # Generador de fondo 🆕
├── tests/
│   ├── raffle-numbers.test.mjs
│   └── image-utils.test.mjs
├── index.html                  # HTML principal
├── package.json
├── .env.example                # Variables de entorno 🆕
├── INSTALL.md                  # Guía de instalación 🆕
├── MIGRATION.md                # Guía de migración 🆕
└── README.md                   # Este archivo
```

## 🎨 Novedades

### v1.1.0 - Diseño Comercial (NUEVO)
- ✨ Rediseño visual con gradientes modernos
- ✨ Efectos hover mejorados con ripple
- ✨ Animaciones suaves y transiciones fluidas
- ✨ Mejor responsividad en móviles
- ✨ Paleta de colores actualizada

### v1.0.1 - Base de Datos y Migración (NUEVO)
- 🗄️ Schema SQL completo (MySQL, PostgreSQL, SQLite)
- 🔄 Guía de migración entre ordenadores
- 📋 Sistema de auditoría
- 💾 Backup y restore automático
- 🔐 Procedimientos almacenados y triggers

### v1.0.0 - Versión Inicial
- Gestión de rifas y clientes
- Sistema de pagos simulado
- Dashboard administrativo
- Generación de PDF

## 🔧 Configuración

Como el proyecto usa módulos JavaScript, lo recomendable es ejecutarlo con un servidor local.

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador.

También puedes usar la extensión **Live Server** de Visual Studio Code.

## Ejecutar pruebas

```bash
npm test
```

## Credenciales de demostración

- Usuario: `admin@example.com`
- Contraseña: `admin123`

> Esta aplicación es solo una demostración de portafolio: no procesa pagos reales. La autenticación también es demostrativa. Los datos y contraseñas se almacenan en el navegador mediante LocalStorage; no debe usarse así en producción.

## Publicación

El proyecto puede desplegarse directamente con **GitHub Pages** desde la rama `main` y la carpeta raíz del repositorio.

## Próximas mejoras

- Backend con API REST.
- Base de datos real (PostgreSQL/MySQL/Supabase).
- Autenticación segura con contraseñas cifradas.
- Validación real de pagos.
- Almacenamiento de imágenes en la nube.
- Panel de estadísticas con gráficos.

## Autor

Proyecto desarrollado como parte de un portafolio de desarrollo web.
