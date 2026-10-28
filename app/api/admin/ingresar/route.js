import { NextResponse } from "next/server";
import { verificarCredenciales } from "../../../../lib/acceso";
import {
  ingresoBloqueado,
  limpiarIngresos,
  obtenerClaveConexion,
  registrarIngresoFallido,
} from "../../../../lib/limite";
import { crearSesion } from "../../../../lib/sesion";

const ERROR_INGRESO = "Usuario o contraseña incorrectos";

export async function POST(request) {
  const claveConexion = obtenerClaveConexion(request);

  if (ingresoBloqueado(claveConexion)) {
    return NextResponse.json(
      {
        error:
          "Demasiados intentos fallidos. Esperá unos minutos y volvé a intentar.",
      },
      { status: 429 }
    );
  }

  let cuerpo;

  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer los datos enviados." },
      { status: 400 }
    );
  }

  const usuario = typeof cuerpo?.usuario === "string" ? cuerpo.usuario.trim() : "";
  const clave = typeof cuerpo?.clave === "string" ? cuerpo.clave : "";
  const correcto = await verificarCredenciales(usuario, clave);

  if (!correcto) {
    registrarIngresoFallido(claveConexion);

    return NextResponse.json({ error: ERROR_INGRESO }, { status: 401 });
  }

  limpiarIngresos(claveConexion);

  try {
    await crearSesion(usuario);
  } catch (error) {
    console.error("No se pudo crear la sesion", error);

    return NextResponse.json(
      { error: "No pudimos iniciar la sesión. Probá de nuevo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
