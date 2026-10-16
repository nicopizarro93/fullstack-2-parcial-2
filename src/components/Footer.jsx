/**
 * Gymratstore - footer común a todas las páginas, portado del <footer> de
 * index.html (idéntico en el resto de páginas). El año dinámico que ponía
 * comun.js vía data-anio-actual ahora es simplemente new Date().getFullYear().
 */
import { Link } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

export default function Footer() {
  const { sesion, logout } = useSesion();

  return (
    <footer className="gr-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6>GYMRATSTORE</h6>
            <p className="small mb-0">Planes de gimnasio y suplementación deportiva, todo en un mismo lugar.</p>
          </div>
          <div className="col-6 col-md-2">
            <h6>Tienda</h6>
            <ul className="list-unstyled small">
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/carrito">Carrito</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h6>Empresa</h6>
            <ul className="list-unstyled small">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h6>Cuenta</h6>
            <ul className="list-unstyled small">
              {!sesion && (
                <>
                  <li><Link to="/login">Iniciar sesión</Link></li>
                  <li><Link to="/registro">Crear cuenta</Link></li>
                </>
              )}
              {sesion && (
                <li>
                  <Link to="/" onClick={logout}>Cerrar sesión</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h6>Legal</h6>
            <ul className="list-unstyled small">
              <li><Link to="/politica-privacidad">Política de privacidad</Link></li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <p className="small text-center mb-0">© {new Date().getFullYear()} Gymratstore. Proyecto académico.</p>
      </div>
    </footer>
  );
}
