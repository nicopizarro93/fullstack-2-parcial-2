// Configuración de Vite + Vitest para Gymratstore React.
// Un solo archivo de configuración: Vite para dev/build, y el bloque `test`
// (leído por Vitest) para las pruebas unitarias, tal como acordamos usar
// Vite/Vitest en vez de Jasmine/Karma para este proyecto.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Solo nos interesa medir cobertura de la lógica de negocio portada
      // (datos, validaciones, sesión), no de cada componente visual.
      include: ["src/data/**", "src/utils/**"],
    },
  },
});
