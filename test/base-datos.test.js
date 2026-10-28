import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("el esquema define las tablas trabajos y consultas", () => {
  const esquema = leerArchivo("db/esquema.sql");

  assert.match(esquema, /CREATE TABLE IF NOT EXISTS trabajos/);
  assert.match(esquema, /CREATE TABLE IF NOT EXISTS consultas/);
});

test("los datos de muestra cubren los seis servicios", () => {
  const datos = leerArchivo("db/datos.sql");
  const servicios = [
    "interiores",
    "durlock",
    "pintura",
    "enduido",
    "machimbre",
    "molduras",
  ];

  for (const servicio of servicios) {
    assert.match(datos, new RegExp(`'${servicio}'`));
  }
});

test("la conexion lee DATABASE_URL del entorno", () => {
  const conexion = leerArchivo("lib/db.js");

  assert.match(conexion, /process\.env\.DATABASE_URL/);
  assert.doesNotMatch(conexion, /postgres(ql)?:\/\//);
});

test("la consulta de trabajos destacados usa parametros", () => {
  const consulta = leerArchivo("lib/trabajos.js");

  assert.match(consulta, /sql\.query\(/);
  assert.match(consulta, /LIMIT \$1/);
  assert.match(consulta, /\[cantidad\]/);
  assert.doesNotMatch(consulta, /\$\{limite\}/);
});
