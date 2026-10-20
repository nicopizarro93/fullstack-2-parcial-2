/**
 * Gymratstore - navbar común a todas las páginas, portada desde el bloque
 * <nav> repetido en cada .html original. Las convenciones data-sesion/
 * data-rol/data-sesion-nombre de la versión vanilla (actualizadas a mano por
 * Sesion.actualizarNavSesion en cada carga de página) se resuelven acá con
 * render condicional de React, que se re-ejecuta solo automáticamente
 * cuando cambia el contexto de sesión/carrito.
 *
 * En pantallas chicas el menú (hamburguesa) es controlado por React
 * (expanded/onToggle) para poder cerrarlo al elegir una sección.
 */
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useSesion } from "../context/SesionContext.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function NavBar() {
  const { sesion, logout } = useSesion();
  const { cantidadItems } = useCarrito();
  const { theme, toggleTheme } = useTheme();
  const esStaff = sesion && (sesion.tipoUsuario === "Administrador" || sesion.tipoUsuario === "Vendedor");

  // Estado del menú móvil: true = desplegado. Al controlarlo con React se
  // puede cerrar desde el código (react-bootstrap no lo cierra solo al usar
  // enlaces de React Router).
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();

  // Si la página cambia por cualquier vía (un enlace, el botón flotante del
  // carrito, el botón "atrás" del navegador), el menú se cierra.
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // Un clic en cualquier enlace del menú lo cierra, incluso si es la página
  // en la que ya estás. El clic "sube" (burbujea) desde el enlace hasta este
  // contenedor. Se ignora el que abre el desplegable del usuario, para poder
  // elegir "Cerrar sesión", y el botón de tema (no es un enlace).
  function cerrarAlElegir(evento) {
    if (evento.target.closest("a") && !evento.target.closest(".dropdown-toggle")) {
      setMenuAbierto(false);
    }
  }

  return (
    <Navbar expand="lg" className="navbar-gr sticky-top" sticky="top" expanded={menuAbierto} onToggle={setMenuAbierto}>
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          GYM<span>RAT</span>STORE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navGr" />
        <Navbar.Collapse id="navGr" onClick={cerrarAlElegir}>
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/categorias">Categorías</Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            {esStaff && (
              <Nav.Link as={NavLink} to="/admin">
                <i className="bi bi-speedometer2 me-1" />Panel admin
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2">
            <button
              type="button"
              className="gr-theme-toggle me-lg-1"
              onClick={toggleTheme}
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              aria-label="Cambiar tema claro/oscuro"
            >
              <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} />
            </button>
            {!sesion && (
              <>
                <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
                <Link to="/registro" className="btn btn-brand btn-sm">Crear cuenta</Link>
              </>
            )}
            {sesion && (
              <NavDropdown title={<><i className="bi bi-person-circle me-1" />{sesion.nombre}</>} align="end">
                <NavDropdown.Item as={Link} to="/" onClick={logout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link as={Link} to="/carrito" className="gr-cart-icon">
              <i className="bi bi-cart3" />
              {cantidadItems > 0 && <span className="gr-carrito-badge">{cantidadItems}</span>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
