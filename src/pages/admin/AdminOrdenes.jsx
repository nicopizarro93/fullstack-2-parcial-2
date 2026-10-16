// Gymratstore - listado de órdenes del panel admin (solo lectura), portado
// desde admin/ordenes.html + admin-ordenes.js.
import { useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { getOrdenes, nombreClienteOrden, formatoCLP } from "../../data/mockData.js";

export default function AdminOrdenes() {
  const [buscar, setBuscar] = useState("");
  const [ordenVista, setOrdenVista] = useState(null);

  const ordenes = useMemo(() => {
    const texto = buscar.trim().toLowerCase();
    return getOrdenes()
      .filter((orden) => {
        if (!texto) return true;
        return (
          String(orden.id).includes(texto) ||
          (orden.run || "").toLowerCase().includes(texto) ||
          nombreClienteOrden(orden).toLowerCase().includes(texto)
        );
      })
      .sort((a, b) => b.id - a.id);
  }, [buscar]);

  return (
    <>
      <h1 className="mb-4">Órdenes</h1>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input type="text" className="form-control form-control-sm" placeholder="Buscar por #id, RUN o cliente..." value={buscar} onChange={(e) => setBuscar(e.target.value)} />
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div className="gr-empty-state"><i className="bi bi-receipt" /><p className="mt-3 mb-0">No hay órdenes con esos filtros.</p></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-gr align-middle">
            <thead>
              <tr><th>#</th><th>Cliente</th><th>Fecha</th><th>Items</th><th>Total</th><th>Estado</th><th className="text-end">Ver</th></tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>#{orden.id}</td>
                  <td>{nombreClienteOrden(orden)}</td>
                  <td>{orden.fecha}</td>
                  <td>{orden.items.length}</td>
                  <td>{formatoCLP(orden.total)}</td>
                  <td><span className="badge text-bg-secondary">{orden.estado}</span></td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setOrdenVista(orden)}><i className="bi bi-eye" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={!!ordenVista} onHide={() => setOrdenVista(null)} centered>
        {ordenVista && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Orden #{ordenVista.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-1"><strong>Cliente:</strong> {nombreClienteOrden(ordenVista)}</p>
              <p className="mb-3"><strong>Fecha:</strong> {ordenVista.fecha}</p>
              <ul className="list-unstyled">
                {ordenVista.items.map((item) => (
                  <li key={item.codigo} className="d-flex justify-content-between border-bottom border-secondary py-2">
                    <span>{item.nombre} × {item.cantidad}</span>
                    <span>{formatoCLP(item.precio * item.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between fs-5 mt-2">
                <strong>Total</strong>
                <strong className="text-accent-lime">{formatoCLP(ordenVista.total)}</strong>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
}
