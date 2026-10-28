"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormularioIngreso() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
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
        <input
          id="admin-clave"
          name="clave"
          type="password"
          value={clave}
          onChange={(evento) => setClave(evento.target.value)}
          autoComplete="current-password"
          required
        />
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
