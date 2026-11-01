import { NextResponse } from "next/server";
import { listarConsultasParaCsv } from "../../../../../lib/consultas";
import { generarCsv, nombreArchivoCsv } from "../../../../../lib/csv";
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
    const consultas = await listarConsultasParaCsv({
      busqueda: parametros.get("buscar"),
      estado: parametros.get("estado"),
    });
    const csv = generarCsv(consultas, formatearFechaConsulta);

    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${nombreArchivoCsv()}"`,
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
