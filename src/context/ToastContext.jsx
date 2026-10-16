/**
 * Gymratstore - avisos tipo "toast", equivalente a Carrito.mostrarToast() de
 * js/carrito.js, pero implementado con <ToastContainer>/<Toast> de
 * react-bootstrap en vez de manipular el DOM a mano con innerHTML.
 */
import { createContext, useCallback, useContext, useState } from "react";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

const ToastContext = createContext(null);
let siguienteId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrarToast = useCallback((mensaje, tipo = "success") => {
    const id = siguienteId++;
    setToasts((actual) => [...actual, { id, mensaje, tipo }]);
    // Mismo tiempo de autodestrucción que el toast original (2.5s).
    setTimeout(() => {
      setToasts((actual) => actual.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <ToastContainer position="bottom-end" className="p-3" style={{ position: "fixed", zIndex: 1080 }}>
        {toasts.map((t) => (
          <Toast key={t.id} bg={t.tipo} onClose={() => setToasts((actual) => actual.filter((x) => x.id !== t.id))}>
            <Toast.Body className={t.tipo === "danger" || t.tipo === "success" ? "text-white" : undefined}>
              {t.mensaje}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
