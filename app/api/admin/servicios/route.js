import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  crearServicioAdicional,
  listarServiciosAdicionales,
} from "../../../../lib/servicios-adicionales";
import { leerSesion } from "../../../../lib/sesion";
import { revisarServicioAdicional } from "../../../../lib/validacion-trabajos";

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
