import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  actualizarVisibilidadServicioAdicional,
  borrarServicioAdicional,
  crearServicioAdicional,
  existeServicioAdicional,
  listarServiciosAdicionales,
} from "../../../../lib/servicios-adicionales";
import { leerSesion } from "../../../../lib/sesion";
import {
  esServicioAdicionalValido,
  revisarServicioAdicional,
} from "../../../../lib/validacion-trabajos";

export const dynamic = "force-dynamic";

function sinSesion() {
  return NextResponse.json(
    { error: "Tenés que ingresar para administrar los servicios." },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}

async function leerCuerpo(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET() {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  try {
    const servicios = await listarServiciosAdicionales();

    return NextResponse.json(
      { servicios },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("No se pudieron obtener los servicios adicionales", error);

    return NextResponse.json(
      { error: "No pudimos obtener los servicios." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const revision = revisarServicioAdicional(await leerCuerpo(request));

  if (revision.error) {
    return NextResponse.json({ error: revision.error }, { status: 400 });
  }

  try {
    const servicio = await crearServicioAdicional(revision.datos);

    if (!servicio) {
      throw new Error("La base no devolvió el servicio recién creado.");
    }

    revalidatePath("/servicios");

    return NextResponse.json({ servicio }, { status: 201 });
  } catch (error) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Ya existe un servicio con ese nombre." },
        { status: 409 }
      );
    }

    console.error("No se pudo crear el servicio adicional", error);

    return NextResponse.json(
      { error: "No pudimos guardar el servicio." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const cuerpo = await leerCuerpo(request);

  if (
    !esServicioAdicionalValido(cuerpo?.id) ||
    typeof cuerpo?.visible !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Los datos para cambiar el servicio no son válidos." },
      { status: 400 }
    );
  }

  try {
    const servicio = await actualizarVisibilidadServicioAdicional(
      cuerpo.id,
      cuerpo.visible
    );

    if (!servicio) {
      return NextResponse.json(
        { error: "No encontramos ese servicio." },
        { status: 404 }
      );
    }

    revalidatePath("/servicios");

    return NextResponse.json({ servicio });
  } catch (error) {
    console.error("No se pudo cambiar la visibilidad del servicio", error);

    return NextResponse.json(
      { error: "No pudimos cambiar la visibilidad del servicio." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const cuerpo = await leerCuerpo(request);

  if (!esServicioAdicionalValido(cuerpo?.id)) {
    return NextResponse.json(
      { error: "El servicio que querés borrar no es válido." },
      { status: 400 }
    );
  }

  try {
    const servicio = await borrarServicioAdicional(cuerpo.id);

    if (servicio) {
      revalidatePath("/servicios");

      return NextResponse.json({ id: cuerpo.id });
    }

    if (await existeServicioAdicional(cuerpo.id)) {
      return NextResponse.json(
        {
          error:
            "No se puede borrar este servicio porque está asignado a uno o más trabajos. Reasignalos primero.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "No encontramos ese servicio." },
      { status: 404 }
    );
  } catch (error) {
    console.error("No se pudo borrar el servicio adicional", error);

    return NextResponse.json(
      { error: "No pudimos borrar el servicio." },
      { status: 500 }
    );
  }
}
