/**
 * Gymratstore - botón flotante del carrito para pantallas chicas.
 *
 * Bajo 992px (breakpoint "lg" de Bootstrap) la navbar se colapsa y el ícono
 * del carrito queda escondido dentro del menú hamburguesa: para llegar al
 * carrito había que abrir el menú primero. Este botón queda fijo abajo a la
 * derecha, siempre a un toque, con el mismo contador que la navbar.
 *
 * - d-lg-none: en escritorio no se muestra (ahí el carrito ya se ve en la navbar).
 * - No aparece en el carrito, el checkout ni las vistas de resultado de la
 *   compra, donde ya estás en ese flujo y solo taparía contenido.
 * - key={cantidadItems} en el contador: cada vez que cambia la cantidad, React
 *   vuelve a montar el <span> y se repite la animación corta del CSS, como
 *   aviso visual de que el producto se agregó.
 */
import { Link, useLocation } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";

const RUTAS_SIN_BOTON = ["/carrito", "/checkout", "/compra-error"];

export default function CarritoFlotante() {
  const { cantidadItems } = useCarrito();
  const { pathname } = useLocation();

  if (RUTAS_SIN_BOTON.includes(pathname) || pathname.startsWith("/compra-exitosa")) {
    return null;
  }

  const etiqueta = cantidadItems > 0
    ? `Ver carrito (${cantidadItems} ${cantidadItems === 1 ? "producto" : "productos"})`
    : "Ver carrito (vacío)";

  return (
    <Link to="/carrito" className="gr-carrito-flotante d-lg-none" aria-label={etiqueta} title={etiqueta}>
      <i className="bi bi-cart3" aria-hidden="true" />
      {cantidadItems > 0 && (
        <span key={cantidadItems} className="gr-carrito-badge" aria-hidden="true">{cantidadItems}</span>
      )}
    </Link>
  );
}
