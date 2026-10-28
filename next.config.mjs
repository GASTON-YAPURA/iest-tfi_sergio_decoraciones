// Configuracion de Next.js para Sergio Decoraciones.
/** @type {import("next").NextConfig} */
const configuracionNext = {
  // Solo afecta a "next dev": permite abrir el sitio desde el celular por la red local.
  // Se carga desde .env.local para no dejar una IP fija en el repositorio.
  allowedDevOrigins: (process.env.ORIGENES_DESARROLLO ?? "")
    .split(",")
    .map((origen) => origen.trim())
    .filter(Boolean),
};

export default configuracionNext;
