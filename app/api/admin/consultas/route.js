import { NextResponse } from "next/server";
import {
  marcarConsultaAtendida,
  obtenerConsultas,
} from "../../../../lib/consultas";
import { leerSesion } from "../../../../lib/sesion";

export const dynamic = "force-dynamic";

async function sinSesion() {
  return NextResponse.json(
    { error: "Tenés que ingresar para ver las consultas." },
    { status: 401 }
  );
}

export async function GET() {
  const sesion = await leerSesion();

  if (!sesion) {
    return sinSesion();
  }

  try {
    const consultas = await obtenerConsultas();

    return NextResponse.json({ consultas });
  } catch (error) {
    console.error("No se pudieron obtener las consultas", error);

    return NextResponse.json(
      { error: "No pudimos obtener las consultas." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const sesion = await leerSesion();

  if (!sesion) {
    return sinSesion();
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

  const id = Number(cuerpo?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { error: "El número de consulta no es válido." },
      { status: 400 }
    );
  }

  try {
    const consulta = await marcarConsultaAtendida(id);

    if (!consulta) {
      return NextResponse.json(
        { error: "No encontramos esa consulta." },
        { status: 404 }
      );
    }

    return NextResponse.json({ consulta });
  } catch (error) {
    console.error("No se pudo marcar la consulta como atendida", error);

    return NextResponse.json(
      { error: "No pudimos actualizar la consulta." },
      { status: 500 }
    );
  }
}
