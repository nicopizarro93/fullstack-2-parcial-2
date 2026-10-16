/**
 * Gymratstore - contexto React que envuelve las funciones de carrito de
 * src/data/mockData.js (equivalentes a js/carrito.js + la parte de estado de
 * js/carrito-page.js), para que cualquier componente pueda leer/mutar el
 * carrito y disparar el toast de aviso con un solo hook (useCarrito).
 */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as Data from "../data/mockData.js";
import { useToast } from "./ToastContext.jsx";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => Data.getCarrito());
  const { mostrarToast } = useToast();

  const sync = useCallback((nuevoCarrito) => setCarrito(nuevoCarrito), []);

  const value = useMemo(
    () => ({
      carrito,
      totalCarrito: carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      cantidadItems: carrito.reduce((acc, i) => acc + i.cantidad, 0),

      // Equivalente a Carrito.agregarAlCarritoConAviso de js/carrito.js.
      agregar(codigo, cantidad = 1) {
        const producto = Data.getProductoPorCodigo(codigo);
        const nuevo = Data.agregarAlCarrito(codigo, cantidad);
        sync(nuevo);
        if (producto) mostrarToast(`"${producto.nombre}" se agregó al carrito.`);
      },
      actualizarCantidad(codigo, cantidad) {
        sync(Data.actualizarCantidadCarrito(codigo, cantidad));
      },
      quitar(codigo) {
        sync(Data.quitarDelCarrito(codigo));
      },
      limpiar() {
        Data.limpiarCarrito();
        sync([]);
      },
      recargar() {
        sync(Data.getCarrito());
      },
    }),
    [carrito, mostrarToast, sync]
  );

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
