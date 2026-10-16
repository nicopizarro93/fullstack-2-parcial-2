/**
 * Gymratstore - capa de datos mock (localStorage), portada 1:1 desde
 * js/mock-data.js de la versión vanilla JS a módulos ES para usarse desde
 * React (contexts/componentes). Las funciones, nombres y reglas de negocio
 * son las mismas del archivo original; solo cambia la forma de exponerlas
 * (export de módulo en vez de window.GymratstoreData) para encajar con
 * Vite/React. Sigue siendo el único lugar que toca localStorage directamente.
 */

// Subir este número fuerza un re-seed completo (borra datos de prueba
// guardados en el navegador y vuelve a cargar la semilla de abajo).
// v3: se agregó precioOferta a algunos suplementos (vista /ofertas, Anexo 1
// Evaluación 2) - sin subir la versión, quien ya tenía la v2 guardada en su
// navegador no vería los nuevos campos de oferta.
const SEED_VERSION = "3";

// Llaves de localStorage usadas por todo el sitio. Centralizadas acá para
// evitar strings mágicos repetidos y typos entre módulos.
const KEYS = {
  seedVersion: "gr_seed_version",
  productos: "gr_productos",
  usuarios: "gr_usuarios",
  ordenes: "gr_ordenes",
  carrito: "gr_carrito",
};

// ---------------------------------------------------------------------
// Datos de referencia (región/comuna, categorías por tipo de producto)
// ---------------------------------------------------------------------

// Regiones y comunas de Chile disponibles para los formularios de
// registro/edición de usuario (lista acotada de ejemplo, no exhaustiva).
export const REGIONES = {
  "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "La Florida"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Quillota"],
  "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro"],
};

// Categorías válidas cuando el tipo de producto es "Plan" (membresía de gimnasio).
export const CATEGORIAS_PLAN = ["Plan Mensual", "Plan Trimestral", "Plan Semestral", "Plan Anual"];

// Categorías válidas cuando el tipo de producto es "Suplemento".
export const CATEGORIAS_SUPLEMENTO = ["Proteínas", "Creatina", "Pre-entreno", "Vitaminas", "Accesorios", "Snacks"];

// Ícono Bootstrap Icons por categoría, usado como respaldo cuando un
// producto no tiene campo "imagen" asignado (ver mediaProducto en
// components/ProductoCard.jsx).
const ICONO_POR_CATEGORIA = {
  "Plan Mensual": "bi-calendar-week",
  "Plan Trimestral": "bi-calendar3",
  "Plan Semestral": "bi-calendar3-range",
  "Plan Anual": "bi-calendar-heart",
  "Proteínas": "bi-cup-straw",
  "Creatina": "bi-capsule",
  "Pre-entreno": "bi-lightning-charge",
  "Vitaminas": "bi-capsule-pill",
  "Accesorios": "bi-bag",
  "Snacks": "bi-egg-fried",
};

// ---------------------------------------------------------------------
// Semilla inicial
// ---------------------------------------------------------------------

// Catálogo inicial de productos (4 planes de membresía + 8 suplementos).
function semillaProductos() {
  return [
    { codigo: "PLAN-MEN", tipo: "Plan", categoria: "Plan Mensual", nombre: "Plan Mensual", descripcion: "Acceso ilimitado a sala de musculación y máquinas de cardio durante 1 mes. Renovación mensual, sin permanencia.", precio: 24990, stock: 50, stockCritico: 10, imagen: "" },
    { codigo: "PLAN-TRI", tipo: "Plan", categoria: "Plan Trimestral", nombre: "Plan Trimestral", descripcion: "3 meses de acceso ilimitado + 1 evaluación física incluida. Ahorra frente al plan mensual.", precio: 64990, stock: 40, stockCritico: 8, imagen: "" },
    { codigo: "PLAN-SEM", tipo: "Plan", categoria: "Plan Semestral", nombre: "Plan Semestral", descripcion: "6 meses de acceso ilimitado + 2 evaluaciones físicas + rutina personalizada inicial.", precio: 119990, stock: 30, stockCritico: 6, imagen: "" },
    { codigo: "PLAN-ANU", tipo: "Plan", categoria: "Plan Anual", nombre: "Plan Anual", descripcion: "12 meses de acceso ilimitado + evaluaciones trimestrales + clases grupales incluidas. Nuestro plan más completo.", precio: 209990, stock: 25, stockCritico: 5, imagen: "" },
    { codigo: "SUP-WHEY01", tipo: "Suplemento", categoria: "Proteínas", nombre: "Proteína Whey Vainilla 900g", descripcion: "Proteína de suero de leche, sabor vainilla, 30 porciones.", precio: 32990, stock: 18, stockCritico: 5, imagen: "img/proteina-vainilla.jpg" },
    { codigo: "SUP-WHEY02", tipo: "Suplemento", categoria: "Proteínas", nombre: "Proteína Whey Chocolate 900g", descripcion: "Proteína de suero de leche, sabor chocolate, 30 porciones.", precio: 32990, stock: 15, stockCritico: 5, imagen: "img/proteina-chocolate.jpg" },
    { codigo: "SUP-CREA01", tipo: "Suplemento", categoria: "Creatina", nombre: "Creatina Monohidratada 300g", descripcion: "Creatina monohidratada pura, sin sabor, 60 porciones.", precio: 18990, stock: 22, stockCritico: 5, imagen: "img/creatina.jpg" },
    { codigo: "SUP-PRE01", tipo: "Suplemento", categoria: "Pre-entreno", nombre: "Pre-entreno Frutos Rojos 300g", descripcion: "Pre-entreno con cafeína y beta-alanina, sabor frutos rojos.", precio: 21990, precioOferta: 17990, stock: 12, stockCritico: 4, imagen: "img/pre-entreno.jpg" },
    { codigo: "SUP-VIT01", tipo: "Suplemento", categoria: "Vitaminas", nombre: "Multivitamínico Deportivo 60 cáps", descripcion: "Complejo multivitamínico formulado para personas activas.", precio: 14990, stock: 30, stockCritico: 8, imagen: "img/multivitaminico.jpg" },
    { codigo: "SUP-ACC01", tipo: "Suplemento", categoria: "Accesorios", nombre: "Shaker Gymratstore 700ml", descripcion: "Vaso mezclador con malla anti-grumos, 700ml.", precio: 6990, stock: 40, stockCritico: 10, imagen: "img/shaker-gymrat.jpg" },
    { codigo: "SUP-ACC02", tipo: "Suplemento", categoria: "Accesorios", nombre: "Cinturón de Levantamiento", descripcion: "Cinturón de cuero reforzado para levantamientos pesados.", precio: 24990, precioOferta: 19990, stock: 8, stockCritico: 3, imagen: "img/cinturon-levantamiento.jpg" },
    { codigo: "SUP-SNK01", tipo: "Suplemento", categoria: "Snacks", nombre: "Barritas Proteicas Caja x12", descripcion: "Caja de 12 barritas proteicas sabor surtido.", precio: 15990, precioOferta: 12990, stock: 20, stockCritico: 5, imagen: "img/barritas-proteicas.jpg" },
  ];
}

// Usuarios iniciales: 1 Administrador, 1 Vendedor y 3 Clientes (con distintos
// estados de membresía) para poder probar todos los flujos desde el primer uso.
function semillaUsuarios() {
  return [
    { run: "189012349", nombre: "Camila", apellidos: "Reyes Muñoz", correo: "admin@duoc.cl", clave: "admin123", fechaNacimiento: "1990-05-12", tipoUsuario: "Administrador", region: "Región Metropolitana", comuna: "Santiago", direccion: "Av. Libertador Bernardo O'Higgins 1234", membresia: null },
    { run: "167890121", nombre: "Diego", apellidos: "Fuentes Lara", correo: "diego.fuentes@duoc.cl", clave: "vende123", fechaNacimiento: "1995-02-20", tipoUsuario: "Vendedor", region: "Región Metropolitana", comuna: "Maipú", direccion: "Calle Los Aromos 456", membresia: null },
    { run: "193456782", nombre: "Matías", apellidos: "Fernández Soto", correo: "matias.fernandez@gmail.com", clave: "socio123", fechaNacimiento: "1998-11-03", tipoUsuario: "Cliente", region: "Región Metropolitana", comuna: "Puente Alto", direccion: "Pasaje Las Rosas 789", membresia: { productoCodigo: "PLAN-TRI", fechaInicio: "2026-08-05", fechaFin: "2026-11-05" } },
    { run: "204567891", nombre: "Valentina", apellidos: "Soto Pizarro", correo: "valentina.soto@gmail.com", clave: "socio123", fechaNacimiento: "2000-07-16", tipoUsuario: "Cliente", region: "Valparaíso", comuna: "Viña del Mar", direccion: "Av. San Martín 321", membresia: { productoCodigo: "PLAN-MEN", fechaInicio: "2026-06-01", fechaFin: "2026-07-01" } },
    { run: "215678903", nombre: "Benjamín", apellidos: "Rojas Castro", correo: "benjamin.rojas@gmail.com", clave: "socio123", fechaNacimiento: "2002-01-27", tipoUsuario: "Cliente", region: "Biobío", comuna: "Concepción", direccion: "Calle Freire 654", membresia: null },
  ];
}

// Órdenes de ejemplo, asociadas a los clientes de semillaUsuarios().
function semillaOrdenes() {
  return [
    { id: 1001, run: "193456782", fecha: "2026-08-05", items: [
      { codigo: "PLAN-TRI", nombre: "Plan Trimestral", tipo: "Plan", precio: 64990, cantidad: 1 },
      { codigo: "SUP-WHEY01", nombre: "Proteína Whey Vainilla 900g", tipo: "Suplemento", precio: 32990, cantidad: 1 },
    ], total: 97980, estado: "Pagada" },
    { id: 1002, run: "204567891", fecha: "2026-06-01", items: [
      { codigo: "PLAN-MEN", nombre: "Plan Mensual", tipo: "Plan", precio: 24990, cantidad: 1 },
    ], total: 24990, estado: "Pagada" },
    { id: 1003, run: "193456782", fecha: "2026-08-20", items: [
      { codigo: "SUP-CREA01", nombre: "Creatina Monohidratada 300g", tipo: "Suplemento", precio: 18990, cantidad: 2 },
      { codigo: "SUP-ACC01", nombre: "Shaker Gymratstore 700ml", tipo: "Suplemento", precio: 6990, cantidad: 1 },
    ], total: 44970, estado: "Pagada" },
  ];
}

// ---------------------------------------------------------------------
// Almacenamiento base
// ---------------------------------------------------------------------

// Lee y parsea una clave de localStorage; devuelve porDefecto si no existe
// o si localStorage falla (ej. modo incógnito con storage bloqueado).
function leer(clave, porDefecto) {
  try {
    const raw = localStorage.getItem(clave);
    if (raw === null) return porDefecto;
    return JSON.parse(raw);
  } catch (e) {
    return porDefecto;
  }
}

// Serializa y guarda un valor en localStorage. Si falla, no lanza error: el
// sitio sigue funcionando en memoria durante la vida de esa carga de página.
function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    /* localStorage no disponible: sigue funcionando en memoria */
  }
}

// Compara la versión de semilla guardada contra SEED_VERSION: si difieren
// (primera visita, o se subió SEED_VERSION a propósito), sobrescribe
// productos/usuarios/órdenes con los datos de fábrica. El carrito NO se toca
// acá (es estado transitorio del usuario, no parte de la semilla).
export function inicializar() {
  let versionGuardada = null;
  try {
    versionGuardada = localStorage.getItem(KEYS.seedVersion);
  } catch (e) {
    versionGuardada = SEED_VERSION;
  }
  if (versionGuardada !== SEED_VERSION) {
    guardar(KEYS.productos, semillaProductos());
    guardar(KEYS.usuarios, semillaUsuarios());
    guardar(KEYS.ordenes, semillaOrdenes());
    try {
      localStorage.setItem(KEYS.seedVersion, SEED_VERSION);
    } catch (e) {
      /* noop */
    }
  }
}

// Se ejecuta al importar este módulo (equivalente al inicializar() que
// corría solo al cargar mock-data.js en la versión vanilla).
inicializar();

// ---------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------

export function getProductos() {
  return leer(KEYS.productos, []);
}

export function getProductoPorCodigo(codigo) {
  return getProductos().find((p) => p.codigo === codigo) || null;
}

export function getProductosPorTipo(tipo) {
  return getProductos().filter((p) => p.tipo === tipo);
}

// Crea o reemplaza un producto según su código (el código es la llave natural).
export function guardarProducto(producto) {
  const productos = getProductos();
  const idx = productos.findIndex((p) => p.codigo === producto.codigo);
  if (idx >= 0) productos[idx] = producto;
  else productos.push(producto);
  guardar(KEYS.productos, productos);
}

export function eliminarProducto(codigo) {
  guardar(KEYS.productos, getProductos().filter((p) => p.codigo !== codigo));
}

// ---------------------------------------------------------------------
// Ofertas (nuevo - Anexo 1 Evaluación 2: vista "Ofertas" del flujo público)
// ---------------------------------------------------------------------

// Precio a cobrar por un producto: el de oferta si existe y es menor al
// precio normal (una oferta mal cargada por el admin, ej. precioOferta
// mayor o igual al precio, se ignora en vez de cobrar de más).
export function getPrecioEfectivo(producto) {
  if (producto && producto.precioOferta != null && producto.precioOferta < producto.precio) {
    return producto.precioOferta;
  }
  return producto ? producto.precio : 0;
}

export function getProductosEnOferta() {
  return getProductos().filter((p) => p.precioOferta != null && p.precioOferta < p.precio);
}

// ---------------------------------------------------------------------
// Usuarios / Alumnos
// ---------------------------------------------------------------------

export function getUsuarios() {
  return leer(KEYS.usuarios, []);
}

export function getUsuarioPorRun(run) {
  return getUsuarios().find((u) => u.run === run) || null;
}

export function getUsuarioPorCorreo(correo) {
  return getUsuarios().find((u) => u.correo.toLowerCase() === String(correo).toLowerCase()) || null;
}

// ¿Ya existe un usuario con este correo? runExcluir permite excluir al propio
// usuario al editar (para no chocar consigo mismo al no cambiar el correo).
export function existeCorreo(correo, runExcluir) {
  const u = getUsuarioPorCorreo(correo);
  return !!u && u.run !== runExcluir;
}

// Crea o reemplaza un usuario según su RUN (llave natural).
export function guardarUsuario(usuario) {
  const usuarios = getUsuarios();
  const idx = usuarios.findIndex((u) => u.run === usuario.run);
  if (idx >= 0) usuarios[idx] = usuario;
  else usuarios.push(usuario);
  guardar(KEYS.usuarios, usuarios);
}

export function eliminarUsuario(run) {
  guardar(KEYS.usuarios, getUsuarios().filter((u) => u.run !== run));
}

// Autenticación mock: busca por correo y compara la contraseña en texto
// plano (aceptable para este proyecto académico sin backend real).
export function autenticar(correo, clave) {
  const usuario = getUsuarioPorCorreo(correo);
  if (!usuario) return null;
  if (usuario.clave !== clave) return null;
  return usuario;
}

// Devuelve "Activa" | "Vencida" | "Sin plan", recalculado contra la fecha
// actual (no confía en un campo "estado" que se pueda desincronizar).
export function getEstadoMembresia(usuario) {
  if (!usuario || !usuario.membresia || !usuario.membresia.fechaFin) return "Sin plan";
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(usuario.membresia.fechaFin + "T00:00:00");
  return fin >= hoy ? "Activa" : "Vencida";
}

// Usuarios de tipo Cliente únicamente (lo que el panel admin llama "alumnos").
export function getUsuariosAlumnos() {
  return getUsuarios().filter((u) => u.tipoUsuario === "Cliente");
}

// ---------------------------------------------------------------------
// Órdenes
// ---------------------------------------------------------------------

export function getOrdenes() {
  return leer(KEYS.ordenes, []);
}

export function getOrdenesPorRun(run) {
  return getOrdenes().filter((o) => o.run === run);
}

// Nombre a mostrar para una orden: alumno registrado, o datos de invitado
// cuando la orden se compró sin cuenta.
export function nombreClienteOrden(orden) {
  if (orden.run) {
    const usuario = getUsuarioPorRun(orden.run);
    return usuario ? `${usuario.nombre} ${usuario.apellidos}` : orden.run;
  }
  if (orden.invitado && orden.invitado.nombre) return `${orden.invitado.nombre} (invitado)`;
  return "Invitado";
}

export function getOrdenPorId(id) {
  return getOrdenes().find((o) => o.id === Number(id)) || null;
}

// Crea una nueva orden, asignándole un id autoincremental (mayor id
// existente + 1, partiendo de 1000 si no hay órdenes todavía).
export function crearOrden(orden) {
  const ordenes = getOrdenes();
  let maxId = 1000;
  ordenes.forEach((o) => {
    if (o.id > maxId) maxId = o.id;
  });
  const nueva = { ...orden, id: maxId + 1 };
  ordenes.push(nueva);
  guardar(KEYS.ordenes, ordenes);
  return nueva;
}

// Aplica los planes comprados en una orden como membresía del cliente (si
// compró más de un plan, se queda con el de fecha de término más lejana).
export function aplicarMembresiaDesdeOrden(run, orden) {
  const usuario = getUsuarioPorRun(run);
  if (!usuario) return;
  const mesesPorCategoria = { "Plan Mensual": 1, "Plan Trimestral": 3, "Plan Semestral": 6, "Plan Anual": 12 };
  let mejor = null;
  orden.items.forEach((item) => {
    if (item.tipo !== "Plan") return;
    const producto = getProductoPorCodigo(item.codigo);
    if (!producto) return;
    const meses = mesesPorCategoria[producto.categoria] || 1;
    const inicio = new Date();
    const fin = new Date();
    fin.setMonth(fin.getMonth() + meses);
    const candidato = {
      productoCodigo: producto.codigo,
      fechaInicio: inicio.toISOString().slice(0, 10),
      fechaFin: fin.toISOString().slice(0, 10),
    };
    if (!mejor || candidato.fechaFin > mejor.fechaFin) mejor = candidato;
  });
  if (mejor) {
    usuario.membresia = mejor;
    guardarUsuario(usuario);
  }
}

// ---------------------------------------------------------------------
// Carrito
// ---------------------------------------------------------------------

export function getCarrito() {
  return leer(KEYS.carrito, []);
}

export function guardarCarrito(carrito) {
  guardar(KEYS.carrito, carrito);
}

// Agrega "cantidad" unidades de un producto al carrito. Si el producto no
// existe en el catálogo, no hace nada. Si ya está en el carrito, suma a la
// cantidad existente (salvo que sea un Plan: nunca se duplica/suma, siempre
// queda en 1 unidad).
export function agregarAlCarrito(codigo, cantidad = 1) {
  const producto = getProductoPorCodigo(codigo);
  if (!producto) return getCarrito();
  const carrito = getCarrito();
  const item = carrito.find((i) => i.codigo === codigo);
  if (item) {
    if (producto.tipo !== "Plan") item.cantidad += cantidad;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      tipo: producto.tipo,
      // Precio de oferta si corresponde (ver getPrecioEfectivo más abajo),
      // para que el carrito y la boleta siempre cobren lo mismo que se
      // mostró en la tarjeta/ficha del producto.
      precio: getPrecioEfectivo(producto),
      cantidad: producto.tipo === "Plan" ? 1 : cantidad,
    });
  }
  guardarCarrito(carrito);
  return carrito;
}

// Revisa el carrito contra el stock REAL del catálogo (puede haber cambiado
// desde que se agregó cada ítem) y devuelve los ítems que ya no alcanzan.
// Lista vacía = todo el carrito tiene stock suficiente. Usado por el paso de
// checkout para decidir si la compra se puede completar o debe mostrar la
// vista "no se pudo realizar el pago" (Anexo 1 Evaluación 2, Figura 8).
export function getItemsSinStock(carrito) {
  return carrito
    .map((item) => {
      const producto = getProductoPorCodigo(item.codigo);
      const disponible = producto ? producto.stock : 0;
      return { codigo: item.codigo, nombre: item.nombre, pedido: item.cantidad, disponible };
    })
    .filter((it) => it.pedido > it.disponible);
}

// Fija la cantidad exacta de un ítem del carrito. Si la cantidad resultante
// es <= 0, el ítem se elimina por completo del carrito.
export function actualizarCantidadCarrito(codigo, cantidad) {
  const carrito = getCarrito()
    .map((item) => (item.codigo === codigo ? { ...item, cantidad } : item))
    .filter((item) => item.cantidad > 0);
  guardarCarrito(carrito);
  return carrito;
}

export function quitarDelCarrito(codigo) {
  const carrito = getCarrito().filter((item) => item.codigo !== codigo);
  guardarCarrito(carrito);
  return carrito;
}

export function limpiarCarrito() {
  guardarCarrito([]);
}

export function getTotalCarrito() {
  return getCarrito().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

export function getCantidadItemsCarrito() {
  return getCarrito().reduce((acc, item) => acc + item.cantidad, 0);
}

// ---------------------------------------------------------------------
// Utilidades de formato
// ---------------------------------------------------------------------

// Formatea un número como moneda chilena (ej. 32990 -> "$32.990"). Si
// toLocaleString falla por algún motivo, cae a un formato simple "$valor".
export function formatoCLP(valor) {
  try {
    return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  } catch (e) {
    return "$" + valor;
  }
}

export function getComunas(region) {
  return REGIONES[region] || [];
}

export function getIconoCategoria(categoria) {
  return ICONO_POR_CATEGORIA[categoria] || "bi-box-seam";
}

// Reexportado por conveniencia para quien prefiera importar un solo objeto
// (parecido al antiguo window.GymratstoreData), aunque el resto del proyecto
// usa los named exports de arriba directamente.
const GymratstoreData = {
  REGIONES, CATEGORIAS_PLAN, CATEGORIAS_SUPLEMENTO,
  getProductos, getProductoPorCodigo, getProductosPorTipo, guardarProducto, eliminarProducto,
  getPrecioEfectivo, getProductosEnOferta,
  getUsuarios, getUsuarioPorRun, getUsuarioPorCorreo, existeCorreo, guardarUsuario, eliminarUsuario,
  autenticar, getEstadoMembresia, getUsuariosAlumnos,
  getOrdenes, getOrdenesPorRun, getOrdenPorId, nombreClienteOrden, crearOrden, aplicarMembresiaDesdeOrden,
  getCarrito, agregarAlCarrito, actualizarCantidadCarrito, quitarDelCarrito, limpiarCarrito,
  getItemsSinStock, getTotalCarrito, getCantidadItemsCarrito, formatoCLP, getComunas, getIconoCategoria,
};
export default GymratstoreData;
