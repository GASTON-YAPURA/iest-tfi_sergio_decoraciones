import assert from "node:assert/strict";
import test from "node:test";
import {
  MENSAJE_WHATSAPP,
  NUMERO_TELEFONO,
  NUMERO_WHATSAPP,
  crearEnlaceLlamada,
  crearEnlaceWhatsApp,
} from "../lib/contacto.js";

test("el numero de WhatsApp solo tiene digitos", () => {
  assert.match(NUMERO_WHATSAPP, /^\d+$/);
});

test("el telefono visible usa el marcador", () => {
  assert.equal(NUMERO_TELEFONO, "+54 9 3837 000000");
});

test("el enlace de WhatsApp incluye el mensaje codificado", () => {
  const enlace = crearEnlaceWhatsApp();

  assert.equal(
    enlace,
    `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`
  );
  assert.match(enlace, /^https:\/\/wa\.me\//);
});

test("el enlace de llamada usa el protocolo tel", () => {
  assert.equal(crearEnlaceLlamada(), `tel:+${NUMERO_WHATSAPP}`);
});
