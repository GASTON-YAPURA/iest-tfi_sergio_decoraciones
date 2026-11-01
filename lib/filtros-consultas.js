// Constantes y normalizadores del panel de consultas.
// No tocan la base: se pueden probar sin conexion.
export const POR_PAGINA = 10;

export const ESTADOS = [
  { id: "todas", nombre: "Todas" },
  { id: "pendientes", nombre: "Pendientes" },
  { id: "atendidas", nombre: "Atendidas" },
  { id: "archivadas", nombre: "Archivadas" },
];

export function normalizarEstado(valor) {
  const estado = typeof valor === "string" ? valor.trim().toLowerCase() : "";

  return ESTADOS.some((opcion) => opcion.id === estado) ? estado : "todas";
}

export function normalizarPagina(valor) {
  const pagina = Number.parseInt(valor, 10);

  return Number.isInteger(pagina) && pagina > 0 ? pagina : 1;
}

export function normalizarBusqueda(valor) {
  const busqueda = typeof valor === "string" ? valor.trim() : "";

  return busqueda.slice(0, 80);
}
