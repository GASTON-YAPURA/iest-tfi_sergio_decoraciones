import BotonLlamar from "../../components/BotonLlamar";
import BotonWhatsApp from "../../components/BotonWhatsApp";
import FormularioConsulta from "../../components/FormularioConsulta";
import { NUMERO_TELEFONO } from "../../lib/contacto";

export const metadata = {
  title: "Contacto | Sergio Decoraciones",
  description:
    "Escribinos por WhatsApp, llamanos o dejá tu consulta para un trabajo de decoración en Tinogasta.",
};

export default function PaginaContacto() {
  return (
    <>
      <section className="portada portada-interior">
        <div className="contenedor">
          <p className="portada-etiqueta">Contacto</p>
          <h1>Hablemos de tu próximo trabajo</h1>
          <p className="portada-bajada">
            Elegí el canal que te resulte más cómodo. Respondemos consultas de
            Tinogasta, Catamarca y la zona.
          </p>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor contacto-contenido">
          <div className="contacto-datos">
            <h2>Contacto directo</h2>
            <p>
              La forma más rápida es WhatsApp: el mensaje ya viene preparado y
              solo tenés que contar qué necesitás. También podés llamar por
              teléfono.
            </p>

            <div className="contacto-acciones">
              <BotonWhatsApp />
              <BotonLlamar />
            </div>

            <div className="contacto-info">
              <h3>WhatsApp</h3>
              <p>Escribinos y contanos qué ambiente querés renovar.</p>

              <h3>Teléfono</h3>
              <p>{NUMERO_TELEFONO}</p>

              <h3>Zona de trabajo</h3>
              <p>Tinogasta, Catamarca y alrededores.</p>
            </div>
          </div>

          <div className="contacto-formulario">
            <h2>Dejanos tu consulta</h2>
            <p>
              Si preferís escribir con más detalle, completá el formulario y
              Sergio te responde a la brevedad.
            </p>
            <FormularioConsulta />
          </div>
        </div>
      </section>
    </>
  );
}
