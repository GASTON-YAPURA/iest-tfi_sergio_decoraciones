"use client";

import { useEffect, useRef, useState } from "react";
import { comprimirImagen, nombreParaTextoAlt } from "../lib/comprimir-imagen";
import { urlFoto } from "../lib/fotos";
import { SERVICIOS } from "../lib/servicios";
import { revisarTextoAlt } from "../lib/texto-alt";
import {
  MAXIMO_FOTOS,
  revisarNombreServicioAdicional,
  revisarTrabajo,
} from "../lib/validacion-trabajos";

let contadorFotos = 0;

function nuevaClave() {
  contadorFotos += 1;

  return `foto-${Date.now()}-${contadorFotos}`;
}

function fotoGuardada(foto, trabajoId) {
  return {
    clave: `guardada-${foto.id}`,
    id: foto.id,
    archivo: null,
    vista: urlFoto(trabajoId, foto.id),
    textoAlt: foto.texto_alt,
    nueva: false,
  };
}

async function leerRespuesta(respuesta) {
  try {
    return await respuesta.json();
  } catch {
    return {};
  }
}

export default function FormularioTrabajo({
  trabajo,
  serviciosAdicionalesIniciales = [],
  onServicioCreado,
  onGuardado,
  onCancelar,
}) {
  const [titulo, setTitulo] = useState(trabajo?.titulo ?? "");
  const [servicio, setServicio] = useState(trabajo?.servicio ?? "");
  const [nombreServicioNuevo, setNombreServicioNuevo] = useState("");
  const [serviciosAdicionales, setServiciosAdicionales] = useState(
    serviciosAdicionalesIniciales
  );
  const [descripcion, setDescripcion] = useState(trabajo?.descripcion ?? "");
  const [visible, setVisible] = useState(trabajo?.visible ?? true);
  const [fotos, setFotos] = useState(() =>
    trabajo ? trabajo.fotos.map((foto) => fotoGuardada(foto, trabajo.id)) : []
  );
  const [trabajoIdCreado, setTrabajoIdCreado] = useState(null);
  const [comprimiendo, setComprimiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const vistasCreadas = useRef(new Set());
  const fotosOriginales = useRef(trabajo?.fotos.map((foto) => foto.id) ?? []);

  useEffect(() => {
    const vistas = vistasCreadas.current;

    return () => {
      for (const vista of vistas) {
        URL.revokeObjectURL(vista);
      }
    };
  }, []);

  async function agregarArchivos(evento) {
    const archivos = Array.from(evento.target.files ?? []);
    evento.target.value = "";

    if (archivos.length === 0) {
      return;
    }

    if (fotos.length + archivos.length > MAXIMO_FOTOS) {
      setError(`Un trabajo no puede tener más de ${MAXIMO_FOTOS} fotos.`);
      return;
    }

    setComprimiendo(true);
    setError("");

    const nuevas = [];

    for (const archivo of archivos) {
      try {
        const comprimida = await comprimirImagen(archivo);
        const vista = URL.createObjectURL(comprimida);
        vistasCreadas.current.add(vista);
        nuevas.push({
          clave: nuevaClave(),
          id: null,
          archivo: comprimida,
          vista,
          textoAlt: nombreParaTextoAlt(archivo.name),
          nueva: true,
        });
      } catch (problema) {
        setError(problema.message);
      }
    }

    if (nuevas.length > 0) {
      setFotos((actuales) => [...actuales, ...nuevas]);
    }

    setComprimiendo(false);
  }

  function cambiarTextoAlt(clave, texto) {
    setFotos((actuales) =>
      actuales.map((foto) =>
        foto.clave === clave ? { ...foto, textoAlt: texto } : foto
      )
    );
  }

  function moverFoto(indice, direccion) {
    setFotos((actuales) => {
      const destino = indice + direccion;

      if (destino < 0 || destino >= actuales.length) {
        return actuales;
      }

      const copia = [...actuales];
      const cambiada = copia[indice];
      copia[indice] = copia[destino];
      copia[destino] = cambiada;

      return copia;
    });
  }

  function quitarFoto(indice) {
    if (fotos.length <= 1) {
      return;
    }

    setFotos((actuales) => {
      const foto = actuales[indice];

      if (foto?.vista?.startsWith("blob:")) {
        URL.revokeObjectURL(foto.vista);
        vistasCreadas.current.delete(foto.vista);
      }

      return actuales.filter((_, posicion) => posicion !== indice);
    });
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError("");

    const revisionNombreServicio =
      servicio === "nuevo"
        ? revisarNombreServicioAdicional(
            nombreServicioNuevo,
            serviciosAdicionales.map((opcion) => opcion.nombre)
          )
        : null;

    if (revisionNombreServicio?.error) {
      setError(revisionNombreServicio.error);
      return;
    }

    const revision = revisarTrabajo({
      titulo,
      servicio: servicio === "nuevo" ? SERVICIOS[0].id : servicio,
      descripcion,
      visible,
    });

    if (revision.error) {
      setError(revision.error);
      return;
    }

    if (fotos.length === 0) {
      setError("Agregá al menos una foto del trabajo.");
      return;
    }

    for (const [indice, foto] of fotos.entries()) {
      const errorTexto = revisarTextoAlt(foto.textoAlt);

      if (errorTexto) {
        setError(`Foto ${indice + 1}: ${errorTexto}`);
        return;
      }
    }

    setGuardando(true);
    const subidas = new Map();

    try {
      let servicioElegido = revision.datos.servicio;

      if (servicio === "nuevo") {
        const respuesta = await fetch("/api/admin/servicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: revisionNombreServicio.nombre }),
        });
        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
          throw new Error(resultado.error ?? "No pudimos guardar el servicio.");
        }

        servicioElegido = resultado.servicio.id;
        setServicio(servicioElegido);
        setServiciosAdicionales((actuales) => [
          ...actuales,
          resultado.servicio,
        ]);
        onServicioCreado?.(resultado.servicio);
      }

      const datosTrabajo = { ...revision.datos, servicio: servicioElegido };
      let trabajoId = trabajo?.id ?? trabajoIdCreado;

      if (!trabajoId) {
        const respuesta = await fetch("/api/admin/trabajos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosTrabajo),
        });
        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
          throw new Error(resultado.error ?? "No pudimos guardar el trabajo.");
        }

        trabajoId = resultado.trabajo.id;
        setTrabajoIdCreado(trabajoId);
      } else {
        const respuesta = await fetch("/api/admin/trabajos", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: trabajoId, ...datosTrabajo }),
        });
        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
          throw new Error(resultado.error ?? "No pudimos guardar el trabajo.");
        }
      }

      const ids = new Map();

      for (const [indice, foto] of fotos.entries()) {
        if (foto.id) {
          ids.set(foto.clave, foto.id);
          continue;
        }

        const formulario = new FormData();
        formulario.append("foto", foto.archivo, foto.archivo.name);
        formulario.append("texto_alt", foto.textoAlt.trim());

        const respuesta = await fetch(
          `/api/admin/trabajos/${trabajoId}/fotos`,
          { method: "POST", body: formulario }
        );
        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
          throw new Error(
            resultado.error ?? `No pudimos subir la foto ${indice + 1}.`
          );
        }

        ids.set(foto.clave, resultado.foto.id);
        subidas.set(foto.clave, resultado.foto.id);
      }

      const idsActuales = new Set(fotos.filter((foto) => foto.id).map((foto) => foto.id));

      for (const id of fotosOriginales.current) {
        if (idsActuales.has(id)) {
          continue;
        }

        const respuesta = await fetch(
          `/api/admin/trabajos/${trabajoId}/fotos`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ foto: id }),
          }
        );
        const resultado = await leerRespuesta(respuesta);

        if (!respuesta.ok) {
          throw new Error(
            resultado.error ?? "No pudimos borrar una foto que quitamos."
          );
        }
      }

      const listaFinal = fotos.map((foto, indice) => ({
        id: ids.get(foto.clave),
        textoAlt: foto.textoAlt.trim(),
        orden: indice + 1,
      }));
      const respuesta = await fetch(
        `/api/admin/trabajos/${trabajoId}/fotos`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fotos: listaFinal }),
        }
      );
      const resultado = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        throw new Error(resultado.error ?? "No pudimos ordenar las fotos.");
      }

      onGuardado(
        trabajo ? "El trabajo se actualizó." : "El trabajo se agregó al sitio."
      );
    } catch (problema) {
      // Si algunas fotos llegaron a subirse, no se vuelven a mandar al reintentar.
      if (subidas.size > 0) {
        setFotos((actuales) =>
          actuales.map((foto) =>
            subidas.has(foto.clave)
              ? { ...foto, id: subidas.get(foto.clave), nueva: false }
              : foto
          )
        );
      }

      setError(problema.message);
    } finally {
      setGuardando(false);
    }
  }

  const ocupado = guardando || comprimiendo;
  const tituloFormulario = trabajo ? "Editar trabajo" : "Agregar trabajo";

  return (
    <form className="formulario-trabajo" onSubmit={guardar} noValidate>
      <h2>{tituloFormulario}</h2>

      {error ? (
        <p className="formulario-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="formulario-trabajo-grid">
        <div className="campo">
          <label htmlFor="trabajo-titulo">Título</label>
          <input
            id="trabajo-titulo"
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            maxLength={120}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="trabajo-servicio">Servicio</label>
          <select
            id="trabajo-servicio"
            value={servicio}
            onChange={(evento) => setServicio(evento.target.value)}
            required
          >
            <option value="">Elegí un servicio</option>
            {SERVICIOS.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.nombre}
              </option>
            ))}
            {!trabajo ? (
              <option value="nuevo">Agregar un nuevo servicio...</option>
            ) : null}
          </select>
        </div>

        {!trabajo && servicio === "nuevo" ? (
          <div className="campo">
            <label htmlFor="trabajo-servicio-nuevo">Nombre del servicio</label>
            <input
              id="trabajo-servicio-nuevo"
              type="text"
              value={nombreServicioNuevo}
              onChange={(evento) =>
                setNombreServicioNuevo(evento.target.value)
              }
              maxLength={80}
              autoComplete="off"
              required
            />
          </div>
        ) : null}
      </div>

      <div className="campo">
        <label htmlFor="trabajo-descripcion">Descripción</label>
        <textarea
          id="trabajo-descripcion"
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          rows={4}
          maxLength={600}
          required
        />
      </div>

      <label className="campo-check">
        <input
          type="checkbox"
          checked={visible}
          onChange={(evento) => setVisible(evento.target.checked)}
        />
        Mostrar este trabajo en el sitio
      </label>

      <fieldset className="campo-fotos">
        <legend>Fotos del trabajo</legend>
        <p className="campo-ayuda">
          La primera foto es la portada. Se achican y comprimen en tu navegador
          antes de subirse. El texto alternativo describe la foto para quien no
          puede verla.
        </p>

        <div className="campo">
          <label
            className="boton-secundario boton-chico boton-archivo"
            htmlFor="trabajo-archivos"
          >
            {comprimiendo ? "Comprimiendo..." : "Agregar fotos"}
          </label>
          <input
            id="trabajo-archivos"
            className="visualmente-oculto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={agregarArchivos}
            disabled={ocupado}
          />
        </div>

        {fotos.length === 0 ? (
          <p className="admin-vacio">Todavía no agregaste fotos.</p>
        ) : (
          <ol className="fotos-editor">
            {fotos.map((foto, indice) => (
              <li className="foto-editor" key={foto.clave}>
                <div className="foto-editor-vista">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.vista} alt="" width={120} height={90} />
                  {indice === 0 ? (
                    <span className="foto-portada">Portada</span>
                  ) : null}
                </div>

                <div className="campo foto-editor-campo">
                  <label htmlFor={`texto-alt-${foto.clave}`}>
                    Texto alternativo de la foto {indice + 1}
                  </label>
                  <input
                    id={`texto-alt-${foto.clave}`}
                    type="text"
                    value={foto.textoAlt}
                    onChange={(evento) =>
                      cambiarTextoAlt(foto.clave, evento.target.value)
                    }
                    maxLength={200}
                    placeholder="Describí lo que se ve en la foto"
                    required
                  />
                </div>

                <div className="foto-editor-acciones">
                  <button
                    type="button"
                    className="boton-secundario boton-chico"
                    onClick={() => moverFoto(indice, -1)}
                    disabled={indice === 0 || ocupado}
                    aria-label={`Subir la foto ${indice + 1}`}
                  >
                    Subir
                  </button>
                  <button
                    type="button"
                    className="boton-secundario boton-chico"
                    onClick={() => moverFoto(indice, 1)}
                    disabled={indice === fotos.length - 1 || ocupado}
                    aria-label={`Bajar la foto ${indice + 1}`}
                  >
                    Bajar
                  </button>
                  <button
                    type="button"
                    className="boton-peligro boton-chico"
                    onClick={() => quitarFoto(indice)}
                    disabled={fotos.length <= 1 || ocupado}
                    aria-label={`Quitar la foto ${indice + 1}`}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </fieldset>

      <div className="formulario-trabajo-acciones">
        <button type="submit" className="boton-principal" disabled={ocupado}>
          {guardando ? "Guardando..." : "Guardar trabajo"}
        </button>
        <button
          type="button"
          className="boton-secundario"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
