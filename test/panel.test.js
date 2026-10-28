import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { hash } from "bcryptjs";
import {
  DURACION_SESION_MS,
  crearValorSesion,
  leerValorSesion,
  verificarCredenciales,
} from "../lib/acceso.js";
import { formatearFechaConsulta } from "../lib/fechas.js";
import {
  MAXIMO_INTENTOS,
  ingresoBloqueado,
  limpiarIngresos,
  registrarIngresoFallido,
  reiniciarLimitesIngreso,
} from "../lib/limite.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

process.env.SESION_SECRETA = "secreto-de-prueba-para-las-sesiones";
process.env.ADMIN_USUARIO = "sergio";

test("la sesion firmada se crea y se puede leer", () => {
  const valor = crearValorSesion("sergio", 1000);
  const datos = leerValorSesion(valor, 1000);

  assert.ok(datos);
  assert.equal(datos.usuario, "sergio");
  assert.equal(datos.exp, 1000 + DURACION_SESION_MS);
});

test("la sesion vence a las 8 horas", () => {
  const valor = crearValorSesion("sergio", 1000);

  assert.ok(leerValorSesion(valor, 1000 + DURACION_SESION_MS - 1));
  assert.equal(leerValorSesion(valor, 1000 + DURACION_SESION_MS), null);
});

test("rechaza una sesion alterada o con formato invalido", () => {
  const valor = crearValorSesion("sergio", 1000);
  const alterado = `${valor.slice(0, 2)}X${valor.slice(3)}`;

  assert.equal(leerValorSesion(alterado, 1000), null);
  assert.equal(leerValorSesion("sin-punto", 1000), null);
  assert.equal(leerValorSesion("a.b.c", 1000), null);
  assert.equal(leerValorSesion(null, 1000), null);
  assert.equal(leerValorSesion(undefined, 1000), null);
});

test("verifica las credenciales contra el hash del entorno", async () => {
  process.env.ADMIN_CLAVE_HASH = await hash("ClaveDePrueba123!", 4);

  assert.equal(
    await verificarCredenciales("sergio", "ClaveDePrueba123!"),
    true
  );
  assert.equal(await verificarCredenciales("sergio", "otra-clave"), false);
  assert.equal(
    await verificarCredenciales("otro-usuario", "ClaveDePrueba123!"),
    false
  );
  assert.equal(await verificarCredenciales("", "ClaveDePrueba123!"), false);
  assert.equal(await verificarCredenciales(null, null), false);
});

test("acepta el hash con los $ escapados de .env.local", async () => {
  const original = await hash("OtraClaveDePrueba123!", 4);
  process.env.ADMIN_CLAVE_HASH = original.replaceAll("$", "\\$");

  assert.equal(
    await verificarCredenciales("sergio", "OtraClaveDePrueba123!"),
    true
  );
});

test("bloquea el ingreso despues de 5 intentos fallidos", () => {
  reiniciarLimitesIngreso();
  const clave = "prueba-ingreso";

  for (let intento = 0; intento < MAXIMO_INTENTOS; intento += 1) {
    assert.equal(ingresoBloqueado(clave, 1000), false);
    registrarIngresoFallido(clave, 1000);
  }

  assert.equal(ingresoBloqueado(clave, 1000), true);
  assert.equal(ingresoBloqueado(clave, 1000 + 15 * 60 * 1000), false);

  reiniciarLimitesIngreso();
});

test("un ingreso correcto limpia los intentos fallidos", () => {
  reiniciarLimitesIngreso();
  const clave = "prueba-limpieza";

  registrarIngresoFallido(clave, 1000);
  limpiarIngresos(clave);

  assert.equal(ingresoBloqueado(clave, 1000), false);
});

test("formatea las fechas de las consultas en la hora de Tinogasta", () => {
  assert.equal(
    formatearFechaConsulta("2026-10-28T15:30:00Z"),
    "28/10/2026, 12:30"
  );
  assert.equal(formatearFechaConsulta("no-es-una-fecha"), "Sin fecha");
});

test("la ruta de ingreso usa credenciales, limite y error generico", () => {
  const ruta = leerArchivo("app/api/admin/ingresar/route.js");

  assert.match(ruta, /export async function POST/);
  assert.match(ruta, /verificarCredenciales/);
  assert.match(ruta, /ingresoBloqueado/);
  assert.match(ruta, /registrarIngresoFallido/);
  assert.match(ruta, /limpiarIngresos/);
  assert.match(ruta, /crearSesion/);
  assert.match(ruta, /Usuario o contraseña incorrectos/);
  assert.match(ruta, /status: 401/);
  assert.match(ruta, /status: 429/);
});

test("la ruta de consultas exige sesion para leer y actualizar", () => {
  const ruta = leerArchivo("app/api/admin/consultas/route.js");

  assert.match(ruta, /export async function GET/);
  assert.match(ruta, /export async function PATCH/);
  assert.equal((ruta.match(/leerSesion\(\)/g) ?? []).length, 2);
  assert.match(ruta, /status: 401/);
  assert.match(ruta, /marcarConsultaAtendida/);
  assert.match(ruta, /Number\.isInteger/);
});

test("la ruta de salir borra la cookie y vuelve al ingreso", () => {
  const ruta = leerArchivo("app/api/admin/salir/route.js");

  assert.match(ruta, /export async function POST/);
  assert.match(ruta, /borrarSesion/);
  assert.match(ruta, /redirect/);
  assert.match(ruta, /\/admin/);
  assert.match(ruta, /303/);
});

test("la cookie de sesion es httpOnly, secure y sameSite strict", () => {
  const sesion = leerArchivo("lib/sesion.js");

  assert.match(sesion, /httpOnly: true/);
  assert.match(sesion, /secure: process\.env\.NODE_ENV === "production"/);
  assert.match(sesion, /sameSite: "strict"/);
  assert.match(sesion, /DURACION_SESION_MS/);
  assert.match(sesion, /redirect\("\/admin"\)/);
});

test("el listado y la marca de atendida usan SQL con parametros", () => {
  const consultas = leerArchivo("lib/consultas.js");

  assert.match(consultas, /ORDER BY creada_en DESC, id DESC/);
  assert.match(consultas, /UPDATE consultas/);
  assert.match(consultas, /SET atendida = TRUE/);
  assert.match(consultas, /WHERE id = \$1/);
  assert.match(consultas, /\[id\]/);
});

test("el panel no aparece en el menu y las paginas son noindex", () => {
  const menu = leerArchivo("components/MenuPrincipal.js");
  const layout = leerArchivo("app/admin/layout.js");

  assert.doesNotMatch(menu, /\/admin/);
  assert.match(layout, /robots: \{/);
  assert.match(layout, /index: false/);
  assert.match(layout, /follow: false/);
});

test("el ingreso usa el formulario y redirige si ya hay sesion", () => {
  const pagina = leerArchivo("app/admin/page.js");

  assert.match(pagina, /title: "Ingreso \| Sergio Decoraciones"/);
  assert.match(pagina, /FormularioIngreso/);
  assert.match(pagina, /logo-sd-dorado\.png/);
  assert.match(pagina, /Monograma SD de Sergio Decoraciones/);
  assert.equal((pagina.match(/<h1>/g) ?? []).length, 1);
  assert.match(pagina, /redirect\("\/admin\/consultas"\)/);
});

test("la pagina de consultas exige sesion antes de leer la base", () => {
  const pagina = leerArchivo("app/admin/consultas/page.js");
  const posicionSesion = pagina.indexOf("exigirSesion()");
  const posicionConsulta = pagina.indexOf("obtenerConsultas()");

  assert.ok(posicionSesion >= 0);
  assert.ok(posicionConsulta > posicionSesion);
  assert.match(pagina, /title: "Consultas \| Sergio Decoraciones"/);
  assert.match(pagina, /TablaConsultas/);
  assert.match(pagina, /action="\/api\/admin\/salir"/);
  assert.match(pagina, /method="post"/);
  assert.match(pagina, /formatearFechaConsulta/);
  assert.equal((pagina.match(/<h1>/g) ?? []).length, 1);
});

test("la tabla muestra los datos, el estado y las acciones", () => {
  const tabla = leerArchivo("components/TablaConsultas.js");

  for (const etiqueta of [
    "Fecha",
    "Nombre",
    "Teléfono",
    "Mensaje",
    "Estado",
    "Acciones",
  ]) {
    assert.match(tabla, new RegExp(etiqueta));
  }

  assert.match(tabla, /Responder por WhatsApp/);
  assert.match(tabla, /Marcar como atendida/);
  assert.match(tabla, /\/api\/admin\/consultas/);
  assert.match(tabla, /role="alert"/);
  assert.match(tabla, /role="status"/);
  assert.match(tabla, /aria-label/);
  assert.match(tabla, /visualmente-oculto/);
  assert.match(tabla, /Todavía no recibiste consultas/);
  assert.match(tabla, /router\.push\("\/admin"\)/);
  assert.match(tabla, /router\.refresh\(\)/);
});

test("los estilos del panel usan las variables de la marca", () => {
  const css = leerArchivo("app/globals.css");

  assert.match(css, /\.visualmente-oculto/);
  assert.match(css, /\.admin-tarjeta/);
  assert.match(css, /\.tabla-consultas/);
  assert.match(css, /\.estado-pendiente/);
  assert.match(css, /\.estado-atendida/);
  assert.match(css, /@media \(max-width: 699px\)/);
  assert.match(css, /var\(--color-acento\)/);
});
