// Armado del archivo CSV de consultas. No guarda nada: se genera al pedirlo.
const COLUMNAS = ["Fecha", "Nombre", "Teléfono", "Mensaje", "Estado"];

// Escapa una celda y evita que Excel interprete formulas.
export function escaparCelda(valor) {
  let texto = String(valor ?? "");

  if (/^[=+\-@\t\r]/.test(texto)) {
    texto = `'${texto}`;
  }

  if (/[",\r\n]/.test(texto)) {
    return `"${texto.replaceAll('"', '""')}"`;
  }

  return texto;
}

export function estadoConsulta(consulta) {
  if (consulta.archivada) {
    return "Archivada";
  }

  return consulta.atendida ? "Atendida" : "Pendiente";
}

// Recibe las consultas tal como salen de la base y devuelve el CSV completo.
export function generarCsv(consultas, formatearFecha) {
  const filas = [COLUMNAS];

  for (const consulta of consultas) {
    filas.push([
      formatearFecha(consulta.creada_en),
      consulta.nombre,
      consulta.telefono,
      consulta.mensaje,
      estadoConsulta(consulta),
    ]);
  }

  return filas.map((fila) => fila.map(escaparCelda).join(",")).join("\r\n");
}

// Nombre del archivo con la fecha del dia, en formato aaaa-mm-dd.
export function nombreArchivoCsv(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `consultas-${anio}-${mes}-${dia}.csv`;
}
