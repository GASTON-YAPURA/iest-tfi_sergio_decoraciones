import { sql } from "./db.js";

const CAMPOS = "id, titulo, servicio, descripcion";

// Agrupa las fotos de cada trabajo en el orden guardado.
function agruparFotos(trabajos, fotos) {
  const porTrabajo = new Map();

  for (const foto of fotos) {
    const lista = porTrabajo.get(foto.trabajo_id) ?? [];
    lista.push({
      id: foto.id,
      texto_alt: foto.texto_alt,
      ancho: foto.ancho,
      alto: foto.alto,
    });
    porTrabajo.set(foto.trabajo_id, lista);
  }

  return trabajos.map((trabajo) => ({
    ...trabajo,
    fotos: porTrabajo.get(trabajo.id) ?? [],
  }));
}

async function traerFotos(trabajos) {
  if (trabajos.length === 0) {
    return trabajos;
  }

  const ids = trabajos.map((trabajo) => trabajo.id);
  const fotos = await sql.query(
    `SELECT id, trabajo_id, texto_alt, ancho, alto
       FROM trabajo_fotos
      WHERE trabajo_id = ANY($1::int[])
      ORDER BY orden, id`,
    [ids]
  );

  return agruparFotos(trabajos, fotos);
}

export async function obtenerTrabajosDestacados(limite = 3) {
  const cantidad = Number.isInteger(limite) && limite > 0 ? limite : 3;
  const filas = await sql.query(
    `SELECT ${CAMPOS} FROM trabajos WHERE visible = TRUE ORDER BY id LIMIT $1`,
    [cantidad]
  );

  return traerFotos(filas);
}

export async function obtenerTrabajos() {
  const filas = await sql.query(
    `SELECT ${CAMPOS} FROM trabajos WHERE visible = TRUE ORDER BY id DESC`
  );

  return traerFotos(filas);
}

// Devuelve una foto con su trabajo, para la ruta que la entrega.
export async function leerFoto(trabajoId, fotoId) {
  const filas = await sql.query(
    `SELECT f.datos, f.tipo, f.ancho, f.alto, t.visible
       FROM trabajo_fotos f
       JOIN trabajos t ON t.id = f.trabajo_id
      WHERE f.id = $1 AND f.trabajo_id = $2`,
    [fotoId, trabajoId]
  );

  return filas[0] ?? null;
}
