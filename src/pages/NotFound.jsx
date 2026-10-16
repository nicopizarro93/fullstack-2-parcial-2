// Página 404 simple para rutas de React Router que no coinciden con nada
// (no existía como tal en la versión multipágina original).
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container py-5">
      <div className="gr-empty-state">
        <i className="bi bi-signpost-split" />
        <h2 className="mt-3">Página no encontrada</h2>
        <p className="mb-2">La página que buscas no existe o fue movida.</p>
        <Link to="/" className="btn btn-sm btn-brand-outline">Volver al inicio</Link>
      </div>
    </main>
  );
}
