/**
 * Gymratstore - raíz de la app React: envuelve toda la aplicación con los
 * providers de contexto (tema, sesión, carrito, toasts) y define las rutas
 * con React Router, reemplazando la navegación multipágina (cada .html) de
 * la versión vanilla por rutas de una SPA.
 */
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import Categorias from "./pages/Categorias.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import CompraExitosa from "./pages/CompraExitosa.jsx";
import CompraError from "./pages/CompraError.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Contacto from "./pages/Contacto.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetalle from "./pages/BlogDetalle.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminHome from "./pages/admin/AdminHome.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminAlumnos from "./pages/admin/AdminAlumnos.jsx";
import AdminOrdenes from "./pages/admin/AdminOrdenes.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SesionProvider>
          <CarritoProvider>
            <ScrollToTop />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="productos" element={<Productos />} />
                <Route path="productos/:codigo" element={<ProductoDetalle />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="ofertas" element={<Ofertas />} />
                <Route path="carrito" element={<Carrito />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="compra-exitosa/:id" element={<CompraExitosa />} />
                <Route path="compra-error" element={<CompraError />} />
                <Route path="login" element={<Login />} />
                <Route path="registro" element={<Registro />} />
                <Route path="contacto" element={<Contacto />} />
                <Route path="nosotros" element={<Nosotros />} />
                <Route path="politica-privacidad" element={<PoliticaPrivacidad />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogDetalle />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="admin"
                element={
                  <ProtectedRoute roles={["Administrador", "Vendedor"]} redirigirSinSesion="/login">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminHome />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route
                  path="alumnos"
                  element={
                    <ProtectedRoute roles={["Administrador"]} redirigirSinSesion="/login" redirigirSinPermiso="/admin">
                      <AdminAlumnos />
                    </ProtectedRoute>
                  }
                />
                <Route path="ordenes" element={<AdminOrdenes />} />
              </Route>
            </Routes>
          </CarritoProvider>
        </SesionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
