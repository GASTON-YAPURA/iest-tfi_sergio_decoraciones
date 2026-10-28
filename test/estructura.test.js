import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("globals.css define las variables de la marca", () => {
  const css = leerArchivo("app/globals.css");
  const variables = [
    "--color-fondo",
    "--color-principal",
    "--color-acento",
    "--color-secundario",
    "--color-acento-suave",
    "--fuente-titulos",
    "--fuente-texto",
    "--radio-borde",
  ];

  for (const variable of variables) {
    assert.match(css, new RegExp(`${variable}\\s*:`));
  }
});

test("el layout declara el idioma español", () => {
  const layout = leerArchivo("app/layout.js");
  assert.match(layout, /<html lang="es"/);
});

test("la portada usa el titulo de la marca", () => {
  const inicio = leerArchivo("app/page.js");
  assert.match(inicio, /Decoraciones que transforman tus espacios/);
});

test("la portada tiene el boton Ver trabajos", () => {
  const inicio = leerArchivo("app/page.js");

  assert.match(inicio, /Ver trabajos/);
  assert.match(inicio, /href="\/trabajos"/);
  assert.equal((inicio.match(/<h1>/g) ?? []).length, 1);
});

test("el inicio muestra trabajos destacados y el resumen de servicios", () => {
  const inicio = leerArchivo("app/page.js");

  assert.match(inicio, /obtenerTrabajosDestacados/);
  assert.match(inicio, /TarjetaTrabajo/);
  assert.match(inicio, /Trabajos destacados/);
  assert.match(inicio, /SERVICIOS\.map/);
});
