/**
 * Gymratstore - "No se pudo realizar el pago" (nuevo, Anexo 1 Evaluación 2,
 * Figura 8). Se llega acá desde Checkout.jsx cuando la revalidación de stock
 * al pagar encuentra que algún ítem del carrito ya no alcanza (motivo
 * determinista, no un error de pasarela simulado al azar) - el carrito NO se
 * vacía ni se cobra nada, así que "volver a intentar el pago" simplemente
 * manda de vuelta a /checkout para ajustar cantidades o continuar.
 */
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CompraError() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = (location.state && location.state.items) || [];

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="gr-card p-4 p-md-5 text-center">
            <i className="bi bi-x-circle-fill text-accent-red" style={{ fontSize: "2.5rem" }} />
            <h3 className="mt-3">No se pudo realizar el pago</h3>
            <p className="text-muted-gr">
              {items.length > 0
                ? "Algunos productos de tu carrito ya no tienen stock suficiente:"
                : "Ocurrió un problema al procesar tu compra. Tu carrito no fue modificado."}
            </p>

            {items.length > 0 && (
              <ul className="list-unstyled text-start mx-auto mb-4" style={{ maxWidth: "26rem" }}>
                {items.map((it) => (
                  <li key={it.codigo} className="d-flex justify-content-between border-bottom border-secondary py-2">
                    <span>{it.nombre}</span>
                    <span className="gr-stock-critico">pediste {it.pedido}, quedan {it.disponible}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
              <button type="button" className="btn btn-brand" onClick={() => navigate("/checkout")}>
                Volver a intentar el pago
              </button>
              <Link to="/carrito" className="btn btn-outline-light">Ajustar mi carrito</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
