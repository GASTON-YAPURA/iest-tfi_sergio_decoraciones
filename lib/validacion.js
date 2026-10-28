// Limites de los campos de la tabla consultas (ver docs/05 - DATOS.md).
export const LIMITES = {
  nombre: 80,
  telefono: 30,
  mensaje: 1000,
};

// Solo se aceptan numeros, espacios y los simbolos de un telefono.
const CARACTERES_TELEFONO = /^[0-9+\-() ]+$/;

function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

// Valida una consulta y devuelve los datos ya limpios cuando es correcta.
export function validarConsulta(datos = {}) {
  const entrada = datos && typeof datos === "object" ? datos : {};
  const nombre = texto(entrada.nombre);
  const telefono = texto(entrada.telefono);
  const mensaje = texto(entrada.mensaje);
  const errores = {};

  if (!nombre) {
    errores.nombre = "Escribí tu nombre.";
  } else if (nombre.length > LIMITES.nombre) {
    errores.nombre = `El nombre no puede superar los ${LIMITES.nombre} caracteres.`;
  }

  if (!telefono) {
    errores.telefono = "Escribí un teléfono para que podamos responderte.";
  } else if (telefono.length > LIMITES.telefono) {
    errores.telefono = `El teléfono no puede superar los ${LIMITES.telefono} caracteres.`;
  } else if (!CARACTERES_TELEFONO.test(telefono) || !/\d/.test(telefono)) {
    errores.telefono =
      "El teléfono solo puede tener números, espacios y los signos + - ( ).";
  }

  if (!mensaje) {
    errores.mensaje = "Contanos qué trabajo necesitás.";
  } else if (mensaje.length > LIMITES.mensaje) {
    errores.mensaje = `El mensaje no puede superar los ${LIMITES.mensaje} caracteres.`;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    datos: { nombre, telefono, mensaje },
  };
}
