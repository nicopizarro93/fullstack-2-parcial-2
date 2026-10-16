// Gymratstore - página "Nosotros", portada 1:1 desde nosotros.html (100%
// estática en el original, sin JS propio: misión, visión y valores).
export default function Nosotros() {
  return (
    <>
      <section className="gr-hero py-5">
        <div className="container">
          <h1>Sobre Gymratstore</h1>
          <p className="text-muted-gr fs-5 mb-0">
            Nacimos para simplificar algo que suele ser enredado: contratar tu plan de gimnasio y comprar tus
            suplementos por separado, en sitios distintos, con letra chica distinta.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="gr-card p-4 h-100">
              <i className="bi bi-bullseye text-accent-red fs-2" />
              <h4 className="mt-3">Misión</h4>
              <p className="text-muted-gr mb-0">
                Entregar una forma simple, transparente y 100% online de inscribirse en el gimnasio y abastecerse de
                suplementación deportiva de calidad.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="gr-card p-4 h-100">
              <i className="bi bi-eye text-accent-red fs-2" />
              <h4 className="mt-3">Visión</h4>
              <p className="text-muted-gr mb-0">
                Ser la plataforma de referencia para gimnasios que quieren digitalizar la gestión de sus alumnos sin
                perder cercanía con la comunidad.
              </p>
            </div>
          </div>
        </div>

        <div className="gr-section-titulo mt-5">
          <h2 className="mb-0">Nuestros valores</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <i className="bi bi-shield-check text-accent-lime fs-1" />
            <h5 className="mt-3">Transparencia</h5>
            <p className="text-muted-gr small">Precios claros, sin letra chica, y control total sobre tus datos personales.</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="bi bi-lightning-charge text-accent-lime fs-1" />
            <h5 className="mt-3">Constancia</h5>
            <p className="text-muted-gr small">Creemos que los resultados llegan con hábitos sostenidos, no con soluciones mágicas.</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="bi bi-people text-accent-lime fs-1" />
            <h5 className="mt-3">Comunidad</h5>
            <p className="text-muted-gr small">Un gimnasio es, primero que nada, la gente que entrena en él.</p>
          </div>
        </div>
      </section>
    </>
  );
}
