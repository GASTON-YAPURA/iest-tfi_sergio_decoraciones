// Carga en la base las fotos originales de multimedia/trabajos/.
// Uso: npm run db:fotos            (agrega solo las que faltan)
//      npm run db:fotos -- --reemplazar  (vuelve a cargar todas)
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "../lib/db.js";
import { detectarTipo, medirImagen, revisarImagen } from "../lib/imagen.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARPETA = join(raiz, "multimedia", "trabajos");
const reemplazar = process.argv.includes("--reemplazar");

// Cada foto original sabe a que trabajo pertenece.
const FOTOS = [
  {
    archivo: "alfombrado-empapelado.jpg",
    servicio: "interiores",
    titulo: "Living con alfombrado y empapelado",
    descripcion:
      "Alfombrado y empapelado de una pared del living, con terminación prolija.",
    texto_alt: "Living con alfombra y una pared empapelada",
  },
  {
    archivo: "cielorraso-durlock.jpg",
    servicio: "durlock",
    titulo: "Cielorraso de durlock",
    descripcion: "Cielorraso de durlock con iluminación embutida.",
    texto_alt: "Cielorraso de durlock con iluminación embutida",
  },
  {
    archivo: "pintura-general.jpg",
    servicio: "pintura",
    titulo: "Pintura general",
    descripcion: "Pintura de paredes y techo en tonos claros.",
    texto_alt: "Paredes y techo pintados en tonos claros",
  },
  {
    archivo: "paredes-enduido.jpg",
    servicio: "enduido",
    titulo: "Paredes con enduido",
    descripcion: "Enduido y lijado de paredes para una terminación lisa.",
    texto_alt: "Paredes interiores con enduido y terminación lisa",
  },
  {
    archivo: "piso-machimbre.jpg",
    servicio: "machimbre",
    titulo: "Piso de machimbre",
    descripcion: "Colocación de piso de machimbre en un ambiente luminoso.",
    texto_alt: "Piso de machimbre colocado en un ambiente luminoso",
  },
  {
    archivo: "molduras-salon.jpg",
    servicio: "molduras",
    titulo: "Molduras en el salón",
    descripcion: "Colocación de molduras decorativas en paredes y techo.",
    texto_alt: "Salón con molduras decorativas en paredes y techo",
  },
];

async function buscarTrabajo(servicio) {
  const filas = await sql.query(
    "SELECT id FROM trabajos WHERE servicio = $1 ORDER BY id LIMIT 1",
    [servicio]
  );

  return filas[0]?.id ?? null;
}

async function asegurarTrabajo(foto) {
  const existente = await buscarTrabajo(foto.servicio);

  if (existente) {
    await sql.query(
      "UPDATE trabajos SET titulo = $1, descripcion = $2 WHERE id = $3",
      [foto.titulo, foto.descripcion, existente]
    );

    return existente;
  }

  const filas = await sql.query(
    `INSERT INTO trabajos (titulo, servicio, descripcion, visible)
     VALUES ($1, $2, $3, TRUE)
     RETURNING id`,
    [foto.titulo, foto.servicio, foto.descripcion]
  );

  return filas[0].id;
}

async function principal() {
  let archivos;

  try {
    archivos = new Set(readdirSync(CARPETA));
  } catch {
    console.error(`No se encontro la carpeta ${CARPETA}.`);
    process.exitCode = 1;
    return;
  }

  let cargadas = 0;
  let salteadas = 0;

  for (const foto of FOTOS) {
    if (!archivos.has(foto.archivo)) {
      console.warn(`Falta el archivo multimedia/trabajos/${foto.archivo}.`);
      continue;
    }

    const datos = readFileSync(join(CARPETA, foto.archivo));
    const error = revisarImagen(datos);

    if (error) {
      console.error(`${foto.archivo}: ${error}`);
      process.exitCode = 1;
      continue;
    }

    const tipo = detectarTipo(datos);
    const medidas = medirImagen(datos);
    const trabajoId = await asegurarTrabajo(foto);

    if (reemplazar) {
      await sql.query("DELETE FROM trabajo_fotos WHERE trabajo_id = $1", [
        trabajoId,
      ]);
    }

    const existentes = await sql.query(
      "SELECT COUNT(*)::int AS total FROM trabajo_fotos WHERE trabajo_id = $1",
      [trabajoId]
    );

    if (existentes[0].total > 0) {
      console.log(`${foto.titulo}: ya tenia foto, se saltea.`);
      salteadas += 1;
      continue;
    }

    await sql.query(
      `INSERT INTO trabajo_fotos
         (trabajo_id, datos, tipo, ancho, alto, texto_alt, orden)
       VALUES ($1, $2, $3, $4, $5, $6, 1)`,
      [
        trabajoId,
        datos,
        tipo,
        medidas.ancho,
        medidas.alto,
        foto.texto_alt,
      ]
    );

    console.log(
      `${foto.titulo}: foto cargada (${tipo}, ${medidas.ancho}x${medidas.alto}).`
    );
    cargadas += 1;
  }

  console.log("");
  console.log(`Listo: ${cargadas} cargadas y ${salteadas} salteadas.`);

  if (cargadas === 0 && salteadas === 0) {
    console.log("No se cargo ninguna foto. Revisa la carpeta multimedia/trabajos/.");
  }
}

principal().catch((error) => {
  console.error("No se pudieron importar las fotos:", error.message);
  process.exitCode = 1;
});
