import TablaConsultas from "../../../components/TablaConsultas";
import { obtenerConsultas } from "../../../lib/consultas";
import { formatearFechaConsulta } from "../../../lib/fechas";
import { exigirSesion } from "../../../lib/sesion";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Consultas | Sergio Decoraciones",
};

function escribirResumen(total, pendientes) {
  if (total === 0) {
    return "Todavía no recibiste consultas.";
  }

  if (pendientes === 0) {
    return `No quedan consultas pendientes. Recibiste ${total} en total.`;
  }

  const pendientesTexto =
    pendientes === 1 ? "1 consulta pendiente" : `${pendientes} consultas pendientes`;

  return `${pendientesTexto} de ${total} recibidas.`;
}

export default async function PaginaConsultas() {
  await exigirSesion();

  let consultas = [];
  let errorBase = false;

  try {
    consultas = await obtenerConsultas();
  } catch (error) {
    errorBase = true;
    console.error("No se pudieron cargar las consultas", error);
  }

  const filas = consultas.map((consulta) => ({
    id: consulta.id,
    nombre: consulta.nombre,
    telefono: consulta.telefono,
    mensaje: consulta.mensaje,
    atendida: consulta.atendida,
    fecha_texto: formatearFechaConsulta(consulta.creada_en),
  }));
  const pendientes = filas.filter((consulta) => !consulta.atendida).length;

  return (
    <>
      <section className="seccion admin-seccion">
        <div className="contenedor">
          <div className="admin-encabezado">
            <div>
              <p className="portada-etiqueta">Panel privado</p>
              <h1>Consultas recibidas</h1>
              <p className="admin-bajada">
                Las más recientes aparecen primero. Respondé por WhatsApp o
                llamá, y después marcá la consulta como atendida.
              </p>
            </div>

            <form action="/api/admin/salir" method="post">
              <button type="submit" className="boton-secundario">
                Salir
              </button>
            </form>
          </div>

          {errorBase ? (
            <p className="formulario-error" role="alert">
              No pudimos cargar las consultas. Recargá la página y probá de
              nuevo.
            </p>
          ) : (
            <>
              <p className="admin-resumen">
                {escribirResumen(filas.length, pendientes)}
              </p>
              <TablaConsultas consultasIniciales={filas} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
