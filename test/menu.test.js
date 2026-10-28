import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("el boton del menu informa su estado y controla la navegacion", () => {
  const menu = leerArchivo("components/MenuPrincipal.js");

  assert.match(menu, /aria-expanded=\{menuAbierto\}/);
  assert.match(menu, /aria-controls="menu-principal"/);
  assert.match(menu, /id="menu-principal"/);
  assert.match(menu, /onClick=\{alternarMenu\}/);
});

test("el menu se cierra con Escape, al tocar fuera y al cambiar de ruta", () => {
  const menu = leerArchivo("components/MenuPrincipal.js");

  assert.match(menu, /evento\.key === "Escape"/);
  assert.match(menu, /pointerdown/);
  assert.match(menu, /removeEventListener\("keydown"/);
  assert.match(menu, /removeEventListener\("pointerdown"/);
  assert.match(menu, /\}, \[rutaActual\]\);/);
});

test("el menu bloquea el desplazamiento del fondo y respeta menos movimiento", () => {
  const menu = leerArchivo("components/MenuPrincipal.js");
  const estilos = leerArchivo("app/globals.css");

  assert.match(menu, /classList\.toggle\("cuerpo-menu-abierto", menuAbierto\)/);
  assert.match(estilos, /body\.cuerpo-menu-abierto \{/);
  assert.match(estilos, /overflow: hidden;/);
  assert.match(estilos, /@media \(prefers-reduced-motion: reduce\)/);
});

test("el menu movil abre solo en pantallas chicas y muestra una cruz", () => {
  const estilos = leerArchivo("app/globals.css");

  assert.match(estilos, /@media \(max-width: 899px\) \{\s*\.menu-navegacion\.menu-abierto \{/);
  assert.match(estilos, /\.menu-boton\[aria-expanded="true"\] \.menu-linea:nth-child\(1\)/);
  assert.match(estilos, /\.menu-boton\[aria-expanded="true"\] \.menu-linea:nth-child\(3\)/);
  assert.match(estilos, /max-height: 80vh;/);
});

test("la configuracion permite el origen del celular en desarrollo", () => {
  const configuracion = leerArchivo("next.config.mjs");

  assert.match(configuracion, /allowedDevOrigins/);
  assert.match(configuracion, /process\.env\.ORIGENES_DESARROLLO/);
  assert.doesNotMatch(configuracion, /NEXT_PUBLIC_/);
});
