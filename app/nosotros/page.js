import Image from "next/image";
import BotonLlamar from "../../components/BotonLlamar";
import BotonWhatsApp from "../../components/BotonWhatsApp";

export const metadata = {
  title: "Nosotros | Sergio Decoraciones",
  description:
    "Conocé a Sergio y cómo trabaja: prolijidad, detalle y buen oficio en cada ambiente.",
};

export default function PaginaNosotros() {
  return (
    <>
      <section className="portada portada-interior">
        <div className="contenedor">
          <p className="portada-etiqueta">Nosotros</p>
          <h1>El oficio de Sergio, en cada ambiente</h1>
          <p className="portada-bajada">
            Prolijidad, detalle y buen oficio para renovar tu casa o tu negocio
            en Tinogasta, Catamarca.
          </p>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor nosotros-contenido">
          <div className="nosotros-texto">
            <h2>Quién es Sergio</h2>
            <p>
              Sergio se dedica a la decoración y a las terminaciones de
              interiores y exteriores. Trabaja en Tinogasta, Catamarca, y en la
              zona, siempre con el mismo cuidado: escuchar qué necesita cada
              persona y dejar el ambiente listo para usar.
            </p>
            <p>
              Hace durlock, pintura, enduido, empapelado, alfombra, machimbre y
              molduras. Cuando el trabajo lo pide, combina varios de esos
              oficios para que el resultado se vea parejo de punta a punta.
            </p>

            <h2>Cómo trabaja</h2>
            <ul className="nosotros-lista">
              <li>
                <strong>Escucha primero.</strong> Cada ambiente y cada persona
                son distintos, así que la charla inicial es para entender qué
                querés lograr y qué hace falta.
              </li>
              <li>
                <strong>Cuida los detalles.</strong> La preparación de la
                superficie, los encuentros y las terminaciones reciben la misma
                atención que el trabajo principal.
              </li>
              <li>
                <strong>Deja todo prolijo.</strong> Protege lo que hay que
                cuidar y ordena el lugar al terminar cada jornada.
              </li>
              <li>
                <strong>Responde directo.</strong> Las consultas se contestan por
                WhatsApp, por teléfono o por el formulario del sitio, sin
                vueltas.
              </li>
            </ul>
          </div>

          <div className="nosotros-foto">
            <Image
              src="/img/trabajos/living-empapelado.jpg"
              alt="Living con una pared empapelada y molduras blancas"
              width={1200}
              height={800}
              sizes="(min-width: 900px) 45vw, 100vw"
            />
            <p className="nosotros-epigrafe">
              Un living terminado con empapelado y molduras.
            </p>
          </div>
        </div>
      </section>

      <section className="seccion seccion-suave">
        <div className="contenedor">
          <h2>Del primer mensaje al trabajo terminado</h2>
          <ol className="nosotros-pasos">
            <li>
              <span className="servicio-numero">01</span>
              <h3>Nos contás qué necesitás</h3>
              <p>
                Escribinos por WhatsApp, llamanos o dejá tu consulta en el
                formulario. Contanos qué ambiente querés renovar y qué tenés en
                mente.
              </p>
            </li>
            <li>
              <span className="servicio-numero">02</span>
              <h3>Coordinamos la visita</h3>
              <p>
                Sergio revisa el espacio, toma las medidas y define con vos cómo
                encarar el trabajo.
              </p>
            </li>
            <li>
              <span className="servicio-numero">03</span>
              <h3>Manos a la obra</h3>
              <p>
                Se realiza el trabajo con los materiales y las terminaciones
                acordadas, cuidando el orden y la limpieza del lugar.
              </p>
            </li>
          </ol>
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
