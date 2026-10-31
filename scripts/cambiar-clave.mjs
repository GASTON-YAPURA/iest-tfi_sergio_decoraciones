// Cambia la contrasena del panel: la pide sin mostrarla y actualiza
// ADMIN_CLAVE_HASH en .env.local. Uso: node scripts/cambiar-clave.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
import { compare, hash } from "bcryptjs";

const RUTA_ENV = new URL("../.env.local", import.meta.url);
const RONDAS = 10;
const LARGO_MINIMO = 10;
const LARGO_MAXIMO = 72;

// Reemplaza (o agrega) la linea de ADMIN_CLAVE_HASH sin tocar el resto del archivo.
export function actualizarHashEnContenido(contenido, hashEscapado) {
  const linea = `ADMIN_CLAVE_HASH=${hashEscapado}`;
  const patron = /^ADMIN_CLAVE_HASH=.*$/m;

  if (patron.test(contenido)) {
    return contenido.replace(patron, () => linea);
  }

  const salto = contenido.includes("\r\n") ? "\r\n" : "\n";
  const base = contenido.length > 0 && !contenido.endsWith("\n")
    ? contenido + salto
    : contenido;

  return base + linea + salto;
}

// Lee del archivo el hash guardado y le quita el escape de los $.
export function extraerHash(contenido) {
  const valor = contenido.match(/^ADMIN_CLAVE_HASH=(.*)$/m)?.[1];
  return valor === undefined ? null : valor.replace(/\\\$/g, "$");
}

// Pide un texto sin mostrarlo en pantalla (para que la clave no quede a la vista).
function preguntarOculto(pregunta) {
  return new Promise((resolver) => {
    process.stdout.write(pregunta);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    rl._writeToOutput = (texto) => {
      if (texto.includes("\n") || texto.includes("\r")) {
        process.stdout.write("\n");
      }
    };

    rl.question("", (respuesta) => {
      rl.close();
      resolver(respuesta);
    });
  });
}

async function principal() {
  const clave = await preguntarOculto("Nueva contrasena del panel: ");

  if (clave.length < LARGO_MINIMO) {
    console.error(`La clave tiene que tener al menos ${LARGO_MINIMO} caracteres.`);
    process.exitCode = 1;
    return;
  }

  if (Buffer.byteLength(clave, "utf8") > LARGO_MAXIMO) {
    console.error(`La clave no puede superar los ${LARGO_MAXIMO} bytes.`);
    process.exitCode = 1;
    return;
  }

  const repetida = await preguntarOculto("Repetir la contrasena: ");

  if (clave !== repetida) {
    console.error("Las claves no coinciden. No se cambio nada.");
    process.exitCode = 1;
    return;
  }

  const nuevoHash = await hash(clave, RONDAS);
  const escapado = nuevoHash.replace(/\$/g, "\\$");

  let contenido;

  try {
    contenido = readFileSync(RUTA_ENV, "utf8");
  } catch {
    console.error("No se encontro .env.local en la raiz del proyecto.");
    process.exitCode = 1;
    return;
  }

  const actualizado = actualizarHashEnContenido(contenido, escapado);
  writeFileSync(RUTA_ENV, actualizado, "utf8");

  // Comprueba que el valor guardado, ya desescapado, valide la clave nueva.
  const guardado = extraerHash(actualizado);
  const correcto = guardado ? await compare(clave, guardado) : false;

  if (!correcto) {
    console.error("No se pudo verificar el hash guardado. Revisar .env.local.");
    process.exitCode = 1;
    return;
  }

  console.log("Listo: ADMIN_CLAVE_HASH actualizado en .env.local.");
  console.log("Reinicia el servidor (npm run dev) para que tome la clave nueva.");
  console.log("");

  // En Vercel el valor va literal: el signo $ no se escapa como en .env.local.
  console.log("Para Vercel, copia este mismo valor SIN las barras invertidas");
  console.log("y pegalo en Settings > Environment Variables > ADMIN_CLAVE_HASH:");
  console.log("");
  console.log(nuevoHash);
  console.log("");
  console.log("No lo subas a GitHub ni lo pegues en un chat.");
}

const seEjecutaDirecto =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (seEjecutaDirecto) {
  principal().catch((error) => {
    console.error("No se pudo cambiar la clave:", error.message);
    process.exitCode = 1;
  });
}
