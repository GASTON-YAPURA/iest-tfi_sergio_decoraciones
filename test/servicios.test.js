import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { SERVICIOS, obtenerNombreServicio } from "../lib/servicios.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("hay seis servicios con los identificadores de la base", () => {
  assert.equal(SERVICIOS.length, 6);
  assert.deepEqual(
    SERVICIOS.map((servicio) => servicio.id),
    ["interiores", "durlock", "pintura", "enduido", "machimbre", "molduras"]
  );
});

test("cada servicio tiene nombre, detalle, descripcion y tareas", () => {
  for (const servicio of SERVICIOS) {
    assert.ok(servicio.nombre.length > 0);
    assert.ok(servicio.detalle.length > 0);
    assert.ok(servicio.descripcion.length > 0);
    assert.ok(Array.isArray(servicio.incluye));
    assert.ok(servicio.incluye.length > 0);
  }
});

test("obtenerNombreServicio devuelve el nombre visible", () => {
  assert.equal(obtenerNombreServicio("durlock"), "Durlock");
  assert.equal(obtenerNombreServicio("interiores"), "Trabajos de interiores");
  assert.equal(obtenerNombreServicio("otro"), "otro");
});

test("la pagina de servicios tiene su titulo, descripcion y un solo h1", () => {
  const pagina = leerArchivo("app/servicios/page.js");

  assert.match(pagina, /title: "Servicios \| Sergio Decoraciones"/);
  assert.match(
    pagina,
    /Durlock, pintura, enduido, empapelado, alfombra, machimbre y/
  );
  assert.match(pagina, /SERVICIOS\.map/);
  assert.equal((pagina.match(/<h1>/g) ?? []).length, 1);
});
