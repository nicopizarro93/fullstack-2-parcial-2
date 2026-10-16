// Gymratstore - página de carrito, portada desde carrito.html + carrito-page.js.
// El paso de pago en sí (datos del cliente, dirección de entrega, revalidar
// stock, crear la orden) se movió a Checkout.jsx (Anexo 1 Evaluación 2,
// Figuras 5-6: "se incorpora Checkout (paso de pago)" como vista propia);
// esta página solo mantiene la lista de ítems/cantidades y lleva a /checkout,
// con la misma regla de siempre: un plan de gimnasio exige cuenta.
import { Link, useNavigate } from "react-router-dom";
import { getProductoPorCodigo, getIconoCategoria, formatoCLP } from "../data/mockData.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";

function FilaCarrito({ item, onActualizarCantidad, onQuitar }) {
  const producto = getProductoPorCodigo(item.codigo);
  const esPlan = item.tipo === "Plan";
  const icono = producto ? getIconoCategoria(producto.categoria) : "bi-box-seam";
  // Si el producto ya no existe en el catálogo (lo eliminó el admin mientras
  // estaba en el carrito de alguien), se usa un stock generoso por defecto.
  const stockDisponible = producto ? producto.stock : 99;

  return (
    <div className="gr-cart-item">
      <div className="gr-cart-item-icono"><i className={`bi ${icono}`} /></div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between">
          <h6 className="mb-1">{item.nombre}</h6>
          <button type="button" className="btn btn-sm btn-link text-accent-red p-0" onClick={() => onQuitar(item.codigo)}>
            <i className="bi bi-trash" />
          </button>
        </div>
        <div className="small text-muted-gr mb-2">{formatoCLP(item.precio)} c/u</div>
        {esPlan ? (
          <span className="badge text-bg-secondary">Membresía · 1 unidad</span>
        ) : (
          <div className="input-group input-group-sm" style={{ width: "8rem" }}>
            <button className="btn btn-outline-light" type="button" onClick={() => onActualizarCantidad(item.codigo, Math.max(1, item.cantidad - 1))}>-</button>
            <input
              type="number"
              className="form-control text-center"
              min="1"
              max={stockDisponible}
              value={item.cantidad}
              onChange={(e) => {
                let cantidad = Math.max(1, parseInt(e.target.value, 10) || 1);
                if (stockDisponible && cantidad > stockDisponible) cantidad = stockDisponible;
                onActualizarCantidad(item.codigo, cantidad);
              }}
            />
            <button className="btn btn-outline-light" type="button" onClick={() => onActualizarCantidad(item.codigo, Math.min(stockDisponible || item.cantidad + 1, item.cantidad + 1))}>+</button>
          </div>
        )}
      </div>
      <div className="text-end" style={{ minWidth: "6rem" }}>
        <strong>{formatoCLP(item.precio * item.cantidad)}</strong>
      </div>
    </div>
  );
}

export default function Carrito() {
  const { carrito, totalCarrito, cantidadItems, actualizarCantidad, quitar } = useCarrito();
  const { sesion } = useSesion();
  const navigate = useNavigate();

  const tienePlan = carrito.some((item) => item.tipo === "Plan");

  if (carrito.length === 0) {
    return (
      <main className="container py-5">
        <h1 className="mb-4">Tu carrito</h1>
        <div className="gr-empty-state">
          <i className="bi bi-cart-x" />
          <p className="mt-3 mb-2">Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-sm btn-brand-outline">Ver productos</Link>
        </div>
      </main>
    );
  }

  function irAPagar() {
    // Un plan de gimnasio siempre requiere cuenta (queda asociado al alumno);
    // Checkout.jsx vuelve a comprobar esto mismo al cargar, esta redirección
    // acá solo evita el salto extra de pasar por /checkout primero.
    if (!sesion && tienePlan) {
      navigate("/login?volver=" + encodeURIComponent("/checkout"));
      return;
    }
    navigate("/checkout");
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">Tu carrito</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {carrito.map((item) => (
              <FilaCarrito key={item.codigo} item={item} onActualizarCantidad={actualizarCantidad} onQuitar={quitar} />
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="gr-card p-4 gr-cart-summary">
            <h5>Resumen</h5>
            <div className="d-flex justify-content-between text-muted-gr small mb-2">
              <span>Productos</span>
              <span>{cantidadItems}</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between fs-5 mb-3">
              <strong>Total</strong>
              <strong className="text-accent-lime">{formatoCLP(totalCarrito)}</strong>
            </div>

            {tienePlan && !sesion && (
              <div className="alert alert-dark border">
                <i className="bi bi-lock me-1 text-accent-red" />
                Tu carrito incluye un plan de gimnasio: necesitas una cuenta para completar esa compra (los
                suplementos sí se pueden comprar como invitado).
                <div className="d-flex gap-2 mt-2">
                  <Link to="/login?volver=/checkout" className="btn btn-sm btn-brand-outline">Iniciar sesión</Link>
                  <Link to="/registro" className="btn btn-sm btn-brand">Crear cuenta</Link>
                </div>
              </div>
            )}

            {!tienePlan && !sesion && (
              <p className="small text-muted-gr">
                <i className="bi bi-person-check me-1" />Puedes comprar como invitado, o{" "}
                <Link to="/login?volver=/checkout">iniciar sesión</Link> si ya tienes cuenta.
              </p>
            )}

            <button type="button" className="btn btn-brand btn-lg w-100" onClick={irAPagar}>
              {!sesion && tienePlan ? "Iniciar sesión para continuar" : "Ir a pagar"}
            </button>
            <Link to="/productos" className="btn btn-outline-light w-100 mt-2">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
