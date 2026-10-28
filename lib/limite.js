// Limite simple en memoria para evitar envios masivos desde la misma conexion.
// En Vercel cada instancia mantiene su propia lista, suficiente para el sitio.
export const MAXIMO_POR_MINUTO = 5;
export const VENTANA_MS = 60 * 1000;

const registros = new Map();

export function permitirConsulta(clave, ahora = Date.now()) {
  const marcas = (registros.get(clave) ?? []).filter(
    (marca) => ahora - marca < VENTANA_MS
  );

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
