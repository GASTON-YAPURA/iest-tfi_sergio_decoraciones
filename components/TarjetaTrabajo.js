import Image from "next/image";
import { urlFoto } from "../lib/fotos";
import { obtenerNombreServicio } from "../lib/servicios";

export default function TarjetaTrabajo({ trabajo, onAbrir, prioridad = false }) {
  const portada = trabajo.fotos?.[0];

  const foto = portada ? (
    <Image
      src={urlFoto(trabajo.id, portada.id)}
      alt={portada.texto_alt}
      width={portada.ancho}
      height={portada.alto}
      sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
      priority={prioridad}
    />
  ) : (
    <span className="tarjeta-sin-foto">Foto en preparación</span>
  );

  return (
    <article className="tarjeta-trabajo">
      {onAbrir && portada ? (
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
