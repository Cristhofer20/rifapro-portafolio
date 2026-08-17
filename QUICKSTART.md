# ⚡ Quick Start - Guía Rápida RifaPro

## 🚀 5 Minutos para Empezar

### 1️⃣ Descargar e Instalar (1 min)
```bash
# Clonar o descargar proyecto
git clone https://github.com/tuusuario/rifapro.git
cd rifapro/APP\ RIFAS

# Instalar
npm install
```

### 2️⃣ Configurar (1 min)
```bash
# Si usas SQLite (más fácil para empezar)
npm run db:init:sqlite

# O si usas MySQL
mysql -u root -p
CREATE DATABASE rifapro_db;
GRANT ALL ON rifapro_db.* TO 'rifapro'@'localhost';
mysql -u rifapro -p rifapro_db < database/schema.sql
```

### 3️⃣ Imagen de Fondo (1 min)
```bash
# Opción A: Generar automáticamente
node scripts/generate-background.js

# Opción B: Usar tu propia imagen
# Colocar archivo en: assets/images/backgrounds/raffle-bg.jpg
```

### 4️⃣ Iniciar (1 min)
```bash
npm start

# Abre en navegador: http://localhost:3000
```

### 5️⃣ Primera Sesión (1 min)
```
📧 Email: admin@rifapro.com
🔐 Contraseña: admin123

⚠️ CAMBIAR CONTRASEÑA DE ADMIN INMEDIATAMENTE
```

---

## 💡 Casos de Uso Comunes

### Caso 1: Crear tu Primera Rifa

```
1. Inicia sesión como admin
2. Click en "Gestión de eventos" (sidebar)
3. Completa el formulario:
   - Título: "Rifa Navidad 2024"
   - Fecha: 24/12/2024
   - Cantidad de ganadores: 3
   - Descripción: "Premio: TV 55 pulgadas"
   - Imagen: Subir foto del premio
4. Click en "Crear evento"
✅ ¡Rifa creada!
```

### Caso 2: Agregar Clientes

```
1. Click en "Gestión de clientes" (sidebar)
2. Completa:
   - Nombre: "Juan Pérez"
   - Email: "juan@email.com"
   - DNI: "12345678"
   - Contraseña: cualquiera
3. Click en "Agregar cliente"
✅ Cliente registrado
```

### Caso 3: Cliente Compra Números

```
1. Cliente inicia sesión con su email
2. Entra en "Mis Eventos"
3. Selecciona la rifa que desea
4. Elige números (1-100)
5. Click en "Pagar"
6. Elige Yape o Plin
7. Descarga PDF del comprobante
✅ Compra realizada
```

### Caso 4: Ver Ganadores

```
1. Admin -> Gestión de eventos
2. Click en rifa
3. Ver sección "Números vendidos"
4. Click en "Sortear ganadores"
5. Se asignan aleatoriamente
✅ Ganadores generados
```

---

## 🎨 Personalización Básica

### Cambiar Colores
Editar `src/styles.css`:
```css
:root {
  --accent: #3b82f6;      /* Azul principal */
  --success: #22c55e;     /* Verde éxito */
  --error: #ef4444;       /* Rojo error */
  /* ... más colores */
}
```

### Cambiar Logo
En `index.html`:
```html
<h1>🎟️ RifaPro</h1>
<!-- Cambiar emoji o texto -->
```

### Cambiar Título
```html
<title>RifaPro | Gestión de Rifas</title>
<!-- Cambiar "RifaPro" por tu nombre -->
```

### Cambiar Fondos
```bash
# Reemplazar imagen
cp tu-imagen.jpg assets/images/backgrounds/raffle-bg.jpg

# O regenerar
node scripts/generate-background.js
```

---

## 🔑 Contraseñas Importantes

### Default Admin
- 📧 Email: `admin@rifapro.com`
- 🔐 Password: `admin123`

### ⚠️ Cambiar Inmediatamente:
1. Inicia sesión como admin
2. Mi Perfil → Editar perfil
3. Nueva contraseña: `algo_muy_seguro`
4. Guardar cambios

---

## 📋 Checklist de Inicio

- [ ] npm install ejecutado
- [ ] Base de datos creada
- [ ] Imagen de fondo agregada
- [ ] npm start corriendo
- [ ] Puedo acceder a http://localhost:3000
- [ ] Puedo iniciar sesión como admin
- [ ] He cambiado la contraseña de admin
- [ ] He creado mi primera rifa
- [ ] He agregado al menos un cliente

---

## 🆘 Problemas Comunes

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### "Database connection failed"
```bash
# Verificar credenciales en .env
cat .env | grep DB_

# Reiniciar servicio MySQL
sudo systemctl restart mysql
```

### "Port 3000 in use"
```bash
# Usar otro puerto
PORT=3001 npm start

# O matar proceso
lsof -i :3000
kill -9 <PID>
```

### Imagen de fondo no se ve
```bash
# Regenerar
node scripts/generate-background.js

# O copiar tu imagen
cp tu-imagen.jpg assets/images/backgrounds/raffle-bg.jpg
```

---

## 📚 Documentación Completa

- 📖 [INSTALL.md](INSTALL.md) - Instalación paso a paso
- 🔄 [MIGRATION.md](MIGRATION.md) - Trasladar a otro PC
- 📚 [DOCUMENTATION.md](DOCUMENTATION.md) - Referencia técnica
- 📋 [README.md](README.md) - Descripción general

---

## 🎯 Próximos Pasos

1. **Explorar UI**
   - Crear eventos
   - Agregar clientes
   - Ver dashboard

2. **Probar Funcionalidades**
   - Hacer un pago simulado
   - Descargar PDF
   - Editar cliente

3. **Personalizar**
   - Cambiar colores
   - Agregar logo
   - Cambiar imagen de fondo

4. **Migrar a Producción**
   - Usar MySQL o PostgreSQL
   - Configurar HTTPS
   - Deploy en servidor

---

## 🚀 Despliegue Rápido

### Heroku (1-2 minutos)
```bash
npm install -g heroku
heroku login
heroku create mi-rifapro
git push heroku main
# ¡Listo en: https://mi-rifapro.herokuapp.com
```

### Vercel
```bash
npm install -g vercel
vercel
# ¡Listo en: https://mi-rifapro.vercel.app
```

### Docker
```bash
docker build -t rifapro .
docker run -p 3000:3000 rifapro
```

---

## 💬 ¿Necesitas Ayuda?

- 📧 Email: soporte@rifapro.com
- 💬 Chat: discord.gg/rifapro
- 🐛 Issues: GitHub Issues
- 📖 Wiki: GitHub Wiki

---

**¡Bienvenido a RifaPro! 🎉**

Estás listo para comenzar. Disfruta administrando rifas de forma profesional.
