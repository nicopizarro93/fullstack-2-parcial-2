/**
 * Gymratstore - sesión mock (login/logout) + control de acceso por rol,
 * portado desde js/sesion.js. No hay backend real: la "sesión" es un objeto
 * guardado en localStorage con los datos mínimos del usuario logueado (run,
 * nombre, apellidos, tipoUsuario).
 *
 * En la versión vanilla, `requiereSesion` redirigía con window.location y
 * `actualizarNavSesion` tocaba el DOM a mano (data-sesion/data-rol). En React
 * esas dos responsabilidades se dividen así, conservando la misma regla de
 * negocio:
 *   - `puedeAcceder(sesion, rolesPermitidos)` es la regla pura (misma lógica
 *     que el `if` interno de requiereSesion) y la usa <ProtectedRoute> para
 *     decidir si renderiza la página o un <Navigate>.
 *   - El resto de la navbar (mostrar nombre, ítems según rol) se resuelve con
 *     render condicional de React en <NavBar>, en vez de clases d-none.
 */

const KEY_SESION = "gr_sesion";

// Guarda en localStorage solo los campos necesarios para la navbar y el
// control de acceso (nunca la contraseña ni otros datos sensibles).
export function guardarSesion(usuario) {
  const datos = {
    run: usuario.run,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    tipoUsuario: usuario.tipoUsuario,
  };
  try {
    localStorage.setItem(KEY_SESION, JSON.stringify(datos));
  } catch (e) {
    /* noop */
  }
  return datos;
}

// Devuelve el objeto de sesión actual, o null si no hay nadie logueado /
// localStorage no está disponible.
export function getSesion() {
  try {
    const raw = localStorage.getItem(KEY_SESION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(KEY_SESION);
  } catch (e) {
    /* noop */
  }
}

// Regla pura de control de acceso (igual a la que tenía requiereSesion):
// sin sesión, no puede acceder; con sesión, solo si rolesPermitidos es null
// (cualquier sesión activa vale) o el tipoUsuario está en la lista.
export function puedeAcceder(sesion, rolesPermitidos) {
  if (!sesion) return false;
  if (!rolesPermitidos) return true;
  return rolesPermitidos.indexOf(sesion.tipoUsuario) !== -1;
}
