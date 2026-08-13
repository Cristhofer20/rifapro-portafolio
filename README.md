# 🎟️ RifaPro — App de Rifas

Aplicación web responsive para administrar rifas, clientes, eventos, pagos, números disponibles y ganadores. El proyecto está hecho con **HTML, CSS y JavaScript modular**, por lo que puede publicarse como sitio estático en GitHub Pages.

## Funcionalidades

- Inicio de sesión y registro de clientes.
- Roles de administrador y cliente.
- CRUD de clientes y eventos.
- Selección y reserva de números del 1 al 100.
- Simulación de pagos con Yape/Plin, sin procesar dinero real.
- Generación de comprobante en PDF.
- Dashboard administrativo.
- Perfil de cliente y foto local.
- Diseño responsive para computadora, tablet y celular.
- Persistencia de demostración mediante `localStorage`.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES Modules
- LocalStorage
- html2pdf.js
- Node.js Test Runner para pruebas
- GitHub Actions para validación automática
- GitHub Pages para despliegue

## Estructura

```text
.
├── index.html
├── package.json
├── README.md
├── src/
│   ├── config.js
│   ├── helpers.js
│   ├── main.js
│   ├── raffleNumbers.js
│   ├── state.js
│   ├── storage.js
│   └── styles.css
├── tests/
│   └── raffle-numbers.test.mjs
└── .github/workflows/
    └── ci.yml
```

## Ejecutar localmente

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
