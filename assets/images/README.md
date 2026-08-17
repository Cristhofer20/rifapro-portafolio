# 📁 Carpeta de Imágenes - RifaPro

Esta carpeta contiene todas las imágenes de la aplicación.

## Estructura

```
assets/
├── images/
│   ├── backgrounds/       # Imágenes de fondo
│   │   └── raffle-bg.jpg  # Fondo para containers (requisito: 1920x1080px+)
│   ├── events/            # Imágenes de eventos/rifas
│   ├── logos/             # Logos y branding
│   └── ui/                # Elementos UI (iconos, etc)
├── placeholders/          # Imágenes placeholder temporales
└── README.md
```

## 🖼️ Imagen de Fondo Recomendada

Debe ser:
- **Resolución**: 1920x1080px o superior
- **Formato**: JPG o PNG
- **Tamaño**: Máximo 500KB
- **Tema**: Relacionada con sorteos/rifas
- **Ubicación**: `assets/images/backgrounds/raffle-bg.jpg`

### Alternativa: Generar automáticamente

Ejecuta este script en la carpeta del proyecto:

```bash
node scripts/generate-background.js
```

Esto generará una imagen de fondo automáticamente.

## 📌 Uso

El fondo se aplicará automáticamente a través del CSS en `src/styles.css`:

```css
.container {
  background-image: url('../assets/images/backgrounds/raffle-bg.jpg');
  background-attachment: fixed;
  opacity: 0.1;
}
```

## ⚠️ Importante

- Las imágenes de eventos se suben dinámicamente a través del formulario
- El fondo no debe interferir con la legibilidad del texto
- Se recomienda usar fondo oscuro con opacidad baja (0.05 - 0.15)
