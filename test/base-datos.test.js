import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("el esquema define las tablas de trabajos, fotos, servicios y consultas", () => {
  const esquema = leerArchivo("db/esquema.sql");

  assert.match(esquema, /CREATE TABLE IF NOT EXISTS trabajos/);
  assert.match(esquema, /CREATE TABLE IF NOT EXISTS trabajo_fotos/);
  assert.match(esquema, /CREATE TABLE IF NOT EXISTS servicios_adicionales/);
  assert.match(
    esquema,
    /CREATE UNIQUE INDEX IF NOT EXISTS servicios_adicionales_nombre_idx/
  );
  assert.match(esquema, /CREATE TABLE IF NOT EXISTS consultas/);
  assert.match(esquema, /datos\s+BYTEA\s+NOT NULL/);
  assert.match(esquema, /ON DELETE CASCADE/);
});

test("las fotos de los trabajos no se guardan en el codigo", () => {
  assert.equal(existsSync(join(raiz, "public/img/trabajos")), false);

  const datos = leerArchivo("db/datos.sql");
  assert.doesNotMatch(datos, /\.jpg|\.png|\.webp/);
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

test("los servicios adicionales guardan y consultan datos con parametros", () => {
  const servicios = leerArchivo("lib/servicios-adicionales.js");

  assert.match(servicios, /INSERT INTO servicios_adicionales \(nombre\)/);
  assert.match(servicios, /VALUES \(\$1\)/);
  assert.match(servicios, /\[nombre\]/);
  assert.match(servicios, /WHERE id = \$1/);
  assert.match(servicios, /\[id\]/);
});
