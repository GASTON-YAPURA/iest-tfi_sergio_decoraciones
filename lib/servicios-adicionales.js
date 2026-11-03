import { sql } from "./db.js";

const PREFIJO_SERVICIO = "extra-";

function servicioParaFormulario(fila) {
  return {
    id: `${PREFIJO_SERVICIO}${fila.id}`,
    nombre: fila.nombre,
    detalle: fila.detalle,
    descripcion: fila.descripcion,
    visible: fila.visible,
  };
}

export async function listarServiciosAdicionales() {
  const filas = await sql.query(
    `SELECT id, nombre, detalle, descripcion, visible
       FROM servicios_adicionales
      ORDER BY LOWER(nombre), id`
  );

  return filas.map(servicioParaFormulario);
}

export async function listarServiciosAdicionalesVisibles() {
  const filas = await sql.query(
    `SELECT id, nombre, detalle, descripcion, visible
       FROM servicios_adicionales
      WHERE visible = TRUE
      ORDER BY LOWER(nombre), id`
  );

  return filas.map(servicioParaFormulario);
}

export async function crearServicioAdicional(datos) {
  const filas = await sql.query(
    `INSERT INTO servicios_adicionales (nombre, detalle, descripcion)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, detalle, descripcion, visible`,
    [datos.nombre, datos.detalle, datos.descripcion]
  );

  return filas[0] ? servicioParaFormulario(filas[0]) : null;
}

function idNumericoServicio(servicio) {
  if (
    typeof servicio !== "string" ||
    !/^extra-[1-9]\d{0,9}$/.test(servicio)
  ) {
    return null;
  }

  const id = Number(servicio.slice(PREFIJO_SERVICIO.length));

  return id <= 2147483647 ? id : null;
}

export async function actualizarVisibilidadServicioAdicional(
  servicio,
  visible
) {
  const id = idNumericoServicio(servicio);

  if (id === null || typeof visible !== "boolean") {
    return null;
  }

  const filas = await sql.query(
    `UPDATE servicios_adicionales
        SET visible = $2
      WHERE id = $1
      RETURNING id, nombre, detalle, descripcion, visible`,
    [id, visible]
  );

  return filas[0] ? servicioParaFormulario(filas[0]) : null;
}

export async function borrarServicioAdicional(servicio) {
  const id = idNumericoServicio(servicio);

  if (id === null) {
    return null;
  }

  const filas = await sql.query(
    `DELETE FROM servicios_adicionales AS servicio
      WHERE servicio.id = $1
        AND NOT EXISTS (
          SELECT 1
            FROM trabajos
           WHERE trabajos.servicio = 'extra-' || servicio.id::text
        )
      RETURNING servicio.id`,
    [id]
  );

  return filas[0] ?? null;
}

export async function existeServicioAdicional(servicio) {
  const id = idNumericoServicio(servicio);

  if (id === null) {
    return false;
  }

  const filas = await sql.query(
    "SELECT id FROM servicios_adicionales WHERE id = $1",
    [id]
  );

  return filas.length > 0;
}
