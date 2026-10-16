/**
 * Gymratstore - vista "Categorías" (nueva, Anexo 1 Evaluación 2: "vista que
 * separa los productos por categorías"). No había una página dedicada para
 * esto; el catálogo (/productos) ya filtraba por categoría con un <select>,
 * pero no existía una landing con tarjetas para entrar directo a una.
 * Reutiliza los datos y el filtro que ya existen (CATEGORIAS_PLAN/
 * CATEGORIAS_SUPLEMENTO, getIconoCategoria) en vez de duplicarlos, y enlaza a
 * /productos?tipo=...&categoria=... (Productos.jsx ya sabe leer ambos).
 */
import { Link } from "react-router-dom";
import { CATEGORIAS_PLAN, CATEGORIAS_SUPLEMENTO, getProductos, getIconoCategoria } from "../data/mockData.js";

function TarjetaCategoria({ categoria, tipo }) {
  const cantidad = getProductos().filter((p) => p.categoria === categoria).length;
  return (
    <div className="col-sm-6 col-lg-3">
      <Link
        to={`/productos?tipo=${encodeURIComponent(tipo)}&categoria=${encodeURIComponent(categoria)}`}
        className="gr-categoria-card text-decoration-none text-reset"
      >
        <i className={`bi ${getIconoCategoria(categoria)}`} />
        <h6 className="mb-1 mt-2">{categoria}</h6>
        <span className="small text-muted-gr">{cantidad} {cantidad === 1 ? "producto" : "productos"}</span>
      </Link>
    </div>
  );
}

export default function Categorias() {
  return (
    <main className="container py-5">
      <div className="gr-section-titulo">
        <h1 className="mb-0">Categorías</h1>
      </div>
      <p className="text-muted-gr mb-4">Elige una categoría para ver sus productos directamente.</p>

      <h5 className="mb-3">Planes de gimnasio</h5>
      <div className="row g-3 mb-5">
        {CATEGORIAS_PLAN.map((c) => <TarjetaCategoria key={c} categoria={c} tipo="Plan" />)}
      </div>

      <h5 className="mb-3">Suplementos</h5>
      <div className="row g-3">
        {CATEGORIAS_SUPLEMENTO.map((c) => <TarjetaCategoria key={c} categoria={c} tipo="Suplemento" />)}
      </div>
    </main>
  );
}
