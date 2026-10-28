"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { obtenerNombreServicio } from "../lib/servicios";

export default function VisorFoto({ trabajo, onCerrar }) {
  const botonCerrar = useRef(null);

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const desbordeAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();

    function manejarTecla(evento) {
      if (evento.key === "Escape") {
        onCerrar();
      }

      if (evento.key === "Tab") {
        evento.preventDefault();
        botonCerrar.current?.focus();
      }
    }

    document.addEventListener("keydown", manejarTecla);

    return () => {
      document.removeEventListener("keydown", manejarTecla);
      document.body.style.overflow = desbordeAnterior;

      if (elementoAnterior instanceof HTMLElement) {
        elementoAnterior.focus();
      }
    };
  }, [onCerrar]);

  return (
    <div className="visor" onClick={onCerrar}>
      <div
        className="visor-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visor-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <button
          type="button"
          ref={botonCerrar}
          className="visor-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar la foto"
        >
          ×
        </button>

        <div className="visor-foto">
          <Image
            src={trabajo.foto}
            alt={trabajo.texto_alt}
            width={1200}
            height={800}
            sizes="(min-width: 900px) 900px, 100vw"
          />
        </div>

        <div className="visor-datos">
          <p className="tarjeta-servicio">
            {obtenerNombreServicio(trabajo.servicio)}
          </p>
          <h2 id="visor-titulo">{trabajo.titulo}</h2>
          {trabajo.descripcion ? <p>{trabajo.descripcion}</p> : null}
        </div>
      </div>
    </div>
  );
}
