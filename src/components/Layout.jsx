// Layout público: navbar + contenido de la ruta + footer, igual a la
// estructura repetida en cada página .html original (nav / main / footer).
// En pantallas chicas suma el botón flotante del carrito (CarritoFlotante).
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";
import CarritoFlotante from "./CarritoFlotante.jsx";

export default function Layout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CarritoFlotante />
    </>
  );
}
