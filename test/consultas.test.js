import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  MAXIMO_POR_MINUTO,
  permitirConsulta,
  reiniciarLimites,
} from "../lib/limite.js";
import { LIMITES, validarConsulta } from "../lib/validacion.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

function leerArchivo(ruta) {
  return readFileSync(join(raiz, ruta), "utf8");
}

test("valida una consulta completa y quita los espacios sobrantes", () => {
  const resultado = validarConsulta({
    nombre: "  María Pérez  ",
    telefono: "  +54 9 3837 000000  ",
    mensaje: "  Quiero pintar un dormitorio.  ",
  });

  assert.equal(resultado.valido, true);
  assert.deepEqual(resultado.errores, {});
  assert.deepEqual(resultado.datos, {
    nombre: "María Pérez",
    telefono: "+54 9 3837 000000",
    mensaje: "Quiero pintar un dormitorio.",
  });
});

test("exige nombre, telefono y mensaje", () => {
  const resultado = validarConsulta({});

  assert.equal(resultado.valido, false);
  assert.ok(resultado.errores.nombre);
  assert.ok(resultado.errores.telefono);
  assert.ok(resultado.errores.mensaje);
});

test("tolera un cuerpo vacio, nulo o que no sea un objeto", () => {
  assert.equal(validarConsulta(null).valido, false);
  assert.equal(validarConsulta("texto").valido, false);
  assert.equal(validarConsulta().valido, false);
});

test("rechaza los campos que superan el largo permitido", () => {
  const resultado = validarConsulta({
    nombre: "a".repeat(LIMITES.nombre + 1),
    telefono: "3".repeat(LIMITES.telefono + 1),
    mensaje: "b".repeat(LIMITES.mensaje + 1),
  });

  assert.equal(resultado.valido, false);
  assert.ok(resultado.errores.nombre);
  assert.ok(resultado.errores.telefono);
  assert.ok(resultado.errores.mensaje);
});

test("rechaza un telefono con letras o sin numeros", () => {
  assert.equal(
    validarConsulta({
      nombre: "Sergio",
      telefono: "3837-ABC",
      mensaje: "Consulta",
    }).valido,
    false
  );

  assert.equal(
    validarConsulta({
      nombre: "Sergio",
      telefono: "+()-",
      mensaje: "Consulta",
    }).valido,
    false
  );
});

test("acepta numeros, espacios y los signos del telefono", () => {
  const resultado = validarConsulta({
    nombre: "Sergio",
    telefono: "+54 (9) 3837-000000",
    mensaje: "Consulta por molduras",
  });

  assert.equal(resultado.valido, true);
});

test("limita las consultas por minuto y libera al pasar la ventana", () => {
  reiniciarLimites();
  const clave = "prueba-limite";

  for (let intento = 0; intento < MAXIMO_POR_MINUTO; intento += 1) {
    assert.equal(permitirConsulta(clave, 1000), true);
  }

  assert.equal(permitirConsulta(clave, 1000), false);
  assert.equal(permitirConsulta(clave, 1000 + 60 * 1000), true);

  reiniciarLimites();
});

test("la ruta de consultas valida, limita y responde con los estados", () => {
  const ruta = leerArchivo("app/api/consultas/route.js");

  assert.match(ruta, /export async function POST/);
  assert.match(ruta, /permitirConsulta/);
  assert.match(ruta, /validarConsulta/);
  assert.match(ruta, /guardarConsulta/);
  assert.match(ruta, /status: 201/);
  assert.match(ruta, /status: 400/);
  assert.match(ruta, /status: 429/);
  assert.match(ruta, /status: 500/);
});

test("el guardado de consultas usa SQL con parametros", () => {
  const consulta = leerArchivo("lib/consultas.js");

  assert.match(consulta, /INSERT INTO consultas/);
  assert.match(consulta, /VALUES \(\$1, \$2, \$3\)/);
  assert.match(consulta, /\[consulta\.nombre, consulta\.telefono, consulta\.mensaje\]/);
});

test("el formulario avisa para que se usan los datos y muestra los estados", () => {
  const formulario = leerArchivo("components/FormularioConsulta.js");

  assert.match(formulario, /name="nombre"/);
  assert.match(formulario, /name="telefono"/);
  assert.match(formulario, /name="mensaje"/);
  assert.match(formulario, /\/api\/consultas/);
  assert.match(formulario, /solo para responder esta consulta/i);
  assert.match(formulario, /role="status"/);
  assert.match(formulario, /role="alert"/);
  assert.match(formulario, /aria-invalid/);
  assert.match(formulario, /aria-describedby/);
});

test("las paginas de nosotros y contacto tienen su SEO y un solo h1", () => {
  const nosotros = leerArchivo("app/nosotros/page.js");
  const contacto = leerArchivo("app/contacto/page.js");

  assert.match(nosotros, /title: "Nosotros \| Sergio Decoraciones"/);
  assert.match(nosotros, /Conocé a Sergio y cómo trabaja/);
  assert.equal((nosotros.match(/<h1>/g) ?? []).length, 1);
  assert.match(nosotros, /alt="Living con una pared empapelada y molduras blancas"/);

  assert.match(contacto, /title: "Contacto \| Sergio Decoraciones"/);
  assert.match(contacto, /Escribinos por WhatsApp, llamanos o dejá tu consulta/);
  assert.equal((contacto.match(/<h1>/g) ?? []).length, 1);
  assert.match(contacto, /FormularioConsulta/);
  assert.match(contacto, /BotonWhatsApp/);
  assert.match(contacto, /BotonLlamar/);
});
