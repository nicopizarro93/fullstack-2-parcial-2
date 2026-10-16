/**
 * Gymratstore - layout del panel admin, portado de la barra lateral repetida
 * en cada admin/*.html (gr-admin-shell/gr-admin-sidebar/gr-admin-main). El
 * link a "Alumnos" solo se muestra para Administrador (mismo criterio que
 * admin-alumnos.js, que exige rol Administrador para toda la página).
 */
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSesion } from "../../context/SesionContext.jsx";

export default function AdminLayout() {
  const { sesion, logout } = useSesion();

  return (
    <div className="gr-admin-shell">
      <aside className="gr-admin-sidebar">
        <Link to="/" className="navbar-brand d-block mb-4">
          GYM<span className="text-accent-red">RAT</span>STORE
        </Link>
        <nav className="nav flex-column gap-1">
          <NavLink to="/admin" end className="nav-link">
            <i className="bi bi-speedometer2" />Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className="nav-link">
            <i className="bi bi-box-seam" />Productos
          </NavLink>
          {sesion?.tipoUsuario === "Administrador" && (
            <NavLink to="/admin/alumnos" className="nav-link">
              <i className="bi bi-people" />Alumnos
            </NavLink>
          )}
          <NavLink to="/admin/ordenes" className="nav-link">
            <i className="bi bi-receipt" />Órdenes
          </NavLink>
          <Link to="/" className="nav-link">
            <i className="bi bi-house" />Volver al sitio
          </Link>
          <button type="button" className="nav-link text-start border-0 bg-transparent" onClick={logout}>
            <i className="bi bi-box-arrow-right" />Cerrar sesión
          </button>
        </nav>
      </aside>
      <div className="gr-admin-main">
        <Outlet />
      </div>
    </div>
  );
}
