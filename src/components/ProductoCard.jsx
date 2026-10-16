/**
 * Gymratstore - tarjeta de producto, portada desde ProductoUI.tarjetaProducto
 * de js/producto-ui.js (que generaba un string de HTML) a un componente JSX.
 * Misma información y misma regla de negocio (ícono de categoría como
 * respaldo si no hay foto, badge según tipo, aviso de stock crítico, botón
 * deshabilitado sin stock); solo cambia la forma de construir el markup.
 */
import { Link } from "react-router-dom";
import { getIconoCategoria, formatoCLP, getPrecioEfectivo } from "../data/mockData.js";
import { useCarrito } from "../context/CarritoContext.jsx";

// Las imagenes viven en public/img/ (Vite las sirve desde la raiz del sitio,
// "/img/..."), pero la semilla y el formulario de admin guardan la ruta sin
// "/" inicial ("img/archivo.jpg"). Con ese string a secas, el navegador la
// resuelve relativa a la URL ACTUAL en vez de a la raiz del sitio: en rutas
// anidadas como la ficha de producto (/productos/:codigo) terminaba
// buscando "/productos/img/archivo.jpg" (404) y la imagen no se veia.
// Esto la normaliza a absoluta sin importar como se haya guardado.
function resolverImagen(ruta) {
  if (!ruta) return ruta;
  if (/^(https?:)?\/\//.test(ruta) || ruta.startsWith("/")) return ruta;
  return "/" + ruta;
}

// Foto real del producto si tiene una asignada, o el icono de su categoria
// como respaldo (los planes de membresia no tienen foto).
export function mediaProducto(producto) {
  if (producto.imagen) {
    return <img src={resolverImagen(producto.imagen)} alt={producto.nombre} loading="lazy" />;
  }
  return <i className={`bi ${getIconoCategoria(producto.categoria)}`} />;
}

// Precio de un producto, mostrando el tachado + precio de oferta cuando
// corresponde (vista /ofertas, Anexo 1 Evaluación 2). Se reutiliza en la
// tarjeta de catálogo y en la ficha de producto para no duplicar el markup.
export function PrecioProducto({ producto }) {
  const enOferta = producto.precioOferta != null && producto.precioOferta < producto.precio;
  if (!enOferta) {
    return <div className="gr-precio">{formatoCLP(producto.precio)}</div>;
  }
  return (
    <div className="d-flex align-items-baseline gap-2 flex-wrap">
      <span className="gr-precio-tachado">{formatoCLP(producto.precio)}</span>
      <div className="gr-precio">{formatoCLP(getPrecioEfectivo(producto))}</div>
      <span className="gr-badge-oferta">Oferta</span>
    </div>
  );
}

export default function ProductoCard({ producto }) {
  const { agregar } = useCarrito();
  const esPlan = producto.tipo === "Plan";
  const badgeClase = esPlan ? "gr-badge-plan" : "gr-badge-suplemento";
  const badgeIcono = esPlan ? "bi-calendar-check" : "bi-cup-straw";
  const stockBajo = producto.stockCritico && producto.stock <= producto.stockCritico;
  const etiquetaStock = esPlan ? "cupos" : "unidades";

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <div className="gr-product-card">
        <Link to={`/productos/${encodeURIComponent(producto.codigo)}`} className="text-decoration-none text-reset">
          <div className="gr-product-media">{mediaProducto(producto)}</div>
        </Link>
        <div className="gr-product-body">
          <span className={`gr-badge-tipo ${badgeClase}`}>
            <i className={`bi ${badgeIcono}`} /> {producto.categoria}
          </span>
          <Link to={`/productos/${encodeURIComponent(producto.codigo)}`} className="text-decoration-none text-reset">
            <h6 className="mb-0">{producto.nombre}</h6>
          </Link>
          <PrecioProducto producto={producto} />
          <div className={`small ${stockBajo ? "gr-stock-critico" : "text-muted-gr"}`}>
            {producto.stock > 0 ? `${producto.stock} ${etiquetaStock} disponibles` : "Sin stock por ahora"}
          </div>
        </div>
        <div className="gr-product-footer">
          <button
            type="button"
            className="btn btn-brand w-100 btn-sm"
            disabled={producto.stock <= 0}
            onClick={() => agregar(producto.codigo, 1)}
          >
            <i className="bi bi-cart-plus me-1" />Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
