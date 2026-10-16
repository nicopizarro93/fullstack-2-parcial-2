/**
 * Gymratstore - vista "Ofertas" (nueva, Anexo 1 Evaluación 2: "vista que
 * muestra todos los productos en ofertas"). Reutiliza ProductoCard tal cual
 * (ya muestra el precio tachado + badge "Oferta" cuando el producto tiene
 * precioOferta, ver components/ProductoCard.jsx) - esta vista solo filtra el
 * catálogo a los productos que están en oferta.
 */
import { Link } from "react-router-dom";
import { getProductosEnOferta } from "../data/mockData.js";
import ProductoCard from "../components/ProductoCard.jsx";

export default function Ofertas() {
  const productos = getProductosEnOferta();

  return (
    <main className="container py-5">
      <div className="gr-section-titulo">
        <h1 className="mb-0">Ofertas</h1>
      </div>
      <p className="text-muted-gr mb-4">Suplementos con descuento por tiempo limitado.</p>

      {productos.length === 0 ? (
        <div className="gr-empty-state">
          <i className="bi bi-tag" />
          <p className="mt-3 mb-2">No hay ofertas activas por ahora.</p>
          <Link to="/productos" className="btn btn-sm btn-brand-outline">Ver todo el catálogo</Link>
        </div>
      ) : (
        <div className="row g-3">
          {productos.map((p) => <ProductoCard key={p.codigo} producto={p} />)}
        </div>
      )}
    </main>
  );
}
