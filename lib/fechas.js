// Formatea las fechas de la base en la hora de Tinogasta, Catamarca.
const FORMATEADOR = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Argentina/Catamarca",
});

export function formatearFechaConsulta(valor) {
  const fecha = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return "Sin fecha";
  }

  return FORMATEADOR.format(fecha);
}
