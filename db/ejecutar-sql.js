import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sql } from "../lib/db.js";

const archivo = process.argv[2];

if (!archivo) {
  console.error("Uso: node --env-file=.env.local db/ejecutar-sql.js <archivo.sql>");
  process.exit(1);
}

const ruta = resolve(process.cwd(), archivo);

function quitarComentarios(contenido) {
  return contenido
    .split("\n")
    .filter((linea) => !linea.trim().startsWith("--"))
    .join("\n");
}

const contenido = quitarComentarios(readFileSync(ruta, "utf8"));
const sentencias = contenido
  .split(";")
  .map((sentencia) => sentencia.trim())
  .filter((sentencia) => sentencia.length > 0);

if (sentencias.length === 0) {
  console.log("No hay sentencias para ejecutar.");
  process.exit(0);
}

await sql.transaction((transaccion) =>
  sentencias.map((sentencia) => transaccion.query(sentencia))
);

console.log(`Ejecutadas ${sentencias.length} sentencias de ${archivo}.`);
