/**
 * Gymratstore - Checkout (nuevo, Anexo 1 Evaluación 2, Figuras 5-6: "Se
 * incorpora Checkout (Paso de Pago): el cliente introduce la dirección de
 * envío y selecciona opciones de entrega"). Antes, Carrito.jsx confirmaba la
 * compra ahí mismo con un formulario mínimo (solo para invitados); ahora el
 * carrito solo lleva a este paso, que junta datos del cliente + dirección de
 * entrega completa (región/comuna, como en Registro.jsx) + un pago simulado,
 * y reutiliza las mismas reglas de validación del Anexo 1 (RUN no aplica
 * acá, pero sí correo/textos) más el nuevo validador de tarjeta.
 *
 * La revalidación de stock (igual que antes) decide a qué vista se llega:
 * /compra-exitosa/:id si alcanza, /compra-error si no - sin azar, para que
 * el flujo sea reproducible y testeable.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {
  REGIONES, getComunas, formatoCLP, getUsuarioPorRun, getProductoPorCodigo,
  guardarProducto, crearOrden, aplicarMembresiaDesdeOrden, getItemsSinStock,
} from "../data/mockData.js";
import * as V from "../utils/validaciones.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";

const VACIO = {
  nombre: "", apellidos: "", correo: "",
  calle: "", departamento: "", region: "", comuna: "", indicaciones: "",
  titular: "", tarjeta: "",
};

export default function Checkout() {
  const { carrito, totalCarrito, cantidadItems, limpiar } = useCarrito();
  const { sesion } = useSesion();
  const navigate = useNavigate();

  const tienePlan = carrito.some((item) => item.tipo === "Plan");
  const usuario = sesion ? getUsuarioPorRun(sesion.run) : null;

  const [form, setForm] = useState(() => (usuario
    ? { ...VACIO, nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo, calle: usuario.direccion || "", region: usuario.region || "", comuna: usuario.comuna || "" }
    : VACIO));
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState("");

  const comunasDisponibles = useMemo(() => getComunas(form.region), [form.region]);

  // Mismas guardas que tenía Carrito.jsx: sin ítems no hay nada que pagar, y
  // un plan de gimnasio siempre exige cuenta antes de llegar a esta vista.
  useEffect(() => {
    if (carrito.length === 0) {
      navigate("/carrito", { replace: true });
      return;
    }
    if (tienePlan && !sesion) {
      navigate("/login?volver=" + encodeURIComponent("/checkout"), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carrito.length, tienePlan, sesion]);

  function actualizar(campo, valor) {
    setForm((f) => {
      const siguiente = { ...f, [campo]: valor };
      if (campo === "region") siguiente.comuna = "";
      return siguiente;
    });
  }

  function validar() {
    const reglas = {
      nombre: V.texto(form.nombre, { requerido: true, max: 50 }),
      apellidos: V.texto(form.apellidos, { requerido: true, max: 100 }),
      correo: V.email(form.correo),
      calle: V.texto(form.calle, { requerido: true, max: 200 }),
      region: V.texto(form.region, { requerido: true, mensajeRequerido: "Selecciona una región." }),
      comuna: V.texto(form.comuna, { requerido: true, mensajeRequerido: "Selecciona una comuna." }),
      titular: V.texto(form.titular, { requerido: true, max: 100 }),
      tarjeta: V.tarjeta(form.tarjeta),
    };
    const nuevosErrores = Object.fromEntries(Object.entries(reglas).map(([k, r]) => [k, r.mensaje]));
    setErrores(nuevosErrores);
    return Object.values(reglas).every((r) => r.valido);
  }

  function pagar(evento) {
    evento.preventDefault();
    setAlerta("");

    if (!validar()) {
      setAlerta("Revisa los campos marcados en rojo antes de continuar.");
      return;
    }

    const envio = {
      calle: form.calle.trim(),
      departamento: form.departamento.trim(),
      region: form.region,
      comuna: form.comuna,
      indicaciones: form.indicaciones.trim(),
    };

    // Revalida stock real al momento de pagar (puede haber cambiado desde
    // que se agregó cada ítem al carrito). Si falta stock, no se cobra ni se
    // crea la orden: se manda a la vista de error con el detalle.
    const itemsSinStock = getItemsSinStock(carrito);
    if (itemsSinStock.length > 0) {
      navigate("/compra-error", { state: { items: itemsSinStock } });
      return;
    }

    carrito.forEach((item) => {
      const producto = getProductoPorCodigo(item.codigo);
      producto.stock -= item.cantidad;
      guardarProducto(producto);
    });

    const orden = crearOrden({
      run: sesion ? sesion.run : null,
      invitado: sesion ? null : { nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim() },
      correo: sesion ? form.correo.trim() : form.correo.trim(),
      fecha: new Date().toISOString().slice(0, 10),
      items: carrito,
      envio,
      total: totalCarrito,
      estado: "Pagada",
    });

    if (sesion) aplicarMembresiaDesdeOrden(sesion.run, orden);
    limpiar();
    navigate(`/compra-exitosa/${orden.id}`, { replace: true });
  }

  if (carrito.length === 0 || (tienePlan && !sesion)) return null; // el useEffect de arriba ya está redirigiendo

  return (
    <main className="container py-5">
      <h1 className="mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          <Form noValidate onSubmit={pagar}>
            <div className="gr-card p-4 mb-3">
              <h5 className="mb-3">Información del cliente</h5>
              <div className="row g-3">
                <Form.Group className="col-md-6">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control maxLength={50} value={form.nombre} isInvalid={!!errores.nombre} onChange={(e) => actualizar("nombre", e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control maxLength={100} value={form.apellidos} isInvalid={!!errores.apellidos} onChange={(e) => actualizar("apellidos", e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control maxLength={100} value={form.correo} isInvalid={!!errores.correo} onChange={(e) => actualizar("correo", e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                  <Form.Text className="text-muted-gr">Acá te enviaremos la boleta.</Form.Text>
                </Form.Group>
              </div>
            </div>

            <div className="gr-card p-4 mb-3">
              <h5 className="mb-3">Dirección de entrega</h5>
              <p className="small text-muted-gr mb-3">Ingresa la dirección de forma detallada.</p>
              <div className="row g-3">
                <Form.Group className="col-md-8">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control maxLength={200} value={form.calle} isInvalid={!!errores.calle} onChange={(e) => actualizar("calle", e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errores.calle}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-4">
                  <Form.Label>Departamento (opcional)</Form.Label>
                  <Form.Control maxLength={50} placeholder="Ej: 603" value={form.departamento} onChange={(e) => actualizar("departamento", e.target.value)} />
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Región</Form.Label>
                  <Form.Select value={form.region} isInvalid={!!errores.region} onChange={(e) => actualizar("region", e.target.value)}>
                    <option value="">Selecciona una región</option>
                    {Object.keys(REGIONES).map((region) => <option key={region} value={region}>{region}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select value={form.comuna} isInvalid={!!errores.comuna} disabled={comunasDisponibles.length === 0} onChange={(e) => actualizar("comuna", e.target.value)}>
                    <option value="">Selecciona una comuna</option>
                    {comunasDisponibles.map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-12">
                  <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
                  <Form.Control as="textarea" rows={2} maxLength={300} placeholder="Ej: entre calles, color del edificio, no tiene timbre" value={form.indicaciones} onChange={(e) => actualizar("indicaciones", e.target.value)} />
                </Form.Group>
              </div>
            </div>

            <div className="gr-card p-4 mb-3">
              <h5 className="mb-3">Pago</h5>
              <p className="small text-muted-gr mb-3">
                <i className="bi bi-shield-lock me-1" />Pago simulado: no se conecta a ninguna pasarela real (proyecto académico).
              </p>
              <div className="row g-3">
                <Form.Group className="col-md-6">
                  <Form.Label>Nombre del titular</Form.Label>
                  <Form.Control maxLength={100} value={form.titular} isInvalid={!!errores.titular} onChange={(e) => actualizar("titular", e.target.value)} />
                  <Form.Control.Feedback type="invalid">{errores.titular}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Número de tarjeta</Form.Label>
                  <Form.Control maxLength={16} placeholder="16 dígitos" value={form.tarjeta} isInvalid={!!errores.tarjeta} onChange={(e) => actualizar("tarjeta", e.target.value.replace(/[^0-9]/g, ""))} />
                  <Form.Control.Feedback type="invalid">{errores.tarjeta}</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {alerta && <Alert variant="danger">{alerta}</Alert>}

            <button type="submit" className="btn btn-brand btn-lg w-100">Pagar ahora {formatoCLP(totalCarrito)}</button>
            <Link to="/carrito" className="btn btn-outline-light w-100 mt-2">Volver al carrito</Link>
          </Form>
        </div>

        <div className="col-lg-5">
          <div className="gr-card p-4 gr-cart-summary">
            <h5 className="mb-3">Tu pedido</h5>
            <ul className="list-unstyled mb-3">
              {carrito.map((item) => (
                <li key={item.codigo} className="d-flex justify-content-between border-bottom border-secondary py-2">
                  <span>{item.nombre} × {item.cantidad}</span>
                  <span>{formatoCLP(item.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between text-muted-gr small mb-2">
              <span>Productos</span>
              <span>{cantidadItems}</span>
            </div>
            <div className="d-flex justify-content-between fs-5">
              <strong>Total</strong>
              <strong className="text-accent-lime">{formatoCLP(totalCarrito)}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
