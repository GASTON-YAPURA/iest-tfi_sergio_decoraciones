// Configuracion de Next.js para Sergio Decoraciones.
/** @type {import("next").NextConfig} */

// Next compara solo el hostname: se aceptan "192.168.1.14", con puerto o con http.
export function normalizarOrigen(valor) {
  return String(valor)
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .toLowerCase();
}

const configuracionNext = {
  // Solo afecta a "next dev": permite abrir el sitio desde el celular por la red local.
  // Se carga desde .env.local para no dejar una IP fija en el repositorio.
  allowedDevOrigins: (process.env.ORIGENES_DESARROLLO ?? "")
    .split(",")
    .map(normalizarOrigen)
    .filter(Boolean),
};

export default configuracionNext;
