import { NextResponse } from "next/server";
import {
  detectarTipo,
  medirImagen,
  revisarImagen,
  revisarTextoAlt,
} from "../../../../../../lib/imagen";
import { leerSesion } from "../../../../../../lib/sesion";
import {
  actualizarFotos,
  agregarFoto,
  borrarFoto,
  contarFotos,
  obtenerTrabajo,
} from "../../../../../../lib/trabajos";
import {
  MAXIMO_FOTOS,
  revisarFotosParaActualizar,
} from "../../../../../../lib/validacion-trabajos";
import { PESO_MAXIMO_BYTES } from "../../../../../../lib/limites-imagen";

export const dynamic = "force-dynamic";

function sinSesion() {
  return NextResponse.json(
    { error: "Tenés que ingresar para administrar las fotos." },
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

async function leerTrabajo(params) {
  const { id } = await params;
  const trabajoId = Number(id);

  if (!Number.isInteger(trabajoId) || trabajoId <= 0) {
    return { error: idInvalido() };
  }

  return { trabajoId };
}

// Sube una foto y la guarda al final del trabajo.
export async function POST(request, { params }) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const { trabajoId, error } = await leerTrabajo(params);

  if (error) {
    return error;
  }

  try {
    const trabajo = await obtenerTrabajo(trabajoId);

    if (!trabajo) {
      return NextResponse.json(
        { error: "No encontramos ese trabajo." },
        { status: 404 }
      );
    }

    const total = await contarFotos(trabajoId);

    if (total >= MAXIMO_FOTOS) {
      return NextResponse.json(
        { error: `Un trabajo no puede tener más de ${MAXIMO_FOTOS} fotos.` },
        { status: 409 }
      );
    }

    let formulario;

    try {
      formulario = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "No pudimos leer la foto enviada." },
        { status: 400 }
      );
    }

    const archivo = formulario.get("foto");

    if (!archivo || typeof archivo.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Elegí una foto para subir." },
        { status: 400 }
      );
    }

    if (archivo.size > PESO_MAXIMO_BYTES) {
      return NextResponse.json(
        { error: "La foto supera el máximo de 1,5 MB." },
        { status: 400 }
      );
    }

    const datos = Buffer.from(await archivo.arrayBuffer());
    const errorImagen = revisarImagen(datos);

    if (errorImagen) {
      return NextResponse.json({ error: errorImagen }, { status: 400 });
    }

    const textoAlt = formulario.get("texto_alt");
    const errorTexto = revisarTextoAlt(textoAlt);

    if (errorTexto) {
      return NextResponse.json({ error: errorTexto }, { status: 400 });
    }

    const tipo = detectarTipo(datos);
    const medidas = medirImagen(datos);
    const foto = await agregarFoto(trabajoId, {
      datos,
      tipo,
      ancho: medidas.ancho,
      alto: medidas.alto,
      textoAlt: String(textoAlt).trim(),
    });

    return NextResponse.json({ foto }, { status: 201 });
  } catch (error) {
    console.error("No se pudo guardar la foto", error);

    return NextResponse.json(
      { error: "No pudimos guardar la foto." },
      { status: 500 }
    );
  }
}

// Guarda los textos alternativos y el orden final de las fotos.
export async function PATCH(request, { params }) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const { trabajoId, error } = await leerTrabajo(params);

  if (error) {
    return error;
  }

  const revision = revisarFotosParaActualizar((await leerCuerpo(request))?.fotos);

  if (revision.error) {
    return NextResponse.json({ error: revision.error }, { status: 400 });
  }

  try {
    const fotos = await actualizarFotos(trabajoId, revision.fotos);

    if (!fotos) {
      return NextResponse.json(
        { error: "No encontramos alguna de esas fotos en el trabajo." },
        { status: 404 }
      );
    }

    return NextResponse.json({ fotos });
  } catch (error) {
    console.error("No se pudieron actualizar las fotos", error);

    return NextResponse.json(
      { error: "No pudimos actualizar las fotos." },
      { status: 500 }
    );
  }
}

// Borra una foto, siempre que quede al menos otra en el trabajo.
export async function DELETE(request, { params }) {
  if (!(await leerSesion())) {
    return sinSesion();
  }

  const { trabajoId, error } = await leerTrabajo(params);

  if (error) {
    return error;
  }

  const fotoId = Number((await leerCuerpo(request))?.foto);

  if (!Number.isInteger(fotoId) || fotoId <= 0) {
    return NextResponse.json(
      { error: "El número de foto no es válido." },
      { status: 400 }
    );
  }

  try {
    const trabajo = await obtenerTrabajo(trabajoId);

    if (!trabajo) {
      return NextResponse.json(
        { error: "No encontramos ese trabajo." },
        { status: 404 }
      );
    }

    if (trabajo.fotos.length <= 1) {
      return NextResponse.json(
        { error: "El trabajo tiene que conservar al menos una foto." },
        { status: 409 }
      );
    }

    const borrada = await borrarFoto(trabajoId, fotoId);

    if (!borrada) {
      return NextResponse.json(
        { error: "No encontramos esa foto en el trabajo." },
        { status: 404 }
      );
    }

    return NextResponse.json({ borrada: true });
  } catch (error) {
    console.error("No se pudo borrar la foto", error);

    return NextResponse.json(
      { error: "No pudimos borrar la foto." },
      { status: 500 }
    );
  }
}
