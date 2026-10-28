import { neon } from "@neondatabase/serverless";

const cadenaConexion = process.env.DATABASE_URL;

if (!cadenaConexion) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

// Unica conexion a la base de datos del proyecto.
export const sql = neon(cadenaConexion);
