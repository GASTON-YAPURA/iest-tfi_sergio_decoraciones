import { NextResponse } from "next/server";
import { obtenerTrabajos } from "../../../lib/trabajos";

export async function GET() {
  try {
    const trabajos = await obtenerTrabajos();

    return NextResponse.json({ trabajos });
  } catch (error) {
    console.error("No se pudieron obtener los trabajos", error);

    return NextResponse.json(
      { error: "No se pudieron obtener los trabajos" },
      { status: 500 }
    );
  }
}
