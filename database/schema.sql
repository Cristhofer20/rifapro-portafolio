-- ========================================
-- MODELO DE BASE DE DATOS - RIFAPRO
-- ========================================
-- Script para crear la base de datos y tablas
-- Compatible con: PostgreSQL, MySQL, SQLite
-- Versión: 1.0
-- ========================================

-- TABLA: usuarios (Clientes y Administradores)
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dni VARCHAR(20) UNIQUE,
  password_hash VARCHAR(500) NOT NULL,
  rol ENUM('admin', 'client') DEFAULT 'client',
  foto_perfil LONGBLOB,
  foto_perfil_url VARCHAR(500),
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email_dni (email, dni)
);

-- TABLA: rifas (Eventos de rifas)
CREATE TABLE rifas (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  admin_id INTEGER NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  fecha_evento DATE NOT NULL,
  imagen_url VARCHAR(500),
  imagen_blob LONGBLOB,
  cantidad_ganadores INTEGER DEFAULT 1,
  cantidad_numeros INTEGER DEFAULT 100,
  precio_numero DECIMAL(10, 2) DEFAULT 10.00,
  moneda VARCHAR(3) DEFAULT 'SOL',
  estado ENUM('proximamente', 'activa', 'realizada', 'cancelada') DEFAULT 'proximamente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha_evento)
);

-- TABLA: numeros_rifa (Números individuales de cada rifa)
CREATE TABLE numeros_rifa (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  rifa_id INTEGER NOT NULL,
  numero INTEGER NOT NULL,
  estado ENUM('disponible', 'vendido', 'bloqueado') DEFAULT 'disponible',
  cliente_id INTEGER,
  fecha_venta TIMESTAMP NULL,
  observaciones VARCHAR(500),
  INDEX idx_rifa_id (rifa_id),
  INDEX idx_cliente_id (cliente_id),
  FOREIGN KEY (rifa_id) REFERENCES rifas(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY unique_rifa_numero (rifa_id, numero)
);

-- TABLA: pagos (Transacciones de pago)
CREATE TABLE pagos (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  cliente_id INTEGER NOT NULL,
  rifa_id INTEGER NOT NULL,
  numero_rifa INTEGER,
  cantidad_numeros INTEGER DEFAULT 1,
  monto DECIMAL(10, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'SOL',
  metodo_pago ENUM('yape', 'plin', 'transferencia', 'efectivo', 'otro') DEFAULT 'otro',
  numero_operacion VARCHAR(50),
  estado ENUM('pendiente', 'confirmado', 'rechazado', 'devuelto') DEFAULT 'pendiente',
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_confirmacion TIMESTAMP NULL,
  observaciones VARCHAR(500),
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (rifa_id) REFERENCES rifas(id) ON DELETE CASCADE,
  INDEX idx_cliente_id (cliente_id),
  INDEX idx_rifa_id (rifa_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha_pago (fecha_pago)
);

-- TABLA: participantes (Relación cliente-rifa)
CREATE TABLE participantes (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  rifa_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  numeros_comprados INTEGER DEFAULT 1,
  monto_total DECIMAL(10, 2) DEFAULT 0,
  estado ENUM('activo', 'rechazado') DEFAULT 'activo',
  fecha_participacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rifa_id) REFERENCES rifas(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rifa_cliente (rifa_id, cliente_id),
  INDEX idx_rifa_id (rifa_id),
  INDEX idx_cliente_id (cliente_id)
);

-- TABLA: ganadores (Resultados de rifas)
CREATE TABLE ganadores (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  rifa_id INTEGER NOT NULL,
  numero_rifa INTEGER NOT NULL,
  cliente_id INTEGER,
  cliente_nombre VARCHAR(255),
  cliente_email VARCHAR(255),
  estado_premio ENUM('pendiente', 'entregado', 'rechazado') DEFAULT 'pendiente',
  descripcion_premio TEXT,
  fecha_sorteo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega TIMESTAMP NULL,
  observaciones VARCHAR(500),
  FOREIGN KEY (rifa_id) REFERENCES rifas(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_rifa_id (rifa_id),
  INDEX idx_cliente_id (cliente_id),
  INDEX idx_fecha_sorteo (fecha_sorteo)
);

-- TABLA: auditoria (Log de operaciones)
CREATE TABLE auditoria (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  usuario_id INTEGER,
  tabla_afectada VARCHAR(100) NOT NULL,
  operacion ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT') NOT NULL,
  registro_id INTEGER,
  datos_anteriores JSON,
  datos_nuevos JSON,
  descripcion VARCHAR(500),
  fecha_operacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_tabla (tabla_afectada),
  INDEX idx_fecha (fecha_operacion)
);

-- TABLA: configuracion (Configuración global de la app)
CREATE TABLE configuracion (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor VARCHAR(500),
  tipo ENUM('texto', 'numero', 'booleano', 'json') DEFAULT 'texto',
  descripcion VARCHAR(500),
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES Y VISTAS
-- ========================================

-- Vista: Resumen de rifas por estado
CREATE VIEW vista_resumen_rifas AS
SELECT 
  r.id,
  r.titulo,
  r.estado,
  COUNT(DISTINCT p.cliente_id) as total_participantes,
  COUNT(DISTINCT nr.id) as total_numeros,
  SUM(CASE WHEN nr.estado = 'vendido' THEN 1 ELSE 0 END) as numeros_vendidos,
  r.cantidad_ganadores,
  r.fecha_evento
FROM rifas r
LEFT JOIN participantes p ON r.id = p.rifa_id
LEFT JOIN numeros_rifa nr ON r.id = nr.rifa_id
GROUP BY r.id;

-- Vista: Reporte de pagos por rifa
CREATE VIEW vista_reporte_pagos AS
SELECT 
  r.id,
  r.titulo,
  COUNT(pg.id) as total_pagos,
  SUM(CASE WHEN pg.estado = 'confirmado' THEN pg.monto ELSE 0 END) as monto_confirmado,
  SUM(CASE WHEN pg.estado = 'pendiente' THEN pg.monto ELSE 0 END) as monto_pendiente,
  SUM(pg.monto) as monto_total
FROM rifas r
LEFT JOIN pagos pg ON r.id = pg.rifa_id
GROUP BY r.id;

-- ========================================
-- DATOS INICIALES (OPCIONAL)
-- ========================================

-- Usuario administrador por defecto
INSERT IGNORE INTO usuarios (nombre, email, dni, password_hash, rol) 
VALUES ('Administrador', 'admin@rifapro.com', '00000000', 
  SHA2('admin123', 256), 'admin');

-- Configuración inicial
INSERT IGNORE INTO configuracion (clave, valor, tipo, descripcion)
VALUES 
  ('version_app', '1.0', 'texto', 'Versión de la aplicación'),
  ('moneda_defecto', 'SOL', 'texto', 'Moneda por defecto'),
  ('precio_numero_defecto', '10.00', 'numero', 'Precio por defecto de cada número'),
  ('cantidad_numeros_defecto', '100', 'numero', 'Cantidad de números por defecto en rifas');

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ========================================

-- Procedimiento: Registrar venta de número
DELIMITER $$
CREATE PROCEDURE sp_vender_numero(
  IN p_rifa_id INT,
  IN p_numero INT,
  IN p_cliente_id INT,
  OUT p_resultado VARCHAR(255)
)
BEGIN
  DECLARE v_estado VARCHAR(20);
  
  SELECT estado INTO v_estado FROM numeros_rifa 
  WHERE rifa_id = p_rifa_id AND numero = p_numero;
  
  IF v_estado IS NULL THEN
    SET p_resultado = 'ERROR: Número no encontrado';
  ELSEIF v_estado != 'disponible' THEN
    SET p_resultado = 'ERROR: Número no disponible';
  ELSE
    UPDATE numeros_rifa 
    SET estado = 'vendido', cliente_id = p_cliente_id, fecha_venta = NOW()
    WHERE rifa_id = p_rifa_id AND numero = p_numero;
    
    SET p_resultado = 'OK: Número vendido exitosamente';
  END IF;
END$$
DELIMITER ;

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger: Actualizar estado de rifa automáticamente
DELIMITER $$
CREATE TRIGGER tr_actualizar_rifa_estado BEFORE INSERT ON numeros_rifa
FOR EACH ROW
BEGIN
  DECLARE v_total INT;
  DECLARE v_vendidos INT;
  
  SELECT COUNT(*) INTO v_total FROM numeros_rifa WHERE rifa_id = NEW.rifa_id;
  SELECT COUNT(*) INTO v_vendidos FROM numeros_rifa 
  WHERE rifa_id = NEW.rifa_id AND estado = 'vendido';
  
  IF v_vendidos = v_total THEN
    UPDATE rifas SET estado = 'realizada' WHERE id = NEW.rifa_id;
  END IF;
END$$
DELIMITER ;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================
