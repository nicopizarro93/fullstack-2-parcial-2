/**
 * Pruebas de componente para ProductoCard (src/components/ProductoCard.jsx),
 * con React Testing Library + Vitest - la propuesta de pruebas del Anexo 1
 * Evaluación 2 pide justo estas 4 categorías (renderizado, renderizado
 * condicional, props y eventos) pero usando Jasmine/Karma; acá se cubren las
 * mismas 4 con la herramienta que ya elegimos para todo el proyecto (Vite/
 * Vitest), en vez de sumar una segunda herramienta de testing.
 *
 * Nota: a diferencia de validaciones.test.js/mockData.test.js/sesion.test.js
 * (lógica pura, verificada a mano en este entorno con un harness sin
 * Vitest), este archivo SÍ necesita jsdom + @testing-library/react
 * instalados (ya están en package.json) para correr - no se pudo ejecutar en
 * el sandbox donde se armó el proyecto por el mismo motivo que el resto
 * (sin acceso a internet para `npm install`). Confírmalo con `npm test`.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductoCard from "./ProductoCard.jsx";
import { CarritoProvider } from "../context/CarritoContext.jsx";
import { ToastProvider } from "../context/ToastContext.jsx";
import { inicializar, getCarrito, getProductoPorCodigo } from "../data/mockData.js";

function renderCard(producto) {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <CarritoProvider>
          <ProductoCard producto={producto} />
        </CarritoProvider>
      </ToastProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  inicializar();
});

describe("ProductoCard - renderizado y props", () => {
  it("muestra el nombre y la categoría del producto que recibe como prop", () => {
    const producto = getProductoPorCodigo("SUP-CREA01");
    renderCard(producto);
    expect(screen.getByText(producto.nombre)).toBeTruthy();
    // Coincidencia exacta: con exact:false "Creatina" también calzaba con el
    // nombre "Creatina Monohidratada 300g" y getByText fallaba por duplicado.
    expect(screen.getByText(producto.categoria)).toBeTruthy();
  });
});

describe("ProductoCard - renderizado condicional (oferta)", () => {
  it("muestra el badge 'Oferta' y el precio tachado si el producto tiene precioOferta vigente", () => {
    const enOferta = getProductoPorCodigo("SUP-PRE01"); // tiene precioOferta en la semilla
    renderCard(enOferta);
    expect(screen.getByText(/oferta/i)).toBeTruthy();
  });

  it("no muestra el badge 'Oferta' en un producto sin descuento", () => {
    const sinOferta = getProductoPorCodigo("SUP-WHEY01");
    renderCard(sinOferta);
    expect(screen.queryByText(/oferta/i)).toBeNull();
  });
});

describe("ProductoCard - evento: agregar al carrito", () => {
  it("al hacer click en 'Agregar al carrito' se agrega el producto al carrito", () => {
    const producto = getProductoPorCodigo("SUP-ACC01");
    renderCard(producto);
    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));
    const item = getCarrito().find((i) => i.codigo === producto.codigo);
    expect(item).toBeTruthy();
    expect(item.cantidad).toBe(1);
  });

  it("el botón queda deshabilitado cuando el producto no tiene stock", () => {
    const sinStock = { ...getProductoPorCodigo("SUP-ACC02"), stock: 0 };
    renderCard(sinStock);
    expect(screen.getByRole("button", { name: /agregar al carrito/i }).disabled).toBe(true);
  });
});
