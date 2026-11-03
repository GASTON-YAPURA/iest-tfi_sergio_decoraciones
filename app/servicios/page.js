import BotonLlamar from "../../components/BotonLlamar";
import BotonWhatsApp from "../../components/BotonWhatsApp";
import { SERVICIOS } from "../../lib/servicios";
import { listarServiciosAdicionales } from "../../lib/servicios-adicionales";
import { IMAGEN_COMPARTIDA } from "../../lib/sitio";

export const metadata = {
  title: "Servicios | Sergio Decoraciones",
  description:
    "Durlock, pintura, enduido, empapelado, alfombra, machimbre y molduras para interiores y exteriores. Consultá por WhatsApp.",
  alternates: {
    canonical: "/servicios",
  },
  openGraph: {
    title: "Servicios | Sergio Decoraciones",
    description:
      "Durlock, pintura, enduido, empapelado, alfombra, machimbre y molduras para interiores y exteriores. Consultá por WhatsApp.",
    url: "/servicios",
    images: [IMAGEN_COMPARTIDA],
  },
};

export const dynamic = "force-dynamic";

export default async function PaginaServicios() {
  const serviciosAdicionales = await listarServiciosAdicionales();

  return (
    <>
      <section className="portada portada-interior">
        <div className="contenedor">
          <p className="portada-etiqueta">Servicios</p>
          <h1>Decoración y terminaciones para cada ambiente</h1>
          <p className="portada-bajada">
            Durlock, pintura, enduido, empapelado, alfombra, machimbre y
            molduras para interiores y exteriores.
          </p>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <ul className="lista-servicios">
            {SERVICIOS.map((servicio, indice) => (
              <li className="servicio-bloque" key={servicio.id}>
                <span className="servicio-numero">
                  {String(indice + 1).padStart(2, "0")}
                </span>

                <div className="servicio-contenido">
                  <h2>{servicio.nombre}</h2>
                  <p className="servicio-detalle">{servicio.detalle}</p>
                  <p>{servicio.descripcion}</p>

                  <ul className="servicio-incluye">
                    {servicio.incluye.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            {serviciosAdicionales.map((servicio, indice) => (
              <li className="servicio-bloque" key={servicio.id}>
                <span className="servicio-numero">
                  {String(SERVICIOS.length + indice + 1).padStart(2, "0")}
                </span>

                <div className="servicio-contenido">
                  <h2>{servicio.nombre}</h2>
                  {servicio.detalle ? (
                    <p className="servicio-detalle">{servicio.detalle}</p>
                  ) : null}
                  {servicio.descripcion ? <p>{servicio.descripcion}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion seccion-llamada">
        <div className="contenedor llamada-contenido">
          <h2>¿Querés renovar un ambiente?</h2>
          <p>
            Contanos qué trabajo necesitás y te respondemos por WhatsApp o por
            teléfono.
          </p>
          <div className="llamada-acciones">
            <BotonWhatsApp />
            <BotonLlamar />
          </div>
        </div>
      </section>
    </>
  );
}
