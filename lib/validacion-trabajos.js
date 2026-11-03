// Validaciones puras del panel de trabajos. No tocan la base ni el navegador.
import { SERVICIOS } from "./servicios.js";

export const MAXIMO_FOTOS = 12;
export const TITULO_MINIMO = 3;
export const TITULO_MAXIMO = 120;
export const DESCRIPCION_MINIMA = 5;
export const DESCRIPCION_MAXIMA = 600;
export const NOMBRE_SERVICIO_MAXIMO = 80;

const IDS_SERVICIOS = SERVICIOS.map((servicio) => servicio.id);

export function esServicioValido(valor) {
  return (
    IDS_SERVICIOS.includes(valor) ||
    (typeof valor === "string" &&
      /^extra-[1-9]\d{0,9}$/.test(valor) &&
      Number(valor.slice(6)) <= 2147483647)
  );
}

export function revisarNombreServicioAdicional(valor, nombresAdicionales = []) {
  const nombre = typeof valor === "string" ? valor.trim() : "";

  if (!nombre) {
    return { error: "Escribí el nombre del nuevo servicio." };
  }

  if (nombre.length > NOMBRE_SERVICIO_MAXIMO) {
    return {
      error: `El nombre del servicio no puede superar los ${NOMBRE_SERVICIO_MAXIMO} caracteres.`,
    };
  }

  const nombresPrincipales = SERVICIOS.flatMap((servicio) => [
    servicio.nombre,
    servicio.etiqueta,
  ]);
  const adicionales = Array.isArray(nombresAdicionales) ? nombresAdicionales : [];
  const existentes = [...nombresPrincipales, ...adicionales];

  if (
    existentes.some(
      (existente) =>
        typeof existente === "string" &&
        existente.trim().toLowerCase() === nombre.toLowerCase()
    )
  ) {
    return { error: "Ya existe un servicio con ese nombre." };
  }

  return { nombre };
}

// Revisa y normaliza los datos del trabajo. Devuelve { error } o { datos }.
export function revisarTrabajo(cuerpo) {
  const titulo = typeof cuerpo?.titulo === "string" ? cuerpo.titulo.trim() : "";
  const servicio =
    typeof cuerpo?.servicio === "string" ? cuerpo.servicio.trim() : "";
  const descripcion =
    typeof cuerpo?.descripcion === "string" ? cuerpo.descripcion.trim() : "";
  const visible = cuerpo?.visible === undefined ? true : cuerpo.visible;

  if (titulo.length < TITULO_MINIMO) {
    return {
      error: `El título tiene que tener al menos ${TITULO_MINIMO} caracteres.`,
    };
  }

  if (titulo.length > TITULO_MAXIMO) {
    return {
      error: `El título no puede superar los ${TITULO_MAXIMO} caracteres.`,
    };
  }

  if (!esServicioValido(servicio)) {
    return { error: "Elegí un servicio disponible." };
  }

  if (descripcion.length < DESCRIPCION_MINIMA) {
    return {
      error: `La descripción tiene que tener al menos ${DESCRIPCION_MINIMA} caracteres.`,
    };
  }

  if (descripcion.length > DESCRIPCION_MAXIMA) {
    return {
      error: `La descripción no puede superar los ${DESCRIPCION_MAXIMA} caracteres.`,
    };
  }

  if (typeof visible !== "boolean") {
    return { error: "La visibilidad del trabajo no es válida." };
  }

  return { datos: { titulo, servicio, descripcion, visible } };
}

// Revisa la lista de fotos que llega al reordenar o cambiar textos.
export function revisarFotosParaActualizar(fotos) {
  if (!Array.isArray(fotos) || fotos.length === 0) {
    return { error: "No hay fotos para actualizar." };
  }

  if (fotos.length > MAXIMO_FOTOS) {
    return { error: `Un trabajo no puede tener más de ${MAXIMO_FOTOS} fotos.` };
  }

  const ids = new Set();
  const normalizadas = [];

  for (const foto of fotos) {
    const id = Number(foto?.id);
    const orden = Number(foto?.orden);
    const textoAlt =
      typeof foto?.textoAlt === "string" ? foto.textoAlt.trim() : "";

    if (!Number.isInteger(id) || id <= 0) {
      return { error: "El número de foto no es válido." };
    }

    if (ids.has(id)) {
      return { error: "Hay una foto repetida en la lista." };
    }

    if (!Number.isInteger(orden) || orden <= 0 || orden > MAXIMO_FOTOS) {
      return { error: "El orden de las fotos no es válido." };
    }

    if (textoAlt.length < 5) {
      return {
        error: "Cada foto necesita un texto alternativo de al menos 5 caracteres.",
      };
    }

    if (textoAlt.length > 200) {
      return { error: "El texto alternativo no puede superar los 200 caracteres." };
    }

    ids.add(id);
    normalizadas.push({ id, textoAlt, orden });
  }

  return { fotos: normalizadas };
}
