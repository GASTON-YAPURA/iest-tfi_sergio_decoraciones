# DECLARACIÓN DE USO DE INTELIGENCIA ARTIFICIAL

Este documento cumple el principio 8 de `CONSTITUCIÓN.md`: **uso responsable de la IA**. Declara qué piezas del proyecto se generaron con inteligencia artificial, con qué herramientas, quién las revisó y dónde lleva cada una la leyenda **"Generado con IA"**.

La ficha detallada de cada pieza visual está en `multimedia/FICHAS-IA.md`.

## 1. Qué se generó con IA y qué no

| Pieza | ¿Generada con IA? | Detalle |
|---|---|---|
| Monograma **SD** del logo | **Sí, en parte** | Las letras S y D se generaron con una herramienta de imágenes por IA. El diseño final, el color, la sombra y las variantes se armaron en **Canva**. |
| Logos horizontales y monogramas de `marca/` | **Sí, derivados** | Salen del monograma generado con IA y se compusieron en Canva con el nombre en Cinzel. No se redibujaron a mano. |
| Fotos de los seis trabajos de muestra (`multimedia/trabajos/` y tabla `trabajo_fotos`) | **Sí** | Las seis imágenes son de muestra y se generaron con IA para el prototipo. No son trabajos reales de Sergio. Los prompts se escribieron con **ChatGPT** y las imágenes se generaron con **Gemini**. |
| Textos visibles del sitio (portada, servicios, nosotros, contacto) | **No** | Los escribió el autor del TP. La IA solo los acomodó y corrigió ortografía. |
| Código del sitio (`app/`, `components/`, `lib/`, `db/`, `test/`) | **Sí, con revisión** | Se escribió con el agente **OpenCode** a partir de las especificaciones de `docs/`. Cada archivo se leyó, se probó y se corrigió antes de darlo por terminado. |
| Documentación (`docs/`, `memory.md`, `Commits.md`, `Legends.md`) | **Sí, con revisión** | Se redactó con el mismo agente a partir de las decisiones del autor. El autor revisó y aprobó el contenido. |
| Datos de la base (títulos, descripciones, textos alternativos) | **Sí, con revisión** | Son datos de muestra inventados para el prototipo; se reemplazan por los reales de Sergio. |
| Número de teléfono y precios | **No** | Son marcadores (`+54 9 3837 000000` y `$ 0`). No se inventaron datos reales. |

## 2. Herramientas usadas

| Herramienta | Para qué | Observación |
|---|---|---|
| Generador de imágenes con IA | Crear la base del monograma SD y las seis fotos de muestra | El monograma se generó con una herramienta de imágenes por IA. Las seis fotos de trabajos se generaron con **Gemini**, a partir de prompts escritos con **ChatGPT**. Las piezas quedaron registradas en `multimedia/FICHAS-IA.md`. |
| Canva | Componer los logos, las variantes y la paleta de colores | Es una herramienta de diseño, no de generación de imágenes. |
| OpenCode (agente de IA) | Escribir código, pruebas y documentación | Trabajó con las reglas de `AGENTS.md` y la especificación de `docs/`. |
| Next.js, React, Neon, GitHub y Vercel | Stack del sitio | No son herramientas de IA. |

## 3. Cuidados que se respetaron

- **No se usaron fotos, nombres ni datos de personas reales.** Las imágenes de muestra son ambientes y terminaciones.
- **No se imitaron marcas** de terceros: el monograma es propio y las fotos no reproducen logos ajenos.
- **No se pegaron datos personales ni claves** en ningún prompt. Las consultas reales de la base nunca se usaron para generar contenido.
- **Ningún código se aceptó sin leerlo**: se ejecutaron `npm test` (72 pruebas) y `npm run build` antes de cerrar cada etapa.
- **Las imágenes se revisaron** antes de publicarlas. Si alguna no representaba el rubro, se descartó.
- **Los datos inventados están marcados**: teléfono de muestra, precios en `$ 0` y fotos de muestra. No se presentan como trabajos reales de Sergio.

## 4. Dónde aparece la leyenda "Generado con IA"

| Lugar | Cómo se ve |
|---|---|
| `multimedia/FICHAS-IA.md` | Cada ficha empieza con la leyenda **Generado con IA** y el detalle de la pieza. |
| `/trabajos` | Al pie de la galería: **"Fotos de muestra generadas con IA."** |
| `docs/00 - IDENTIDAD-MARCA.md` | Nota en la sección del logo, con el vínculo a este documento. |
| Este documento | Declaración general y tabla de piezas. |

El logo **no** lleva la leyenda estampada encima: el manual de marca prohíbe agregarle textos, sombras o efectos. La leyenda queda en el manual, en la ficha y en este documento, que es donde se puede leer sin alterar la pieza.

## 5. Cómo se comprueba

1. Abrir `multimedia/FICHAS-IA.md` y contar las fichas: una por el monograma, una por las variantes del logo y una por cada una de las seis fotos.
2. Abrir `/trabajos` y buscar el texto "Fotos de muestra generadas con IA".
3. Buscar `Generado con IA` en `docs/` y `multimedia/`.
4. Revisar que `docs/00 - IDENTIDAD-MARCA.md` tenga la nota del logo.

## 6. Vigencia

- **Última actualización:** 01/11/2026.
- Si se reemplazan las fotos de muestra por fotos reales de Sergio, se quita la ficha correspondiente, se actualiza la leyenda de `/trabajos` y se registra el cambio en `memory.md`.
- Si se cambia el logo, se actualiza la ficha IA-01 y la nota de `docs/00 - IDENTIDAD-MARCA.md`.
