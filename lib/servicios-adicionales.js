import { sql } from "./db.js";

const PREFIJO_SERVICIO = "extra-";

function servicioParaFormulario(fila) {
  return {
    id: `${PREFIJO_SERVICIO}${fila.id}`,
    nombre: fila.nombre,
    detalle: fila.detalle,
    descripcion: fila.descripcion,
  };
}

export async function listarServiciosAdicionales() {
  const filas = await sql.query(
    `SELECT id, nombre, detalle, descripcion
       FROM servicios_adicionales
      ORDER BY LOWER(nombre), id`
  );

  return filas.map(servicioParaFormulario);
}

export async function crearServicioAdicional(datos) {
  const filas = await sql.query(
    `INSERT INTO servicios_adicionales (nombre, detalle, descripcion)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, detalle, descripcion`,
    [datos.nombre, datos.detalle, datos.descripcion]
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
