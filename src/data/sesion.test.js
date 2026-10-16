/**
 * Pruebas unitarias de sesión y control de acceso por rol
 * (src/data/sesion.js), portado desde js/sesion.js. Es la funcionalidad que
 * protege todo el panel admin, por eso se prueba junto a las validaciones y
 * el carrito como una de las "más importantes" del sitio.
 */
import { describe, it, expect, afterEach } from "vitest";
import { guardarSesion, getSesion, cerrarSesion, puedeAcceder } from "./sesion.js";

describe("guardarSesion() / getSesion() / cerrarSesion()", () => {
  afterEach(() => cerrarSesion());

  it("guarda solo los campos mínimos necesarios (nunca la contraseña)", () => {
    const datos = guardarSesion({
      run: "193456782", nombre: "Matías", apellidos: "Fernández Soto",
      tipoUsuario: "Cliente", clave: "socio123", correo: "matias@gmail.com",
    });
    expect(datos).not.toHaveProperty("clave");
    expect(datos).not.toHaveProperty("correo");
    expect(getSesion()).toEqual({ run: "193456782", nombre: "Matías", apellidos: "Fernández Soto", tipoUsuario: "Cliente" });
  });

  it("getSesion() devuelve null si no hay sesión guardada", () => {
    expect(getSesion()).toBeNull();
  });

  it("cerrarSesion() borra la sesión activa", () => {
    guardarSesion({ run: "1", nombre: "Ana", apellidos: "Soto", tipoUsuario: "Cliente" });
    cerrarSesion();
    expect(getSesion()).toBeNull();
  });
});

describe("puedeAcceder() - misma regla que requiereSesion() en la versión vanilla", () => {
  const admin = { run: "189012349", nombre: "Camila", tipoUsuario: "Administrador" };
  const vendedor = { run: "167890121", nombre: "Diego", tipoUsuario: "Vendedor" };
  const cliente = { run: "193456782", nombre: "Matías", tipoUsuario: "Cliente" };

  it("sin sesión, nunca puede acceder (haya o no restricción de roles)", () => {
    expect(puedeAcceder(null, null)).toBe(false);
    expect(puedeAcceder(null, ["Administrador"])).toBe(false);
  });

  it("con sesión y sin lista de roles, cualquier sesión activa puede acceder", () => {
    expect(puedeAcceder(cliente, null)).toBe(true);
  });

  it("con sesión y lista de roles, solo accede si su tipoUsuario está en la lista", () => {
    expect(puedeAcceder(admin, ["Administrador", "Vendedor"])).toBe(true);
    expect(puedeAcceder(vendedor, ["Administrador", "Vendedor"])).toBe(true);
    expect(puedeAcceder(cliente, ["Administrador", "Vendedor"])).toBe(false);
  });

  it("admin/alumnos es exclusivo de Administrador: un Vendedor no puede entrar", () => {
    expect(puedeAcceder(admin, ["Administrador"])).toBe(true);
    expect(puedeAcceder(vendedor, ["Administrador"])).toBe(false);
  });
});
