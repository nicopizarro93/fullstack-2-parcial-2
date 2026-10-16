// Gymratstore - política de privacidad, portada 1:1 desde
// politica-privacidad.html (texto legal conforme a la Ley N° 21.719 de
// Chile). Página 100% estática, sin lógica propia.
export default function PoliticaPrivacidad() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-1">Política de Privacidad</h1>
          <p className="text-muted-gr mb-4">
            Última actualización: septiembre de 2026. Elaborada conforme a la Ley N° 21.719 sobre Protección de
            Datos Personales.
          </p>

          <div className="gr-card p-4 p-md-5">
            <h5>1. Datos que recolectamos</h5>
            <p className="text-muted-gr">
              Al crear tu cuenta solicitamos: RUN, nombre, apellidos, correo electrónico, fecha de nacimiento
              (opcional), región, comuna y dirección. Al comprar, registramos el detalle de tu orden (productos,
              cantidades y montos).
            </p>

            <h5 className="mt-4">2. Qué NO recolectamos</h5>
            <p className="text-muted-gr">
              Gymratstore no solicita ni almacena datos de salud, condición física, biométricos ni ningún otro dato
              sensible de sus alumnos. La Ley 21.719 prohíbe expresamente tratar datos de salud recolectados en el
              ámbito deportivo salvo autorización legal expresa, por lo que evitamos deliberadamente pedir ese tipo
              de información.
            </p>

            <h5 className="mt-4">3. Finalidad del tratamiento</h5>
            <p className="text-muted-gr">
              Usamos tus datos exclusivamente para gestionar tu cuenta, tu membresía y tus compras, y para
              contactarte por soporte. No compartimos tus datos con terceros con fines comerciales.
            </p>

            <h5 className="mt-4">4. Consentimiento</h5>
            <p className="text-muted-gr">
              Al marcar la casilla de autorización en el formulario de registro entregas un consentimiento libre,
              informado y específico para el tratamiento descrito en esta política. Puedes revocarlo en cualquier
              momento escribiéndonos a contacto@gymratstore.cl.
            </p>

            <h5 className="mt-4">5. Tus derechos (ARCO+)</h5>
            <p className="text-muted-gr">
              Puedes solicitar acceso, rectificación, supresión, oposición, portabilidad o bloqueo temporal de tus
              datos personales en cualquier momento, escribiéndonos a contacto@gymratstore.cl. Responderemos dentro
              de los plazos que establece la ley.
            </p>

            <h5 className="mt-4">6. Seguridad</h5>
            <p className="text-muted-gr">
              Aplicamos el principio de minimización: solo pedimos los datos estrictamente necesarios para operar
              el servicio, y trabajamos para proteger tu información con medidas técnicas y organizativas
              razonables.
            </p>

            <h5 className="mt-4">7. Contacto</h5>
            <p className="text-muted-gr mb-0">Si tienes dudas sobre esta política, escríbenos a contacto@gymratstore.cl.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
