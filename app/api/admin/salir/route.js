import { NextResponse } from "next/server";
import { borrarSesion } from "../../../../lib/sesion";

export async function POST(request) {
  await borrarSesion();

  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
