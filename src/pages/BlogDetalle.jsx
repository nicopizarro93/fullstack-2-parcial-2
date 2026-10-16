// Gymratstore - detalle de entrada del blog, portado desde
// blog-detalle.html + blog-detalle.js. El contenido de los posts sigue
// embebido acá mismo (no hay backend/CMS, igual que en el original); el
// HTML de cada post es de confianza (lo escribimos nosotros, no viene de
// input de usuario), por eso se sigue insertando con dangerouslySetInnerHTML.
import { Link, useParams } from "react-router-dom";

const POSTS = {
  "1": {
    titulo: "5 errores comunes al elegir tu plan de gimnasio",
    fecha: "12 ago 2026",
    contenido: `<p>Elegir un plan de gimnasio no debería ser complicado, pero es fácil caer en errores que terminan costando caro o generando frustración. Estos son los más comunes que vemos en Gymratstore:</p>
      <ol>
        <li><strong>Elegir el plan más largo "porque sale más barato"</strong>, sin tener claro si vas a mantener la constancia. Un plan mensual que sí usas rinde más que un plan anual abandonado al segundo mes.</li>
        <li><strong>No revisar los cupos disponibles.</strong> Cada plan tiene un cupo máximo de inscritos para que la sala nunca se sienta saturada - revisa la disponibilidad antes de comprar.</li>
        <li><strong>Olvidar la evaluación física inicial.</strong> Los planes trimestral, semestral y anual la incluyen: úsala para partir con una rutina que realmente te sirva.</li>
        <li><strong>No sumar la suplementación al presupuesto.</strong> Si vas a complementar tu entrenamiento con proteína o creatina, cotiza todo junto antes de decidir el plan.</li>
        <li><strong>Registrarte con datos incompletos.</strong> Mantener tu ficha de alumno al día facilita cualquier trámite (renovación, cambio de plan, etc.).</li>
      </ol>`,
  },
  "2": {
    titulo: "Proteína en polvo: qué mirar antes de comprar",
    fecha: "25 ago 2026",
    contenido: `<p>El pasillo de suplementos puede ser abrumador. Antes de agregar una proteína al carrito, fíjate en estos puntos:</p>
      <ul>
        <li><strong>Gramos de proteína por porción</strong>, no solo el peso total del envase. Compara "proteína por porción" entre marcas, no el precio del bote.</li>
        <li><strong>Tipo de proteína.</strong> La whey se absorbe rápido y es una buena opción post-entreno; otras variantes de absorción lenta rinden mejor de noche.</li>
        <li><strong>Azúcares añadidos.</strong> Revisa la tabla nutricional, no solo el sabor en el empaque.</li>
        <li><strong>Tu objetivo real.</strong> La proteína en polvo complementa una dieta, no la reemplaza - no es obligatoria para entrenar bien.</li>
      </ul>
      <p>En nuestro catálogo encontrarás variantes en distintos sabores y formatos, además de creatina y pre-entrenos para cuando el objetivo lo amerite.</p>`,
  },
};

export default function BlogDetalle() {
  const { id } = useParams();
  const post = POSTS[id];

  if (!post) {
    return (
      <main className="container py-5">
        <div className="gr-empty-state">
          <i className="bi bi-journal-x" />
          <p className="mt-3 mb-2">No encontramos esa entrada del blog.</p>
          <Link to="/blog" className="btn btn-sm btn-brand-outline">Volver al blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/blog" className="small text-muted-gr"><i className="bi bi-arrow-left me-1" />Volver al blog</Link>
          <h1 className="mt-2 mb-1">{post.titulo}</h1>
          <p className="text-muted-gr mb-4">{post.fecha}</p>
          <div className="gr-card p-4 p-md-5" dangerouslySetInnerHTML={{ __html: post.contenido }} />
        </div>
      </div>
    </main>
  );
}
