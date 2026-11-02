import { sql } from "./db.js";
import {
  POR_PAGINA,
  normalizarBusqueda,
  normalizarEstado,
  normalizarPagina,
} from "./filtros-consultas.js";

export { POR_PAGINA } from "./filtros-consultas.js";

const CAMPOS =
  "id, nombre, telefono, mensaje, creada_en, atendida, archivada";

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

// Condiciones comunes a la lista, la cuenta y el PDF. La busqueda viaja como
// parametro; el estado solo elige una de las cuatro condiciones fijas.
function armarFiltro(busqueda, estado) {
  const condiciones = [];
  const valores = [];

  if (busqueda) {
    valores.push(`%${busqueda}%`);
    condiciones.push(
      `(nombre ILIKE $${valores.length} OR telefono ILIKE $${valores.length})`
    );
  }

  if (estado === "pendientes") {
    condiciones.push("archivada = FALSE AND atendida = FALSE");
  } else if (estado === "atendidas") {
    condiciones.push("archivada = FALSE AND atendida = TRUE");
  } else if (estado === "archivadas") {
    condiciones.push("archivada = TRUE");
  } else {
    condiciones.push("archivada = FALSE");
  }

  return {
    valores,
    texto: `WHERE ${condiciones.join(" AND ")}`,
  };
}

// Devuelve una pagina de consultas y cuantas paginas hay en total.
export async function listarConsultas(opciones = {}) {
  const busqueda = normalizarBusqueda(opciones.busqueda);
  const estado = normalizarEstado(opciones.estado);
  const paginaPedida = normalizarPagina(opciones.pagina);
  const filtro = armarFiltro(busqueda, estado);

  const cuenta = await sql.query(
    `SELECT COUNT(*)::int AS total FROM consultas ${filtro.texto}`,
    filtro.valores
  );
  const total = cuenta[0]?.total ?? 0;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const pagina = Math.min(paginaPedida, paginas);
  const desplazamiento = (pagina - 1) * POR_PAGINA;

  const valores = [...filtro.valores, POR_PAGINA, desplazamiento];
  const consultas = await sql.query(
    `SELECT ${CAMPOS}
       FROM consultas
       ${filtro.texto}
      ORDER BY creada_en DESC, id DESC
      LIMIT $${valores.length - 1} OFFSET $${valores.length}`,
    valores
  );

  return { consultas, total, pagina, paginas, busqueda, estado };
}

// Todas las consultas del filtro, sin paginar: se usan para el PDF.
export async function listarConsultasParaPdf(opciones = {}) {
  const busqueda = normalizarBusqueda(opciones.busqueda);
  const estado = normalizarEstado(opciones.estado);
  const filtro = armarFiltro(busqueda, estado);

  return sql.query(
    `SELECT ${CAMPOS}
       FROM consultas
       ${filtro.texto}
      ORDER BY creada_en DESC, id DESC`,
    filtro.valores
  );
}

// Resumen fijo del panel: no cambia con el filtro elegido.
export async function contarConsultas() {
  const filas = await sql.query(
    `SELECT
       COUNT(*) FILTER (WHERE archivada = FALSE AND atendida = FALSE)::int AS pendientes,
       COUNT(*) FILTER (WHERE archivada = FALSE AND atendida = TRUE)::int AS atendidas,
       COUNT(*) FILTER (WHERE archivada = FALSE)::int AS total,
       COUNT(*) FILTER (WHERE archivada = TRUE)::int AS archivadas
     FROM consultas`
  );

  return filas[0] ?? { pendientes: 0, atendidas: 0, total: 0, archivadas: 0 };
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

// Archiva (sin borrar) o restaura una consulta.
export async function cambiarConsultaArchivada(id, archivada) {
  const filas = await sql.query(
    `UPDATE consultas
     SET archivada = $2,
         atendida = CASE WHEN $2 THEN TRUE ELSE atendida END
     WHERE id = $1
     RETURNING ${CAMPOS}`,
    [id, archivada]
  );

  return filas[0] ?? null;
}

export async function borrarConsultaArchivada(id) {
  const filas = await sql.query(
    `DELETE FROM consultas
      WHERE id = $1 AND archivada = TRUE
      RETURNING id`,
    [id]
  );

  return filas[0] ?? null;
}

export async function obtenerConsulta(id) {
  const filas = await sql.query(
    `SELECT ${CAMPOS} FROM consultas WHERE id = $1`,
    [id]
  );

  return filas[0] ?? null;
}
