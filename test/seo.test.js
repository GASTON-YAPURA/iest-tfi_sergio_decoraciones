import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

const PAGINAS = [
  ["app/page.js", "/"],
  ["app/servicios/page.js", "/servicios"],
  ["app/trabajos/page.js", "/trabajos"],
  ["app/nosotros/page.js", "/nosotros"],
  ["app/contacto/page.js", "/contacto"],
];

test("el layout arma la direccion base y los datos para compartir", () => {
  const layout = leerArchivo("app/layout.js");

  assert.match(layout, /metadataBase: new URL\(obtenerUrlSitio\(\)\)/);
  assert.match(layout, /openGraph: \{/);
  assert.match(layout, /twitter: \{/);
  assert.match(layout, /IMAGEN_COMPARTIDA/);
  assert.match(layout, /alternates: \{\s*canonical: "\/"/);
});

test("la direccion del sitio sale de SITIO_URL o de Vercel", () => {
  const sitio = leerArchivo("lib/sitio.js");

  assert.match(sitio, /process\.env\.SITIO_URL/);
  assert.match(sitio, /VERCEL_PROJECT_PRODUCTION_URL/);
  assert.match(sitio, /logo-horizontal-principal\.png/);
});

test("cada pagina publica tiene su direccion canonica y su vista previa", () => {
  for (const [archivo, ruta] of PAGINAS) {
    const pagina = leerArchivo(archivo);

    assert.match(
      pagina,
      /title: (?:"[^"]+"|TITULO_SITIO)/,
      `falta el titulo en ${archivo}`
    );
    assert.match(pagina, /description:/, `falta la descripcion en ${archivo}`);
    assert.match(
      pagina,
      new RegExp(`canonical: "${ruta === "/" ? "\\/" : ruta}"`),
      `falta la canonica de ${ruta}`
    );
    assert.match(pagina, /images: \[IMAGEN_COMPARTIDA\]/);
    assert.equal((pagina.match(/<h1>/g) ?? []).length, 1, `h1 de ${ruta}`);
  }
});

test("robots.txt deja el sitio publico y bloquea el panel y la API", () => {
  const robots = leerArchivo("app/robots.js");

  assert.match(robots, /allow: "\/"/);
  assert.match(robots, /"\/admin"/);
  assert.match(robots, /"\/api\/"/);
  assert.match(robots, /sitemap: crearUrlSitio\("\/sitemap\.xml"\)/);
});

test("el sitemap lista las paginas publicas y no el panel", () => {
  const sitemap = leerArchivo("app/sitemap.js");

  for (const [, ruta] of PAGINAS) {
    assert.ok(
      sitemap.includes(`ruta: "${ruta}"`),
      `falta ${ruta} en el sitemap`
    );
  }

  assert.doesNotMatch(sitemap, /admin/);
});
