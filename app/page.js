import Link from "next/link";
import TarjetaTrabajo from "../components/TarjetaTrabajo";
import { SERVICIOS } from "../lib/servicios";
import { obtenerTrabajosDestacados } from "../lib/trabajos";

// Los trabajos se cargan en la base; el inicio se refresca cada hora.
export const revalidate = 3600;

export default async function PaginaInicio() {
  const trabajos = await obtenerTrabajosDestacados(3);

  return (
    <>
      <section className="portada">
        <div className="contenedor portada-contenido">
          <div className="portada-texto">
            <p className="portada-etiqueta">Tinogasta, Catamarca</p>
            <h1>Decoraciones que transforman tus espacios</h1>
            <p className="portada-bajada">
              Pintura, durlock, empapelado y más, con detalle y buen oficio.
            </p>
            <div className="portada-acciones">
              <Link className="boton-principal" href="/trabajos">
                Ver trabajos
              </Link>
            </div>
          </div>

          <div className="portada-decoracion" aria-hidden="true">
            <span className="portada-circulo portada-circulo-grande" />
            <span className="portada-circulo portada-circulo-chico" />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="seccion-encabezado">
            <h2>Trabajos destacados</h2>
            <Link className="enlace-seccion" href="/trabajos">
              Ver todos los trabajos
            </Link>
          </div>

          {trabajos.length > 0 ? (
            <ul className="grilla-trabajos">
              {trabajos.map((trabajo) => (
                <li key={trabajo.id}>
                  <TarjetaTrabajo trabajo={trabajo} />
                </li>
              ))}
            </ul>
          ) : (
            <p>Todavía no hay trabajos publicados.</p>
          )}
        </div>
      </section>

      <section className="seccion seccion-suave">
        <div className="contenedor">
          <div className="seccion-encabezado">
            <h2>Servicios</h2>
            <Link className="enlace-seccion" href="/servicios">
              Ver todos los servicios
            </Link>
          </div>

          <ul className="grilla-servicios">
            {SERVICIOS.map((servicio, indice) => (
              <li className="servicio-resumen" key={servicio.id}>
                <span className="servicio-numero">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <h3>{servicio.nombre}</h3>
                <p>{servicio.detalle}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
