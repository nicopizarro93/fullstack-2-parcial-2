// Punto de entrada de la app React (equivalente a los <script> al final de
// cada .html en la versión original). Monta <App /> en el <div id="root">
// de index.html y carga el CSS global (Bootstrap + estilos propios + tema).
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
