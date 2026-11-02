// Armado del PDF de consultas. No guarda nada: se genera al pedirlo.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const TAMANO_TEXTO = 8;
const TAMANO_ENCABEZADO = 8.5;
const INTERLINEA = 10;
const PADDING_FILA = 5;
const PADDING_CELDA = 4;
const ALTO_ENCABEZADO_TABLA = 20;
const ALTO_CABECERA = 62;
const ALTO_PIE = 28;
const MARGEN = 44;

// Medidas de una hoja A4 en puntos.
const ANCHO_PAGINA = 595.28;
const ALTO_PAGINA = 841.89;
const ANCHO_TABLA = ANCHO_PAGINA - MARGEN * 2;

const COLUMNAS = [
  { titulo: "Fecha", ancho: 80 },
  { titulo: "Nombre", ancho: 82 },
  { titulo: "Teléfono", ancho: 82 },
  { titulo: "Mensaje", ancho: 200.28 },
  { titulo: "Estado", ancho: 63 },
];

// Los colores copian la paleta de docs/00 - IDENTIDAD-MARCA.md.
const NEGRO = rgb(26 / 255, 26 / 255, 26 / 255);
const ACENTO = rgb(129 / 255, 89 / 255, 34 / 255);
const SECUNDARIO = rgb(108 / 255, 108 / 255, 108 / 255);
const BLANCO = rgb(1, 1, 1);
const GRIS_CLARO = rgb(0.965, 0.965, 0.965);
const BORDE = rgb(0.86, 0.86, 0.86);

// La fuente estandar usa WinAnsi: se cambian las comillas tipograficas y se
// reemplazan los caracteres que no se pueden escribir (por ejemplo, emojis).
const REEMPLAZOS = new Map([
  ["\u2018", "'"],
  ["\u2019", "'"],
  ["\u201C", '"'],
  ["\u201D", '"'],
  ["\u2013", "-"],
  ["\u2014", "-"],
  ["\u2026", "..."],
  ["\u2022", "-"],
  ["\u00A0", " "],
  ["\u20AC", "EUR"],
]);

export function sanitizarTextoPdf(valor) {
  const texto = String(valor ?? "")
    .normalize("NFC")
    .replace(/[\t\n\r]+/g, " ");
  let salida = "";

  for (const caracter of texto) {
    if (REEMPLAZOS.has(caracter)) {
      salida += REEMPLAZOS.get(caracter);
      continue;
    }

    const codigo = caracter.codePointAt(0);

    if ((codigo >= 0x20 && codigo <= 0x7e) || (codigo >= 0xa1 && codigo <= 0xff)) {
      salida += caracter;
    } else {
      salida += "?";
    }
  }

  return salida.replace(/\s+/g, " ").trim();
}

export function estadoConsulta(consulta) {
  if (consulta.archivada) {
    return "Archivada";
  }

  return consulta.atendida ? "Atendida" : "Pendiente";
}

// Corta un texto en las lineas que entran en el ancho de la columna.
function cortarTexto(texto, fuente, tamano, anchoMaximo) {
  const palabras = texto.split(" ").filter(Boolean);
  const lineas = [];
  let actual = "";

  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;

    if (fuente.widthOfTextAtSize(prueba, tamano) <= anchoMaximo) {
      actual = prueba;
      continue;
    }

    if (actual) {
      lineas.push(actual);
      actual = "";
    }

    // Una palabra sola mas ancha que la columna se corta por caracteres.
    let trozo = "";

    for (const caracter of palabra) {
      if (fuente.widthOfTextAtSize(trozo + caracter, tamano) <= anchoMaximo) {
        trozo += caracter;
      } else {
        if (trozo) {
          lineas.push(trozo);
        }
        trozo = caracter;
      }
    }

    actual = trozo;
  }

  if (actual) {
    lineas.push(actual);
  }

  return lineas.length ? lineas : [""];
}

function prepararFilas(consultas, fuente, formatearFecha) {
  return consultas.map((consulta) => {
    const valores = [
      formatearFecha(consulta.creada_en),
      consulta.nombre,
      consulta.telefono,
      consulta.mensaje,
      estadoConsulta(consulta),
    ];

    const lineas = valores.map((valor, indice) =>
      cortarTexto(
        sanitizarTextoPdf(valor),
        fuente,
        TAMANO_TEXTO,
        COLUMNAS[indice].ancho - PADDING_CELDA * 2
      )
    );

    const cantidadLineas = Math.max(1, ...lineas.map((celda) => celda.length));
    const alto = cantidadLineas * INTERLINEA + PADDING_FILA * 2;

    return { lineas, alto };
  });
}

// Reparte las filas en paginas sin cortar ninguna por la mitad.
function paginar(filas) {
  const altoDisponible =
    ALTO_PAGINA - MARGEN - ALTO_CABECERA - ALTO_ENCABEZADO_TABLA - MARGEN - ALTO_PIE;
  const paginas = [];
  let pagina = [];
  let usado = 0;

  for (const fila of filas) {
    if (pagina.length && usado + fila.alto > altoDisponible) {
      paginas.push(pagina);
      pagina = [];
      usado = 0;
    }

    pagina.push(fila);
    usado += fila.alto;
  }

  if (pagina.length || !paginas.length) {
    paginas.push(pagina);
  }

  return paginas;
}

function dibujarCabecera(pagina, fuentes, generado) {
  const tituloY = ALTO_PAGINA - MARGEN - 18;

  pagina.drawText("Sergio Decoraciones", {
    x: MARGEN,
    y: tituloY,
    size: 18,
    font: fuentes.negrita,
    color: NEGRO,
  });

  pagina.drawText("Consultas recibidas", {
    x: MARGEN,
    y: tituloY - 18,
    size: 10,
    font: fuentes.texto,
    color: SECUNDARIO,
  });

  const fechaTexto = sanitizarTextoPdf(`Generado el ${generado}`);
  const anchoFecha = fuentes.texto.widthOfTextAtSize(fechaTexto, 8.5);

  pagina.drawText(fechaTexto, {
    x: MARGEN + ANCHO_TABLA - anchoFecha,
    y: tituloY - 18,
    size: 8.5,
    font: fuentes.texto,
    color: SECUNDARIO,
  });

  pagina.drawLine({
    start: { x: MARGEN, y: tituloY - 32 },
    end: { x: MARGEN + ANCHO_TABLA, y: tituloY - 32 },
    thickness: 2,
    color: ACENTO,
  });
}

function dibujarEncabezadoTabla(pagina, fuentes, ySuperior) {
  pagina.drawRectangle({
    x: MARGEN,
    y: ySuperior - ALTO_ENCABEZADO_TABLA,
    width: ANCHO_TABLA,
    height: ALTO_ENCABEZADO_TABLA,
    color: ACENTO,
  });

  let x = MARGEN;

  for (const columna of COLUMNAS) {
    pagina.drawText(columna.titulo, {
      x: x + PADDING_CELDA,
      y: ySuperior - 13,
      size: TAMANO_ENCABEZADO,
      font: fuentes.negrita,
      color: BLANCO,
    });

    x += columna.ancho;
  }

  return ySuperior - ALTO_ENCABEZADO_TABLA;
}

function dibujarFila(pagina, fila, ySuperior, fuentes, indice) {
  if (indice % 2 === 1) {
    pagina.drawRectangle({
      x: MARGEN,
      y: ySuperior - fila.alto,
      width: ANCHO_TABLA,
      height: fila.alto,
      color: GRIS_CLARO,
    });
  }

  let x = MARGEN;

  for (let indiceCelda = 0; indiceCelda < fila.lineas.length; indiceCelda += 1) {
    let y = ySuperior - PADDING_FILA - TAMANO_TEXTO;

    for (const linea of fila.lineas[indiceCelda]) {
      pagina.drawText(linea, {
        x: x + PADDING_CELDA,
        y,
        size: TAMANO_TEXTO,
        font: fuentes.texto,
        color: NEGRO,
      });

      y -= INTERLINEA;
    }

    x += COLUMNAS[indiceCelda].ancho;
  }

  const lineaY = ySuperior - fila.alto;

  pagina.drawLine({
    start: { x: MARGEN, y: lineaY },
    end: { x: MARGEN + ANCHO_TABLA, y: lineaY },
    thickness: 0.5,
    color: BORDE,
  });

  return lineaY;
}

function dibujarPie(pagina, fuentes, numero, total) {
  const lineaY = MARGEN + ALTO_PIE - 14;

  pagina.drawLine({
    start: { x: MARGEN, y: lineaY },
    end: { x: MARGEN + ANCHO_TABLA, y: lineaY },
    thickness: 0.5,
    color: BORDE,
  });

  pagina.drawText("Sergio Decoraciones · Consultas", {
    x: MARGEN,
    y: lineaY - 13,
    size: 7.5,
    font: fuentes.texto,
    color: SECUNDARIO,
  });

  const paginaTexto = `Página ${numero} de ${total}`;
  const anchoPagina = fuentes.texto.widthOfTextAtSize(paginaTexto, 7.5);

  pagina.drawText(paginaTexto, {
    x: MARGEN + ANCHO_TABLA - anchoPagina,
    y: lineaY - 13,
    size: 7.5,
    font: fuentes.texto,
    color: SECUNDARIO,
  });
}

// Recibe las consultas tal como salen de la base y devuelve el PDF completo.
export async function generarPdf(consultas, formatearFecha) {
  const pdf = await PDFDocument.create();
  const fuentes = {
    texto: await pdf.embedFont(StandardFonts.Helvetica),
    negrita: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  const generado = formatearFecha(new Date());
  const filas = prepararFilas(consultas, fuentes.texto, formatearFecha);
  const paginas = [];
  const paginasFilas = paginar(filas);

  for (const filasPagina of paginasFilas) {
    const pagina = pdf.addPage([ANCHO_PAGINA, ALTO_PAGINA]);
    paginas.push(pagina);

    dibujarCabecera(pagina, fuentes, generado);

    let y = ALTO_PAGINA - MARGEN - ALTO_CABECERA;
    y = dibujarEncabezadoTabla(pagina, fuentes, y);

    if (!filasPagina.length) {
      pagina.drawText("No hay consultas para mostrar con este filtro.", {
        x: MARGEN,
        y: y - 24,
        size: 9,
        font: fuentes.texto,
        color: SECUNDARIO,
      });
    }

    filasPagina.forEach((fila, indice) => {
      y = dibujarFila(pagina, fila, y, fuentes, indice);
    });
  }

  paginas.forEach((pagina, indice) => {
    dibujarPie(pagina, fuentes, indice + 1, paginas.length);
  });

  return pdf.save();
}

// Nombre del archivo con la fecha del dia, en formato aaaa-mm-dd.
export function nombreArchivoPdf(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `consultas-${anio}-${mes}-${dia}.pdf`;
}
