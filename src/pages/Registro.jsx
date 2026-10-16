// Gymratstore - registro de cuenta, portado desde registro.html + registro.js.
// Mismas reglas del Anexo 1 (RUN, correo institucional, contraseña, región/
// comuna, dirección, consentimiento) y mismo comportamiento (crea un
// usuario tipo "Cliente", inicia sesión automáticamente y redirige al home).
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import * as V from "../utils/validaciones.js";
import { REGIONES, getComunas, existeCorreo, guardarUsuario } from "../data/mockData.js";
import { useSesion } from "../context/SesionContext.jsx";

const INICIAL = {
  run: "", correo: "", nombre: "", apellidos: "", clave: "",
  fechaNacimiento: "", region: "", comuna: "", direccion: "", consentimiento: false,
};

export default function Registro() {
  const { iniciarSesionConUsuario } = useSesion();
  const navigate = useNavigate();
  const [valores, setValores] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState("");
  const [exito, setExito] = useState(false);

  const comunasDisponibles = useMemo(() => getComunas(valores.region), [valores.region]);

  function actualizar(campo, valor) {
    setValores((v) => {
      const siguiente = { ...v, [campo]: valor };
      // Igual que poblarComunas en la versión vanilla: al cambiar la región,
      // la comuna elegida deja de ser válida si no pertenece a la nueva región.
      if (campo === "region") siguiente.comuna = "";
      return siguiente;
    });
  }

  function validar() {
    const reglas = {
      run: V.run(valores.run),
      correo: V.email(valores.correo),
      nombre: V.texto(valores.nombre, { requerido: true, max: 50 }),
      apellidos: V.texto(valores.apellidos, { requerido: true, max: 100 }),
      clave: V.clave(valores.clave),
      direccion: V.texto(valores.direccion, { requerido: true, max: 300 }),
      region: V.texto(valores.region, { requerido: true, mensajeRequerido: "Selecciona una región." }),
      comuna: V.texto(valores.comuna, { requerido: true, mensajeRequerido: "Selecciona una comuna." }),
    };
    const nuevosErrores = Object.fromEntries(Object.entries(reglas).map(([k, r]) => [k, r.mensaje]));
    let valido = Object.values(reglas).every((r) => r.valido);

    // No se puede repetir correo entre cuentas.
    if (valido && existeCorreo(valores.correo.trim())) {
      nuevosErrores.correo = "Ya existe una cuenta registrada con ese correo.";
      valido = false;
    }
    // El consentimiento de tratamiento de datos es obligatorio (Ley 21.719).
    if (!valores.consentimiento) {
      nuevosErrores.consentimiento = "Debes autorizar el tratamiento de tus datos para continuar.";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  }

  function enviar(evento) {
    evento.preventDefault();
    setAlerta("");
    setExito(false);

    if (!validar()) {
      setAlerta("Revisa los campos marcados en rojo antes de continuar.");
      return;
    }

    // Toda cuenta creada desde este formulario es de tipo Cliente, sin
    // membresía asignada todavía (se asigna al comprar un plan).
    const usuario = {
      run: valores.run.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim(),
      clave: valores.clave,
      fechaNacimiento: valores.fechaNacimiento || null,
      tipoUsuario: "Cliente",
      region: valores.region,
      comuna: valores.comuna,
      direccion: valores.direccion.trim(),
      membresia: null,
    };
    guardarUsuario(usuario);
    iniciarSesionConUsuario(usuario);

    setExito(true);
    setTimeout(() => navigate("/"), 1200);
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="gr-card p-4 p-md-5">
            <h1 className="mb-1">Crear cuenta</h1>
            <p className="text-muted-gr mb-4">Regístrate para contratar un plan y comprar suplementos.</p>

            <Form noValidate onSubmit={enviar}>
              <div className="row g-3">
                <Form.Group className="col-md-6">
                  <Form.Label>RUN (sin puntos ni guion)</Form.Label>
                  <Form.Control
                    maxLength={9}
                    placeholder="193456782"
                    value={valores.run}
                    isInvalid={!!errores.run}
                    onChange={(e) => actualizar("run", e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.run}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    maxLength={100}
                    placeholder="tu.correo@gmail.com"
                    value={valores.correo}
                    isInvalid={!!errores.correo}
                    onChange={(e) => actualizar("correo", e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                  <Form.Text className="text-muted-gr">Dominios aceptados: @duoc.cl, @profesor.duoc.cl, @gmail.com</Form.Text>
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    maxLength={50}
                    value={valores.nombre}
                    isInvalid={!!errores.nombre}
                    onChange={(e) => actualizar("nombre", e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    maxLength={100}
                    value={valores.apellidos}
                    isInvalid={!!errores.apellidos}
                    onChange={(e) => actualizar("apellidos", e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    maxLength={10}
                    value={valores.clave}
                    isInvalid={!!errores.clave}
                    onChange={(e) => actualizar("clave", e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
                  <Form.Text className="text-muted-gr">Entre 4 y 10 caracteres.</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Fecha de nacimiento (opcional)</Form.Label>
                  <Form.Control
                    type="date"
                    value={valores.fechaNacimiento}
                    onChange={(e) => actualizar("fechaNacimiento", e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="col-md-6">
                  <Form.Label>Región</Form.Label>
                  <Form.Select
                    value={valores.region}
                    isInvalid={!!errores.region}
                    onChange={(e) => actualizar("region", e.target.value)}
                  >
                    <option value="">Selecciona una región</option>
                    {Object.keys(REGIONES).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-md-6">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Select
                    value={valores.comuna}
                    isInvalid={!!errores.comuna}
                    disabled={comunasDisponibles.length === 0}
                    onChange={(e) => actualizar("comuna", e.target.value)}
                  >
                    <option value="">Selecciona una comuna</option>
                    {comunasDisponibles.map((comuna) => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-12">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    maxLength={300}
                    value={valores.direccion}
                    isInvalid={!!errores.direccion}
                    onChange={(e) => actualizar("direccion", e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-12">
                  <Form.Check
                    type="checkbox"
                    id="consentimiento"
                    checked={valores.consentimiento}
                    isInvalid={!!errores.consentimiento}
                    onChange={(e) => actualizar("consentimiento", e.target.checked)}
                    label={
                      <span className="small text-muted-gr">
                        Autorizo el tratamiento de mis datos personales según la{" "}
                        <Link to="/politica-privacidad" target="_blank">Política de Privacidad</Link> de Gymratstore.
                      </span>
                    }
                    feedback={errores.consentimiento}
                    feedbackType="invalid"
                  />
                </Form.Group>
              </div>

              {alerta && <Alert variant="danger" className="mt-4">{alerta}</Alert>}
              {exito && <Alert variant="success" className="mt-4">Cuenta creada con éxito. Redirigiendo...</Alert>}

              <button type="submit" className="btn btn-brand btn-lg w-100 mt-3">Crear cuenta</button>
              <p className="text-center small text-muted-gr mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.
              </p>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
