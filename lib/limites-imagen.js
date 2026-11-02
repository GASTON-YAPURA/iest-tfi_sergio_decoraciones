// Limites de las fotos compartidos por el servidor y el navegador.
export const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
export const PESO_MAXIMO_BYTES = 1500000; // 1,5 MB despues de comprimir
export const ANCHO_MAXIMO = 1600;
export const ALTO_MAXIMO = 1600;
export const LADO_MAXIMO_ACEPTADO = 6000; // evita imagenes desmedidas

// Achica la foto sin deformarla y sin agrandarla nunca.
export function calcularMedidas(
  ancho,
  alto,
  maxAncho = ANCHO_MAXIMO,
  maxAlto = ALTO_MAXIMO
) {
  const anchoNumero = Number(ancho);
  const altoNumero = Number(alto);

  if (
    !Number.isFinite(anchoNumero) ||
    !Number.isFinite(altoNumero) ||
    anchoNumero <= 0 ||
    altoNumero <= 0
  ) {
    return null;
  }

  const escala = Math.min(1, maxAncho / anchoNumero, maxAlto / altoNumero);

  return {
    ancho: Math.max(1, Math.round(anchoNumero * escala)),
    alto: Math.max(1, Math.round(altoNumero * escala)),
  };
}
