import { NextResponse } from "next/server";
import { leerSesion } from "../../../../../lib/sesion";
import { leerFoto } from "../../../../../lib/trabajos";

// Entrega una foto guardada en la base. El id de la foto viaja como ?foto=.
export async function GET(request, { params }) {
  const { id } = await params;
  const trabajoId = Number(id);
  const fotoId = Number(request.nextUrl.searchParams.get("foto"));

  if (
    !Number.isInteger(trabajoId) ||
    !Number.isInteger(fotoId) ||
    trabajoId <= 0 ||
    fotoId <= 0
  ) {
    return NextResponse.json({ error: "Foto no encontrada" }, { status: 404 });
  }

  try {
    const foto = await leerFoto(trabajoId, fotoId);

    if (!foto) {
      return NextResponse.json({ error: "Foto no encontrada" }, { status: 404 });
    }

    // Un trabajo oculto solo lo puede ver Sergio desde el panel.
    if (!foto.visible && !(await leerSesion())) {
      return NextResponse.json({ error: "Foto no encontrada" }, { status: 404 });
    }

    return new NextResponse(foto.datos, {
      headers: {
        "Content-Type": foto.tipo,
        "Content-Length": String(foto.datos.length),
        "Cache-Control": foto.visible
          ? "public, max-age=86400, stale-while-revalidate=604800"
          : "private, no-store",
      },
    });
  } catch (error) {
    console.error("No se pudo leer la foto del trabajo", error);

    return NextResponse.json(
      { error: "No se pudo cargar la foto" },
      { status: 500 }
    );
  }
}
