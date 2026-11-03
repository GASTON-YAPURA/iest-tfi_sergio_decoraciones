import { sql } from "./db.js";

const TABLA_TRABAJOS =
  "trabajos t LEFT JOIN servicios_adicionales sa ON t.servicio = 'extra-' || sa.id::text";
const CAMPOS_PUBLICOS =
  "t.id, t.titulo, t.servicio, t.descripcion, sa.nombre AS servicio_nombre";
const CAMPOS_PANEL =
  "t.id, t.titulo, t.servicio, t.descripcion, t.visible, sa.nombre AS servicio_nombre";
const CAMPOS_MUTACION = "id, titulo, servicio, descripcion, visible";

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
      orden: foto.orden,
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
    `SELECT id, trabajo_id, texto_alt, ancho, alto, orden
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
    `SELECT ${CAMPOS_PUBLICOS}
       FROM ${TABLA_TRABAJOS}
      WHERE t.visible = TRUE
      ORDER BY t.id
      LIMIT $1`,
    [cantidad]
  );

  return traerFotos(filas);
}

export async function obtenerTrabajos() {
  const filas = await sql.query(
    `SELECT ${CAMPOS_PUBLICOS}
       FROM ${TABLA_TRABAJOS}
      WHERE t.visible = TRUE
      ORDER BY t.id DESC`
  );

  return traerFotos(filas);
}

// Listado completo para el panel: incluye los trabajos ocultos y sus fotos.
export async function listarTrabajosPanel() {
  const filas = await sql.query(
    `SELECT ${CAMPOS_PANEL}
       FROM ${TABLA_TRABAJOS}
      ORDER BY t.id DESC`
  );

  return traerFotos(filas);
}

export async function obtenerTrabajo(id) {
  const filas = await sql.query(
    `SELECT ${CAMPOS_PANEL}
       FROM ${TABLA_TRABAJOS}
      WHERE t.id = $1`,
    [id]
  );

  if (!filas[0]) {
    return null;
  }

  const [trabajo] = await traerFotos(filas);

  return trabajo;
}

export async function crearTrabajo(datos) {
  const filas = await sql.query(
    `INSERT INTO trabajos (titulo, servicio, descripcion, visible)
     VALUES ($1, $2, $3, $4)
     RETURNING ${CAMPOS_MUTACION}`,
    [datos.titulo, datos.servicio, datos.descripcion, datos.visible]
  );

  return filas[0] ?? null;
}

export async function actualizarTrabajo(id, datos) {
  const filas = await sql.query(
    `UPDATE trabajos
        SET titulo = $2,
            servicio = $3,
            descripcion = $4,
            visible = $5
      WHERE id = $1
      RETURNING ${CAMPOS_MUTACION}`,
    [id, datos.titulo, datos.servicio, datos.descripcion, datos.visible]
  );

  return filas[0] ?? null;
}

export async function borrarTrabajo(id) {
  const filas = await sql.query(
    "DELETE FROM trabajos WHERE id = $1 RETURNING id",
    [id]
  );

  return filas[0] ?? null;
}

// Guarda una foto al final de la lista del trabajo.
export async function agregarFoto(trabajoId, foto) {
  const filas = await sql.query(
    `INSERT INTO trabajo_fotos
       (trabajo_id, datos, tipo, ancho, alto, texto_alt, orden)
     SELECT $1, $2, $3, $4, $5, $6, COALESCE(MAX(orden), 0) + 1
       FROM trabajo_fotos
      WHERE trabajo_id = $1
      RETURNING id, texto_alt, ancho, alto, orden`,
    [
      trabajoId,
      foto.datos,
      foto.tipo,
      foto.ancho,
      foto.alto,
      foto.textoAlt,
    ]
  );

  return filas[0] ?? null;
}

// Actualiza de una vez los textos y el orden de varias fotos del trabajo.
export async function actualizarFotos(trabajoId, fotos) {
  if (fotos.length === 0) {
    return [];
  }

  const ids = fotos.map((foto) => foto.id);
  const cuenta = await sql.query(
    `SELECT COUNT(*)::int AS total
       FROM trabajo_fotos
      WHERE trabajo_id = $1 AND id = ANY($2::int[])`,
    [trabajoId, ids]
  );

  if (cuenta[0]?.total !== ids.length) {
    return null;
  }

  return sql.query(
    `UPDATE trabajo_fotos AS f
        SET texto_alt = datos.texto_alt,
            orden = datos.orden
       FROM unnest($2::int[], $3::text[], $4::int[])
            AS datos (id, texto_alt, orden)
      WHERE f.id = datos.id AND f.trabajo_id = $1
      RETURNING f.id, f.texto_alt, f.ancho, f.alto, f.orden`,
    [
      trabajoId,
      ids,
      fotos.map((foto) => foto.textoAlt),
      fotos.map((foto) => foto.orden),
    ]
  );
}

// Borra una foto, salvo que sea la ultima del trabajo.
export async function borrarFoto(trabajoId, fotoId) {
  const filas = await sql.query(
    `DELETE FROM trabajo_fotos
      WHERE id = $1
        AND trabajo_id = $2
        AND (SELECT COUNT(*) FROM trabajo_fotos WHERE trabajo_id = $2) > 1
      RETURNING id`,
    [fotoId, trabajoId]
  );

  return filas[0] ?? null;
}

// Cuenta las fotos para validar el maximo antes de subir.
export async function contarFotos(trabajoId) {
  const filas = await sql.query(
    "SELECT COUNT(*)::int AS total FROM trabajo_fotos WHERE trabajo_id = $1",
    [trabajoId]
  );

  return filas[0]?.total ?? 0;
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
