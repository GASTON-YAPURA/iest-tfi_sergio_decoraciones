// Limites simples en memoria para evitar envios masivos desde la misma conexion.
// En Vercel cada instancia mantiene su propia lista, suficiente para el sitio.
export const MAXIMO_POR_MINUTO = 5;
export const VENTANA_MS = 60 * 1000;
export const MAXIMO_INTENTOS = 5;
export const VENTANA_INTENTOS_MS = 15 * 60 * 1000;

const registros = new Map();
const intentos = new Map();

function marcasVigentes(marcas, ahora, ventana) {
  return (marcas ?? []).filter((marca) => ahora - marca < ventana);
}

// Identifica la conexion para aplicar el limite en cada ruta.
export function obtenerClaveConexion(request) {
  const reenviada = request.headers.get("x-forwarded-for");

  if (reenviada) {
    const primera = reenviada.split(",")[0].trim();

    if (primera) {
      return primera;
    }
  }

  return request.headers.get("x-real-ip") ?? "conexion-local";
}

export function permitirConsulta(clave, ahora = Date.now()) {
  const marcas = marcasVigentes(registros.get(clave), ahora, VENTANA_MS);

  if (marcas.length >= MAXIMO_POR_MINUTO) {
    registros.set(clave, marcas);
    return false;
  }

  marcas.push(ahora);
  registros.set(clave, marcas);

  return true;
}

// Se usa en las pruebas para empezar siempre con el limite libre.
export function reiniciarLimites() {
  registros.clear();
}

export function ingresoBloqueado(clave, ahora = Date.now()) {
  const marcas = marcasVigentes(intentos.get(clave), ahora, VENTANA_INTENTOS_MS);

  if (marcas.length === 0) {
    intentos.delete(clave);
  } else {
    intentos.set(clave, marcas);
  }

  return marcas.length >= MAXIMO_INTENTOS;
}

export function registrarIngresoFallido(clave, ahora = Date.now()) {
  const marcas = marcasVigentes(intentos.get(clave), ahora, VENTANA_INTENTOS_MS);

  marcas.push(ahora);
  intentos.set(clave, marcas);
}

export function limpiarIngresos(clave) {
  intentos.delete(clave);
}

export function reiniciarLimitesIngreso() {
  intentos.clear();
}
