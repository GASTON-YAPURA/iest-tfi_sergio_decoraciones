import { NextResponse } from "next/server";
import { leerSesion } from "../../../../lib/sesion";

export const dynamic = "force-dynamic";

export async function GET() {
  const sesion = await leerSesion();

  return NextResponse.json(
    { autenticada: Boolean(sesion) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
