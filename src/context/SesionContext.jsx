/**
 * Gymratstore - contexto React que envuelve src/data/sesion.js para que los
 * componentes puedan leer/mutar la sesión activa con un hook (useSesion) en
 * vez de llamar a localStorage o a window.Sesion directamente, como hacía
 * cada página en la versión vanilla.
 */
import { createContext, useContext, useMemo, useState } from "react";
import * as Sesion from "../data/sesion.js";
import { autenticar as autenticarUsuario } from "../data/mockData.js";

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(() => Sesion.getSesion());

  const value = useMemo(
    () => ({
      sesion,
      // Autentica contra mockData (igual que login.js) y, si es válida,
      // guarda la sesión mínima y actualiza el estado de React.
      login(correo, clave) {
        const usuario = autenticarUsuario(correo, clave);
        if (!usuario) return null;
        setSesion(Sesion.guardarSesion(usuario));
        return usuario;
      },
      // Usado por registro.js: ya se tiene el usuario completo (recién
      // creado), solo hace falta abrir sesión con él.
      iniciarSesionConUsuario(usuario) {
        setSesion(Sesion.guardarSesion(usuario));
      },
      logout() {
        Sesion.cerrarSesion();
        setSesion(null);
      },
      puedeAcceder(rolesPermitidos) {
        return Sesion.puedeAcceder(sesion, rolesPermitidos);
      },
    }),
    [sesion]
  );

  return <SesionContext.Provider value={value}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de <SesionProvider>");
  return ctx;
}
