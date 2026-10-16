/**
 * Pruebas unitarias de la capa de datos (src/data/mockData.js), portada
 * desde js/mock-data.js. Cubren solo las funcionalidades más importantes
 * acordadas: carrito (agregar/actualizar/quitar/totales), estado de
 * membresía (Activa/Vencida/Sin plan) y formato de moneda - no se testea
 * cada función del módulo, solo las reglas de negocio centrales.
 *
 * jsdom (configurado en vite.config.js) provee un localStorage real para
 * estas pruebas, y src/test/setup.js lo limpia después de cada test para
 * que no se contaminen entre sí.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  formatoCLP, getEstadoMembresia, agregarAlCarrito, actualizarCantidadCarrito,
  quitarDelCarrito, getCarrito, getTotalCarrito, getCantidadItemsCarrito,
  getProductoPorCodigo, aplicarMembresiaDesdeOrden, getUsuarioPorRun, inicializar,
  getPrecioEfectivo, getProductosEnOferta, getItemsSinStock,
} from "./mockData.js";

// src/test/setup.js limpia localStorage completo después de cada test para
// aislarlos entre sí; inicializar() solo corre automáticamente al importar
// el módulo (una vez), así que hay que volver a sembrar productos/usuarios/
// órdenes manualmente antes de cada test de este archivo.
beforeEach(() => {
  inicializar();
});

describe("formatoCLP() - formato de moneda chilena", () => {
  it("formatea un número como pesos chilenos sin decimales", () => {
    expect(formatoCLP(32990)).toBe((32990).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }));
    expect(formatoCLP(0)).toContain("0");
  });
});

describe("getEstadoMembresia() - Activa / Vencida / Sin plan", () => {
  it("devuelve 'Sin plan' si el usuario no tiene membresía", () => {
    expect(getEstadoMembresia({ membresia: null })).toBe("Sin plan");
    expect(getEstadoMembresia(null)).toBe("Sin plan");
  });

  it("devuelve 'Activa' si la fecha de fin es hoy o futura", () => {
    const fin = new Date();
    fin.setDate(fin.getDate() + 10);
    const usuario = { membresia: { fechaFin: fin.toISOString().slice(0, 10) } };
    expect(getEstadoMembresia(usuario)).toBe("Activa");
  });

  it("devuelve 'Vencida' si la fecha de fin ya pasó", () => {
    const usuario = { membresia: { fechaFin: "2020-01-01" } };
    expect(getEstadoMembresia(usuario)).toBe("Vencida");
  });
});

describe("carrito: agregar / actualizar cantidad / quitar / totales", () => {
  it("agrega un suplemento nuevo con la cantidad indicada", () => {
    agregarAlCarrito("SUP-CREA01", 2);
    const carrito = getCarrito();
    expect(carrito).toHaveLength(1);
    expect(carrito[0]).toMatchObject({ codigo: "SUP-CREA01", cantidad: 2 });
  });

  it("suma cantidad si el mismo suplemento se agrega de nuevo", () => {
    agregarAlCarrito("SUP-CREA01", 2);
    agregarAlCarrito("SUP-CREA01", 3);
    const item = getCarrito().find((i) => i.codigo === "SUP-CREA01");
    expect(item.cantidad).toBe(5);
  });

  it("un Plan nunca se duplica/suma: siempre queda en 1 unidad", () => {
    agregarAlCarrito("PLAN-MEN", 1);
    agregarAlCarrito("PLAN-MEN", 1);
    const item = getCarrito().find((i) => i.codigo === "PLAN-MEN");
    expect(item.cantidad).toBe(1);
  });

  it("ignora un código de producto que no existe en el catálogo", () => {
    agregarAlCarrito("NO-EXISTE", 1);
    expect(getCarrito()).toHaveLength(0);
  });

  it("actualizarCantidadCarrito fija la cantidad exacta, y la elimina si llega a 0", () => {
    agregarAlCarrito("SUP-CREA01", 1);
    actualizarCantidadCarrito("SUP-CREA01", 5);
    expect(getCarrito().find((i) => i.codigo === "SUP-CREA01").cantidad).toBe(5);

    actualizarCantidadCarrito("SUP-CREA01", 0);
    expect(getCarrito().find((i) => i.codigo === "SUP-CREA01")).toBeUndefined();
  });

  it("quitarDelCarrito elimina el ítem completo", () => {
    agregarAlCarrito("SUP-CREA01", 1);
    quitarDelCarrito("SUP-CREA01");
    expect(getCarrito()).toHaveLength(0);
  });

  it("getTotalCarrito y getCantidadItemsCarrito suman precio*cantidad y cantidades", () => {
    agregarAlCarrito("SUP-CREA01", 2); // 18990 c/u
    agregarAlCarrito("SUP-ACC01", 1); // 6990
    const producto1 = getProductoPorCodigo("SUP-CREA01");
    const producto2 = getProductoPorCodigo("SUP-ACC01");
    expect(getTotalCarrito()).toBe(producto1.precio * 2 + producto2.precio * 1);
    expect(getCantidadItemsCarrito()).toBe(3);
  });
});

describe("aplicarMembresiaDesdeOrden() - asigna el plan comprado como membresía del alumno", () => {
  it("asigna la membresía con la duración correcta según la categoría del plan", () => {
    const run = "215678903"; // Benjamín, seed sin membresía previa
    const producto = getProductoPorCodigo("PLAN-TRI"); // Plan Trimestral -> 3 meses
    const orden = {
      run,
      items: [{ codigo: producto.codigo, nombre: producto.nombre, tipo: "Plan", precio: producto.precio, cantidad: 1 }],
      total: producto.precio,
    };
    aplicarMembresiaDesdeOrden(run, orden);

    const usuario = getUsuarioPorRun(run);
    expect(usuario.membresia).not.toBeNull();
    expect(usuario.membresia.productoCodigo).toBe("PLAN-TRI");
    expect(getEstadoMembresia(usuario)).toBe("Activa");
  });

  it("no hace nada si la orden no contiene ningún ítem de tipo Plan", () => {
    const run = "215678903";
    aplicarMembresiaDesdeOrden(run, { run, items: [{ codigo: "SUP-CREA01", tipo: "Suplemento" }], total: 100 });
    expect(getUsuarioPorRun(run).membresia).toBeNull();
  });
});

/**
 * Ofertas y revalidación de stock en checkout (nuevo - Anexo 1 Evaluación 2:
 * vista "Ofertas" y el paso de Checkout que decide entre /compra-exitosa y
 * /compra-error). No se prueba cada función del módulo, solo estas reglas de
 * negocio nuevas, igual que el resto del archivo.
 */
describe("getPrecioEfectivo() / getProductosEnOferta() - precio de oferta", () => {
  it("devuelve el precioOferta cuando es menor al precio normal", () => {
    const producto = getProductoPorCodigo("SUP-PRE01"); // tiene precioOferta en la semilla
    expect(producto.precioOferta).toBeLessThan(producto.precio);
    expect(getPrecioEfectivo(producto)).toBe(producto.precioOferta);
  });

  it("devuelve el precio normal si no hay precioOferta", () => {
    const producto = getProductoPorCodigo("SUP-WHEY01"); // sin precioOferta en la semilla
    expect(getPrecioEfectivo(producto)).toBe(producto.precio);
  });

  it("ignora un precioOferta cargado por error que sea igual o mayor al precio normal", () => {
    const producto = { codigo: "X", precio: 1000, precioOferta: 1000 };
    expect(getPrecioEfectivo(producto)).toBe(1000);
  });

  it("getProductosEnOferta() solo incluye productos con un descuento real", () => {
    const enOferta = getProductosEnOferta();
    expect(enOferta.length).toBeGreaterThan(0);
    enOferta.forEach((p) => expect(p.precioOferta).toBeLessThan(p.precio));
    expect(enOferta.find((p) => p.codigo === "SUP-WHEY01")).toBeUndefined();
  });
});

describe("agregarAlCarrito() cobra el precio de oferta cuando corresponde", () => {
  it("agrega un producto en oferta al carrito con su precioOferta, no el precio normal", () => {
    const producto = getProductoPorCodigo("SUP-SNK01"); // en oferta en la semilla
    agregarAlCarrito(producto.codigo, 1);
    const item = getCarrito().find((i) => i.codigo === producto.codigo);
    expect(item.precio).toBe(producto.precioOferta);
  });
});

describe("getItemsSinStock() - revalidación de stock al pagar (Checkout.jsx)", () => {
  it("devuelve una lista vacía si todo el carrito tiene stock suficiente", () => {
    agregarAlCarrito("SUP-CREA01", 1);
    expect(getItemsSinStock(getCarrito())).toHaveLength(0);
  });

  it("detecta un ítem que pide más cantidad de la que queda en stock", () => {
    const producto = getProductoPorCodigo("SUP-ACC02");
    const carritoFalso = [{ codigo: producto.codigo, nombre: producto.nombre, cantidad: producto.stock + 5 }];
    const faltantes = getItemsSinStock(carritoFalso);
    expect(faltantes).toHaveLength(1);
    expect(faltantes[0]).toMatchObject({ codigo: producto.codigo, disponible: producto.stock });
  });

  it("si el producto ya no existe en el catálogo, cuenta como 0 de stock disponible", () => {
    const faltantes = getItemsSinStock([{ codigo: "NO-EXISTE", nombre: "Fantasma", cantidad: 1 }]);
    expect(faltantes).toHaveLength(1);
    expect(faltantes[0].disponible).toBe(0);
  });
});
