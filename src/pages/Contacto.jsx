// Gymratstore - formulario de contacto, portado desde contacto.html +
// contacto.js. Mismas 3 reglas de validación (nombre/correo/comentario) y
// mismo "envío" simulado (sin backend real); el manejo de errores pasa de
// mostrarError/is-invalid manual a estado de React + isInvalid de react-bootstrap.
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import * as V from "../utils/validaciones.js";

const CAMPOS_INICIALES = { nombre: "", correo: "", comentario: "" };

export default function Contacto() {
  const [valores, setValores] = useState(CAMPOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);
  const [alerta, setAlerta] = useState(false);

  function actualizar(campo, valor) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

  function validar() {
    const resultado = {
      nombre: V.texto(valores.nombre, { requerido: true, max: 100 }),
      correo: V.email(valores.correo),
      comentario: V.texto(valores.comentario, { requerido: true, max: 500 }),
    };
    setErrores({
      nombre: resultado.nombre.mensaje,
      correo: resultado.correo.mensaje,
      comentario: resultado.comentario.mensaje,
    });
    return Object.values(resultado).every((r) => r.valido);
  }

  function enviar(evento) {
    evento.preventDefault();
    setExito(false);
    setAlerta(false);
    if (!validar()) {
      setAlerta(true);
      return;
    }
    // "Envío" simulado exitoso: no hay backend real al que postear.
    setValores(CAMPOS_INICIALES);
    setErrores({});
    setExito(true);
  }

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <h1 className="mb-1">Contacto</h1>
          <p className="text-muted-gr mb-4">¿Dudas sobre planes o suplementos? Escríbenos y te respondemos a la brevedad.</p>
          <ul className="list-unstyled text-muted-gr">
            <li className="mb-2"><i className="bi bi-geo-alt text-accent-red me-2" />Av. Siempre Viva 1234, Santiago</li>
            <li className="mb-2"><i className="bi bi-envelope text-accent-red me-2" />contacto@gymratstore.cl</li>
            <li className="mb-2"><i className="bi bi-telephone text-accent-red me-2" />+56 9 1234 5678</li>
          </ul>
        </div>
        <div className="col-lg-7">
          <div className="gr-card p-4 p-md-5">
            <Form noValidate onSubmit={enviar}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  maxLength={100}
                  value={valores.nombre}
                  isInvalid={!!errores.nombre}
                  onChange={(e) => actualizar("nombre", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  maxLength={100}
                  value={valores.correo}
                  isInvalid={!!errores.correo}
                  onChange={(e) => actualizar("correo", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                <Form.Text className="text-muted-gr">Dominios aceptados: @duoc.cl, @profesor.duoc.cl, @gmail.com</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  maxLength={500}
                  value={valores.comentario}
                  isInvalid={!!errores.comentario}
                  onChange={(e) => actualizar("comentario", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{errores.comentario}</Form.Control.Feedback>
              </Form.Group>

              {exito && <Alert variant="success">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</Alert>}
              {alerta && <Alert variant="danger">Revisa los campos marcados en rojo antes de enviar.</Alert>}

              <button type="submit" className="btn btn-brand btn-lg w-100">Enviar mensaje</button>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
