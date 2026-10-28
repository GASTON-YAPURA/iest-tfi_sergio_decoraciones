import { sql } from "./db.js";

const CAMPOS = "id, titulo, servicio, descripcion, foto, texto_alt";

export async function obtenerTrabajosDestacados(limite = 3) {
  const cantidad = Number.isInteger(limite) && limite > 0 ? limite : 3;
  const filas = await sql.query(
    `SELECT ${CAMPOS} FROM trabajos WHERE visible = TRUE ORDER BY id LIMIT $1`,
    [cantidad]
  );

  return filas;
}

export async function obtenerTrabajos() {
  return sql.query(
    `SELECT ${CAMPOS} FROM trabajos WHERE visible = TRUE ORDER BY id DESC`
  );
}
