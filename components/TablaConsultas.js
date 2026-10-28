"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { crearEnlaceWhatsAppConNumero } from "../lib/contacto";

export default function TablaConsultas({ consultasIniciales }) {
  const router = useRouter();
  const [consultas, setConsultas] = useState(consultasIniciales);
  const [marcando, setMarcando] = useState(null);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  async function marcarAtendida(consulta) {
    setMarcando(consulta.id);
    setAviso("");
    setError("");

    try {
      const respuesta = await fetch("/api/admin/consultas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: consulta.id }),
      });

      let resultado = {};

      try {
        resultado = await respuesta.json();
      } catch {
        resultado = {};
      }

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return;
      }

      if (!respuesta.ok) {
        setError(
          resultado.error ?? "No pudimos marcar la consulta como atendida."
        );
        return;
      }

      setConsultas((anteriores) =>
        anteriores.map((item) =>
          item.id === consulta.id ? { ...item, atendida: true } : item
        )
      );
      setAviso(`La consulta de ${consulta.nombre} quedó marcada como atendida.`);
      router.refresh();
    } catch {
      setError(
        "No pudimos marcar la consulta. Revisá tu conexión y probá de nuevo."
      );
    } finally {
      setMarcando(null);
    }
  }

  if (consultas.length === 0) {
    return <p className="admin-vacio">Todavía no recibiste consultas.</p>;
  }

  return (
    <div className="tabla-consultas-envoltura">
      {aviso ? (
        <p className="admin-aviso" role="status">
          {aviso}
        </p>
      ) : null}

      {error ? (
        <p className="formulario-error" role="alert">
          {error}
        </p>
      ) : null}

      <table className="tabla-consultas">
        <caption className="visualmente-oculto">
          Consultas recibidas, de la más reciente a la más antigua
        </caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Nombre</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Mensaje</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((consulta) => {
            const digitos = consulta.telefono.replace(/\D/g, "");
            const enlaceWhatsApp = crearEnlaceWhatsAppConNumero(
              consulta.telefono,
              `Hola ${consulta.nombre}, le escribimos de Sergio Decoraciones por su consulta.`
            );

            return (
              <tr key={consulta.id}>
                <td data-etiqueta="Fecha">{consulta.fecha_texto}</td>
                <td data-etiqueta="Nombre">{consulta.nombre}</td>
                <td data-etiqueta="Teléfono">
                  <a href={`tel:+${digitos}`}>{consulta.telefono}</a>
                </td>
                <td data-etiqueta="Mensaje" className="consulta-mensaje">
                  {consulta.mensaje}
                </td>
                <td data-etiqueta="Estado">
                  <span
                    className={`estado-consulta ${
                      consulta.atendida
                        ? "estado-atendida"
                        : "estado-pendiente"
                    }`}
                  >
                    {consulta.atendida ? "Atendida" : "Pendiente"}
                  </span>
                </td>
                <td data-etiqueta="Acciones" className="consulta-acciones">
                  <a
                    className="boton-secundario boton-chico"
                    href={enlaceWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Responder por WhatsApp a ${consulta.nombre}`}
                  >
                    Responder por WhatsApp
                  </a>

                  {consulta.atendida ? null : (
                    <button
                      type="button"
                      className="boton-principal boton-chico"
                      onClick={() => marcarAtendida(consulta)}
                      disabled={marcando === consulta.id}
                      aria-label={`Marcar la consulta de ${consulta.nombre} como atendida`}
                    >
                      {marcando === consulta.id
                        ? "Guardando..."
                        : "Marcar como atendida"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
