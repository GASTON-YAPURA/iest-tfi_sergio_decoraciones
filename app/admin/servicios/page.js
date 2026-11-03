import NavegacionPanel from "../../../components/NavegacionPanel";
import PanelServicios from "../../../components/PanelServicios";
import { exigirSesion } from "../../../lib/sesion";
import { listarServiciosAdicionales } from "../../../lib/servicios-adicionales";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Servicios | Sergio Decoraciones",
};

export default async function PaginaServiciosPanel() {
  await exigirSesion();

  let servicios = [];
  let errorBase = false;

  try {
    servicios = await listarServiciosAdicionales();
  } catch (error) {
    errorBase = true;
    console.error("No se pudieron cargar los servicios del panel", error);
  }

  return (
    <section className="seccion admin-seccion">
      <div className="contenedor">
        <div className="admin-encabezado">
          <div>
            <p className="portada-etiqueta">Panel privado</p>
            <h1>Servicios del sitio</h1>
            <p className="admin-bajada">
              Administrá las fichas de servicios por separado de los trabajos.
            </p>
          </div>

          <div className="admin-encabezado-acciones">
            <NavegacionPanel actual="servicios" />
            <form action="/api/admin/salir" method="post">
              <button type="submit" className="boton-secundario">
                Salir
              </button>
            </form>
          </div>
        </div>

        {errorBase ? (
          <p className="formulario-error" role="alert">
            No pudimos cargar los servicios. Recargá la página y probá de
            nuevo.
          </p>
        ) : (
          <PanelServicios serviciosIniciales={servicios} />
        )}
      </div>
    </section>
  );
}
