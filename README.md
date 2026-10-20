# Gymratstore - React + Vite + react-bootstrap

Migración de la tienda **Gymratstore** (antes HTML/JS vanilla + Bootstrap, carpeta `GymratstoreCompleto`) a **React** con **Vite** y **react-bootstrap**, para la Evaluación Parcial 2 de DSY1104.

Este proyecto es nuevo y vive **al lado** de `GymratstoreCompleto` (no lo reemplaza ni lo borra): así el sitio vanilla original queda intacto como respaldo/referencia mientras se revisa esta migración.

## Decisiones tomadas (resumen)

- **React + Vite** (no Create React App) y **react-bootstrap** como librería de componentes (no Bootstrap JS "a mano").
- **Vite/Vitest** para pruebas unitarias, en vez de Jasmine/Karma (que menciona el documento oficial de la evaluación). Se decidió así explícitamente, no por error.
- Pruebas unitarias **acotadas a lo más importante** (no se buscó maximizar el número de pruebas): validación de RUN con dígito verificador, validación de correo/clave, lógica de carrito (agregar/actualizar/quitar/totales), estado de membresía (Activa/Vencida/Sin plan) y control de acceso por rol.
- **Modo oscuro/claro** nuevo (el sitio original tenía el tema oscuro fijo), con un botón en la navbar y persistencia en `localStorage`.
- Mejoras de UI/UX: navegación de página única (sin recargas completas al cambiar de sección), un solo sistema de avisos (toasts de react-bootstrap, sin el `alert()` nativo de respaldo que tenía la versión vanilla), filtros de catálogo más compactos, y modales de admin con `react-bootstrap` en vez de manipulación manual del DOM.
- La lógica de negocio (`mock-data.js`, `validaciones.js`, `sesion.js`, `carrito.js`/`carrito-page.js`) se **portó**, no se rediseñó: mismos nombres de función, mismas reglas (dígito verificador de RUN, dominios de correo permitidos, duración de cada plan, etc.), solo cambiando `window.Algo = {...}` por `export`/módulos ES y adaptando el pintado de errores de formulario al patrón controlado de React (`isInvalid` + `Form.Control.Feedback`) en vez de clases `is-invalid` puestas a mano en el DOM.

## Novedades a partir del Anexo 1 de la Evaluación 2

El equipo subió después el documento oficial **"DSY1104 Evaluación Parcial 2 - Anexo 1 Instrucciones"**. No se siguió al pie de la letra (ya habíamos tomado otras decisiones, como Vitest en vez de Jasmine), pero sí se implementaron las mejoras que tenían más sentido para el sitio:

- **Vista "Categorías"** (`/categorias`): tarjetas por categoría (Planes y Suplementos) que llevan al catálogo ya filtrado. Antes solo existía el `<select>` de categoría dentro de `/productos`.
- **Vista "Ofertas"** (`/ofertas`): catálogo filtrado a los productos con `precioOferta`. Se agregó un campo opcional `precioOferta` a `mockData.js` (3 suplementos de ejemplo en la semilla) y un campo del mismo nombre en el formulario de admin de productos, para que el precio de oferta se pueda gestionar, no solo quede fijo en la semilla.
- **Checkout como paso propio** (`/checkout`): antes "confirmar compra" pasaba dentro de la misma página del carrito con un formulario mínimo (solo nombre/correo/dirección de invitado). Ahora el carrito lleva a un Checkout con datos del cliente, dirección de entrega completa (calle, depto, región, comuna, indicaciones - mismo patrón de `Registro.jsx`) y un pago simulado (titular + número de tarjeta, 16 dígitos). Sigue sin requerir cuenta para comprar solo suplementos; un plan de gimnasio sigue exigiendo sesión.
- **Vistas de resultado separadas**: `/compra-exitosa/:id` (resumen de la orden, con botones para "Imprimir boleta en PDF" vía `window.print()` y "Enviar boleta por email", simulado con un toast) y `/compra-error` (cuando la revalidación de stock al pagar encuentra que algún ítem ya no alcanza - no se simula un error de pasarela al azar, para que el flujo sea reproducible). El "¡Compra confirmada!" genérico que antes vivía dentro de `Carrito.jsx` se reemplazó por estas dos vistas.
- **Prueba de componente con React Testing Library** (`src/components/ProductoCard.test.jsx`): el Anexo 1 propone para React+Jasmine 4 categorías de prueba (renderizado, renderizado condicional, props, eventos); se armó un archivo que cubre esas mismas 4 categorías pero con Vitest + Testing Library (ya estaban en el `package.json`, no se sumó Jasmine). A diferencia de los otros archivos de test, **este no se pudo verificar ejecutándolo** en este entorno (necesita jsdom + `@testing-library/react` instalados, no solo lógica pura) - revísalo con `npm test` junto con el resto.

Lo que **no** se tocó a propósito (ya funcionaba y no estaba roto): el flujo de login/registro, el panel de alumnos/órdenes del admin, y el dashboard de métricas tipo Figura 9 del Anexo 1 (el actual `AdminHome.jsx` ya muestra estadísticas de alumnos; rehacerlo como el mockup de "Compras/Productos/Usuarios" habría sido un rediseño completo de una pantalla que ya cumple, no una mejora puntual).

## Estructura

```
src/
  assets/      css/index.css (estilos globales), img/productos/ (fotos de productos)
  data/        mockData.js (catálogo/usuarios/órdenes/carrito en localStorage), sesion.js (login/roles)
  utils/       validaciones.js (reglas del Anexo 1: RUN, correo, clave, tarjeta, etc.)
  context/     ThemeContext, ToastContext, SesionContext, CarritoContext
  components/  NavBar, Footer, CarritoFlotante, ProductoCard (+ test), ProtectedRoute, Layout, admin/AdminLayout
  pages/       Home, Productos, Categorias, Ofertas, ProductoDetalle, Carrito, Checkout,
               CompraExitosa, CompraError, Login, Registro, Contacto, Nosotros,
               PoliticaPrivacidad, Blog, BlogDetalle, NotFound, admin/*
```

## Cómo correrlo

Este proyecto se armó completo (todo el código fuente), pero **no se pudo ejecutar `npm install` ni las pruebas desde esta sesión**: el entorno donde se generó este proyecto tiene bloqueado el acceso de red al registro de npm (política del entorno, no un problema del proyecto). Para usarlo:

```bash
npm install
npm run dev        # servidor de desarrollo (Vite)
npm run build       # build de producción
npm test            # corre las pruebas unitarias con Vitest
npm run test:coverage  # pruebas + reporte de cobertura (para el documento de cobertura de testing)
```

**Importante:** antes de entregar, corre `npm install` y `npm test` al menos una vez en tu máquina y avísame si algo falla. La lógica pura (`validaciones.test.js`, `mockData.test.js`, `sesion.test.js` - 48 aserciones en total) se verificó manualmente ejecutando esas mismas aserciones contra el código real con un pequeño harness aparte (sin Vitest, ver nota de la sección anterior), y todas pasaron. El archivo de componente (`ProductoCard.test.jsx`) no se pudo ejecutar de la misma forma (necesita jsdom + Testing Library reales) - no hay sustituto de correr el `npm test` real con todo instalado.

## Qué falta (pendiente, no incluido en esta entrega)

- Actualizar el documento **ERS** a su última versión reflejando esta arquitectura React.
- Crear el **documento de cobertura de testing** que pide la rúbrica (puede apoyarse en `npm run test:coverage`).
- Subir este proyecto al repositorio de GitHub del equipo (`https://github.com/nicopizarro93/proyecto-fullstack`) - no se hacen `git push` desde esta sesión.
