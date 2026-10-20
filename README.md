# Gymratstore - React + Vite + react-bootstrap

Tienda web de **planes de gimnasio y suplementos deportivos**, desarrollada para la **Evaluación Parcial 2 de DSY1104 (Desarrollo Fullstack II)**.

Es la migración a **React** del sitio original Gymratstore (HTML + JavaScript + Bootstrap). Se mantuvieron las mismas reglas de negocio y se agregaron las vistas que pide el Anexo 1 de la evaluación.

## Tecnologías

- **React 18** + **Vite 5** (SPA con **React Router 6**)
- **react-bootstrap** / Bootstrap 5.3 + Bootstrap Icons
- **Vitest** + **React Testing Library** + jsdom para las pruebas unitarias
- Persistencia simulada con `localStorage` (no hay backend)

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior.

```bash
npm install            # instala dependencias
npm run dev            # servidor de desarrollo (http://localhost:5173)
npm test               # pruebas unitarias
npm run test:coverage  # pruebas + reporte de cobertura (carpeta coverage/)
npm run build          # build de producción (carpeta dist/)
```

## Usuarios de prueba

Se cargan automáticamente la primera vez que se abre el sitio:

| Rol           | Correo                       | Contraseña | Acceso                                    |
| ------------- | ---------------------------- | ---------- | ----------------------------------------- |
| Administrador | `admin@duoc.cl`              | `admin123` | Panel admin completo                      |
| Vendedor      | `diego.fuentes@duoc.cl`      | `vende123` | Panel admin (productos y órdenes)         |
| Cliente       | `matias.fernandez@gmail.com` | `socio123` | Tienda, con membresía de ejemplo          |

Para volver a los datos iniciales, borra el `localStorage` del sitio desde las herramientas del navegador.

## Funcionalidades

**Tienda (público)**
- Home, catálogo de productos con filtros, **Categorías** (`/categorias`) y **Ofertas** (`/ofertas`)
- Ficha de producto con productos relacionados
- Carrito persistente y carrito flotante
- **Checkout** (`/checkout`): datos del cliente, dirección de entrega (región/comuna) y pago simulado con tarjeta
- Resultado de la compra: **compra exitosa** (`/compra-exitosa/:id`), con boleta imprimible en PDF, o **compra con error** (`/compra-error`) cuando ya no hay stock suficiente
- Registro e inicio de sesión, blog, nosotros, contacto y política de privacidad
- Modo claro/oscuro con preferencia guardada

**Panel de administración** (`/admin`, protegido por rol)
- Dashboard con estadísticas
- CRUD de productos, incluido el precio de oferta
- CRUD de usuarios/alumnos y sus membresías (solo Administrador)
- Listado de órdenes

**Reglas de negocio**
- RUN chileno sin puntos ni guion, validado con dígito verificador; no se puede repetir
- Correos solo de los dominios `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`; no se pueden repetir
- Contraseña de 4 a 10 caracteres
- Los planes de gimnasio exigen una cuenta y siempre se compran de a 1; los suplementos se pueden comprar como invitado
- El stock se revalida al momento de pagar
- Una membresía queda Activa o Vencida según su fecha de término

## Pruebas

53 pruebas en 4 archivos, todas pasando con `npm test`:

| Archivo                                  | Qué prueba                                                           |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `src/utils/validaciones.test.js`         | RUN y dígito verificador, correo, contraseña, números, tarjeta       |
| `src/data/mockData.test.js`              | Carrito (agregar, actualizar, quitar, totales), ofertas, membresías  |
| `src/data/sesion.test.js`                | Sesión y control de acceso por rol                                   |
| `src/components/ProductoCard.test.jsx`   | Componente: renderizado, renderizado condicional, props y eventos    |

Se usó **Vitest** en lugar de Jasmine/Karma porque se integra directamente con Vite. Las cuatro categorías de prueba de componentes que propone el Anexo 1 se cubren con React Testing Library.

## Estructura

```
src/
  assets/      css/index.css (estilos globales y temas), img/productos/
  components/  NavBar, Footer, Layout, ProductoCard, CarritoFlotante,
               ProtectedRoute, ScrollToTop, admin/AdminLayout
  context/     ThemeContext, ToastContext, SesionContext, CarritoContext
  data/        mockData.js (productos, usuarios, órdenes y carrito en localStorage)
               sesion.js (sesión y control de acceso por rol)
  pages/       vistas públicas y admin/*
  utils/       validaciones.js (reglas de formularios)
  test/        setup.js (configuración de Testing Library)
```

## Limitaciones conocidas

Es un proyecto académico sin backend, por lo tanto:
- Los usuarios, contraseñas y la sesión se guardan en `localStorage` del navegador, sin cifrar. El control de acceso es solo del lado del cliente y no sería seguro en producción.
- El pago y el envío de la boleta por correo son simulados.
