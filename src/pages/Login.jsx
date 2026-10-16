// Gymratstore - login, portado desde login.html + login.js. Misma regla de
// redirección post-login por prioridad: ?volver=, luego Administrador/
// Vendedor al panel admin, luego Cliente al home.
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import * as V from "../utils/validaciones.js";
import { useSesion } from "../context/SesionContext.jsx";

export default function Login() {
  const { login } = useSesion();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState("");

  function enviar(evento) {
    evento.preventDefault();
    setAlerta("");

    // Valida formato antes de siquiera intentar autenticar (evita mostrar
    // "correo o contraseña incorrectos" por un simple error de formato).
    const rCorreo = V.email(correo);
    const rClave = V.clave(clave);
    setErrores({ correo: rCorreo.mensaje, clave: rClave.mensaje });
    if (!rCorreo.valido || !rClave.valido) return;

    const usuario = login(correo.trim(), clave);
    if (!usuario) {
      setAlerta("Correo o contraseña incorrectos.");
      return;
    }

    // Redirección post-login, en orden de prioridad: 1) ?volver=<url>,
    // 2) Administrador/Vendedor al panel admin, 3) Cliente al home.
    const destino = params.get("volver");
    if (destino) navigate(destino);
    else if (usuario.tipoUsuario === "Administrador" || usuario.tipoUsuario === "Vendedor") navigate("/admin");
    else navigate("/");
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="gr-card p-4 p-md-5">
            <h1 className="mb-1">Iniciar sesión</h1>
            <p className="text-muted-gr mb-4">Ingresa con tu correo y contraseña de Gymratstore.</p>

            <Form noValidate onSubmit={enviar}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  maxLength={100}
                  value={correo}
                  isInvalid={!!errores.correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="tu.correo@gmail.com"
                />
                <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  maxLength={10}
                  value={clave}
                  isInvalid={!!errores.clave}
                  onChange={(e) => setClave(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
              </Form.Group>

              {alerta && <Alert variant="danger">{alerta}</Alert>}

              <button type="submit" className="btn btn-brand btn-lg w-100 mt-2">Iniciar sesión</button>
              <p className="text-center small text-muted-gr mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Crea una aquí</Link>.
              </p>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
