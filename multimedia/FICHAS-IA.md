# FICHAS-IA: registro de las piezas generadas con IA

Cada pieza visual del proyecto tiene acá su ficha. La ficha dice qué se generó con IA, con qué herramienta, qué se editó después, dónde se usa y dónde está la leyenda **"Generado con IA"**.

La declaración general está en `docs/DECLARACION-IA.md`.

## Leyenda

> **Generado con IA.** Esta pieza se creó, total o parcialmente, con una herramienta de inteligencia artificial y después fue revisada por el autor.

## Resumen

| Ficha | Pieza | Archivo | Tipo | Herramienta |
|---|---|---|---|---|
| IA-01 | Monograma SD | `marca/logo-sd-dorado-principal.png` y variantes | Isotipo | IA + Canva |
| IA-02 | Variantes del logo | `marca/` y `public/img/marca/` | Logos | IA + Canva |
| IA-03 | Living con alfombrado y empapelado | `multimedia/trabajos/alfombrado-empapelado.jpg` | Foto de muestra | Gemini |
| IA-04 | Cielorraso de durlock | `multimedia/trabajos/cielorraso-durlock.jpg` | Foto de muestra | Gemini |
| IA-05 | Pintura general | `multimedia/trabajos/pintura-general.jpg` | Foto de muestra | Gemini |
| IA-06 | Paredes con enduido | `multimedia/trabajos/paredes-enduido.jpg` | Foto de muestra | Gemini |
| IA-07 | Piso de machimbre | `multimedia/trabajos/piso-machimbre.jpg` | Foto de muestra | Gemini |
| IA-08 | Molduras en el salón | `multimedia/trabajos/molduras-salon.jpg` | Foto de muestra | Gemini |

Las seis fotos de trabajos se generaron con **Gemini** a partir de prompts escritos con **ChatGPT**. Los originales quedan en `multimedia/trabajos/` como respaldo y la copia que se publica se carga en la base de datos con `npm run db:fotos`; por eso la carpeta `public/img/trabajos/` ya no existe.

---

## IA-01: Monograma SD

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Pieza** | Monograma con las letras S y D entrelazadas |
| **Archivos** | `marca/logo-sd-dorado-principal.png` (base) y las variantes de `marca/VARIANTES/` |
| **Tipo** | Isotipo / monograma de marca |
| **Herramienta** | Generador de imágenes con IA para las letras; **Canva** para el color, la sombra y el recorte |
| **Fecha** | 06/10/2026 |
| **Qué se generó con IA** | La forma de las letras S y D y su entrelazado |
| **Qué se hizo después** | Se eligió el dorado de la marca, se agregó la sombra suave, se recortó el fondo y se guardaron las versiones en distintos colores |
| **Dónde se usa** | Favicon (`app/layout.js`), encabezado en celular, ingreso del panel y foto de perfil |
| **Revisión** | El autor revisó que no imitara ninguna marca conocida y que se leyera bien a 32 px de alto |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | En esta ficha, en `docs/00 - IDENTIDAD-MARCA.md` y en `docs/DECLARACION-IA.md`. No se estampa sobre el logo para no alterar la pieza. |

---

## IA-02: Variantes del logo

> **Generado con IA (el monograma). El nombre se compuso con tipografía, no con IA.**

| Campo | Detalle |
|---|---|
| **Pieza** | Ocho variantes del logo para fondos claros y oscuros |
| **Archivos** | `logo-horizontal-principal.png`, `logo-horizontal-ocre.png`, `logo-horizontal-negro.png`, `logo-horizontal-gris.png`, `logo-horizontal-blanco.png`, `logo-sd-dorado.png`, `logo-sd-grafito.png`, `logo-sd-blanco.png` |
| **Tipo** | Logos horizontal y monograma |
| **Herramienta** | **Canva**, a partir del monograma de la ficha IA-01 |
| **Fecha** | 06/10/2026 |
| **Qué se generó con IA** | Solo el monograma SD de la ficha IA-01 |
| **Qué se hizo después** | Se agregó el nombre "SERGIO DECORACIONES" en Cinzel, se armaron las versiones horizontal y vertical y se cambiaron los colores según el fondo |
| **Dónde se usa** | Encabezado y pie de todas las páginas, favicon y manual de marca |
| **Revisión** | El autor comprobó el contraste sobre blanco y sobre Negro Carbón, y que no se deformara la proporción |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | En esta ficha, en `docs/00 - IDENTIDAD-MARCA.md` y en `docs/DECLARACION-IA.md` |

---

## IA-03: Living con alfombrado y empapelado

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Archivo original** | `multimedia/trabajos/alfombrado-empapelado.jpg` |
| **Dónde se publica** | Guardada en la tabla `trabajo_fotos` de la base y servida por `/api/trabajos/[id]/foto` |
| **Medidas** | 1376 × 768 px |
| **Tipo** | Foto de muestra de un trabajo |
| **Prompt** | Escrito con **ChatGPT** |
| **Herramienta** | **Gemini** (generación de imágenes) |
| **Qué muestra** | Un living con alfombra y una pared empapelada |
| **Dónde se usa** | Galería de `/trabajos` y trabajos destacados del inicio |
| **Texto alternativo** | "Living con alfombra y una pared empapelada" |
| **Revisión** | El autor revisó que la imagen representara el rubro antes de publicarla |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | Al pie de la galería de `/trabajos`: "Fotos de muestra generadas con IA." |

---

## IA-04: Cielorraso de durlock

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Archivo original** | `multimedia/trabajos/cielorraso-durlock.jpg` |
| **Dónde se publica** | Guardada en la tabla `trabajo_fotos` de la base y servida por `/api/trabajos/[id]/foto` |
| **Medidas** | 1376 × 768 px |
| **Tipo** | Foto de muestra de un trabajo |
| **Prompt** | Escrito con **ChatGPT** |
| **Herramienta** | **Gemini** (generación de imágenes) |
| **Qué muestra** | Un cielorraso de durlock con iluminación embutida |
| **Dónde se usa** | Galería de `/trabajos` y trabajos destacados del inicio |
| **Texto alternativo** | "Cielorraso de durlock con iluminación embutida" |
| **Revisión** | El autor revisó que la imagen representara el rubro antes de publicarla |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | Al pie de la galería de `/trabajos`: "Fotos de muestra generadas con IA." |

---

## IA-05: Pintura general

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Archivo original** | `multimedia/trabajos/pintura-general.jpg` |
| **Dónde se publica** | Guardada en la tabla `trabajo_fotos` de la base y servida por `/api/trabajos/[id]/foto` |
| **Medidas** | 1376 × 768 px |
| **Tipo** | Foto de muestra de un trabajo |
| **Prompt** | Escrito con **ChatGPT** |
| **Herramienta** | **Gemini** (generación de imágenes) |
| **Qué muestra** | Paredes y techo pintados en tonos claros |
| **Dónde se usa** | Galería de `/trabajos` y trabajos destacados del inicio |
| **Texto alternativo** | "Paredes y techo pintados en tonos claros" |
| **Revisión** | El autor revisó que la imagen representara el rubro antes de publicarla |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | Al pie de la galería de `/trabajos`: "Fotos de muestra generadas con IA." |

---

## IA-06: Paredes con enduido

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Archivo original** | `multimedia/trabajos/paredes-enduido.jpg` |
| **Dónde se publica** | Guardada en la tabla `trabajo_fotos` de la base y servida por `/api/trabajos/[id]/foto` |
| **Medidas** | 1376 × 768 px |
| **Tipo** | Foto de muestra de un trabajo |
| **Prompt** | Escrito con **ChatGPT** |
| **Herramienta** | **Gemini** (generación de imágenes) |
| **Qué muestra** | Paredes interiores con enduido y terminación lisa |
| **Dónde se usa** | Galería de `/trabajos` y trabajos destacados del inicio |
| **Texto alternativo** | "Paredes interiores con enduido y terminación lisa" |
| **Revisión** | El autor revisó que la imagen representara el rubro antes de publicarla |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | Al pie de la galería de `/trabajos`: "Fotos de muestra generadas con IA." |

---

## IA-07: Piso de machimbre

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Archivo original** | `multimedia/trabajos/piso-machimbre.jpg` |
| **Dónde se publica** | Guardada en la tabla `trabajo_fotos` de la base y servida por `/api/trabajos/[id]/foto` |
| **Medidas** | 1376 × 768 px |
| **Tipo** | Foto de muestra de un trabajo |
| **Prompt** | Escrito con **ChatGPT** |
| **Herramienta** | **Gemini** (generación de imágenes) |
| **Qué muestra** | Un piso de machimbre en un ambiente luminoso |
| **Dónde se usa** | Galería de `/trabajos` y trabajos destacados del inicio |
| **Texto alternativo** | "Piso de machimbre colocado en un ambiente luminoso" |
| **Revisión** | El autor revisó que la imagen representara el rubro antes de publicarla |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | Al pie de la galería de `/trabajos`: "Fotos de muestra generadas con IA." |

---

## IA-08: Molduras en el salón

> **Generado con IA.**

| Campo | Detalle |
|---|---|
| **Archivo original** | `multimedia/trabajos/molduras-salon.jpg` |
| **Dónde se publica** | Guardada en la tabla `trabajo_fotos` de la base y servida por `/api/trabajos/[id]/foto` |
| **Medidas** | 1376 × 768 px |
| **Tipo** | Foto de muestra de un trabajo |
| **Prompt** | Escrito con **ChatGPT** |
| **Herramienta** | **Gemini** (generación de imágenes) |
| **Qué muestra** | Un salón con molduras decorativas en paredes y techo |
| **Dónde se usa** | Galería de `/trabajos` y trabajos destacados del inicio |
| **Texto alternativo** | "Salón con molduras decorativas en paredes y techo" |
| **Revisión** | El autor revisó que la imagen representara el rubro antes de publicarla |
| **Personas reales** | No se usaron personas reales |
| **Leyenda** | Al pie de la galería de `/trabajos`: "Fotos de muestra generadas con IA." |

---

## Piezas que no son multimedia

El código, las pruebas y la documentación también se escribieron con ayuda de IA. No llevan ficha en este archivo porque no son piezas visuales: están declarados en `docs/DECLARACION-IA.md`, sección 1, y se revisaron con `npm test` y `npm run build`.

Los textos visibles del sitio **no** los escribió la IA: los escribió el autor y la IA solo los acomodó.
