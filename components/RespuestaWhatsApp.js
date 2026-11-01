"use client";

import { useEffect, useId, useRef, useState } from "react";
import { crearEnlaceWhatsAppConNumero } from "../lib/contacto";

export default function RespuestaWhatsApp({ consulta, onCerrar }) {
  const tituloId = useId();
  const campoMensaje = useRef(null);
  const cerrarActual = useRef(onCerrar);
  const [mensaje, setMensaje] = useState(
    `Hola ${consulta.nombre}, le escribimos de Sergio Decoraciones por su consulta.`
  );

  cerrarActual.current = onCerrar;

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const desbordeAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    if (campoMensaje.current) {
      campoMensaje.current.focus();
      const fin = campoMensaje.current.value.length;
      campoMensaje.current.setSelectionRange(fin, fin);
    }

    function manejarTecla(evento) {
      if (evento.key === "Escape") {
        cerrarActual.current();
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
  }, []);

  const texto = mensaje.trim();
  const enlaceWhatsApp = crearEnlaceWhatsAppConNumero(
    consulta.telefono,
    texto ||
      `Hola ${consulta.nombre}, le escribimos de Sergio Decoraciones por su consulta.`
  );

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className="modal-caja"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        onClick={(evento) => evento.stopPropagation()}
      >
        <button
          type="button"
          className="visor-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar el cuadro de respuesta"
        >
          ×
        </button>

        <h2 id={tituloId}>Responder a {consulta.nombre}</h2>
        <p className="modal-bajada">
          Podés cambiar el mensaje antes de abrir WhatsApp. El teléfono de la
          consulta ya está cargado.
        </p>

        <div className="campo">
          <label htmlFor={`${tituloId}-mensaje`}>Mensaje para WhatsApp</label>
          <textarea
            id={`${tituloId}-mensaje`}
            ref={campoMensaje}
            value={mensaje}
            onChange={(evento) => setMensaje(evento.target.value)}
            rows={5}
          />
        </div>

        <div className="modal-acciones">
          <a
            className="boton-principal"
            href={enlaceWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir WhatsApp
          </a>
          <button
            type="button"
            className="boton-secundario"
            onClick={onCerrar}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
