/**
 * Gymratstore - "Compra exitosa" (nuevo, Anexo 1 Evaluación 2, Figura 7: "se
 * incorporan nuevas vistas [si] la compra fue exitosa o no [...] y se genera
 * un resumen"). Reemplaza la pantalla de confirmación que antes vivía dentro
 * de Carrito.jsx (un simple "¡Compra confirmada!" sin detalle) por una vista
 * propia con número de orden, resumen completo y acciones de boleta.
 * "Imprimir boleta en PDF" usa window.print() (con estilos @media print del
 * index.css) y "Enviar boleta por email" es un mock (no hay backend de
 * correo real) que solo confirma con un toast, como el resto del sitio.
 */
import { Link, useParams } from "react-router-dom";
import { getOrdenPorId, formatoCLP } from "../data/mockData.js";
import { useToast } from "../context/ToastContext.jsx";

export default function CompraExitosa() {
  const { id } = useParams();
  const orden = getOrdenPorId(id);
  const { mostrarToast } = useToast();

  if (!orden) {
    return (
      <main className="container py-5">
        <div className="gr-empty-state">
          <i className="bi bi-receipt" />
          <p className="mt-3 mb-2">No encontramos esa orden.</p>
          <Link to="/" className="btn btn-sm btn-brand-outline">Volver al inicio</Link>
        </div>
      </main>
    );
  }

  const correo = orden.correo || (orden.invitado && orden.invitado.correo) || "";

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="gr-card p-4 p-md-5" id="boleta">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <i className="bi bi-check-circle-fill text-accent-lime me-2" style={{ fontSize: "1.5rem" }} />
                <span className="fs-4 align-middle">Se ha realizado la compra</span>
              </div>
              <span className="small text-muted-gr">Orden #{orden.id} · {orden.fecha}</span>
            </div>

            {orden.envio && (
              <div className="mb-3">
                <h6 className="text-muted-gr">Dirección de entrega</h6>
                <p className="mb-0">
                  {orden.envio.calle}{orden.envio.departamento ? `, ${orden.envio.departamento}` : ""}
                  <br />
                  {orden.envio.comuna}, {orden.envio.region}
                </p>
                {orden.envio.indicaciones && <p className="small text-muted-gr mb-0">{orden.envio.indicaciones}</p>}
              </div>
            )}

            <h6 className="text-muted-gr">Resumen</h6>
            <ul className="list-unstyled mb-3">
              {orden.items.map((item) => (
                <li key={item.codigo} className="d-flex justify-content-between border-bottom border-secondary py-2">
                  <span>{item.nombre} × {item.cantidad}</span>
                  <span>{formatoCLP(item.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between fs-5 mb-4">
              <strong>Total pagado</strong>
              <strong className="text-accent-lime">{formatoCLP(orden.total)}</strong>
            </div>

            <div className="d-flex gap-2 flex-wrap gr-no-print">
              <button type="button" className="btn btn-brand-outline" onClick={() => window.print()}>
                <i className="bi bi-file-earmark-pdf me-1" />Imprimir boleta en PDF
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => mostrarToast(correo ? `Boleta enviada a ${correo}.` : "Boleta enviada por correo.")}
              >
                <i className="bi bi-envelope me-1" />Enviar boleta por email
              </button>
              <Link to="/" className="btn btn-brand ms-auto">Volver al inicio</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
