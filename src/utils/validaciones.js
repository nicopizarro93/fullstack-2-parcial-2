/**
 * Gymratstore - reglas de validación de formulario (Anexo 1), portadas desde
 * js/validaciones.js. Cada regla devuelve siempre la misma forma:
 * { valido: boolean, mensaje: string } - el mensaje va vacío cuando es válido.
 *
 * La versión vanilla mezclaba estas reglas puras con helpers de DOM
 * (mostrarError/limpiarError/aplicar/validarFormulario, que pegaban clases
 * is-invalid/is-valid directamente en inputs). En React ese trabajo de UI lo
 * hace cada formulario controlado con el patrón isInvalid + Form.Control.Feedback
 * de react-bootstrap, así que ese pedazo NO se portó (no tiene sentido en un
 * componente controlado) - pero las reglas de negocio en sí (qué hace válido
 * o inválido un RUN, un correo, una clave, etc.) son exactamente las mismas,
 * dígito verificador incluido.
 */

// Únicos dominios de correo aceptados en todo el sitio.
export const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

// Helper base: ¿el valor está presente y no es solo espacios en blanco?
export function requerido(valor) {
  return valor !== null && valor !== undefined && String(valor).trim() !== "";
}

// Valida un campo de texto libre. opciones: { requerido, mensajeRequerido, min, max }.
export function texto(valor, opciones = {}) {
  const v = valor === null || valor === undefined ? "" : String(valor).trim();
  if (opciones.requerido && !requerido(v)) {
    return { valido: false, mensaje: opciones.mensajeRequerido || "Este campo es obligatorio." };
  }
  if (!opciones.requerido && v === "") {
    return { valido: true, mensaje: "" };
  }
  if (opciones.min && v.length < opciones.min) {
    return { valido: false, mensaje: "Debe tener al menos " + opciones.min + " caracteres." };
  }
  if (opciones.max && v.length > opciones.max) {
    return { valido: false, mensaje: "No puede superar los " + opciones.max + " caracteres." };
  }
  return { valido: true, mensaje: "" };
}

// Valida un campo numérico. opciones: { requerido, mensajeRequerido, min, max, entero }.
export function numero(valor, opciones = {}) {
  const v = valor === null || valor === undefined ? "" : String(valor).trim();
  if (opciones.requerido && !requerido(v)) {
    return { valido: false, mensaje: opciones.mensajeRequerido || "Este campo es obligatorio." };
  }
  if (!opciones.requerido && v === "") {
    return { valido: true, mensaje: "" };
  }
  const n = Number(v);
  if (v === "" || isNaN(n)) {
    return { valido: false, mensaje: "Debe ser un número válido." };
  }
  if (opciones.entero && !Number.isInteger(n)) {
    return { valido: false, mensaje: "Debe ser un número entero (sin decimales)." };
  }
  if (opciones.min !== undefined && n < opciones.min) {
    return { valido: false, mensaje: "No puede ser menor que " + opciones.min + "." };
  }
  if (opciones.max !== undefined && n > opciones.max) {
    return { valido: false, mensaje: "No puede ser mayor que " + opciones.max + "." };
  }
  return { valido: true, mensaje: "" };
}

// Valida un correo: formato general + pertenencia a uno de los
// DOMINIOS_PERMITIDOS (regla propia del Anexo 1, no un email cualquiera).
export function email(valor, opciones = {}) {
  const v = valor === null || valor === undefined ? "" : String(valor).trim();
  if (!requerido(v)) {
    return { valido: false, mensaje: "El correo es obligatorio." };
  }
  const max = opciones.max || 100;
  if (v.length > max) {
    return { valido: false, mensaje: "El correo no puede superar los " + max + " caracteres." };
  }
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patron.test(v)) {
    return { valido: false, mensaje: "Ingresa un correo con formato válido." };
  }
  const dominio = v.split("@")[1].toLowerCase();
  if (DOMINIOS_PERMITIDOS.indexOf(dominio) === -1) {
    return {
      valido: false,
      mensaje: "Solo se aceptan correos " + DOMINIOS_PERMITIDOS.map((d) => "@" + d).join(", ") + ".",
    };
  }
  return { valido: true, mensaje: "" };
}

// Valida una contraseña: obligatoria, largo entre 4 y 10 caracteres.
export function clave(valor) {
  const v = valor === null || valor === undefined ? "" : String(valor);
  if (!requerido(v)) {
    return { valido: false, mensaje: "La contraseña es obligatoria." };
  }
  if (v.length < 4 || v.length > 10) {
    return { valido: false, mensaje: "La contraseña debe tener entre 4 y 10 caracteres." };
  }
  return { valido: true, mensaje: "" };
}

// Dígito verificador de un RUN chileno (algoritmo módulo 11).
export function calcularDV(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

// El Anexo 1 pide RUN sin puntos ni guion, largo 7-9 (8 u 9 dígitos si se
// cuenta el DV), validando el dígito verificador.
export function run(valor) {
  const v = valor === null || valor === undefined ? "" : String(valor).trim().toUpperCase();
  if (!requerido(v)) {
    return { valido: false, mensaje: "El RUN es obligatorio." };
  }
  if (!/^[0-9]{6,8}[0-9K]$/.test(v)) {
    return { valido: false, mensaje: "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion (ej: 193456782)." };
  }
  const cuerpo = v.slice(0, -1);
  const dvIngresado = v.slice(-1);
  const dvCalculado = calcularDV(cuerpo);
  if (dvIngresado !== dvCalculado) {
    return { valido: false, mensaje: "El dígito verificador del RUN no es válido." };
  }
  return { valido: true, mensaje: "" };
}

// Cantidad a agregar/actualizar en el carrito: entero entre 1 y el stock
// disponible del producto (evita pedir más unidades de las que hay).
export function cantidadCarrito(valor, stockDisponible) {
  return numero(valor, { requerido: true, min: 1, max: stockDisponible, entero: true });
}

// Número de tarjeta para el checkout simulado (Anexo 1 Evaluación 2): 16
// dígitos sin espacios ni guiones. No se conecta a ninguna pasarela real, así
// que no valida marca/Luhn, solo el formato que pide el formulario.
export function tarjeta(valor) {
  const v = valor === null || valor === undefined ? "" : String(valor).trim();
  if (!requerido(v)) {
    return { valido: false, mensaje: "El número de tarjeta es obligatorio." };
  }
  if (!/^[0-9]{16}$/.test(v)) {
    return { valido: false, mensaje: "Ingresa los 16 dígitos de la tarjeta, sin espacios ni guiones." };
  }
  return { valido: true, mensaje: "" };
}
