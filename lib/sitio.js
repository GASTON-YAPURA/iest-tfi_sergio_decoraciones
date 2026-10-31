// Direccion publica del sitio e imagen que se muestra al compartir un enlace.
// La direccion se toma de SITIO_URL y, si no esta, de Vercel o del entorno local.
const URL_LOCAL = "http://localhost:3000";

export const TITULO_SITIO = "Sergio Decoraciones | Decoración en Tinogasta";
export const DESCRIPCION_SITIO =
  "Pintura, durlock, enduido, empapelado, machimbre y molduras en Tinogasta, Catamarca. Mirá nuestros trabajos y consultá por WhatsApp.";

export const IMAGEN_COMPARTIDA = {
  url: "/img/marca/logo-horizontal-principal.png",
  width: 1619,
  height: 515,
  alt: "Logo de Sergio Decoraciones",
};

export function obtenerUrlSitio() {
  const configurada = (process.env.SITIO_URL ?? "").trim();

  if (configurada) {
    return configurada.replace(/\/+$/, "");
  }

  // En Vercel, la direccion del proyecto llega por variable de entorno.
  const enVercel = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    ""
  ).trim();

  if (enVercel) {
    return `https://${enVercel.replace(/\/+$/, "")}`;
  }

  return URL_LOCAL;
}

export function crearUrlSitio(ruta = "/") {
  return `${obtenerUrlSitio()}${ruta}`;
}
