import assert from "node:assert/strict";
import test from "node:test";
import {
  detectarTipo,
  medirImagen,
  revisarImagen,
  revisarTextoAlt,
} from "../lib/imagen.js";

// Imagen JPEG minima con un solo cuadro de 1376 x 768.
function jpegDePrueba(ancho = 1376, alto = 768) {
  const app0 = Buffer.from([
    0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00,
    0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
  ]);
  const sof = Buffer.alloc(19);
  sof[0] = 0xff;
  sof[1] = 0xc0;
  sof.writeUInt16BE(17, 2);
  sof[4] = 8;
  sof.writeUInt16BE(alto, 5);
  sof.writeUInt16BE(ancho, 7);

  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, sof]);
}

// Imagen PNG minima con el ancho y el alto en el IHDR.
function pngDePrueba(ancho = 800, alto = 600) {
  const buffer = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(ancho, 16);
  buffer.writeUInt32BE(alto, 20);

  return buffer;
}

test("reconoce el tipo real por los primeros bytes", () => {
  assert.equal(detectarTipo(jpegDePrueba()), "image/jpeg");
  assert.equal(detectarTipo(pngDePrueba()), "image/png");
  assert.equal(detectarTipo(Buffer.from("no soy una imagen")), null);
});

test("mide el ancho y el alto de la imagen", () => {
  assert.deepEqual(medirImagen(jpegDePrueba(1376, 768)), {
    ancho: 1376,
    alto: 768,
  });
  assert.deepEqual(medirImagen(pngDePrueba(800, 600)), {
    ancho: 800,
    alto: 600,
  });
});

test("rechaza archivos que no son imagenes o son enormes", () => {
  assert.match(
    revisarImagen(Buffer.from("archivo de texto cualquiera")),
    /no es una imagen/
  );
  assert.match(
    revisarImagen(Buffer.concat([jpegDePrueba(), Buffer.alloc(1600000)])),
    /1,5 MB/
  );
  assert.match(revisarImagen(jpegDePrueba(7000, 7000)), /6000 px/);
  assert.equal(revisarImagen(jpegDePrueba(1376, 768)), null);
});

test("el texto alternativo es obligatorio y tiene un maximo", () => {
  assert.match(revisarTextoAlt(""), /al menos 5 caracteres/);
  assert.match(revisarTextoAlt("     "), /al menos 5 caracteres/);
  assert.match(revisarTextoAlt("a".repeat(201)), /200 caracteres/);
  assert.equal(revisarTextoAlt("Living con alfombra"), null);
});
