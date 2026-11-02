import { NextResponse } from "next/server";
import { leerSesion } from "../../../../lib/sesion";
import {
  actualizarTrabajo,
  borrarTrabajo,
  crearTrabajo,
  listarTrabajosPanel,
} from "../../../../lib/trabajos";
import { revisarTrabajo } from "../../../../lib/validacion-trabajos";

export const dynamic = "force-dynamic";

function sinSesion() {
  return NextResponse.json(
    { error: "Tenés que ingresar para administrar los trabajos." },
    { status: 401 }
  );
}

function idInvalido() {
  return NextResponse.json(
    { error: "El número de trabajo no es válido." },
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

// Listado completo para el panel, con los trabajos ocultos incluidos.
export async function GET() {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  try {
    const trabajos = await listarTrabajosPanel();

    return NextResponse.json({ trabajos });
  } catch (error) {
    console.error("No se pudieron obtener los trabajos", error);

    return NextResponse.json(
      { error: "No pudimos obtener los trabajos." },
      { status: 500 }
    );
  }
}

// Agrega un trabajo sin fotos. Las fotos se suben después, una por una.
export async function POST(request) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const revision = revisarTrabajo(await leerCuerpo(request));

  if (revision.error) {
    return NextResponse.json({ error: revision.error }, { status: 400 });
  }

  try {
    const trabajo = await crearTrabajo(revision.datos);

    return NextResponse.json({ trabajo }, { status: 201 });
  } catch (error) {
    console.error("No se pudo crear el trabajo", error);

    return NextResponse.json(
      { error: "No pudimos guardar el trabajo." },
      { status: 500 }
    );
  }
}

// Edita el título, el servicio, la descripción o la visibilidad.
export async function PATCH(request) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const cuerpo = await leerCuerpo(request);
  const id = Number(cuerpo?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return idInvalido();
  }

  const revision = revisarTrabajo(cuerpo);

  if (revision.error) {
    return NextResponse.json({ error: revision.error }, { status: 400 });
  }

  try {
    const trabajo = await actualizarTrabajo(id, revision.datos);

    if (!trabajo) {
      return NextResponse.json(
        { error: "No encontramos ese trabajo." },
        { status: 404 }
      );
    }

    return NextResponse.json({ trabajo });
  } catch (error) {
    console.error("No se pudo actualizar el trabajo", error);

    return NextResponse.json(
      { error: "No pudimos actualizar el trabajo." },
      { status: 500 }
    );
  }
}

// Borra el trabajo y, en cascada, todas sus fotos.
export async function DELETE(request) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const cuerpo = await leerCuerpo(request);
  const id = Number(cuerpo?.id);

  if (!Number.isInteger(id) || id <= 0) {
    return idInvalido();
  }

  try {
    const trabajo = await borrarTrabajo(id);

    if (!trabajo) {
      return NextResponse.json(
        { error: "No encontramos ese trabajo." },
        { status: 404 }
      );
    }

    return NextResponse.json({ borrado: true });
  } catch (error) {
    console.error("No se pudo borrar el trabajo", error);

    return NextResponse.json(
      { error: "No pudimos borrar el trabajo." },
      { status: 500 }
    );
  }
}
