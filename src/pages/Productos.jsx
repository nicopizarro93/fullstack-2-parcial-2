// Gymratstore - catálogo, portado desde productos.html + productos.js.
// Mismos filtros (tipo/categoría/texto libre) y mismo soporte para llegar
// con un filtro preseleccionado vía query string (?tipo=Plan|Suplemento).
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductos, CATEGORIAS_PLAN, CATEGORIAS_SUPLEMENTO } from "../data/mockData.js";
import ProductoCard from "../components/ProductoCard.jsx";

export default function Productos() {
  const [params] = useSearchParams();
  const tipoInicial = params.get("tipo") === "Plan" || params.get("tipo") === "Suplemento" ? params.get("tipo") : "";
  // Nuevo: además de ?tipo=, la vista /categorias enlaza acá con
  // ?categoria=X (Anexo 1 Evaluación 2, "vista que separa los productos por
  // categorías"). Solo se usa si pertenece a la lista de categorías válidas
  // para el tipo que llegó (o a cualquiera de las dos listas si no vino tipo).
  const categoriasValidas = [...CATEGORIAS_PLAN, ...CATEGORIAS_SUPLEMENTO];
  const categoriaInicial = categoriasValidas.includes(params.get("categoria")) ? params.get("categoria") : "";

  const [tipo, setTipo] = useState(tipoInicial);
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [texto, setTexto] = useState("");

  // Si se llega con un tipo o categoría preseleccionados por query string, se
  // reflejan en los filtros (si no viene categoría, queda a elección del
  // usuario, igual que en la versión original).
  useEffect(() => {
    setTipo(tipoInicial);
    setCategoria(categoriaInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoInicial, categoriaInicial]);

  const categoriasDisponibles = useMemo(() => {
    if (tipo === "Plan") return CATEGORIAS_PLAN;
    if (tipo === "Suplemento") return CATEGORIAS_SUPLEMENTO;
    return [...CATEGORIAS_PLAN, ...CATEGORIAS_SUPLEMENTO];
  }, [tipo]);

  const productos = useMemo(() => {
    const textoLower = texto.trim().toLowerCase();
    return getProductos().filter((p) => {
      if (tipo && p.tipo !== tipo) return false;
      if (categoria && p.categoria !== categoria) return false;
      if (textoLower && p.nombre.toLowerCase().indexOf(textoLower) === -1) return false;
      return true;
    });
  }, [tipo, categoria, texto]);

  const hayFiltrosActivos = !!tipo || !!categoria || texto.trim() !== "";

  function limpiarFiltros() {
    setTipo("");
    setCategoria("");
    setTexto("");
  }

  return (
    <main className="container py-5">
      <div className="gr-section-titulo">
        <h1 className="mb-0">Catálogo</h1>
      </div>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-5">
          <div className="btn-group" role="group">
            {[{ v: "", l: "Todos" }, { v: "Plan", l: "Planes" }, { v: "Suplemento", l: "Suplementos" }].map((op) => (
              <button
                key={op.v}
                type="button"
                className={`btn btn-sm ${tipo === op.v ? "btn-brand" : "btn-outline-light"}`}
                onClick={() => { setTipo(op.v); setCategoria(""); }}
              >
                {op.l}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select form-select-sm" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar por nombre..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          {hayFiltrosActivos && (
            <button type="button" className="btn btn-sm btn-outline-light w-100" onClick={limpiarFiltros}>
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="gr-empty-state">
          <i className="bi bi-search" />
          <p className="mt-3 mb-2">No encontramos productos con esos filtros.</p>
          <button type="button" className="btn btn-sm btn-brand-outline" onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>
      ) : (
        <div className="row g-3">
          {productos.map((p) => <ProductoCard key={p.codigo} producto={p} />)}
        </div>
      )}
    </main>
  );
}
