// Compresion de fotos en el navegador, antes de subirlas al panel.
import {
  PESO_MAXIMO_BYTES,
  TIPOS_PERMITIDOS,
  calcularMedidas,
} from "./limites-imagen.js";

const CALIDAD_INICIAL = 0.85;
const CALIDAD_MINIMA = 0.5;

// Sugiere un texto alternativo a partir del nombre del archivo.
export function nombreParaTextoAlt(nombreArchivo) {
  return String(nombreArchivo ?? "")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function abrirImagen(archivo) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(archivo);
  }

  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    const direccion = URL.createObjectURL(archivo);

    imagen.onload = () => {
      URL.revokeObjectURL(direccion);
      resolver(imagen);
    };

    imagen.onerror = () => {
      URL.revokeObjectURL(direccion);
      rechazar(new Error("No se pudo leer la foto."));
    };

    imagen.src = direccion;
  });
}

function dibujarEnCanvas(imagen, ancho, alto) {
  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;

  const contexto = canvas.getContext("2d");

  if (!contexto) {
    throw new Error("Este navegador no puede comprimir la foto.");
  }

  // Fondo blanco: evita bordes negros al pasar una PNG con transparencia.
  contexto.fillStyle = "#FFFFFF";
  contexto.fillRect(0, 0, ancho, alto);
  contexto.drawImage(imagen, 0, 0, ancho, alto);

  return canvas;
}

function aBlob(canvas, calidad) {
  return new Promise((resolver) => {
    canvas.toBlob(resolver, "image/jpeg", calidad);
  });
}

// Achica y comprime la foto. Devuelve un File JPG listo para subir.
export async function comprimirImagen(archivo) {
  if (!archivo) {
    throw new Error("No elegiste ninguna foto.");
  }

  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    throw new Error("La foto tiene que ser JPG, PNG o WebP.");
  }

  const imagen = await abrirImagen(archivo);
  const medidas = calcularMedidas(imagen.width, imagen.height);

  if (!medidas) {
    throw new Error("No se pudieron leer las medidas de la foto.");
  }

  const canvas = dibujarEnCanvas(imagen, medidas.ancho, medidas.alto);
  let calidad = CALIDAD_INICIAL;
  let blob = await aBlob(canvas, calidad);

  while (blob && blob.size > PESO_MAXIMO_BYTES && calidad > CALIDAD_MINIMA) {
    calidad -= 0.1;
    blob = await aBlob(canvas, calidad);
  }

  if (!blob || blob.size > PESO_MAXIMO_BYTES) {
    throw new Error("La foto sigue pesando demasiado. Probá con otra más chica.");
  }

  const nombre = `${nombreParaTextoAlt(archivo.name) || "foto"}.jpg`;

  return new File([blob], nombre, { type: "image/jpeg" });
}
