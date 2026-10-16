// Gymratstore - Home, portada desde index.html + home.js. Mismas
// estadísticas rápidas, destacados (2 planes + 2 suplementos) y hero que
// cambia según haya sesión y, si la hay, según tipo de usuario/estado de
// membresía.
import { Link } from "react-router-dom";
import {
  getProductosPorTipo, getUsuariosAlumnos, getUsuarioPorRun, getEstadoMembresia, getProductoPorCodigo,
} from "../data/mockData.js";
import ProductoCard from "../components/ProductoCard.jsx";
import { useSesion } from "../context/SesionContext.jsx";

function HeroSesion({ sesion }) {
  const iniciales = (sesion.nombre.charAt(0) + (sesion.apellidos ? sesion.apellidos.charAt(0) : "")).toUpperCase();

  // Personal administrativo no tiene membresía de cliente: acceso directo al panel.
  if (sesion.tipoUsuario !== "Cliente") {
    return (
      <div className="row align-items-center g-4">
        <div className="col-auto">
          <div className="gr-avatar-circle-lg">{iniciales}</div>
        </div>
        <div className="col-lg-8">
          <h1>Hola, {sesion.nombre}</h1>
          <p className="mb-2">
            Rol: <span className="gr-badge-membresia is-activa">{sesion.tipoUsuario}</span>
          </p>
          <p className="text-muted-gr mb-3">Tienes acceso al panel de administración de Gymratstore.</p>
          <Link to="/admin" className="btn btn-brand">Ir al panel admin</Link>
        </div>
      </div>
    );
  }

  // Cliente: el hero varía según el estado real de su membresía.
  const usuario = getUsuarioPorRun(sesion.run);
  const estado = getEstadoMembresia(usuario);
  let badgeClase = "is-sin-plan";
  let detalle = "Todavía no tienes un plan contratado.";
  let botonTexto = "Ver planes";
  let botonHref = "/productos?tipo=Plan";

  if (estado === "Activa") {
    const plan = getProductoPorCodigo(usuario.membresia.productoCodigo);
    badgeClase = "is-activa";
    detalle = `${plan ? plan.nombre : "Tu plan"} vigente hasta el ${usuario.membresia.fechaFin}.`;
    botonTexto = "Ver suplementos";
    botonHref = "/productos?tipo=Suplemento";
  } else if (estado === "Vencida") {
    badgeClase = "is-vencida";
    detalle = `Tu plan venció el ${usuario.membresia.fechaFin}. Renuévalo para seguir entrenando con nosotros.`;
    botonTexto = "Renovar plan";
    botonHref = "/productos?tipo=Plan";
  }

  return (
    <div className="row align-items-center g-4">
      <div className="col-auto">
        <div className="gr-avatar-circle-lg">{iniciales}</div>
      </div>
      <div className="col-lg-8">
        <h1>Hola, {sesion.nombre}</h1>
        <p className="mb-2">
          Estado de tu membresía: <span className={`gr-badge-membresia ${badgeClase}`}>{estado}</span>
        </p>
        <p className="text-muted-gr mb-3">{detalle}</p>
        <div className="d-flex gap-2 flex-wrap">
          <Link to={botonHref} className="btn btn-brand">{botonTexto}</Link>
          <Link to="/productos?tipo=Suplemento" className="btn btn-outline-light">Ver suplementos</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { sesion } = useSesion();
  const esStaff = sesion && (sesion.tipoUsuario === "Administrador" || sesion.tipoUsuario === "Vendedor");
  const destacados = [...getProductosPorTipo("Plan").slice(0, 2), ...getProductosPorTipo("Suplemento").slice(0, 2)];

  return (
    <>
      {esStaff && (
        <div className="container pt-3">
          <div className="alert alert-dark border d-flex justify-content-between align-items-center flex-wrap gap-2 mb-0">
            <span><i className="bi bi-shield-lock me-2 text-accent-lime" />Sesión de staff activa.</span>
            <Link to="/admin" className="btn btn-sm btn-brand-outline">Ir al panel admin</Link>
          </div>
        </div>
      )}

      <section className="gr-hero">
        <div className="container">
          {!sesion ? (
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <h1>Entrena fuerte.<br />Suplementa mejor.</h1>
                <p className="text-muted-gr fs-5 mb-4">
                  Contrata tu plan de gimnasio y arma tu pedido de suplementos en el mismo carrito. Gymratstore
                  reúne membresías y suplementación deportiva en un solo lugar.
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/registro" className="btn btn-brand btn-lg">Crear cuenta gratis</Link>
                  <Link to="/productos" className="btn btn-outline-light btn-lg">Ver productos</Link>
                </div>
              </div>
              <div className="col-lg-5 text-center">
                <i className="bi bi-cart-check text-accent-lime" style={{ fontSize: "9rem" }} />
              </div>
            </div>
          ) : (
            <HeroSesion sesion={sesion} />
          )}
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-3 mb-5">
          <div className="col-6 col-md-3">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-accent-lime">{getProductosPorTipo("Plan").length}</div>
              <div className="small text-muted-gr">Planes disponibles</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-accent-lime">{getProductosPorTipo("Suplemento").length}</div>
              <div className="small text-muted-gr">Suplementos en catálogo</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-accent-lime">{getUsuariosAlumnos().length}</div>
              <div className="small text-muted-gr">Alumnos inscritos</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="gr-stat-card">
              <div className="gr-stat-valor text-accent-lime">100%</div>
              <div className="small text-muted-gr">Online, sin filas</div>
            </div>
          </div>
        </div>

        <div className="gr-section-titulo">
          <h2 className="mb-0">Destacados</h2>
          <Link to="/productos" className="small">Ver todo el catálogo <i className="bi bi-arrow-right" /></Link>
        </div>
        <div className="row g-3">
          {destacados.map((p) => <ProductoCard key={p.codigo} producto={p} />)}
        </div>
      </section>

      <section className="container pb-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <i className="bi bi-calendar2-check text-accent-red fs-1" />
            <h5 className="mt-3">Planes flexibles</h5>
            <p className="text-muted-gr small">Mensual, trimestral, semestral o anual: eliges el plan que calza con tu rutina.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-cup-straw text-accent-red fs-1" />
            <h5 className="mt-3">Suplementos de calidad</h5>
            <p className="text-muted-gr small">Proteínas, creatina, pre-entrenos y accesorios, listos para retirar o coordinar entrega.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-people text-accent-red fs-1" />
            <h5 className="mt-3">Gestión simple de alumnos</h5>
            <p className="text-muted-gr small">El equipo del gimnasio ve en un solo panel quién está inscrito y el estado de su membresía.</p>
          </div>
        </div>
      </section>
    </>
  );
}
