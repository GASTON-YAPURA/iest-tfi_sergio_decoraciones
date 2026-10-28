import { sql } from "./db.js";

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
