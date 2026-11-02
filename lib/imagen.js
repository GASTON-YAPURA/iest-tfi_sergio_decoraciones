// Utilidades para reconocer y medir imagenes sin dependencias externas.
// Se usan en el servidor y en los scripts; nunca en el navegador.
import {
  ANCHO_MAXIMO,
  ALTO_MAXIMO,
  LADO_MAXIMO_ACEPTADO,
  PESO_MAXIMO_BYTES,
  TIPOS_PERMITIDOS,
} from "./limites-imagen.js";

export {
  ANCHO_MAXIMO,
  ALTO_MAXIMO,
  LADO_MAXIMO_ACEPTADO,
  PESO_MAXIMO_BYTES,
  TIPOS_PERMITIDOS,
};
export { revisarTextoAlt } from "./texto-alt.js";

function comoBuffer(datos) {
  if (Buffer.isBuffer(datos)) {
    return datos;
  }

  return Buffer.from(datos.buffer, datos.byteOffset, datos.byteLength);
}

// Devuelve el tipo real de la imagen mirando los primeros bytes.
export function detectarTipo(datos) {
  const buffer = comoBuffer(datos);

  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function medirJpeg(buffer) {
  let posicion = 2;

  while (posicion + 9 < buffer.length) {
    if (buffer[posicion] !== 0xff) {
      posicion += 1;
      continue;
    }

    const marcador = buffer[posicion + 1];

    // Marcadores sin largo propio.
    if (
      marcador === 0xd8 ||
      marcador === 0x01 ||
      (marcador >= 0xd0 && marcador <= 0xd7)
    ) {
      posicion += 2;
      continue;
    }

    const largo = buffer.readUInt16BE(posicion + 2);

    if (largo < 2) {
      return null;
    }

    const esInicioDeCuadro =
      marcador >= 0xc0 &&
      marcador <= 0xcf &&
      marcador !== 0xc4 &&
      marcador !== 0xc8 &&
      marcador !== 0xcc;

    if (esInicioDeCuadro) {
      return {
        alto: buffer.readUInt16BE(posicion + 5),
        ancho: buffer.readUInt16BE(posicion + 7),
      };
    }

    posicion += 2 + largo;
  }

  return null;
}

function medirPng(buffer) {
  return {
    ancho: buffer.readUInt32BE(16),
    alto: buffer.readUInt32BE(20),
  };
}

function medirWebp(buffer) {
  const formato = buffer.toString("ascii", 12, 16);

  if (formato === "VP8 ") {
    return {
      ancho: buffer.readUInt16LE(26) & 0x3fff,
      alto: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (formato === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return {
      ancho: (bits & 0x3fff) + 1,
      alto: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  if (formato === "VP8X") {
    return {
      ancho: buffer.readUIntLE(24, 3) + 1,
      alto: buffer.readUIntLE(27, 3) + 1,
    };
  }

  return null;
}

// Devuelve { ancho, alto } o null si no se pudo leer.
export function medirImagen(datos) {
  const buffer = comoBuffer(datos);
  const tipo = detectarTipo(buffer);

  if (tipo === "image/jpeg") {
    return medirJpeg(buffer);
  }

  if (tipo === "image/png") {
    return buffer.length >= 24 ? medirPng(buffer) : null;
  }

  if (tipo === "image/webp") {
    return buffer.length >= 30 ? medirWebp(buffer) : null;
  }

  return null;
}

// Revisa tipo, peso y medidas. Devuelve un texto de error o null si esta bien.
export function revisarImagen(datos) {
  const buffer = comoBuffer(datos);
  const tipo = detectarTipo(buffer);

  if (!tipo) {
    return "El archivo no es una imagen JPG, PNG o WebP.";
  }

  if (buffer.length > PESO_MAXIMO_BYTES) {
    return "La foto supera el maximo de 1,5 MB.";
  }

  const medidas = medirImagen(buffer);

  if (!medidas || medidas.ancho === 0 || medidas.alto === 0) {
    return "No se pudieron leer las medidas de la foto.";
  }

  if (
    medidas.ancho > LADO_MAXIMO_ACEPTADO ||
    medidas.alto > LADO_MAXIMO_ACEPTADO
  ) {
    return "La foto es demasiado grande. El maximo es 6000 px por lado.";
  }

  return null;
}
