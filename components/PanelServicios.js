"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SERVICIOS } from "../lib/servicios";
import { revisarServicioAdicional } from "../lib/validacion-trabajos";

async function leerRespuesta(respuesta) {
  try {
    return await respuesta.json();
  } catch {
    return {};
  }
}

export default function PanelServicios({ serviciosIniciales }) {
  const router = useRouter();
  const [servicios, setServicios] = useState(serviciosIniciales);
  const [nombre, setNombre] = useState("");
  const [detalle, setDetalle] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [procesando, setProcesando] = useState(null);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  async function guardar(evento) {
    evento.preventDefault();
    setAviso("");
    setError("");

    const revision = revisarServicioAdicional(
      { nombre, detalle, descripcion },
      servicios.map((servicio) => servicio.nombre)
    );

    if (revision.error) {
      setError(revision.error);
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch("/api/admin/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(revision.datos),
      });

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        setError(resultado.error ?? "No pudimos guardar el servicio.");
        return;
      }

      setServicios((actuales) =>
        [...actuales, resultado.servicio].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es")
        )
      );
      setNombre("");
      setDetalle("");
      setDescripcion("");
      setAviso(`El servicio "${resultado.servicio.nombre}" se agregó.`);
      router.refresh();
    } catch {
      setError("No pudimos guardar el servicio. Revisá tu conexión.");
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarVisibilidad(servicio) {
    setProcesando({ id: servicio.id, accion: "visibilidad" });
    setAviso("");
    setError("");

    try {
      const respuesta = await fetch("/api/admin/servicios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: servicio.id,
          visible: !servicio.visible,
        }),
      });

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        setError(resultado.error ?? "No pudimos cambiar la visibilidad.");
        return;
      }

      setServicios((actuales) =>
        actuales.map((actual) =>
          actual.id === servicio.id ? resultado.servicio : actual
        )
      );
      setAviso(
        resultado.servicio.visible
          ? `El servicio "${servicio.nombre}" vuelve a verse en el sitio.`
          : `El servicio "${servicio.nombre}" quedó oculto en el sitio.`
      );
      router.refresh();
    } catch {
      setError("No pudimos cambiar la visibilidad. Revisá tu conexión.");
    } finally {
      setProcesando(null);
    }
  }

  async function borrar(servicio) {
    const confirmado = window.confirm(
      `¿Borrar el servicio "${servicio.nombre}"? No se puede recuperar. Si está asignado a algún trabajo, primero tendrás que reasignarlo.`
    );

    if (!confirmado) {
      return;
    }

    setProcesando({ id: servicio.id, accion: "borrar" });
    setAviso("");
    setError("");

    try {
      const respuesta = await fetch("/api/admin/servicios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: servicio.id }),
      });

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        setError(resultado.error ?? "No pudimos borrar el servicio.");
        return;
      }

      setServicios((actuales) =>
        actuales.filter((actual) => actual.id !== servicio.id)
      );
      setAviso(`El servicio "${servicio.nombre}" se borró para siempre.`);
      router.refresh();
    } catch {
      setError("No pudimos borrar el servicio. Revisá tu conexión.");
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div className="panel-servicios">
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

      <form className="formulario-trabajo" onSubmit={guardar} noValidate>
        <h2>Agregar un servicio</h2>
        <p className="campo-ayuda">
          El servicio se agrega a esta sección y queda disponible como
          categoría al cargar trabajos. No crea ningún trabajo.
        </p>

        <div className="campo">
          <label htmlFor="servicio-nombre">Nombre</label>
          <input
            id="servicio-nombre"
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            maxLength={80}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="servicio-detalle">Detalle breve</label>
          <input
            id="servicio-detalle"
            type="text"
            value={detalle}
            onChange={(evento) => setDetalle(evento.target.value)}
            maxLength={120}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="servicio-descripcion">Descripción</label>
          <textarea
            id="servicio-descripcion"
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            rows={4}
            maxLength={600}
            required
          />
        </div>

        <button
          type="submit"
          className="boton-principal"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar servicio"}
        </button>
      </form>

      <section className="panel-servicios-listado" aria-labelledby="servicios-listado-titulo">
        <h2 id="servicios-listado-titulo">Servicios disponibles</h2>
        <ul className="lista-servicios">
          {SERVICIOS.map((servicio) => (
            <li className="servicio-bloque" key={servicio.id}>
              <span className="servicio-numero" aria-hidden="true">
                —
              </span>
              <div className="servicio-contenido">
                <h3>{servicio.nombre}</h3>
                <p className="servicio-detalle">{servicio.detalle}</p>
                <p>{servicio.descripcion}</p>
              </div>
            </li>
          ))}
          {servicios.map((servicio) => (
            <li className="servicio-bloque" key={servicio.id}>
              <span className="servicio-numero" aria-hidden="true">
                —
              </span>
              <div className="servicio-contenido">
                <h3>{servicio.nombre}</h3>
                <p className="trabajo-meta">
                  <span
                    className={
                      servicio.visible
                        ? "estado-trabajo estado-visible"
                        : "estado-trabajo estado-oculto"
                    }
                  >
                    {servicio.visible ? "Visible" : "Oculto"}
                  </span>
                </p>
                {servicio.detalle ? (
                  <p className="servicio-detalle">{servicio.detalle}</p>
                ) : null}
                {servicio.descripcion ? <p>{servicio.descripcion}</p> : null}
                <div className="trabajo-acciones">
                  <button
                    type="button"
                    className="boton-secundario boton-chico"
                    onClick={() => cambiarVisibilidad(servicio)}
                    disabled={procesando?.id === servicio.id}
                    aria-label={
                      servicio.visible
                        ? `Ocultar el servicio ${servicio.nombre}`
                        : `Mostrar el servicio ${servicio.nombre}`
                    }
                  >
                    {procesando?.id === servicio.id &&
                    procesando.accion === "visibilidad"
                      ? "Guardando..."
                      : servicio.visible
                        ? "Ocultar"
                        : "Mostrar"}
                  </button>
                  <button
                    type="button"
                    className="boton-peligro boton-chico"
                    onClick={() => borrar(servicio)}
                    disabled={procesando?.id === servicio.id}
                    aria-label={`Borrar el servicio ${servicio.nombre}`}
                  >
                    {procesando?.id === servicio.id &&
                    procesando.accion === "borrar"
                      ? "Borrando..."
                      : "Borrar"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
