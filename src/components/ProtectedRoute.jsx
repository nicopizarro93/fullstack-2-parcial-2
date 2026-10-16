/**
 * Gymratstore - puerta de acceso por rol para rutas de React Router,
 * equivalente a Sesion.requiereSesion(rolesPermitidos, urlSinSesion,
 * urlSinPermiso) de js/sesion.js. En la versión vanilla esa función
 * redirigía con window.location.href al principio del script de cada
 * página protegida; acá se resuelve con <Navigate> envolviendo la ruta
 * en App.jsx, que es la forma idiomática de React Router de lograr lo mismo.
 *
 * roles: array de tipoUsuario permitidos, o null para "cualquier sesión activa".
 * redirigirSinSesion: a dónde mandar a quien no tiene sesión (default /login).
 * redirigirSinPermiso: a dónde mandar a quien SÍ tiene sesión pero con un rol
 *   no autorizado (default: el mismo que redirigirSinSesion, igual que el
 *   comportamiento original).
 */
import { Navigate, useLocation } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";

export default function ProtectedRoute({ roles = null, redirigirSinSesion = "/login", redirigirSinPermiso, children }) {
  const { sesion } = useSesion();
  const location = useLocation();

  if (!sesion) {
    return <Navigate to={`${redirigirSinSesion}?volver=${encodeURIComponent(location.pathname)}`} replace />;
  }
  if (roles && roles.indexOf(sesion.tipoUsuario) === -1) {
    return <Navigate to={redirigirSinPermiso || redirigirSinSesion} replace />;
  }
  return children;
}
