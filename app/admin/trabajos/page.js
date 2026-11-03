import NavegacionPanel from "../../../components/NavegacionPanel";
import PanelTrabajos from "../../../components/PanelTrabajos";
import { exigirSesion } from "../../../lib/sesion";
import { listarServiciosAdicionales } from "../../../lib/servicios-adicionales";
import { listarTrabajosPanel } from "../../../lib/trabajos";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trabajos | Sergio Decoraciones",
};

export default async function PaginaTrabajosPanel() {
  await exigirSesion();

  let trabajos = [];
  let serviciosAdicionales = [];
  let errorBase = false;

  try {
    [trabajos, serviciosAdicionales] = await Promise.all([
      listarTrabajosPanel(),
      listarServiciosAdicionales(),
    ]);
  } catch (error) {
    errorBase = true;
    console.error("No se pudieron cargar los trabajos del panel", error);
  }

  return (
    <section className="seccion admin-seccion">
      <div className="contenedor">
        <div className="admin-encabezado">
          <div>
            <p className="portada-etiqueta">Panel privado</p>
            <h1>Trabajos del sitio</h1>
            <p className="admin-bajada">
              Agregá, corregí y ordená los trabajos que se ven en la galería.
              Los más nuevos aparecen primero.
            </p>
          </div>

          <div className="admin-encabezado-acciones">
            <NavegacionPanel actual="trabajos" />
            <form action="/api/admin/salir" method="post">
              <button type="submit" className="boton-secundario">
                Salir
              </button>
            </form>
          </div>
        </div>

        {errorBase ? (
          <p className="formulario-error" role="alert">
            No pudimos cargar los trabajos. Recargá la página y probá de nuevo.
          </p>
        ) : (
          <PanelTrabajos
            trabajosIniciales={trabajos}
            serviciosAdicionalesIniciales={serviciosAdicionales}
          />
        )}
      </div>
    </section>
  );
}
