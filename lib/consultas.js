import { sql } from "./db.js";

const CAMPOS = "id, nombre, telefono, mensaje, creada_en, atendida";

// Guarda una consulta ya validada. Los valores viajan siempre como parametros.
export async function guardarConsulta(consulta) {
  const filas = await sql.query(
    `INSERT INTO consultas (nombre, telefono, mensaje)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [consulta.nombre, consulta.telefono, consulta.mensaje]
  );

  return filas[0]?.id ?? null;
}

// Devuelve todas las consultas, con la mas reciente primero.
export async function obtenerConsultas() {
  return sql.query(
    `SELECT ${CAMPOS} FROM consultas ORDER BY creada_en DESC, id DESC`
  );
}

// Marca una consulta como atendida sin tocar las demas.
export async function marcarConsultaAtendida(id) {
  const filas = await sql.query(
    `UPDATE consultas
     SET atendida = TRUE
     WHERE id = $1
     RETURNING ${CAMPOS}`,
    [id]
  );

  return filas[0] ?? null;
}
