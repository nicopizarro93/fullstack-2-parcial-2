/**
 * Gymratstore - modo oscuro/claro (NUEVO, no existía en la versión vanilla:
 * esa venía con data-bs-theme="dark" fijo en cada .html). Mejora de UI/UX
 * pedida por el equipo, fuera de la rúbrica.
 *
 * Usa el mecanismo nativo de Bootstrap 5.3 (atributo data-bs-theme en <html>)
 * para que TODos los componentes de Bootstrap/react-bootstrap reaccionen
 * automáticamente sin tocar cada uno a mano. La preferencia se guarda en
 * localStorage para que se mantenga entre visitas.
 */
import { createContext, useContext, useEffect, useState } from "react";

const KEY_TEMA = "gr_tema";
const ThemeContext = createContext(null);

function temaInicial() {
  try {
    const guardado = localStorage.getItem(KEY_TEMA);
    if (guardado === "light" || guardado === "dark") return guardado;
  } catch (e) {
    /* noop */
  }
  // Sin preferencia guardada: respeta el modo del sistema operativo/navegador.
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    try {
      localStorage.setItem(KEY_TEMA, theme);
    } catch (e) {
      /* noop */
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((actual) => (actual === "dark" ? "light" : "dark"));
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
