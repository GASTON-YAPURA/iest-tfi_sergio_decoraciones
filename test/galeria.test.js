import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { filtrarTrabajosPorServicio } from "../lib/servicios.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("la pagina de trabajos tiene su titulo, descripcion y un solo h1", () => {
  const pagina = leerArchivo("app/trabajos/page.js");

  assert.match(
    pagina,
    /title: "Trabajos terminados \| Sergio Decoraciones"/
  );
  assert.match(pagina, /obtenerTrabajos/);
  assert.match(pagina, /GaleriaTrabajos/);
  assert.equal((pagina.match(/<h1>/g) ?? []).length, 1);
});

test("la api de trabajos devuelve los trabajos", () => {
  const ruta = leerArchivo("app/api/trabajos/route.js");

  assert.match(ruta, /export async function GET/);
  assert.match(ruta, /obtenerTrabajos/);
  assert.match(ruta, /NextResponse\.json/);
});

test("el filtro usa los seis servicios y la opcion Todos", () => {
  const filtro = leerArchivo("components/FiltroServicios.js");

  assert.match(filtro, /id: "todos"/);
  assert.match(filtro, /SERVICIOS\.map/);
  assert.match(filtro, /aria-pressed/);
});

test("la galeria filtra por servicio y abre el visor", () => {
  const galeria = leerArchivo("components/GaleriaTrabajos.js");

  assert.match(galeria, /filtrarTrabajosPorServicio/);
  assert.match(galeria, /TarjetaTrabajo/);
  assert.match(galeria, /VisorFoto/);
});

test("el filtro deja solo los trabajos del servicio elegido", () => {
  const trabajos = [
    { id: 1, servicio: "pintura" },
    { id: 2, servicio: "durlock" },
    { id: 3, servicio: "pintura" },
  ];

  assert.deepEqual(filtrarTrabajosPorServicio(trabajos, "todos"), trabajos);
  assert.deepEqual(
    filtrarTrabajosPorServicio(trabajos, "pintura").map((trabajo) => trabajo.id),
    [1, 3]
  );
  assert.deepEqual(filtrarTrabajosPorServicio(trabajos, "molduras"), []);
});

test("el visor es un dialogo accesible con la foto", () => {
  const visor = leerArchivo("components/VisorFoto.js");

  assert.match(visor, /role="dialog"/);
  assert.match(visor, /aria-modal="true"/);
  assert.match(visor, /Escape/);
  assert.match(visor, /aria-label="Cerrar la foto"/);
  assert.match(visor, /alt=\{trabajo\.texto_alt\}/);
});
