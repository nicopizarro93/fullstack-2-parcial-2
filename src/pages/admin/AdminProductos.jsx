// Gymratstore - CRUD de productos del panel admin, portado desde
// admin/productos.html + admin-productos.js. Mismas reglas: Vendedor es
// solo lectura (no ve botón "nuevo" ni columna de acciones); Administrador
// tiene control total. El modal de bootstrap.Modal se reemplaza por
// <Modal> de react-bootstrap, pero la validación y el guardado son los
// mismos (unicidad de código al crear, categorías dependientes del tipo).
import { useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import {
  getProductos, getProductoPorCodigo, guardarProducto, eliminarProducto,
  CATEGORIAS_PLAN, CATEGORIAS_SUPLEMENTO, formatoCLP,
} from "../../data/mockData.js";
import * as V from "../../utils/validaciones.js";
import { useSesion } from "../../context/SesionContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const VACIO = { codigo: "", tipo: "Plan", categoria: "", nombre: "", imagen: "", descripcion: "", precio: "", precioOferta: "", stock: "", stockCritico: "" };

export default function AdminProductos() {
  const { sesion } = useSesion();
  const { mostrarToast } = useToast();
  const soloLectura = sesion.tipoUsuario === "Vendedor";

  const [version, setVersion] = useState(0); // fuerza refrescar tras guardar/eliminar
  const [filtroTipo, setFiltroTipo] = useState("");
  const [buscar, setBuscar] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [codigoEnEdicion, setCodigoEnEdicion] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState("");

  const productos = useMemo(() => {
    const texto = buscar.trim().toLowerCase();
    return getProductos().filter((p) => {
      if (filtroTipo && p.tipo !== filtroTipo) return false;
      if (texto && p.nombre.toLowerCase().indexOf(texto) === -1 && p.codigo.toLowerCase().indexOf(texto) === -1) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo, buscar, version]);

  const categoriasDelTipo = form.tipo === "Plan" ? CATEGORIAS_PLAN : CATEGORIAS_SUPLEMENTO;

  function abrirNuevo() {
    setCodigoEnEdicion(null);
    setForm({ ...VACIO, categoria: CATEGORIAS_PLAN[0] });
    setErrores({});
    setAlerta("");
    setModalAbierto(true);
  }

  function abrirEditar(producto) {
    setCodigoEnEdicion(producto.codigo);
    setForm({
      codigo: producto.codigo,
      tipo: producto.tipo,
      categoria: producto.categoria,
      nombre: producto.nombre,
      imagen: producto.imagen || "",
      descripcion: producto.descripcion || "",
      precio: String(producto.precio),
      precioOferta: producto.precioOferta != null ? String(producto.precioOferta) : "",
      stock: String(producto.stock),
      stockCritico: producto.stockCritico != null ? String(producto.stockCritico) : "",
    });
    setErrores({});
    setAlerta("");
    setModalAbierto(true);
  }

  function cambiarTipo(tipo) {
    const categorias = tipo === "Plan" ? CATEGORIAS_PLAN : CATEGORIAS_SUPLEMENTO;
    setForm((f) => ({ ...f, tipo, categoria: categorias.includes(f.categoria) ? f.categoria : categorias[0] }));
  }

  function guardar(evento) {
    evento.preventDefault();
    const reglas = {
      categoria: V.texto(form.categoria, { requerido: true }),
      codigo: V.texto(form.codigo, { requerido: true, min: 3 }),
      nombre: V.texto(form.nombre, { requerido: true, max: 100 }),
      descripcion: V.texto(form.descripcion, { requerido: false, max: 500 }),
      precio: V.numero(form.precio, { requerido: true, min: 0 }),
      precioOferta: V.numero(form.precioOferta, { requerido: false, min: 0 }),
      stock: V.numero(form.stock, { requerido: true, min: 0, entero: true }),
      stockCritico: V.numero(form.stockCritico, { requerido: false, min: 0, entero: true }),
    };
    const nuevosErrores = Object.fromEntries(Object.entries(reglas).map(([k, r]) => [k, r.mensaje]));
    let valido = Object.values(reglas).every((r) => r.valido);

    const codigo = form.codigo.trim().toUpperCase();
    // El código debe ser único, pero solo se valida la unicidad al CREAR.
    if (valido && !codigoEnEdicion && getProductoPorCodigo(codigo)) {
      nuevosErrores.codigo = "Ya existe un producto con ese código.";
      valido = false;
    }
    // El precio de oferta (si se cargó) tiene que ser menor al precio normal,
    // si no la "oferta" no bajaría nada (ver getPrecioEfectivo en mockData.js).
    if (valido && form.precioOferta !== "" && Number(form.precioOferta) >= Number(form.precio)) {
      nuevosErrores.precioOferta = "El precio de oferta debe ser menor al precio normal.";
      valido = false;
    }

    setErrores(nuevosErrores);
    if (!valido) {
      setAlerta("Revisa los campos marcados en rojo.");
      return;
    }

    guardarProducto({
      codigo,
      tipo: form.tipo,
      categoria: form.categoria,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      precioOferta: form.precioOferta === "" ? null : Number(form.precioOferta),
      stock: parseInt(form.stock, 10),
      stockCritico: form.stockCritico === "" ? null : parseInt(form.stockCritico, 10),
      imagen: form.imagen.trim(),
    });

    setModalAbierto(false);
    mostrarToast("Producto guardado correctamente.");
    setVersion((v) => v + 1);
  }

  function eliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    eliminarProducto(producto.codigo);
    mostrarToast("Producto eliminado.");
    setVersion((v) => v + 1);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="mb-0">Productos</h1>
        {!soloLectura && (
          <button type="button" className="btn btn-brand" onClick={abrirNuevo}>
            <i className="bi bi-plus-lg me-1" />Nuevo producto
          </button>
        )}
      </div>

      <div className="row g-2 mb-3">
        <div className="col-auto">
          <div className="btn-group">
            {[{ v: "", l: "Todos" }, { v: "Plan", l: "Planes" }, { v: "Suplemento", l: "Suplementos" }].map((op) => (
              <button key={op.v} type="button" className={`btn btn-sm ${filtroTipo === op.v ? "btn-brand" : "btn-outline-light"}`} onClick={() => setFiltroTipo(op.v)}>
                {op.l}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control form-control-sm" placeholder="Buscar por nombre o código..." value={buscar} onChange={(e) => setBuscar(e.target.value)} />
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="gr-empty-state"><i className="bi bi-box-seam" /><p className="mt-3 mb-0">No hay productos con esos filtros.</p></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-gr align-middle">
            <thead>
              <tr>
                <th>Código</th><th>Tipo</th><th>Categoría</th><th>Nombre</th><th>Precio</th><th>Oferta</th><th>Stock</th><th>Crítico</th>
                {!soloLectura && <th className="text-end">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => {
                const stockBajo = producto.stockCritico != null && producto.stock <= producto.stockCritico;
                return (
                  <tr key={producto.codigo}>
                    <td>{producto.codigo}</td>
                    <td>{producto.tipo}</td>
                    <td>{producto.categoria}</td>
                    <td>{producto.nombre}</td>
                    <td>{formatoCLP(producto.precio)}</td>
                    <td>{producto.precioOferta != null ? <span className="gr-badge-oferta">{formatoCLP(producto.precioOferta)}</span> : <span className="text-muted-gr">-</span>}</td>
                    <td>{producto.stock}</td>
                    <td className={stockBajo ? "gr-stock-critico" : ""}>{producto.stockCritico != null ? producto.stockCritico : "-"}</td>
                    {!soloLectura && (
                      <td className="text-end">
                        <button type="button" className="btn btn-sm btn-outline-light me-1" onClick={() => abrirEditar(producto)}><i className="bi bi-pencil" /></button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(producto)}><i className="bi bi-trash" /></button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Form noValidate onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>{codigoEnEdicion ? "Editar producto" : "Nuevo producto"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-3">
              <Form.Group className="col-6">
                <Form.Label>Tipo</Form.Label>
                <Form.Select value={form.tipo} onChange={(e) => cambiarTipo(e.target.value)}>
                  <option value="Plan">Plan</option>
                  <option value="Suplemento">Suplemento</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={form.categoria} isInvalid={!!errores.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>
                  {categoriasDelTipo.map((c) => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Código</Form.Label>
                <Form.Control
                  value={form.codigo} isInvalid={!!errores.codigo} disabled={!!codigoEnEdicion}
                  onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
                />
                <Form.Control.Feedback type="invalid">{errores.codigo}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={form.nombre} maxLength={100} isInvalid={!!errores.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-12">
                <Form.Label>Imagen (ruta, opcional)</Form.Label>
                <Form.Control value={form.imagen} onChange={(e) => setForm((f) => ({ ...f, imagen: e.target.value }))} placeholder="img/ejemplo.jpg" />
              </Form.Group>
              <Form.Group className="col-12">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={2} maxLength={500} value={form.descripcion} isInvalid={!!errores.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" min="0" value={form.precio} isInvalid={!!errores.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Precio oferta (opcional)</Form.Label>
                <Form.Control type="number" min="0" value={form.precioOferta} isInvalid={!!errores.precioOferta} onChange={(e) => setForm((f) => ({ ...f, precioOferta: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{errores.precioOferta}</Form.Control.Feedback>
                <Form.Text className="text-muted-gr">Déjalo vacío si el producto no está en oferta.</Form.Text>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" min="0" value={form.stock} isInvalid={!!errores.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Stock crítico</Form.Label>
                <Form.Control type="number" min="0" value={form.stockCritico} isInvalid={!!errores.stockCritico} onChange={(e) => setForm((f) => ({ ...f, stockCritico: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{errores.stockCritico}</Form.Control.Feedback>
              </Form.Group>
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
