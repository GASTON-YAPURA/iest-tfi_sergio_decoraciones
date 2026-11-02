import { NextResponse } from "next/server";
import { listarConsultasParaPdf } from "../../../../../lib/consultas";
import { generarPdf, nombreArchivoPdf } from "../../../../../lib/pdf";
import { formatearFechaConsulta } from "../../../../../lib/fechas";
import { leerSesion } from "../../../../../lib/sesion";

export const dynamic = "force-dynamic";

// Descarga las consultas del filtro actual. Solo con sesión iniciada.
export async function GET(request) {
  const sesion = await leerSesion();

  if (!sesion) {
    return NextResponse.json(
      { error: "Tenés que ingresar para exportar las consultas." },
      { status: 401 }
    );
  }

  const parametros = request.nextUrl.searchParams;

  try {
    const consultas = await listarConsultasParaPdf({
      busqueda: parametros.get("buscar"),
      estado: parametros.get("estado"),
    });
    const pdf = await generarPdf(consultas, formatearFechaConsulta);

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivoPdf()}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("No se pudieron exportar las consultas", error);

    return NextResponse.json(
      { error: "No pudimos exportar las consultas." },
      { status: 500 }
    );
  }
}
