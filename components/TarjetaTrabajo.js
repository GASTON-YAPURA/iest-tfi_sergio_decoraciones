import Image from "next/image";
import { obtenerNombreServicio } from "../lib/servicios";

export default function TarjetaTrabajo({ trabajo, onAbrir }) {
  const foto = (
    <Image
      src={trabajo.foto}
      alt={trabajo.texto_alt}
      width={1200}
      height={800}
      sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
    />
  );

  return (
    <article className="tarjeta-trabajo">
      {onAbrir ? (
        <button
          type="button"
          className="tarjeta-foto"
          onClick={onAbrir}
          aria-label={`Ver ${trabajo.titulo} en grande`}
          aria-haspopup="dialog"
        >
          {foto}
        </button>
      ) : (
        <div className="tarjeta-foto">{foto}</div>
      )}

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
