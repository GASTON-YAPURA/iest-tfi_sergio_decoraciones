import { sql } from "./db.js";

const PREFIJO_SERVICIO = "extra-";

function servicioParaFormulario(fila) {
  return {
    id: `${PREFIJO_SERVICIO}${fila.id}`,
    nombre: fila.nombre,
  };
}

export async function listarServiciosAdicionales() {
  const filas = await sql.query(
    `SELECT id, nombre
       FROM servicios_adicionales
      ORDER BY LOWER(nombre), id`
  );

  return filas.map(servicioParaFormulario);
}

export async function crearServicioAdicional(nombre) {
  const filas = await sql.query(
    `INSERT INTO servicios_adicionales (nombre)
     VALUES ($1)
     RETURNING id, nombre`,
    [nombre]
  );

  return filas[0] ? servicioParaFormulario(filas[0]) : null;
}

export async function existeServicioAdicional(servicio) {
  if (typeof servicio !== "string" || !/^extra-[1-9]\d{0,9}$/.test(servicio)) {
    return false;
  }

  const id = Number(servicio.slice(PREFIJO_SERVICIO.length));

  if (id > 2147483647) {
    return false;
  }

  const filas = await sql.query(
    "SELECT id FROM servicios_adicionales WHERE id = $1",
    [id]
  );

  return filas.length > 0;
}
