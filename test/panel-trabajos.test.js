import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { nombreParaTextoAlt } from "../lib/comprimir-imagen.js";
import {
  ALTO_MAXIMO,
  ANCHO_MAXIMO,
  PESO_MAXIMO_BYTES,
  calcularMedidas,
} from "../lib/limites-imagen.js";
import {
  MAXIMO_FOTOS,
  revisarNombreServicioAdicional,
  revisarFotosParaActualizar,
  revisarServicioAdicional,
  revisarTrabajo,
} from "../lib/validacion-trabajos.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

const TRABAJO_VALIDO = {
  titulo: "Living con empapelado",
  servicio: "interiores",
  descripcion: "Renovamos el living con empapelado y alfombra nueva.",
  visible: true,
};

const FOTO_VALIDA = {
  id: 1,
  orden: 1,
  textoAlt: "Living terminado con alfombra clara",
};

test("el panel de trabajos normaliza los datos antes de guardarlos", () => {
  const revision = revisarTrabajo({
    titulo: "  Living con empapelado  ",
    servicio: "interiores",
    descripcion: "  Renovamos el living con empapelado y alfombra nueva.  ",
  });

  assert.equal(revision.error, undefined);
  assert.deepEqual(revision.datos, {
    titulo: "Living con empapelado",
    servicio: "interiores",
    descripcion: "Renovamos el living con empapelado y alfombra nueva.",
    visible: true,
  });
});

test("rechaza trabajos con titulo, servicio o descripcion invalidos", () => {
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, titulo: "ab" }).error,
    /al menos 3 caracteres/
  );
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, titulo: "a".repeat(121) }).error,
    /120 caracteres/
  );
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, servicio: "plomeria" }).error,
    /servicio disponible/
  );
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, descripcion: "poco" }).error,
    /al menos 5 caracteres/
  );
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, descripcion: "a".repeat(601) }).error,
    /600 caracteres/
  );
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, visible: "si" }).error,
    /visibilidad/
  );
  assert.match(revisarTrabajo(null).error, /al menos 3 caracteres/);
});

test("valida nombres de servicios adicionales y evita duplicados", () => {
  assert.deepEqual(revisarNombreServicioAdicional("  Colocación de pisos  ", []), {
    nombre: "Colocación de pisos",
  });
  assert.match(revisarNombreServicioAdicional(" ").error, /Escribí/);
  assert.match(revisarNombreServicioAdicional("a".repeat(81)).error, /80 caracteres/);
  assert.match(revisarNombreServicioAdicional("DURLOCK").error, /Ya existe/);
  assert.match(
    revisarNombreServicioAdicional("Pintura interior", ["pintura INTERIOR"])
      .error,
    /Ya existe/
  );
  assert.equal(revisarTrabajo({ ...TRABAJO_VALIDO, servicio: "extra-12" }).error, undefined);
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, servicio: "extra-0" }).error,
    /servicio disponible/
  );
  assert.match(
    revisarTrabajo({ ...TRABAJO_VALIDO, servicio: "extra-2147483648" }).error,
    /servicio disponible/
  );
});

test("valida y normaliza nombre, detalle y descripcion del servicio", () => {
  assert.deepEqual(
    revisarServicioAdicional({
      nombre: "  Colocación de pisos ",
      detalle: "  Terminación interior ",
      descripcion: "  Colocamos pisos con una terminación prolija. ",
    }),
    {
      datos: {
        nombre: "Colocación de pisos",
        detalle: "Terminación interior",
        descripcion: "Colocamos pisos con una terminación prolija.",
      },
    }
  );
  assert.match(
    revisarServicioAdicional({
      nombre: "Pisos",
      detalle: " ".repeat(1),
      descripcion: "Descripción válida",
    }).error,
    /detalle breve/
  );
  assert.match(
    revisarServicioAdicional({
      nombre: "Pisos",
      detalle: "d".repeat(121),
      descripcion: "Descripción válida",
    }).error,
    /120 caracteres/
  );
  assert.match(
    revisarServicioAdicional({
      nombre: "Pisos",
      detalle: "Detalle",
      descripcion: "cort",
    }).error,
    /al menos 5 caracteres/
  );
  assert.match(
    revisarServicioAdicional({
      nombre: "Pisos",
      detalle: "Detalle",
      descripcion: "d".repeat(601),
    }).error,
    /600 caracteres/
  );
});

test("ordena y valida la lista de fotos editadas", () => {
  const revision = revisarFotosParaActualizar([
    FOTO_VALIDA,
    { id: 2, orden: 2, textoAlt: "  Detalle de la moldura  " },
  ]);

  assert.equal(revision.error, undefined);
  assert.deepEqual(revision.fotos, [
    { id: 1, orden: 1, textoAlt: "Living terminado con alfombra clara" },
    { id: 2, orden: 2, textoAlt: "Detalle de la moldura" },
  ]);
});

test("rechaza fotos repetidas, sin texto o con orden invalido", () => {
  assert.match(revisarFotosParaActualizar([]).error, /No hay fotos/);
  assert.match(revisarFotosParaActualizar(null).error, /No hay fotos/);

  const demasiadas = Array.from({ length: MAXIMO_FOTOS + 1 }, (_, indice) => ({
    id: indice + 1,
    orden: indice + 1,
    textoAlt: `Foto numero ${indice + 1}`,
  }));
  assert.match(revisarFotosParaActualizar(demasiadas).error, /12 fotos/);

  assert.match(
    revisarFotosParaActualizar([{ ...FOTO_VALIDA, id: 0 }]).error,
    /número de foto/
  );
  assert.match(
    revisarFotosParaActualizar([FOTO_VALIDA, FOTO_VALIDA]).error,
    /repetida/
  );
  assert.match(
    revisarFotosParaActualizar([{ ...FOTO_VALIDA, orden: 0 }]).error,
    /orden/
  );
  assert.match(
    revisarFotosParaActualizar([{ ...FOTO_VALIDA, orden: MAXIMO_FOTOS + 1 }])
      .error,
    /orden/
  );
  assert.match(
    revisarFotosParaActualizar([{ ...FOTO_VALIDA, textoAlt: "ojo" }]).error,
    /al menos 5 caracteres/
  );
  assert.match(
    revisarFotosParaActualizar([
      { ...FOTO_VALIDA, textoAlt: "a".repeat(201) },
    ]).error,
    /200 caracteres/
  );
});

test("achica las fotos sin deformarlas ni agrandarlas", () => {
  assert.deepEqual(calcularMedidas(3200, 1800), { ancho: 1600, alto: 900 });
  assert.deepEqual(calcularMedidas(1800, 3200), { ancho: 900, alto: 1600 });
  assert.deepEqual(calcularMedidas(1376, 768), { ancho: 1376, alto: 768 });
  assert.deepEqual(calcularMedidas(800, 600), { ancho: 800, alto: 600 });
  assert.equal(calcularMedidas(0, 600), null);
  assert.equal(calcularMedidas("ancho", 600), null);
  assert.equal(calcularMedidas(null, null), null);
  assert.equal(ANCHO_MAXIMO, 1600);
  assert.equal(ALTO_MAXIMO, 1600);
});

test("el limite de peso coincide con el que informa la ruta", () => {
  assert.equal(PESO_MAXIMO_BYTES, 1500000);
  assert.ok(PESO_MAXIMO_BYTES < 2 * 1024 * 1024);
});

test("el texto alternativo se sugiere desde el nombre del archivo", () => {
  assert.equal(
    nombreParaTextoAlt("living_con-alfombra.jpg"),
    "living con alfombra"
  );
  assert.equal(nombreParaTextoAlt("  durlock__cielorraso .png"), "durlock cielorraso");
  assert.equal(nombreParaTextoAlt(null), "");
  assert.equal(nombreParaTextoAlt(""), "");
});

test("la pagina de trabajos exige sesion antes de leer la base", () => {
  const pagina = leerArchivo("app/admin/trabajos/page.js");
  const posicionSesion = pagina.indexOf("exigirSesion()");
  const posicionListado = pagina.indexOf("listarTrabajosPanel(");

  assert.ok(posicionSesion >= 0);
  assert.ok(posicionListado > posicionSesion);
  assert.match(pagina, /title: "Trabajos \| Sergio Decoraciones"/);
  assert.match(pagina, /PanelTrabajos/);
  assert.match(pagina, /NavegacionPanel actual="trabajos"/);
  assert.match(pagina, /action="\/api\/admin\/salir"/);
  assert.match(pagina, /method="post"/);
  assert.match(pagina, /role="alert"/);
  assert.equal((pagina.match(/<h1>/g) ?? []).length, 1);
});

test("la navegacion del panel cambia entre consultas y trabajos", () => {
  const navegacion = leerArchivo("components/NavegacionPanel.js");

  assert.match(navegacion, /href="\/admin\/consultas"/);
  assert.match(navegacion, /href="\/admin\/trabajos"/);
  assert.match(navegacion, /href="\/admin\/servicios"/);
  assert.match(navegacion, /actual === "consultas"/);
  assert.match(navegacion, /actual === "trabajos"/);
  assert.match(navegacion, /actual === "servicios"/);
  assert.match(navegacion, /aria-current/);
  assert.match(navegacion, /aria-label="Secciones del panel"/);
});

test("la api de trabajos exige sesion en las cuatro acciones", () => {
  const ruta = leerArchivo("app/api/admin/trabajos/route.js");

  assert.match(ruta, /export async function GET/);
  assert.match(ruta, /export async function POST/);
  assert.match(ruta, /export async function PATCH/);
  assert.match(ruta, /export async function DELETE/);
  assert.equal((ruta.match(/leerSesion\(\)/g) ?? []).length, 4);
  assert.equal((ruta.match(/return sinSesion\(\)/g) ?? []).length, 4);
  assert.match(ruta, /status: 401/);
  assert.match(ruta, /listarTrabajosPanel/);
  assert.match(ruta, /revisarTrabajo/);
  assert.match(ruta, /crearTrabajo/);
  assert.match(ruta, /actualizarTrabajo/);
  assert.match(ruta, /borrarTrabajo/);
  assert.match(ruta, /existeServicioAdicional/);
  assert.equal((ruta.match(/existeServicioAdicional\(/g) ?? []).length, 2);
  assert.match(ruta, /startsWith\("extra-"\)/);
  assert.match(ruta, /Number\.isInteger/);
  assert.match(ruta, /status: 201/);
  assert.match(ruta, /status: 404/);
});

test("la api de servicios adicionales exige sesion para listar y crear", () => {
  const ruta = leerArchivo("app/api/admin/servicios/route.js");

  assert.match(ruta, /export async function GET/);
  assert.match(ruta, /export async function POST/);
  assert.equal((ruta.match(/leerSesion\(\)/g) ?? []).length, 2);
  assert.match(ruta, /listarServiciosAdicionales/);
  assert.match(ruta, /crearServicioAdicional/);
  assert.match(ruta, /revisarServicioAdicional/);
  assert.match(ruta, /status: 401/);
  assert.match(ruta, /status: 409/);
  assert.match(ruta, /Cache-Control/);
});

test("los trabajos eligen servicios existentes sin crearlos en el formulario", () => {
  const formulario = leerArchivo("components/FormularioTrabajo.js");
  const panel = leerArchivo("components/PanelTrabajos.js");

  assert.match(formulario, /serviciosAdicionalesIniciales\.map/);
  assert.doesNotMatch(formulario, /fetch\("\/api\/admin\/servicios"/);
  assert.doesNotMatch(formulario, /Agregar un nuevo servicio/);
  assert.match(formulario, /serviciosAdicionalesIniciales/);
  assert.match(panel, /serviciosAdicionalesIniciales/);
  assert.match(panel, /servicio_nombre/);
});

test("el panel administra servicios desde una pagina privada separada", () => {
  const pagina = leerArchivo("app/admin/servicios/page.js");
  const panel = leerArchivo("components/PanelServicios.js");

  assert.match(pagina, /await exigirSesion\(\)/);
  assert.match(pagina, /listarServiciosAdicionales/);
  assert.match(pagina, /NavegacionPanel actual="servicios"/);
  assert.match(pagina, /PanelServicios/);
  assert.match(panel, /fetch\("\/api\/admin\/servicios"/);
  assert.match(panel, /Guardar servicio/);
  assert.match(panel, /servicios\.map/);
  assert.doesNotMatch(panel, /\/api\/admin\/trabajos/);
});

test("crear servicios revalida la pagina de servicios y no crea trabajos", () => {
  const ruta = leerArchivo("app/api/admin/servicios/route.js");
  const panel = leerArchivo("components/PanelServicios.js");

  assert.match(ruta, /revalidatePath\("\/servicios"\)/);
  assert.match(panel, /fetch\("\/api\/admin\/servicios"/);
  assert.doesNotMatch(panel, /\/api\/admin\/trabajos/);
});

test("la API invalida la ficha pública al crear un servicio", () => {
  const ruta = leerArchivo("app/api/admin/servicios/route.js");

  assert.match(ruta, /revalidatePath\("\/servicios"\)/);
});

test("las mutaciones del panel revalidan las paginas publicas de trabajos", () => {
  const revalidacion = leerArchivo("lib/revalidar-trabajos.js");
  const trabajos = leerArchivo("app/api/admin/trabajos/route.js");
  const fotos = leerArchivo("app/api/admin/trabajos/[id]/fotos/route.js");

  assert.match(revalidacion, /revalidatePath\("\/"\)/);
  assert.match(revalidacion, /revalidatePath\("\/trabajos"\)/);
  assert.equal((trabajos.match(/revalidarTrabajosPublicos\(\)/g) ?? []).length, 3);
  assert.equal((fotos.match(/revalidarTrabajosPublicos\(\)/g) ?? []).length, 3);
});

test("la api de fotos exige sesion y valida el peso y el maximo", () => {
  const ruta = leerArchivo("app/api/admin/trabajos/[id]/fotos/route.js");

  assert.match(ruta, /export async function POST/);
  assert.match(ruta, /export async function PATCH/);
  assert.match(ruta, /export async function DELETE/);
  assert.equal((ruta.match(/await leerSesion\(\)/g) ?? []).length, 3);
  assert.equal((ruta.match(/return sinSesion\(\)/g) ?? []).length, 3);
  assert.match(ruta, /status: 401/);
  assert.match(ruta, /MAXIMO_FOTOS/);
  assert.match(ruta, /status: 409/);
  assert.match(ruta, /PESO_MAXIMO_BYTES/);
  assert.match(ruta, /1,5 MB/);
  assert.match(ruta, /revisarImagen/);
  assert.match(ruta, /detectarTipo/);
  assert.match(ruta, /medirImagen/);
  assert.match(ruta, /formulario\.get\("foto"\)/);
  assert.match(ruta, /formulario\.get\("texto_alt"\)/);
  assert.match(ruta, /agregarFoto/);
});

test("la edicion de fotos guarda el orden y protege la ultima", () => {
  const ruta = leerArchivo("app/api/admin/trabajos/[id]/fotos/route.js");

  assert.match(ruta, /revisarFotosParaActualizar/);
  assert.match(ruta, /actualizarFotos/);
  assert.match(ruta, /fotos\.length <= 1/);
  assert.match(ruta, /al menos una foto/);
  assert.match(ruta, /borrarFoto/);
  assert.match(ruta, /status: 404/);
  assert.match(ruta, /Number\.isInteger/);
});

test("el listado del panel incluye los ocultos y el publico no", () => {
  const trabajos = leerArchivo("lib/trabajos.js");

  assert.match(
    trabajos,
    /SELECT \$\{CAMPOS_PANEL\}[\s\S]*FROM \$\{TABLA_TRABAJOS\}[\s\S]*ORDER BY t\.id DESC/
  );
  assert.match(trabajos, /WHERE t\.visible = TRUE[\s\S]*ORDER BY t\.id DESC/);
  assert.match(trabajos, /LEFT JOIN servicios_adicionales/);
  assert.match(trabajos, /FROM trabajo_fotos/);
  assert.match(trabajos, /ORDER BY orden, id/);
  assert.match(trabajos, /COALESCE\(MAX\(orden\), 0\) \+ 1/);
  assert.match(trabajos, /DELETE FROM trabajos WHERE id = \$1/);
  assert.match(trabajos, /DELETE FROM trabajo_fotos/);
  assert.match(trabajos, /COUNT\(\*\) FROM trabajo_fotos WHERE trabajo_id = \$2\) > 1/);
});

test("las mutaciones retornan solo columnas de trabajos y no alias del join", () => {
  const trabajos = leerArchivo("lib/trabajos.js");

  assert.match(trabajos, /const CAMPOS_MUTACION = "id, titulo, servicio, descripcion, visible"/);
  assert.match(trabajos, /INSERT INTO trabajos[\s\S]*RETURNING \$\{CAMPOS_MUTACION\}/);
  assert.match(trabajos, /UPDATE trabajos[\s\S]*RETURNING \$\{CAMPOS_MUTACION\}/);
  assert.doesNotMatch(trabajos, /RETURNING \$\{CAMPOS_PANEL\}/);
});

test("las consultas de la base viajan siempre con parametros", () => {
  const trabajos = leerArchivo("lib/trabajos.js");

  assert.match(trabajos, /sql\.query\(/);
  assert.match(trabajos, /WHERE id = \$1/);
  assert.match(trabajos, /\[id\]/);
  assert.match(trabajos, /unnest\(\$2::int\[\], \$3::text\[\], \$4::int\[\]\)/);
  assert.match(trabajos, /ANY\(\$1::int\[\]\)/);
  assert.doesNotMatch(trabajos, /trabajo_id = \$\{/);
});

test("la ruta publica de la foto oculta los trabajos que no se ven", () => {
  const ruta = leerArchivo("app/api/trabajos/[id]/foto/route.js");

  assert.match(ruta, /await params/);
  assert.match(ruta, /searchParams\.get\("foto"\)/);
  assert.match(ruta, /leerFoto/);
  assert.match(ruta, /Content-Type/);
  assert.match(ruta, /leerSesion/);
  assert.match(ruta, /!foto\.visible/);
  assert.match(ruta, /no-store/);
  assert.match(ruta, /status: 404/);
});

test("el panel lista los trabajos nuevos primero y con su portada", () => {
  const panel = leerArchivo("components/PanelTrabajos.js");

  assert.match(panel, /trabajo\.fotos\?\.\[0\]/);
  assert.match(panel, /urlFoto\(trabajo\.id, portada\.id\)/);
  assert.match(panel, /alt=\{portada\.texto_alt\}/);
  assert.match(panel, /className="trabajo-sin-foto"/);
  assert.match(panel, /trabajos\.map/);
  assert.match(panel, /Agregar trabajo/);
  assert.match(panel, /Editar/);
});

test("el panel oculta, muestra y borra con confirmacion", () => {
  const panel = leerArchivo("components/PanelTrabajos.js");

  assert.match(panel, /window\.confirm/);
  assert.match(panel, /no se puede recuperar/);
  assert.match(panel, /visible: !trabajo\.visible/);
  assert.match(panel, /"Ocultar"/);
  assert.match(panel, /"Mostrar"/);
  assert.match(panel, /method: "DELETE"/);
  assert.match(panel, /\/api\/admin\/trabajos/);
  assert.match(panel, /router\.push\("\/admin"\)/);
  assert.match(panel, /role="status"/);
  assert.match(panel, /role="alert"/);
  assert.match(panel, /aria-label=\{`Editar el trabajo/);
  assert.match(panel, /aria-label=\{`Borrar el trabajo/);
});

test("el formulario comprime, conserva el orden y pide texto alternativo", () => {
  const formulario = leerArchivo("components/FormularioTrabajo.js");

  assert.match(formulario, /comprimirImagen/);
  assert.match(formulario, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.match(formulario, /multiple/);
  assert.match(formulario, /MAXIMO_FOTOS/);
  assert.match(formulario, /revisarTrabajo/);
  assert.match(formulario, /revisarTextoAlt/);
  assert.match(formulario, /nombreParaTextoAlt/);
  assert.match(formulario, /moverFoto\(indice, -1\)/);
  assert.match(formulario, /moverFoto\(indice, 1\)/);
  assert.match(formulario, /fotos\.length <= 1/);
  assert.match(formulario, /foto-portada/);
  assert.match(formulario, /La primera foto es la portada/);
  assert.doesNotMatch(formulario, /dangerouslySetInnerHTML/);
});

test("el formulario sube las fotos después de crear o editar el trabajo", () => {
  const formulario = leerArchivo("components/FormularioTrabajo.js");

  assert.match(formulario, /method: "POST"/);
  assert.match(formulario, /method: "PATCH"/);
  assert.match(formulario, /new FormData\(\)/);
  assert.match(formulario, /formulario\.append\("foto"/);
  assert.match(formulario, /formulario\.append\("texto_alt"/);
  assert.match(formulario, /method: "DELETE"/);
  assert.match(formulario, /orden: indice \+ 1/);
  assert.match(formulario, /`\/api\/admin\/trabajos\/\$\{trabajoId\}\/fotos`/);
});

test("los trabajos visibles alimentan las paginas publicas", () => {
  const inicio = leerArchivo("app/page.js");
  const pagina = leerArchivo("app/trabajos/page.js");

  assert.match(inicio, /obtenerTrabajosDestacados/);
  assert.match(pagina, /obtenerTrabajos\(/);
});

test("los estilos del panel de trabajos usan las variables de la marca", () => {
  const css = leerArchivo("app/globals.css");

  assert.match(css, /\.admin-navegacion/);
  assert.match(css, /\.trabajo-fila/);
  assert.match(css, /\.trabajo-miniatura/);
  assert.match(css, /\.formulario-trabajo/);
  assert.match(css, /\.fotos-editor/);
  assert.match(css, /\.foto-editor/);
  assert.match(css, /\.foto-portada/);
  assert.match(css, /\.boton-archivo/);
  assert.match(css, /\.estado-visible/);
  assert.match(css, /\.estado-oculto/);
  assert.match(css, /var\(--color-acento\)/);
  assert.match(css, /var\(--fuente-titulos\)/);
});
