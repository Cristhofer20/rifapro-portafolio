# 🔄 Guía de Migración de Datos - RifaPro

## Tabla de Contenidos
1. [Migración Completa](#migración-completa)
2. [Backup y Restore](#backup-y-restore)
3. [Migración Entre Bases de Datos](#migración-entre-bases-de-datos)
4. [Migración de Servidor a Servidor](#migración-de-servidor-a-servidor)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🔄 Migración Completa

### Opción 1: Copiar Todo el Proyecto

**Paso 1: En el equipo origen**
```bash
# Hacer backup de la BD
npm run db:backup

# Copiar todo el proyecto
# - Usar USB, Google Drive, Dropbox, etc.
# - Asegurarse de incluir:
#   - src/
#   - database/
#   - package.json
#   - .env (con credenciales)

# NO incluir:
# - node_modules/
# - .git/
# - dist/
# - build/
```

**Paso 2: En el equipo destino**
```bash
# Extraer/clonar el proyecto
cd APP\ RIFAS

# Instalar dependencias
npm install

# Verificar .env está presente
cat .env

# Iniciar aplicación
npm start
```

---

## 💾 Backup y Restore

### MySQL / MariaDB

**Hacer Backup:**
```bash
# Backup completo
mysqldump -u rifapro -p rifapro_db > backup_rifapro.sql

# Backup con timestamp
mysqldump -u rifapro -p rifapro_db > backup_rifapro_$(date +%Y%m%d_%H%M%S).sql

# Backup sin contraseña interactiva (usando .my.cnf)
mysqldump --defaults-extra-file=.my.cnf -u rifapro rifapro_db > backup.sql

# Backup comprimido
mysqldump -u rifapro -p rifapro_db | gzip > backup_rifapro.sql.gz
```

**Restaurar Backup:**
```bash
# Restaurar desde SQL
mysql -u rifapro -p rifapro_db < backup_rifapro.sql

# Restaurar desde comprimido
gunzip < backup_rifapro.sql.gz | mysql -u rifapro -p rifapro_db

# Restaurar en nueva BD
mysql -u root -p
CREATE DATABASE rifapro_nuevo;
GRANT ALL ON rifapro_nuevo.* TO 'rifapro'@'localhost';
EXIT;

mysql -u rifapro -p rifapro_nuevo < backup_rifapro.sql
```

### PostgreSQL

**Hacer Backup:**
```bash
# Backup completo
pg_dump -U rifapro -d rifapro_db > backup_rifapro.sql

# Backup formato custom (más comprimido)
pg_dump -U rifapro -d rifapro_db -Fc > backup_rifapro.dump

# Con host remoto
pg_dump -h 192.168.1.100 -U rifapro -d rifapro_db > backup.sql
```

**Restaurar Backup:**
```bash
# Restaurar SQL
psql -U rifapro -d rifapro_db < backup_rifapro.sql

# Restaurar custom
pg_restore -U rifapro -d rifapro_db backup_rifapro.dump

# En nueva BD
createdb -U rifapro rifapro_nuevo
pg_restore -U rifapro -d rifapro_nuevo backup_rifapro.dump
```

### SQLite

**Hacer Backup:**
```bash
# Copiar archivo directamente
cp data/rifapro.db backups/rifapro_$(date +%Y%m%d_%H%M%S).db

# Backup con compresión
zip -r backup_rifapro.zip data/rifapro.db

# Dump SQL
sqlite3 data/rifapro.db ".dump" > backup_rifapro.sql
```

**Restaurar Backup:**
```bash
# Restaurar archivo
cp backups/rifapro_backup.db data/rifapro.db

# Desde SQL
sqlite3 data/rifapro.db < backup_rifapro.sql
```

---

## 🔀 Migración Entre Bases de Datos

### De MySQL a PostgreSQL

**Paso 1: Exportar desde MySQL**
```bash
mysqldump -u rifapro -p rifapro_db > export.sql
```

**Paso 2: Convertir SQL (si es necesario)**
```bash
# Usar herramienta de conversión
# Opción 1: pgloader (recomendado)
sudo apt-get install pgloader

pgloader mysql://rifapro:password@localhost/rifapro_db \
         postgresql://rifapro:password@localhost/rifapro_db

# Opción 2: Conversión manual
# - Cambiar INT a INTEGER
# - Cambiar AUTO_INCREMENT a SERIAL
# - Cambiar VARCHAR a character varying
```

**Paso 3: Crear BD en PostgreSQL**
```bash
createdb -U rifapro rifapro_db
psql -U rifapro rifapro_db < export.sql
```

### De PostgreSQL a MySQL

**Paso 1: Exportar desde PostgreSQL**
```bash
pg_dump -U rifapro -d rifapro_db > export.sql
```

**Paso 2: Convertir formato**
```bash
# Cambiar sintaxis PostgreSQL a MySQL
# - SERIAL a AUTO_INCREMENT
# - :: a
# - RETURNING a SELECT LAST_INSERT_ID()
```

**Paso 3: Crear BD en MySQL e importar**
```bash
mysqldump -u root -p
CREATE DATABASE rifapro_db;
GRANT ALL ON rifapro_db.* TO 'rifapro'@'localhost';
EXIT;

mysql -u rifapro -p rifapro_db < export.sql
```

### De MySQL a SQLite

```bash
# Usar script Python
pip install mysql2sqlite

mysql2sqlite -f rifapro.db -d rifapro_db -u rifapro -p

# O exportar y convertir manualmente
mysqldump -u rifapro -p rifapro_db > export.sql
sqlite3 rifapro.db < export.sql
```

---

## 🖥️ Migración de Servidor a Servidor

### Escenario: Trasladar a Producción

**Paso 1: Preparar Servidor de Producción**
```bash
# En servidor prod
ssh usuario@servidor-prod

# Crear carpeta del proyecto
mkdir -p /var/www/rifapro
cd /var/www/rifapro

# Crear usuario para la app
sudo useradd -m -s /bin/bash rifapro
sudo chown rifapro:rifapro /var/www/rifapro
```

**Paso 2: Transferir Código**
```bash
# En equipo local
scp -r APP\ RIFAS/* usuario@servidor-prod:/var/www/rifapro/

# O usando git
cd /var/www/rifapro
git clone https://github.com/tuusuario/rifapro.git .
git checkout main
```

**Paso 3: Instalar en Producción**
```bash
# En servidor prod, como usuario rifapro
cd /var/www/rifapro
npm install --production

# Crear .env
cp .env.example .env
nano .env  # Editar con credenciales reales
```

**Paso 4: Migrar Base de Datos**
```bash
# Opción 1: Backup remoto
# En servidor prod
mysqldump -u rifapro -p > /tmp/backup.sql

# En equipo local
scp usuario@servidor-prod:/tmp/backup.sql .

# Restaurar en BD local
mysql -u rifapro -p rifapro_dev < backup.sql
```

**Paso 5: Configurar Servicio**
```bash
# Crear archivo systemd (Linux)
sudo nano /etc/systemd/system/rifapro.service

[Unit]
Description=RifaPro Application
After=network.target

[Service]
Type=simple
User=rifapro
WorkingDirectory=/var/www/rifapro
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# Activar servicio
sudo systemctl daemon-reload
sudo systemctl enable rifapro
sudo systemctl start rifapro
```

**Paso 6: Verificar Migración**
```bash
# Revisar logs
sudo systemctl status rifapro
sudo journalctl -u rifapro -f

# Probar acceso
curl http://servidor-prod:3000
```

---

## 🔍 Verificación Post-Migración

**Checklist:**

- [ ] Base de datos está conectada
- [ ] Todos los datos se trasladaron correctamente
- [ ] Usuarios pueden iniciar sesión
- [ ] Eventos aparecen correctamente
- [ ] Pagos se muestran en historial
- [ ] Imágenes de eventos cargan correctamente
- [ ] Backups están funcionando
- [ ] Permisos de archivos son correctos
- [ ] .env tiene valores seguros
- [ ] HTTPS está configurado (en producción)

**Script de Verificación:**
```bash
npm run verify:migration

# Debería mostrar:
# ✓ Base de datos conectada
# ✓ Usuarios mirados: X
# ✓ Eventos migrados: X
# ✓ Pagos migrados: X
# ✓ Imágenes verificadas
# ✓ Permisos correctos
```

---

## 🐛 Solución de Problemas

### Problema: "Connection Refused"
```bash
# Verificar que BD está corriendo
# MySQL
sudo systemctl start mysql

# PostgreSQL
sudo systemctl start postgresql

# Verificar credenciales en .env
cat .env | grep DB_
```

### Problema: "Access Denied for User"
```bash
# Verificar usuario existe
mysql -u root -p
SELECT User, Host FROM mysql.user;

# Crear usuario si no existe
CREATE USER 'rifapro'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON rifapro_db.* TO 'rifapro'@'localhost';
FLUSH PRIVILEGES;
```

### Problema: "Database doesn't exist"
```bash
# Crear BD
mysqladmin -u root -p create rifapro_db

# Restaurar schema
mysql -u rifapro -p rifapro_db < database/schema.sql
```

### Problema: "Columna no existe después de migración"
```bash
# Ejecutar migraciones pendientes
npm run db:migrate

# O restaurar schema nuevamente
mysql -u rifapro -p rifapro_db < database/schema.sql
```

### Problema: "Imágenes no se ven después de migración"
```bash
# Verificar ruta de imágenes
ls -la assets/images/

# Verificar permisos
chmod -R 755 assets/

# Reconstruir rutas en BD (si es necesario)
npm run db:rebuild-image-paths
```

---

## 📝 Registro de Migración

Crear archivo `MIGRATION.log`:

```
MIGRACIÓN RIFAPRO
================
Fecha: 2024-01-15
Equipo Origen: PC-ADMIN
Equipo Destino: SERVIDOR-PROD

BD Tipo: MySQL
BD Nombre: rifapro_db
BD Usuario: rifapro
BD Puerto: 3306

Datos Migrados:
- Usuarios: 45
- Eventos/Rifas: 12
- Pagos: 234
- Participantes: 1,203

Status: ✓ COMPLETADA
Verificación: ✓ EXITOSA
Backup: rifapro_backup_20240115.sql

Problemas: Ninguno
Notas: Migración exitosa sin problemas
```

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisar logs
2. Verificar .env
3. Ejecutar `npm run verify:migration`
4. Contactar: soporte@rifapro.com
5. Abrir issue en GitHub

¡Migración completada! 🎉
