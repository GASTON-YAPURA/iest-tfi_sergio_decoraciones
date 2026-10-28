import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DURACION_SESION_MS,
  crearValorSesion,
  leerValorSesion,
} from "./acceso.js";

export const NOMBRE_COOKIE = "sesion_sergio";

function opcionesCookie() {
  return {
    httpOnly: true,
    // En desarrollo la cookie viaja por HTTP; en produccion solo por HTTPS.
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(DURACION_SESION_MS / 1000),
  };
}

export async function crearSesion(usuario) {
  const almacen = await cookies();
  almacen.set(NOMBRE_COOKIE, crearValorSesion(usuario), opcionesCookie());
}

export async function leerSesion() {
  const almacen = await cookies();
  const datos = leerValorSesion(almacen.get(NOMBRE_COOKIE)?.value);

  if (!datos || datos.usuario !== process.env.ADMIN_USUARIO) {
    return null;
  }

  return datos;
}

export async function borrarSesion() {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE);
}

export async function exigirSesion() {
  const sesion = await leerSesion();

  if (!sesion) {
    redirect("/admin");
  }

  return sesion;
}
