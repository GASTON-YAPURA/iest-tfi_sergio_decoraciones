"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { urlFoto } from "../lib/fotos";
import { obtenerNombreServicio } from "../lib/servicios";

export default function VisorFoto({ trabajo, onCerrar }) {
  const fotos = trabajo.fotos ?? [];
  const total = fotos.length;
  const [indice, setIndice] = useState(0);
  const contenedor = useRef(null);
  const botonCerrar = useRef(null);
  const fotoActual = fotos[indice];

  const anterior = useCallback(() => {
    setIndice((actual) => (actual - 1 + total) % total);
  }, [total]);

  const siguiente = useCallback(() => {
    setIndice((actual) => (actual + 1) % total);
  }, [total]);

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const desbordeAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    botonCerrar.current?.focus();

    function manejarTecla(evento) {
      if (evento.key === "Escape") {
        onCerrar();
        return;
      }

      if (total > 1 && evento.key === "ArrowLeft") {
        evento.preventDefault();
        anterior();
        return;
      }

      if (total > 1 && evento.key === "ArrowRight") {
        evento.preventDefault();
        siguiente();
        return;
      }

      if (evento.key === "Tab") {
        const enfocables = contenedor.current?.querySelectorAll(
          "button, a[href]"
        );

        if (!enfocables || enfocables.length === 0) {
          return;
        }

        const primero = enfocables[0];
        const ultimo = enfocables[enfocables.length - 1];

        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primero.focus();
        }
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
  }, [anterior, siguiente, onCerrar, total]);

  return (
    <div className="visor" onClick={onCerrar}>
      <div
        className="visor-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visor-titulo"
        ref={contenedor}
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
          {fotoActual ? (
            <Image
              key={fotoActual.id}
              src={urlFoto(trabajo.id, fotoActual.id)}
              alt={fotoActual.texto_alt}
              width={fotoActual.ancho}
              height={fotoActual.alto}
              sizes="(min-width: 900px) 900px, 100vw"
            />
          ) : (
            <p>Este trabajo todavía no tiene fotos.</p>
          )}

          {total > 1 ? (
            <>
              <button
                type="button"
                className="visor-flecha visor-flecha-izquierda"
                onClick={anterior}
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="visor-flecha visor-flecha-derecha"
                onClick={siguiente}
                aria-label="Foto siguiente"
              >
                ›
              </button>
            </>
          ) : null}
        </div>

        <div className="visor-datos">
          <p className="tarjeta-servicio">
            {obtenerNombreServicio(trabajo.servicio, trabajo.servicio_nombre)}
          </p>
          <h2 id="visor-titulo">{trabajo.titulo}</h2>
          {trabajo.descripcion ? <p>{trabajo.descripcion}</p> : null}
          {total > 1 ? (
            <p className="visor-contador" aria-live="polite">
              Foto {indice + 1} de {total}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
