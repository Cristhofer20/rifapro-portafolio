// ========================================
// GENERADOR DE IMAGEN DE FONDO
// ========================================
// Este script genera una imagen de fondo automáticamente
// para RifaPro si no tienes una.

// Uso: node scripts/generate-background.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración de la imagen
const WIDTH = 1920;
const HEIGHT = 1080;
const OUTPUT_PATH = path.join(__dirname, '../assets/images/backgrounds/raffle-bg.jpg');

// Crear directorio si no existe
const dir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('✓ Directorio creado:', dir);
}

// Crear canvas
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

console.log('🎨 Generando imagen de fondo para RifaPro...');
console.log(`   Resolución: ${WIDTH}x${HEIGHT}px`);

// Fondo base (gradiente oscuro azul)
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
gradient.addColorStop(0, '#081028');
gradient.addColorStop(0.5, '#101e3d');
gradient.addColorStop(1, '#0a1930');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Patrón de puntos (representando números de rifas)
ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
for (let i = 0; i < 100; i++) {
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;
  const radius = Math.random() * 8 + 2;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Líneas decorativas (representando conexiones)
ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
ctx.lineWidth = 2;
for (let i = 0; i < 20; i++) {
  const x1 = Math.random() * WIDTH;
  const y1 = Math.random() * HEIGHT;
  const x2 = Math.random() * WIDTH;
  const y2 = Math.random() * HEIGHT;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Círculos decorativos grandes
ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
ctx.lineWidth = 3;
for (let i = 0; i < 5; i++) {
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;
  const radius = Math.random() * 200 + 50;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Guardar imagen
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
fs.writeFileSync(OUTPUT_PATH, buffer);

console.log('✓ Imagen guardada en:', OUTPUT_PATH);
console.log('✓ Tamaño del archivo:', (buffer.length / 1024).toFixed(2), 'KB');
console.log('');
console.log('✨ ¡Imagen de fondo creada exitosamente!');
console.log('');
console.log('Próximos pasos:');
console.log('1. Reinicia la aplicación: npm start');
console.log('2. El fondo se mostrará detrás de todos los containers');
console.log('');
console.log('💡 Personalización:');
console.log('  - Edita este archivo para cambiar colores');
console.log('  - Puedes reemplazar la imagen con una tuya propia');
console.log('');
