// Gymratstore - dashboard del panel admin, portado desde admin/index.html +
// admin-home.js. El control de acceso (Administrador/Vendedor) ya lo resuelve
// <ProtectedRoute> en App.jsx; acá solo quedan las estadísticas, que siguen
// siendo exclusivas de Administrador para lo relacionado a alumnos/membresías
// (un Vendedor no gestiona alumnos).
import { getProductos, getOrdenes, getUsuariosAlumnos, getEstadoMembresia, formatoCLP, nombreClienteOrden } from "../../data/mockData.js";
import { useSesion } from "../../context/SesionContext.jsx";

export default function AdminHome() {
  const { sesion } = useSesion();
  const productos = getProductos();
  const ordenes = getOrdenes();
  const alumnos = getUsuariosAlumnos();
  const esAdmin = sesion.tipoUsuario === "Administrador";

  let activas = 0, vencidas = 0, sinPlan = 0;
  if (esAdmin) {
    alumnos.forEach((alumno) => {
      const estado = getEstadoMembresia(alumno);
      if (estado === "Activa") activas++;
      else if (estado === "Vencida") vencidas++;
      else sinPlan++;
    });
  }

  const ultimas = [...ordenes].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Dashboard</h1>
        <span className="text-muted-gr small">Rol: {sesion.tipoUsuario}</span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="gr-stat-card">
            <div className="gr-stat-valor text-accent-lime">{productos.length}</div>
            <div className="small text-muted-gr">Productos</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="gr-stat-card">
            <div className="gr-stat-valor text-accent-lime">{ordenes.length}</div>
            <div className="small text-muted-gr">Órdenes</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="gr-stat-card">
            <div className="gr-stat-valor text-accent-lime">{formatoCLP(ordenes.reduce((acc, o) => acc + o.total, 0))}</div>
            <div className="small text-muted-gr">Ventas totales</div>
          </div>
        </div>
        {esAdmin && (
          <div className="col-6 col-md-3">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-accent-lime">{alumnos.length}</div>
              <div className="small text-muted-gr">Alumnos</div>
            </div>
          </div>
        )}
      </div>

      {esAdmin && (
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="gr-stat-card">
              <div className="gr-stat-valor" style={{ color: "var(--gr-lime)" }}>{activas}</div>
              <div className="small text-muted-gr">Membresías activas</div>
            </div>
          </div>
          <div className="col-4">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-accent-red">{vencidas}</div>
              <div className="small text-muted-gr">Membresías vencidas</div>
            </div>
          </div>
          <div className="col-4">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-muted-gr">{sinPlan}</div>
              <div className="small text-muted-gr">Sin plan</div>
            </div>
          </div>
        </div>
      )}

      <h5 className="mb-3">Últimas órdenes</h5>
      <div className="table-responsive">
        <table className="table table-gr align-middle">
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Fecha</th><th>Total</th></tr>
          </thead>
          <tbody>
            {ultimas.length === 0 ? (
              <tr><td colSpan={4} className="text-muted-gr text-center py-3">Todavía no hay órdenes registradas.</td></tr>
            ) : (
              ultimas.map((orden) => (
                <tr key={orden.id}>
                  <td>#{orden.id}</td>
                  <td>{nombreClienteOrden(orden)}</td>
                  <td>{orden.fecha}</td>
                  <td>{formatoCLP(orden.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
