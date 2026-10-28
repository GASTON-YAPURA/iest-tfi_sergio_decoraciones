import { compare } from "bcryptjs";
import { createHmac, timingSafeEqual } from "node:crypto";

// La sesion de Sergio dura 8 horas, como indica docs/10 - SEGURIDAD.md.
export const DURACION_SESION_MS = 8 * 60 * 60 * 1000;

function obtenerSecreto() {
  const secreto = process.env.SESION_SECRETA;

  if (!secreto) {
    throw new Error("Falta la variable de entorno SESION_SECRETA");
  }

  return secreto;
}

function firmar(codificado, secreto) {
  return createHmac("sha256", secreto).update(codificado).digest("base64url");
}

// Crea el valor firmado que va dentro de la cookie de sesion.
export function crearValorSesion(usuario, ahora = Date.now()) {
  const datos = JSON.stringify({ usuario, exp: ahora + DURACION_SESION_MS });
  const codificado = Buffer.from(datos, "utf8").toString("base64url");

  return `${codificado}.${firmar(codificado, obtenerSecreto())}`;
}

// Verifica la firma y el vencimiento. Devuelve null si algo no coincide.
export function leerValorSesion(valor, ahora = Date.now()) {
  if (typeof valor !== "string") {
    return null;
  }

  const partes = valor.split(".");

  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    return null;
  }

  const [codificado, firma] = partes;
  let secreto;

  try {
    secreto = obtenerSecreto();
  } catch {
    return null;
  }

  const esperada = firmar(codificado, secreto);
  const recibida = Buffer.from(firma, "base64url");
  const calculada = Buffer.from(esperada, "base64url");

  if (
    recibida.length !== calculada.length ||
    !timingSafeEqual(recibida, calculada)
  ) {
    return null;
  }

  try {
    const datos = JSON.parse(
      Buffer.from(codificado, "base64url").toString("utf8")
    );

    if (
      !datos ||
      typeof datos.usuario !== "string" ||
      !Number.isFinite(datos.exp) ||
      datos.exp <= ahora
    ) {
      return null;
    }

    return datos;
  } catch {
    return null;
  }
}

function obtenerHash() {
  const hash = process.env.ADMIN_CLAVE_HASH;

  if (!hash) {
    return null;
  }

  // En .env.local los $ se escapan para Next; en Vercel llegan sin escapar.
  return hash.replace(/\\\$/g, "$");
}

// Compara las credenciales con el usuario y el hash guardados en el entorno.
export async function verificarCredenciales(usuario, clave) {
  const usuarioEsperado = process.env.ADMIN_USUARIO;
  const hash = obtenerHash();

  if (
    !usuarioEsperado ||
    !hash ||
    typeof usuario !== "string" ||
    typeof clave !== "string"
  ) {
    return false;
  }

  const usuarioCorrecto = usuario === usuarioEsperado;

  try {
    const claveCorrecta = await compare(clave, hash);
    return usuarioCorrecto && claveCorrecta;
  } catch {
    return false;
  }
}
