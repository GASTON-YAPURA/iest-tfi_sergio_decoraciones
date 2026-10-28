"use client";

import { useState } from "react";
import { LIMITES, validarConsulta } from "../lib/validacion";

const VALORES_INICIALES = { nombre: "", telefono: "", mensaje: "" };

export default function FormularioConsulta() {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("inicial");
  const [mensajeError, setMensajeError] = useState("");

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setValores((anteriores) => ({ ...anteriores, [name]: value }));
    setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));

    if (estado === "error") {
      setEstado("inicial");
      setMensajeError("");
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const revision = validarConsulta(valores);

    if (!revision.valido) {
      setErrores(revision.errores);
      setMensajeError(
        "Revisá los datos marcados y volvé a enviar la consulta."
      );
      setEstado("error");
      return;
    }

    setEstado("enviando");
    setErrores({});
    setMensajeError("");

    try {
      const respuesta = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(revision.datos),
      });

      let resultado = {};

      try {
        resultado = await respuesta.json();
      } catch {
        resultado = {};
      }

      if (!respuesta.ok) {
        setErrores(resultado.errores ?? {});
        setMensajeError(
          resultado.error ??
            "No pudimos enviar la consulta. Probá de nuevo en unos minutos."
        );
        setEstado("error");
        return;
      }

      setValores(VALORES_INICIALES);
      setEstado("exito");
    } catch {
      setMensajeError(
        "No pudimos enviar la consulta. Revisá tu conexión y probá de nuevo."
      );
      setEstado("error");
    }
  }

  if (estado === "exito") {
    return (
      <div className="formulario-consulta formulario-exito" role="status">
        <h2>¡Gracias por escribirnos!</h2>
        <p>
          Recibimos tu consulta. Sergio te va a responder por teléfono o
          WhatsApp a la brevedad.
        </p>
        <button
          type="button"
          className="boton-secundario"
          onClick={() => setEstado("inicial")}
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form
      className="formulario-consulta"
      onSubmit={manejarEnvio}
      noValidate
      aria-busy={estado === "enviando"}
    >
      {mensajeError ? (
        <p className="formulario-error" role="alert">
          {mensajeError}
        </p>
      ) : null}

      <div className="campo">
        <label htmlFor="consulta-nombre">Nombre</label>
        <input
          id="consulta-nombre"
          name="nombre"
          type="text"
          value={valores.nombre}
          onChange={manejarCambio}
          maxLength={LIMITES.nombre}
          autoComplete="name"
          aria-invalid={errores.nombre ? "true" : undefined}
          aria-describedby={
            errores.nombre ? "consulta-nombre-error" : undefined
          }
        />
        {errores.nombre ? (
          <p className="campo-error" id="consulta-nombre-error">
            {errores.nombre}
          </p>
        ) : null}
      </div>

      <div className="campo">
        <label htmlFor="consulta-telefono">Teléfono</label>
        <input
          id="consulta-telefono"
          name="telefono"
          type="tel"
          value={valores.telefono}
          onChange={manejarCambio}
          maxLength={LIMITES.telefono}
          autoComplete="tel"
          placeholder="+54 9 3837 000000"
          aria-invalid={errores.telefono ? "true" : undefined}
          aria-describedby={
            errores.telefono
              ? "consulta-telefono-ayuda consulta-telefono-error"
              : "consulta-telefono-ayuda"
          }
        />
        <p className="campo-ayuda" id="consulta-telefono-ayuda">
          Con código de área, para poder llamarte o escribirte.
        </p>
        {errores.telefono ? (
          <p className="campo-error" id="consulta-telefono-error">
            {errores.telefono}
          </p>
        ) : null}
      </div>

      <div className="campo">
        <label htmlFor="consulta-mensaje">Mensaje</label>
        <textarea
          id="consulta-mensaje"
          name="mensaje"
          rows={5}
          value={valores.mensaje}
          onChange={manejarCambio}
          maxLength={LIMITES.mensaje}
          aria-invalid={errores.mensaje ? "true" : undefined}
          aria-describedby={
            errores.mensaje
              ? "consulta-mensaje-ayuda consulta-mensaje-error"
              : "consulta-mensaje-ayuda"
          }
        />
        <p className="campo-ayuda" id="consulta-mensaje-ayuda">
          Contanos qué ambiente querés renovar y qué trabajo necesitás.
        </p>
        {errores.mensaje ? (
          <p className="campo-error" id="consulta-mensaje-error">
            {errores.mensaje}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="boton-principal"
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? "Enviando..." : "Enviar consulta"}
      </button>

      <p className="formulario-aviso">
        Usamos tu nombre y tu teléfono solo para responder esta consulta. No los
        compartimos con nadie.
      </p>
    </form>
  );
}
