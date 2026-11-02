"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormularioTrabajo from "./FormularioTrabajo";
import { urlFoto } from "../lib/fotos";
import { obtenerNombreServicio } from "../lib/servicios";

async function leerRespuesta(respuesta) {
  try {
    return await respuesta.json();
  } catch {
    return {};
  }
}

function textoFotos(cantidad) {
  return cantidad === 1 ? "1 foto" : `${cantidad} fotos`;
}

export default function PanelTrabajos({ trabajosIniciales }) {
  const router = useRouter();
  const [trabajos, setTrabajos] = useState(trabajosIniciales);
  const [modo, setModo] = useState("lista");
  const [editando, setEditando] = useState(null);
  const [procesando, setProcesando] = useState(null);
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  async function recargar() {
    try {
      const respuesta = await fetch("/api/admin/trabajos");

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        setError(resultado.error ?? "No pudimos actualizar la lista.");
        return;
      }

      setTrabajos(resultado.trabajos);
    } catch {
      setError("No pudimos actualizar la lista. Revisá tu conexión.");
    }
  }

  async function cambiarVisibilidad(trabajo) {
    setProcesando(trabajo.id);
    setAviso("");
    setError("");

    try {
      const respuesta = await fetch("/api/admin/trabajos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: trabajo.id,
          titulo: trabajo.titulo,
          servicio: trabajo.servicio,
          descripcion: trabajo.descripcion,
          visible: !trabajo.visible,
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

      setAviso(
        trabajo.visible
          ? `El trabajo "${trabajo.titulo}" quedó oculto en el sitio.`
          : `El trabajo "${trabajo.titulo}" vuelve a verse en el sitio.`
      );
      await recargar();
    } catch {
      setError("No pudimos cambiar la visibilidad. Revisá tu conexión.");
    } finally {
      setProcesando(null);
    }
  }

  async function borrar(trabajo) {
    const confirmado = window.confirm(
      `¿Borrar el trabajo "${trabajo.titulo}"? También se borran sus fotos (${textoFotos(
        trabajo.fotos.length
      )}) y no se puede recuperar.`
    );

    if (!confirmado) {
      return;
    }

    setProcesando(trabajo.id);
    setAviso("");
    setError("");

    try {
      const respuesta = await fetch("/api/admin/trabajos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trabajo.id }),
      });

      if (respuesta.status === 401) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        setError(resultado.error ?? "No pudimos borrar el trabajo.");
        return;
      }

      setAviso(`El trabajo "${trabajo.titulo}" se borró para siempre.`);
      await recargar();
    } catch {
      setError("No pudimos borrar el trabajo. Revisá tu conexión.");
    } finally {
      setProcesando(null);
    }
  }

  function abrirNuevo() {
    setAviso("");
    setError("");
    setEditando(null);
    setModo("nuevo");
  }

  function abrirEdicion(trabajo) {
    setAviso("");
    setError("");
    setEditando(trabajo);
    setModo("editar");
  }

  async function terminar(mensaje) {
    setModo("lista");
    setEditando(null);
    setAviso(mensaje);
    await recargar();
  }

  function cancelar() {
    setModo("lista");
    setEditando(null);
    recargar();
  }

  if (modo !== "lista") {
    return (
      <FormularioTrabajo
        key={editando?.id ?? "nuevo"}
        trabajo={editando}
        onGuardado={terminar}
        onCancelar={cancelar}
      />
    );
  }

  return (
    <div className="panel-trabajos">
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

      <div className="panel-trabajos-barra">
        <p className="admin-contador">
          {trabajos.length === 1 ? "1 trabajo" : `${trabajos.length} trabajos`}
        </p>
        <button type="button" className="boton-principal" onClick={abrirNuevo}>
          Agregar trabajo
        </button>
      </div>

      {trabajos.length === 0 ? (
        <p className="admin-vacio">
          Todavía no hay trabajos cargados. Agregá el primero con una o varias
          fotos.
        </p>
      ) : (
        <div className="trabajos-lista">
          {trabajos.map((trabajo) => {
            const portada = trabajo.fotos?.[0];
            const ocupado = procesando === trabajo.id;

            return (
              <article className="trabajo-fila" key={trabajo.id}>
                <div className="trabajo-miniatura">
                  {portada ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={urlFoto(trabajo.id, portada.id)}
                      alt={portada.texto_alt}
                      width={120}
                      height={90}
                      loading="lazy"
                    />
                  ) : (
                    <span className="trabajo-sin-foto">Sin foto</span>
                  )}
                </div>

                <div className="trabajo-datos">
                  <p className="trabajo-servicio">
                    {obtenerNombreServicio(trabajo.servicio)}
                  </p>
                  <h2>{trabajo.titulo}</h2>
                  <p className="trabajo-meta">
                    {textoFotos(trabajo.fotos.length)} ·{" "}
                    <span
                      className={
                        trabajo.visible
                          ? "estado-trabajo estado-visible"
                          : "estado-trabajo estado-oculto"
                      }
                    >
                      {trabajo.visible ? "Visible" : "Oculto"}
                    </span>
                  </p>
                </div>

                <div className="trabajo-acciones">
                  <button
                    type="button"
                    className="boton-secundario boton-chico"
                    onClick={() => abrirEdicion(trabajo)}
                    disabled={ocupado}
                    aria-label={`Editar el trabajo ${trabajo.titulo}`}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="boton-secundario boton-chico"
                    onClick={() => cambiarVisibilidad(trabajo)}
                    disabled={ocupado}
                    aria-label={
                      trabajo.visible
                        ? `Ocultar el trabajo ${trabajo.titulo}`
                        : `Mostrar el trabajo ${trabajo.titulo}`
                    }
                  >
                    {ocupado
                      ? "Guardando..."
                      : trabajo.visible
                        ? "Ocultar"
                        : "Mostrar"}
                  </button>

                  <button
                    type="button"
                    className="boton-peligro boton-chico"
                    onClick={() => borrar(trabajo)}
                    disabled={ocupado}
                    aria-label={`Borrar el trabajo ${trabajo.titulo}`}
                  >
                    Borrar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
