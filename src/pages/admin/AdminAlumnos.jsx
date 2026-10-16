// Gymratstore - CRUD de usuarios (alumnos + personal) del panel admin,
// portado desde admin/alumnos.html + admin-alumnos.js. Exclusivo de
// Administrador (ya filtrado por <ProtectedRoute> en App.jsx). Mismas
// reglas: contraseña obligatoria solo al crear (en blanco al editar =
// conservar la actual), no se puede repetir correo, membresía solo aplica a
// Cliente, y nadie puede eliminar su propia cuenta.
import { useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {
  getUsuarios, getUsuarioPorRun, existeCorreo, guardarUsuario, eliminarUsuario,
  getEstadoMembresia, getProductosPorTipo, REGIONES, getComunas,
} from "../../data/mockData.js";
import * as V from "../../utils/validaciones.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const VACIO = {
  run: "", tipoUsuario: "Cliente", clave: "", nombre: "", apellidos: "", correo: "",
  fechaNacimiento: "", region: "", comuna: "", direccion: "", plan: "", vigencia: "",
};

export default function AdminAlumnos() {
  const { sesion } = useSesion();
  const { mostrarToast } = useToast();
  const planes = getProductosPorTipo("Plan");

  const [version, setVersion] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [buscar, setBuscar] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [runEnEdicion, setRunEnEdicion] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState("");

  const usuarios = useMemo(() => {
    const texto = buscar.trim().toLowerCase();
    return getUsuarios().filter((u) => {
      if (filtroTipo && u.tipoUsuario !== filtroTipo) return false;
      if (texto) {
        const coincide =
          u.run.toLowerCase().includes(texto) ||
          `${u.nombre} ${u.apellidos}`.toLowerCase().includes(texto) ||
          u.correo.toLowerCase().includes(texto);
        if (!coincide) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo, buscar, version]);

  const comunasDisponibles = useMemo(() => getComunas(form.region), [form.region]);

  function abrirNuevo() {
    setRunEnEdicion(null);
    setForm(VACIO);
    setErrores({});
    setAlerta("");
    setModalAbierto(true);
  }

  function abrirEditar(usuario) {
    setRunEnEdicion(usuario.run);
    setForm({
      run: usuario.run,
      tipoUsuario: usuario.tipoUsuario,
      clave: "",
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      fechaNacimiento: usuario.fechaNacimiento || "",
      region: usuario.region || "",
      comuna: usuario.comuna || "",
      direccion: usuario.direccion || "",
      plan: usuario.membresia ? usuario.membresia.productoCodigo : "",
      vigencia: usuario.membresia ? usuario.membresia.fechaFin : "",
    });
    setErrores({});
    setAlerta("");
    setModalAbierto(true);
  }

  function actualizar(campo, valor) {
    setForm((f) => {
      const siguiente = { ...f, [campo]: valor };
      if (campo === "region") siguiente.comuna = "";
      return siguiente;
    });
  }

  function guardar(evento) {
    evento.preventDefault();
    const reglas = {
      run: V.run(form.run),
      nombre: V.texto(form.nombre, { requerido: true, max: 50 }),
      apellidos: V.texto(form.apellidos, { requerido: true, max: 100 }),
      correo: V.email(form.correo),
      direccion: V.texto(form.direccion, { requerido: true, max: 300 }),
      region: V.texto(form.region, { requerido: true, mensajeRequerido: "Selecciona una región." }),
      comuna: V.texto(form.comuna, { requerido: true, mensajeRequerido: "Selecciona una comuna." }),
    };
    const nuevosErrores = Object.fromEntries(Object.entries(reglas).map(([k, r]) => [k, r.mensaje]));
    let valido = Object.values(reglas).every((r) => r.valido);

    // La contraseña es obligatoria solo al crear; al editar, en blanco = no cambiarla.
    if (!runEnEdicion || form.clave !== "") {
      const rClave = V.clave(form.clave);
      nuevosErrores.clave = rClave.mensaje;
      valido = rClave.valido && valido;
    }

    const correo = form.correo.trim();
    if (valido && existeCorreo(correo, runEnEdicion)) {
      nuevosErrores.correo = "Ya existe un usuario con ese correo.";
      valido = false;
    }
    if (form.tipoUsuario === "Cliente" && form.plan && !form.vigencia) {
      nuevosErrores.vigencia = "Indica la fecha de vigencia del plan asignado.";
      valido = false;
    }

    setErrores(nuevosErrores);
    if (!valido) {
      setAlerta("Revisa los campos marcados en rojo.");
      return;
    }

    const run = form.run.trim().toUpperCase();
    const claveFinal = form.clave !== "" ? form.clave : runEnEdicion ? getUsuarioPorRun(runEnEdicion).clave : "";

    let membresia = null;
    if (form.tipoUsuario === "Cliente" && form.plan) {
      const previo = runEnEdicion ? getUsuarioPorRun(runEnEdicion) : null;
      const fechaInicioPrevia = previo && previo.membresia && previo.membresia.productoCodigo === form.plan
        ? previo.membresia.fechaInicio
        : new Date().toISOString().slice(0, 10);
      membresia = { productoCodigo: form.plan, fechaInicio: fechaInicioPrevia, fechaFin: form.vigencia };
    }

    guardarUsuario({
      run,
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo,
      clave: claveFinal,
      fechaNacimiento: form.fechaNacimiento || null,
      tipoUsuario: form.tipoUsuario,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
      membresia,
    });

    setModalAbierto(false);
    mostrarToast("Usuario guardado correctamente.");
    setVersion((v) => v + 1);
  }

  function eliminar(usuario) {
    if (usuario.run === sesion.run) return; // no puede eliminar su propia cuenta
    if (!window.confirm(`¿Eliminar a "${usuario.nombre} ${usuario.apellidos}"? Esta acción no se puede deshacer.`)) return;
    eliminarUsuario(usuario.run);
    mostrarToast("Usuario eliminado.");
    setVersion((v) => v + 1);
  }

  function badgeMembresia(usuario) {
    if (usuario.tipoUsuario !== "Cliente") return <span className="text-muted-gr small">-</span>;
    const estado = getEstadoMembresia(usuario);
    const clase = estado === "Activa" ? "is-activa" : estado === "Vencida" ? "is-vencida" : "is-sin-plan";
    return <span className={`gr-badge-membresia ${clase}`}>{estado}</span>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">Alumnos</h1>
        <button type="button" className="btn btn-brand" onClick={abrirNuevo}>
          <i className="bi bi-plus-lg me-1" />Nuevo usuario
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-auto">
          <div className="btn-group">
            {[{ v: "", l: "Todos" }, { v: "Cliente", l: "Clientes" }, { v: "Vendedor", l: "Vendedores" }, { v: "Administrador", l: "Admins" }].map((op) => (
              <button key={op.v} type="button" className={`btn btn-sm ${filtroTipo === op.v ? "btn-brand" : "btn-outline-light"}`} onClick={() => setFiltroTipo(op.v)}>
                {op.l}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control form-control-sm" placeholder="Buscar por RUN, nombre o correo..." value={buscar} onChange={(e) => setBuscar(e.target.value)} />
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="gr-empty-state"><i className="bi bi-people" /><p className="mt-3 mb-0">No hay usuarios con esos filtros.</p></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-gr align-middle">
            <thead>
              <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Membresía</th><th>Comuna</th><th className="text-end">Acciones</th></tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.run}>
                  <td>{usuario.run}</td>
                  <td>{usuario.nombre} {usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.tipoUsuario}</td>
                  <td>{badgeMembresia(usuario)}</td>
                  <td>{usuario.comuna || "-"}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-outline-light me-1" onClick={() => abrirEditar(usuario)}><i className="bi bi-pencil" /></button>
                    <button
                      type="button" className="btn btn-sm btn-outline-danger" disabled={usuario.run === sesion.run}
                      title={usuario.run === sesion.run ? "No puedes eliminar tu propia cuenta" : undefined}
                      onClick={() => eliminar(usuario)}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered size="lg">
        <Form noValidate onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>{runEnEdicion ? "Editar usuario" : "Nuevo usuario"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-3">
              <Form.Group className="col-md-4">
                <Form.Label>RUN</Form.Label>
                <Form.Control value={form.run} disabled={!!runEnEdicion} isInvalid={!!errores.run} onChange={(e) => actualizar("run", e.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.run}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Tipo de usuario</Form.Label>
                <Form.Select value={form.tipoUsuario} onChange={(e) => actualizar("tipoUsuario", e.target.value)}>
                  <option value="Cliente">Cliente</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Administrador">Administrador</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Contraseña {runEnEdicion && <span className="text-muted-gr small">(dejar en blanco para no cambiarla)</span>}</Form.Label>
                <Form.Control type="password" value={form.clave} isInvalid={!!errores.clave} onChange={(e) => actualizar("clave", e.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={form.nombre} maxLength={50} isInvalid={!!errores.nombre} onChange={(e) => actualizar("nombre", e.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control value={form.apellidos} maxLength={100} isInvalid={!!errores.apellidos} onChange={(e) => actualizar("apellidos", e.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.apellidos}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label>Correo</Form.Label>
                <Form.Control value={form.correo} maxLength={100} isInvalid={!!errores.correo} onChange={(e) => actualizar("correo", e.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Fecha de nacimiento (opcional)</Form.Label>
                <Form.Control type="date" value={form.fechaNacimiento} onChange={(e) => actualizar("fechaNacimiento", e.target.value)} />
              </Form.Group>

              <Form.Group className="col-md-4">
                <Form.Label>Región</Form.Label>
                <Form.Select value={form.region} isInvalid={!!errores.region} onChange={(e) => actualizar("region", e.target.value)}>
                  <option value="">Selecciona una región</option>
                  {Object.keys(REGIONES).map((r) => <option key={r} value={r}>{r}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Comuna</Form.Label>
                <Form.Select value={form.comuna} isInvalid={!!errores.comuna} disabled={comunasDisponibles.length === 0} onChange={(e) => actualizar("comuna", e.target.value)}>
                  <option value="">Selecciona una comuna</option>
                  {comunasDisponibles.map((c) => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Dirección</Form.Label>
                <Form.Control value={form.direccion} maxLength={300} isInvalid={!!errores.direccion} onChange={(e) => actualizar("direccion", e.target.value)} />
                <Form.Control.Feedback type="invalid">{errores.direccion}</Form.Control.Feedback>
              </Form.Group>

              {form.tipoUsuario === "Cliente" && (
                <>
                  <Form.Group className="col-md-6">
                    <Form.Label>Plan asignado (opcional)</Form.Label>
                    <Form.Select value={form.plan} onChange={(e) => actualizar("plan", e.target.value)}>
                      <option value="">Sin plan</option>
                      {planes.map((p) => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="col-md-6">
                    <Form.Label>Vigencia hasta</Form.Label>
                    <Form.Control type="date" value={form.vigencia} isInvalid={!!errores.vigencia} onChange={(e) => actualizar("vigencia", e.target.value)} />
                    <Form.Control.Feedback type="invalid">{errores.vigencia}</Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
            </div>
            {alerta && <Alert variant="danger" className="mt-3 mb-0">{alerta}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-outline-light" onClick={() => setModalAbierto(false)}>Cancelar</button>
            <button type="submit" className="btn btn-brand">Guardar</button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
