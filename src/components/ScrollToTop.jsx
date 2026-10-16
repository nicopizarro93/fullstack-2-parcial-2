/**
 * Gymratstore - en una SPA, React Router NO reinicia el scroll al cambiar de
 * ruta (a diferencia de la versión vanilla: cada clic cargaba un .html
 * nuevo y el navegador partía arriba solo). Sin esto, al entrar a la ficha
 * de un producto desde más abajo del catálogo, la página nueva quedaba en
 * la misma posición de scroll y había que subir a mano para verla.
 * No pinta nada: solo escucha el cambio de ruta y sube la página.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
