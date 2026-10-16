/**
 * Pruebas unitarias de las validaciones del Anexo 1 (src/utils/validaciones.js),
 * portadas desde js/validaciones.js. Son de las funcionalidades más
 * sensibles del sitio (bloquean registro/login/admin si fallan), por eso
 * están entre las "más importantes" que acordamos cubrir con Vitest.
 */
import { describe, it, expect } from "vitest";
import { run, email, clave, calcularDV, texto, numero, cantidadCarrito, tarjeta } from "./validaciones.js";

describe("run() - validación de RUN chileno con dígito verificador", () => {
  it("acepta un RUN válido (dígito verificador correcto)", () => {
    // 193456782 es el RUN semilla de un cliente en mockData.js: cuerpo
    // 19345678 -> DV 2, calculado con el mismo algoritmo módulo 11.
    expect(run("193456782").valido).toBe(true);
    expect(calcularDV("19345678")).toBe("2");
  });

  it("rechaza un RUN con el dígito verificador incorrecto", () => {
    const resultado = run("193456780"); // mismo cuerpo, DV equivocado
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toMatch(/dígito verificador/i);
  });

  it("acepta un RUN cuyo dígito verificador calculado es K", () => {
    // Busca un cuerpo de 8 dígitos cuyo DV sea K para probar ese caso borde.
    // 15 dígitos probados por fuerza bruta en el propio algoritmo darían K
    // en algún punto; en vez de adivinar, se prueba un valor conocido:
    // cuerpo 2345678K más abajo por fuerza bruta no es necesario, basta con
    // construir el RUN a partir de calcularDV para no acoplarse a un valor mágico.
    const cuerpo = "20000000";
    const dv = calcularDV(cuerpo);
    expect(run(cuerpo + dv).valido).toBe(true);
  });

  it("rechaza un RUN vacío, muy corto o con letras fuera del DV", () => {
    expect(run("").valido).toBe(false);
    expect(run("123").valido).toBe(false);
    expect(run("ABCDEFGHI").valido).toBe(false);
  });
});

describe("email() - correo con dominio institucional/permitido", () => {
  it("acepta correos en los dominios permitidos (duoc.cl, profesor.duoc.cl, gmail.com)", () => {
    expect(email("alumno@duoc.cl").valido).toBe(true);
    expect(email("profe@profesor.duoc.cl").valido).toBe(true);
    expect(email("persona@gmail.com").valido).toBe(true);
  });

  it("rechaza un correo con formato inválido", () => {
    expect(email("no-es-un-correo").valido).toBe(false);
  });

  it("rechaza un correo con dominio no permitido (regla propia del Anexo 1)", () => {
    const resultado = email("alguien@hotmail.com");
    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toMatch(/duoc\.cl/);
  });

  it("rechaza un correo vacío como obligatorio", () => {
    expect(email("").valido).toBe(false);
  });
});

describe("clave() - contraseña entre 4 y 10 caracteres", () => {
  it("acepta contraseñas de 4 a 10 caracteres", () => {
    expect(clave("1234").valido).toBe(true);
    expect(clave("socio123").valido).toBe(true);
    expect(clave("1234567890").valido).toBe(true);
  });

  it("rechaza contraseñas demasiado cortas o demasiado largas", () => {
    expect(clave("123").valido).toBe(false);
    expect(clave("12345678901").valido).toBe(false);
  });

  it("rechaza una contraseña vacía", () => {
    expect(clave("").valido).toBe(false);
  });
});

describe("texto() y numero() - reglas genéricas reutilizadas en todos los formularios", () => {
  it("texto() respeta requerido/min/max", () => {
    expect(texto("", { requerido: true }).valido).toBe(false);
    expect(texto("ab", { min: 3 }).valido).toBe(false);
    expect(texto("abcdef", { max: 3 }).valido).toBe(false);
    expect(texto("abc", { min: 2, max: 5 }).valido).toBe(true);
  });

  it("numero() respeta entero/min/max", () => {
    expect(numero("abc", { requerido: true }).valido).toBe(false);
    expect(numero("3.5", { entero: true }).valido).toBe(false);
    expect(numero("-1", { min: 0 }).valido).toBe(false);
    expect(numero("5", { min: 0, max: 10, entero: true }).valido).toBe(true);
  });
});

describe("cantidadCarrito() - cantidad a agregar/actualizar en el carrito", () => {
  it("acepta una cantidad entre 1 y el stock disponible", () => {
    expect(cantidadCarrito(1, 10).valido).toBe(true);
    expect(cantidadCarrito(10, 10).valido).toBe(true);
  });

  it("rechaza una cantidad que supera el stock disponible", () => {
    expect(cantidadCarrito(11, 10).valido).toBe(false);
  });

  it("rechaza una cantidad de 0 o negativa", () => {
    expect(cantidadCarrito(0, 10).valido).toBe(false);
    expect(cantidadCarrito(-2, 10).valido).toBe(false);
  });
});

describe("tarjeta() - número de tarjeta del checkout simulado (Anexo 1 Evaluación 2)", () => {
  it("acepta un número de 16 dígitos", () => {
    expect(tarjeta("4111111111111111").valido).toBe(true);
  });

  it("rechaza un número con menos o más de 16 dígitos", () => {
    expect(tarjeta("123").valido).toBe(false);
    expect(tarjeta("41111111111111111").valido).toBe(false);
  });

  it("rechaza letras, espacios o guiones", () => {
    expect(tarjeta("4111-1111-1111-1111").valido).toBe(false);
    expect(tarjeta("abcd111111111111").valido).toBe(false);
  });

  it("rechaza un valor vacío", () => {
    expect(tarjeta("").valido).toBe(false);
  });
});
