// Gymratstore - listado del blog, portado 1:1 desde blog.html (contenido
// estático: los 2 posts de ejemplo coinciden con el diccionario POSTS de
// BlogDetalle.jsx, indexado por id).
import { Link } from "react-router-dom";

const POSTS = [
  { id: "1", icono: "bi-clipboard-check", fecha: "12 ago 2026", titulo: "5 errores comunes al elegir tu plan de gimnasio", resumen: "Antes de contratar un plan, revisa estos puntos para no pagar de más ni quedarte corto." },
  { id: "2", icono: "bi-cup-straw", fecha: "25 ago 2026", titulo: "Proteína en polvo: qué mirar antes de comprar", resumen: "Tipos de proteína, cómo leer la etiqueta y cuándo realmente la necesitas." },
];

export default function Blog() {
  return (
    <main className="container py-5">
      <h1 className="mb-1">Blog</h1>
      <p className="text-muted-gr mb-4">Consejos de entrenamiento y suplementación del equipo Gymratstore.</p>

      <div className="row g-4">
        {POSTS.map((post) => (
          <div className="col-md-6" key={post.id}>
            <div className="gr-card gr-blog-card h-100">
              <div className="gr-blog-media"><i className={`bi ${post.icono}`} /></div>
              <div className="p-4">
                <span className="small text-muted-gr">{post.fecha}</span>
                <h4 className="mt-1">{post.titulo}</h4>
                <p className="text-muted-gr">{post.resumen}</p>
                <Link to={`/blog/${post.id}`} className="btn btn-brand-outline btn-sm">Leer más</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
