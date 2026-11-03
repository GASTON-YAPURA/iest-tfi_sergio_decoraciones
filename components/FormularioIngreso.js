"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormularioIngreso() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [estado, setEstado] = useState("inicial");
  const [error, setError] = useState("");

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setEstado("enviando");
    setError("");

    try {
      const respuesta = await fetch("/api/admin/ingresar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, clave }),
      });

      let resultado = {};

      try {
        resultado = await respuesta.json();
      } catch {
        resultado = {};
      }

      if (!respuesta.ok) {
        setError(resultado.error ?? "Usuario o contraseña incorrectos");
        setClave("");
        setEstado("error");
        return;
      }

      router.push("/admin/consultas");
      router.refresh();
    } catch {
      setError(
        "No pudimos ingresar. Revisá tu conexión y probá de nuevo."
      );
      setEstado("error");
    }
  }

  return (
    <form className="formulario-ingreso" onSubmit={manejarEnvio} noValidate>
      {error ? (
        <p className="formulario-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="campo">
        <label htmlFor="admin-usuario">Usuario</label>
        <input
          id="admin-usuario"
          name="usuario"
          type="text"
          value={usuario}
          onChange={(evento) => setUsuario(evento.target.value)}
          autoComplete="username"
          autoFocus
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="admin-clave">Contraseña</label>
        <div className="campo-clave">
          <input
            id="admin-clave"
            name="clave"
            type={mostrarClave ? "text" : "password"}
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="boton-visibilidad-clave"
            aria-label={
              mostrarClave ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            aria-controls="admin-clave"
            aria-pressed={mostrarClave}
            onClick={() => setMostrarClave(!mostrarClave)}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {mostrarClave ? (
                <>
                  <path d="m3 3 18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a14.8 14.8 0 0 1-3.1 3.8" />
                  <path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.4 0 2.7-.4 3.8-1" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="boton-principal"
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
