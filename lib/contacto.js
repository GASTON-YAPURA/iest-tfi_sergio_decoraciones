// Numeros de contacto de Sergio. Reemplazar el marcador por los datos reales.
export const NUMERO_WHATSAPP = "5493837000000";
export const NUMERO_TELEFONO = "+54 9 3837 000000";
export const MENSAJE_WHATSAPP =
  "Hola Sergio, vi su sitio web y quiero consultar por un trabajo de decoración.";

export function crearEnlaceWhatsAppConNumero(numero, mensaje) {
  const digitos = String(numero).replace(/\D/g, "");

  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

export function crearEnlaceWhatsApp(mensaje = MENSAJE_WHATSAPP) {
  return crearEnlaceWhatsAppConNumero(NUMERO_WHATSAPP, mensaje);
}

export function crearEnlaceLlamada() {
  return `tel:+${NUMERO_WHATSAPP}`;
}
