import { NextResponse } from "next/server";
import { guardarConsulta } from "../../../lib/consultas";
import { permitirConsulta } from "../../../lib/limite";
import { validarConsulta } from "../../../lib/validacion";

function obtenerClave(request) {
  const reenviada = request.headers.get("x-forwarded-for");

  if (reenviada) {
    return reenviada.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "conexion-local";
}

export async function POST(request) {
  if (!permitirConsulta(obtenerClave(request))) {
    return NextResponse.json(
      {
        error:
          "Recibimos muchas consultas seguidas. Esperá un minuto y volvé a intentar.",
      },
      { status: 429 }
    );
  }

  let cuerpo;

  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer la consulta enviada." },
      { status: 400 }
    );
  }

  const resultado = validarConsulta(cuerpo);

  if (!resultado.valido) {
    return NextResponse.json(
      {
        error: "Revisá los datos marcados en el formulario.",
        errores: resultado.errores,
      },
      { status: 400 }
    );
  }

  try {
    await guardarConsulta(resultado.datos);
  } catch (error) {
    console.error("No se pudo guardar la consulta", error);

    return NextResponse.json(
      {
        error:
          "No pudimos guardar tu consulta. Probá de nuevo en unos minutos.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      mensaje: "¡Gracias! Recibimos tu consulta y te vamos a responder pronto.",
    },
    { status: 201 }
  );
}
