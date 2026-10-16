// Gymratstore - ficha de producto, portada desde producto-detalle.html +
// producto-detalle.js. Misma lógica: selector de cantidad limitado al stock
// (ocultado para planes, que siempre son 1 unidad), aviso de que un plan
// requiere cuenta, y relacionados por categoría (con respaldo a "mismo tipo"
// si no hay suficientes de la misma categoría).
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductoPorCodigo, getProductos } from "../data/mockData.js";
import { mediaProducto, PrecioProducto } from "../components/ProductoCard.jsx";
import ProductoCard from "../components/ProductoCard.jsx";
import * as V from "../utils/validaciones.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const producto = codigo ? getProductoPorCodigo(codigo) : null;
  const { agregar } = useCarrito();
  const { sesion } = useSesion();
  const [cantidad, setCantidad] = useState(1);
  const [errorCantidad, setErrorCantidad] = useState("");

  const relacionados = useMemo(() => {
    if (!producto) return [];
    let lista = getProductos().filter((p) => p.codigo !== producto.codigo && p.categoria === producto.categoria);
    if (lista.length === 0) {
      lista = getProductos().filter((p) => p.codigo !== producto.codigo && p.tipo === producto.tipo);
    }
    return lista.slice(0, 4);
  }, [producto]);

  if (!producto) {
    return (
      <main className="container py-5">
        <div className="gr-empty-state">
          <i className="bi bi-exclamation-circle" />
          <p className="mt-3 mb-2">No encontramos ese producto.</p>
          <Link to="/productos" className="btn btn-sm btn-brand-outline">Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  const esPlan = producto.tipo === "Plan";
  const etiquetaStock = esPlan ? "cupos" : "unidades";
  const bajo = producto.stockCritico && producto.stock <= producto.stockCritico;

  function agregarAlCarrito() {
    setErrorCantidad("");
    const cantidadFinal = esPlan ? 1 : cantidad;
    const resultado = V.cantidadCarrito(cantidadFinal, producto.stock);
    if (!resultado.valido) {
      setErrorCantidad(resultado.mensaje);
      return;
    }
    agregar(producto.codigo, cantidadFinal);
  }

  return (
    <main className="container py-5">
      <div className="row g-4" id="detalleProducto">
        <div className="col-lg-5">
          <div className="gr-product-media" style={{ borderRadius: "var(--gr-radius)" }}>{mediaProducto(producto)}</div>
        </div>
        <div className="col-lg-7">
          <span className={`gr-badge-tipo ${esPlan ? "gr-badge-plan" : "gr-badge-suplemento"}`}>{producto.categoria}</span>
          <h1 className="mt-2">{producto.nombre}</h1>
          <p className="text-muted-gr">{producto.descripcion || "Sin descripción disponible."}</p>
          <div className="fs-2 mb-2"><PrecioProducto producto={producto} /></div>

          {producto.stock > 0 ? (
            <p className={bajo ? "small gr-stock-critico" : "small text-muted-gr"}>
              {producto.stock} {etiquetaStock} disponibles{bajo ? " (quedan pocos)" : ""}
            </p>
          ) : (
            <p className="small gr-stock-critico">Sin stock por ahora.</p>
          )}

          {esPlan && !sesion && (
            <div className="alert alert-dark border small">
              <i className="bi bi-info-circle me-1 text-accent-lime" />
              Para contratar un plan necesitas una cuenta (quedará asociado a tu perfil de alumno).
            </div>
          )}

          <div className="row g-2 align-items-center mt-3">
            {!esPlan && (
              <div className="col-auto">
                <input
                  type="number"
                  className="form-control"
                  style={{ width: "6rem" }}
                  min="1"
                  max={producto.stock}
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
                />
              </div>
            )}
            <div className="col-auto">
              <button type="button" className="btn btn-brand btn-lg" disabled={producto.stock <= 0} onClick={agregarAlCarrito}>
                {producto.stock <= 0 ? "Sin stock" : <><i className="bi bi-cart-plus me-1" />Agregar al carrito</>}
              </button>
            </div>
          </div>
          {errorCantidad && <div className="text-accent-red small mt-2">{errorCantidad}</div>}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-5" id="seccionRelacionados">
          <div className="gr-section-titulo">
            <h2 className="mb-0">Relacionados</h2>
          </div>
          <div className="row g-3">
            {relacionados.map((p) => <ProductoCard key={p.codigo} producto={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
