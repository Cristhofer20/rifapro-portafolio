# 📋 Guía de Instalación - RifaPro

## 🚀 Instalación Rápida

### Requisitos Previos
- **Node.js** v14+ ([descargar](https://nodejs.org/))
- **npm** v6+ (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Opción 1: Clonar del Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/RifaPro-Portfolio.git

# Navegar a la carpeta del proyecto
cd RifaPro-Portfolio/APP\ RIFAS

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

### Opción 2: Instalación Manual

1. **Descargar el código**
   - Descargar el archivo ZIP del proyecto
   - Extraer en una carpeta local

2. **Instalar dependencias**
   ```bash
   cd APP\ RIFAS
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npm start
   ```

## 🗄️ Configuración de Base de Datos

### Paso 1: Elegir Base de Datos

RifaPro soporta:
- **SQLite** (recomendado para desarrollo/pequeños grupos)
- **MySQL** (recomendado para producción)
- **PostgreSQL** (alternativa profesional)

### Paso 2: Crear la Base de Datos

#### Opción A: SQLite (Más fácil)

```bash
# Crear archivo de base de datos (automático)
npm run db:init:sqlite
```

#### Opción B: MySQL

```sql
-- Conectarse a MySQL
mysql -u root -p

-- Crear base de datos
CREATE DATABASE rifapro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional pero recomendado)
CREATE USER 'rifapro'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON rifapro_db.* TO 'rifapro'@'localhost';
FLUSH PRIVILEGES;

-- Ejecutar el schema
mysql -u rifapro -p rifapro_db < database/schema.sql
```

#### Opción C: PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE rifapro_db ENCODING 'UTF8';

# Crear usuario
CREATE USER rifapro WITH PASSWORD 'tu_contraseña_segura';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE rifapro_db TO rifapro;
\q

# Ejecutar el schema
psql -U rifapro -d rifapro_db -f database/schema.sql
```

### Paso 3: Configurar Conexión

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=rifapro
DB_PASSWORD=tu_contraseña_segura
DB_DATABASE=rifapro_db

# Aplicación
APP_PORT=3000
APP_ENV=development
APP_DEBUG=false

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
SALT_ROUNDS=10

# Email (opcional)
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_app
```

## 📁 Estructura de Carpetas

```
APP RIFAS/
├── src/
│   ├── main.js              # Punto de entrada principal
│   ├── config.js            # Configuración de la app
│   ├── state.js             # Estado global
│   ├── storage.js           # Manejo de datos (localStorage)
│   ├── helpers.js           # Funciones auxiliares
│   ├── autoScroll.js        # Scroll automático
│   ├── raffleNumbers.js     # Lógica de números
│   ├── imageUtils.js        # Procesamiento de imágenes
│   └── styles.css           # Estilos CSS
├── database/
│   ├── schema.sql           # Esquema de BD
│   └── seeds.sql            # Datos iniciales (opcional)
├── assets/
│   └── images/
│       ├── backgrounds/     # Fondos
│       ├── events/          # Imágenes de eventos
│       └── logos/           # Logos
├── tests/
│   ├── raffle-numbers.test.mjs
│   └── image-utils.test.mjs
├── index.html               # HTML principal
├── package.json             # Dependencias
├── .env.example             # Ejemplo de variables de entorno
└── README.md
```

## 🔐 Seguridad - Primeros Pasos

1. **Cambiar credenciales de admin**
   - Usuario: `admin@rifapro.com`
   - Contraseña: `admin123`
   - ⚠️ Cambiar inmediatamente en producción

2. **Configurar JWT_SECRET**
   ```bash
   # Generar secret seguro
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **HTTPS en Producción**
   - Usar certificados SSL/TLS
   - Configurar headers de seguridad

## 🚀 Despliegue

### Opción 1: Servidor Local

```bash
npm start
# Acceder en http://localhost:3000
```

### Opción 2: Vercel

```bash
npm install -g vercel
vercel
```

### Opción 3: Heroku

```bash
# Instalar CLI de Heroku
npm install -g heroku

# Login
heroku login

# Crear app
heroku create tu-app-rifapro

# Deploy
git push heroku main
```

### Opción 4: Docker

```bash
# Crear imagen
docker build -t rifapro .

# Ejecutar contenedor
docker run -p 3000:3000 rifapro
```

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas específicas
npm run test:unit
npm run test:e2e

# Con cobertura
npm run test:coverage
```

## 📊 Migraciones de Datos

### Importar datos desde otra instancia

```bash
# Exportar desde BD antigua
mysqldump -u usuario -p rifapro_db > backup.sql

# Importar en BD nueva
mysql -u usuario -p rifapro_db < backup.sql
```

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```bash
# Cambiar puerto en .env
APP_PORT=3001
```

### Error: "Database connection failed"
- Verificar credenciales en `.env`
- Verificar que BD está running
- Verificar firewall

## 📞 Soporte

- 📧 Email: soporte@rifapro.com
- 💬 Issues: GitHub Issues
- 📚 Documentación: Ver README.md

## ✅ Verificación de Instalación

```bash
# Verificar que todo está correcto
npm run verify

# Debería mostrar:
# ✓ Node.js instalado
# ✓ npm instalado
# ✓ Dependencias instaladas
# ✓ Base de datos conectada
# ✓ Aplicación lista
```

¡Listo! Tu RifaPro está listo para usar. 🎉
