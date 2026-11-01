import { NextResponse } from "next/server";
import {
  borrarConsultaArchivada,
  cambiarConsultaArchivada,
  marcarConsultaAtendida,
  obtenerConsulta,
} from "../../../../lib/consultas";
import { leerSesion } from "../../../../lib/sesion";

export const dynamic = "force-dynamic";

const ACCIONES = ["atender", "archivar", "restaurar"];

function sinSesion() {
  return NextResponse.json(
    { error: "Tenés que ingresar para ver las consultas." },
    { status: 401 }
  );
}

function idInvalido() {
  return NextResponse.json(
    { error: "El número de consulta no es válido." },
    { status: 400 }
  );
}

async function leerCuerpo(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Atiende, archiva o restaura una consulta. Solo con sesión iniciada.
export async function PATCH(request) {
  const sesion = await leerSesion();

  if (!sesion) {
    return sinSesion();
  }

  const cuerpo = await leerCuerpo(request);
  const id = Number(cuerpo?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return idInvalido();
  }

  const accion = cuerpo?.accion;

  if (!ACCIONES.includes(accion)) {
    return NextResponse.json(
      { error: "La acción pedida no es válida." },
      { status: 400 }
    );
  }

  try {
    let consulta;

    if (accion === "atender") {
      consulta = await marcarConsultaAtendida(id);
    } else {
      consulta = await cambiarConsultaArchivada(id, accion === "archivar");
    }

    if (!consulta) {
      return NextResponse.json(
        { error: "No encontramos esa consulta." },
        { status: 404 }
      );
    }

    return NextResponse.json({ consulta });
  } catch (error) {
    console.error("No se pudo actualizar la consulta", error);

    return NextResponse.json(
      { error: "No pudimos actualizar la consulta." },
      { status: 500 }
    );
  }
}

// Borra definitivamente una consulta archivada. No se puede deshacer.
export async function DELETE(request) {
  const sesion = await leerSesion();

  if (!sesion) {
    return sinSesion();
  }

  const cuerpo = await leerCuerpo(request);
  const id = Number(cuerpo?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return idInvalido();
  }

  try {
    const consulta = await obtenerConsulta(id);

    if (!consulta) {
      return NextResponse.json(
        { error: "No encontramos esa consulta." },
        { status: 404 }
      );
    }

    if (!consulta.archivada) {
      return NextResponse.json(
        { error: "Primero archivá la consulta para poder borrarla." },
        { status: 409 }
      );
    }

    await borrarConsultaArchivada(id);

    return NextResponse.json({ borrada: true });
  } catch (error) {
    console.error("No se pudo borrar la consulta", error);

    return NextResponse.json(
      { error: "No pudimos borrar la consulta." },
      { status: 500 }
    );
  }
}
