"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RespuestaWhatsApp from "./RespuestaWhatsApp";

function estadoDeConsulta(consulta) {
  if (consulta.archivada) {
    return { texto: "Archivada", clase: "estado-archivada" };
  }

  if (consulta.atendida) {
    return { texto: "Atendida", clase: "estado-atendida" };
  }

  return { texto: "Pendiente", clase: "estado-pendiente" };
}

export default function TablaConsultas({ consultas, mensajeVacio }) {
  const router = useRouter();
  const [consultaRespondiendo, setConsultaRespondiendo] = useState(null);
  const [procesando, setProcesando] = useState(null);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  async function enviar(url, opciones) {
    try {
      const respuesta = await fetch(url, opciones);

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return null;
      }

      let resultado = {};

      try {
        resultado = await respuesta.json();
      } catch {
        resultado = {};
      }

      if (!respuesta.ok) {
        setError(resultado.error ?? "No pudimos guardar el cambio.");
        return null;
      }

      return resultado;
    } catch {
      setError("No pudimos guardar el cambio. Revisá tu conexión.");
      return null;
    }
  }

  async function cambiarEstado(consulta, accion, mensaje) {
    setProcesando(consulta.id);
    setAviso("");
    setError("");

    const resultado = await enviar("/api/admin/consultas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: consulta.id, accion }),
    });

    if (resultado) {
      setAviso(mensaje);
      router.refresh();
    }

    setProcesando(null);
  }

  async function borrar(consulta) {
    const confirmado = window.confirm(
      `¿Borrar definitivamente la consulta de ${consulta.nombre}? También se borra el mensaje y no se puede recuperar.`
    );

    if (!confirmado) {
      return;
    }

    setProcesando(consulta.id);
    setAviso("");
    setError("");

    const resultado = await enviar("/api/admin/consultas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: consulta.id }),
    });

    if (resultado) {
      setAviso(`La consulta de ${consulta.nombre} se borró para siempre.`);
      router.refresh();
    }

    setProcesando(null);
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

      {consultas.length === 0 ? (
        <p className="admin-vacio">{mensajeVacio}</p>
      ) : (
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
              const estado = estadoDeConsulta(consulta);
              const ocupada = procesando === consulta.id;

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
                    <span className={`estado-consulta ${estado.clase}`}>
                      {estado.texto}
                    </span>
                  </td>
                  <td data-etiqueta="Acciones" className="consulta-acciones">
                    <button
                      type="button"
                      className="boton-secundario boton-chico"
                      onClick={() => setConsultaRespondiendo(consulta)}
                      aria-label={`Responder por WhatsApp a ${consulta.nombre}`}
                    >
                      Responder
                    </button>

                    {consulta.archivada ? null : (
                      <>
                        {consulta.atendida ? null : (
                          <button
                            type="button"
                            className="boton-principal boton-chico"
                            onClick={() =>
                              cambiarEstado(
                                consulta,
                                "atender",
                                `La consulta de ${consulta.nombre} quedó marcada como atendida.`
                              )
                            }
                            disabled={ocupada}
                            aria-label={`Marcar la consulta de ${consulta.nombre} como atendida`}
                          >
                            {ocupada ? "Guardando..." : "Marcar como atendida"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="boton-secundario boton-chico"
                          onClick={() =>
                            cambiarEstado(
                              consulta,
                              "archivar",
                              `La consulta de ${consulta.nombre} quedó archivada.`
                            )
                          }
                          disabled={ocupada}
                          aria-label={`Archivar la consulta de ${consulta.nombre}`}
                        >
                          Archivar
                        </button>
                      </>
                    )}

                    {consulta.archivada ? (
                      <>
                        <button
                          type="button"
                          className="boton-secundario boton-chico"
                          onClick={() =>
                            cambiarEstado(
                              consulta,
                              "restaurar",
                              `La consulta de ${consulta.nombre} volvió a la lista.`
                            )
                          }
                          disabled={ocupada}
                          aria-label={`Restaurar la consulta de ${consulta.nombre}`}
                        >
                          Restaurar
                        </button>

                        <button
                          type="button"
                          className="boton-peligro boton-chico"
                          onClick={() => borrar(consulta)}
                          disabled={ocupada}
                          aria-label={`Borrar definitivamente la consulta de ${consulta.nombre}`}
                        >
                          {ocupada ? "Borrando..." : "Borrar"}
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {consultaRespondiendo ? (
        <RespuestaWhatsApp
          consulta={consultaRespondiendo}
          onCerrar={() => setConsultaRespondiendo(null)}
        />
      ) : null}
    </div>
  );
}
