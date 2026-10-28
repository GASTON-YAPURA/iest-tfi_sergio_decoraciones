import Image from "next/image";
import { obtenerNombreServicio } from "../lib/servicios";

export default function TarjetaTrabajo({ trabajo }) {
  return (
    <article className="tarjeta-trabajo">
      <div className="tarjeta-foto">
        <Image
          src={trabajo.foto}
          alt={trabajo.texto_alt}
          width={1200}
          height={800}
          sizes="(min-width: 900px) 33vw, 100vw"
        />
      </div>

      <div className="tarjeta-cuerpo">
        <p className="tarjeta-servicio">
          {obtenerNombreServicio(trabajo.servicio)}
        </p>
        <h3>{trabajo.titulo}</h3>
        {trabajo.descripcion ? (
          <p className="tarjeta-descripcion">{trabajo.descripcion}</p>
        ) : null}
      </div>
    </article>
  );
}
