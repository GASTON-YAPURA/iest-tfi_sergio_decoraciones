import GaleriaTrabajos from "../../components/GaleriaTrabajos";
import { obtenerTrabajos } from "../../lib/trabajos";

export const metadata = {
  title: "Trabajos terminados | Sergio Decoraciones",
  description:
    "Mirá trabajos de pintura, durlock, enduido, machimbre y molduras realizados por Sergio Decoraciones en Tinogasta.",
};

export const revalidate = 3600;

export default async function PaginaTrabajos() {
  const trabajos = await obtenerTrabajos();

  return (
    <>
      <section className="portada portada-interior">
        <div className="contenedor">
          <p className="portada-etiqueta">Trabajos</p>
          <h1>Trabajos terminados</h1>
          <p className="portada-bajada">
            Pintura, durlock, enduido, empapelado, machimbre y molduras en
            Tinogasta, Catamarca. Tocá una foto para verla en grande.
          </p>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          {trabajos.length > 0 ? (
            <GaleriaTrabajos trabajos={trabajos} />
          ) : (
            <p>Todavía no hay trabajos publicados.</p>
          )}
        </div>
      </section>
    </>
  );
}
