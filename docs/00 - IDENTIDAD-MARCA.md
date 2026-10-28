# Manual de identidad: Sergio Decoraciones

## Esencia

- **Nombre:** Sergio Decoraciones
- **Rubro:** decoración y terminaciones de interiores y exteriores
- **Eslogan:** "Cada ambiente, con detalle y buen oficio."
- **Misión:** Transformar casas, locales y espacios con trabajos prolijos de decoración y terminación, cumpliendo los plazos y cuidando cada detalle.
- **Visión:** Ser la decoración de confianza en Tinogasta y la región, reconocida por la calidad de sus terminaciones y el trato cercano.
- **Personalidad:** elegante, prolija, confiable, cercana
- **Público:** personas adultas, o cualquier persona que necesite el trabajo, que quieren renovar o terminar un ambiente de su casa, local u oficina.
- **Zona de trabajo:** mayormente Tinogasta, Catamarca; el resto depende de dónde sea el trabajo.

## Logo

El logo combina un monograma **SD** entrelazado con el nombre escrito en Cinzel: "SERGIO" arriba y "DECORACIONES" abajo. Transmite elegancia y oficio. Existen dos formas (monograma y horizontal) en varios colores, para usar sobre fondos claros y oscuros.

| Versión | Archivo | Fondo donde se usa | Uso |
|---|---|---|---|
| Horizontal principal (SD dorado, SERGIO negro, DECORACIONES gris) | `marca/logo-horizontal-principal.png` | Blanco | Encabezado del sitio, presupuestos |
| Horizontal ocre | `marca/logo-horizontal-ocre.png` | Blanco | Impresos, sello en presupuestos |
| Horizontal negro | `marca/logo-horizontal-negro.png` | Blanco | Documentos en blanco y negro |
| Horizontal gris | `marca/logo-horizontal-gris.png` | Blanco | Marca de agua, usos discretos |
| Horizontal blanco | `marca/logo-horizontal-blanco.png` | Negro Carbón `#1A1A1A` | Pie de página y secciones oscuras |
| Monograma dorado | `marca/logo-sd-dorado.png` | Blanco | Favicon, redes sociales |
| Monograma grafito | `marca/logo-sd-grafito.png` | Blanco | Documentos en blanco y negro |
| Monograma blanco | `marca/logo-sd-blanco.png` | Negro Carbón `#1A1A1A` | Foto de perfil, secciones oscuras |

### Reglas del logo

La IA nunca debe:

- Deformar, rotar o recolorear el logo
- Agregarle sombras o efectos (las versiones ya traen su sombra suave incluida)
- Usar una versión sobre un fondo de bajo contraste: las versiones de color van sobre blanco y las blancas, sobre Negro Carbón
- Reconstruirlo escribiendo el nombre con texto: siempre se usa el archivo de `marca/`

Tamaño mínimo digital: 32 px de alto.

## Colores

| Nombre | HEX | Uso | Proporción |
|---|---|---|---|
| Blanco Puro | `#FFFFFF` | Fondo dominante | 60 % |
| Negro Carbón | `#1A1A1A` | Títulos, textos y secciones oscuras | 20 % |
| Ocre Profundo | `#815922` | Acento: botones, enlaces, detalles | 10 % |
| Gris Grafito | `#6C6D6F` | Textos de apoyo, bordes e íconos | 10 % |

Los botones llevan fondo Ocre Profundo con texto blanco. Para fondos suaves (por ejemplo la portada) se usa Ocre Profundo al 10 % de opacidad sobre blanco (`--color-acento-suave`); no es un color nuevo. La paleta completa está en `marca/paleta-colores.jpg`.

## Tipografías

| Uso | Familia | Peso |
|---|---|---|
| Títulos (H1, H2) y destacados | Cinzel | Bold |
| Textos y párrafos | Lato | Regular |

Cinzel es la tipografía del logo y se muestra en letras capitales, por eso se usa solo en títulos y nunca en párrafos largos. Lato es una sans serif legible que equilibra la elegancia de Cinzel. Ambas son gratuitas en Google Fonts, aptas para la web.

## Tono de voz

- Cercano y respetuoso: se habla de "usted" al cliente.
- Claro y sin tecnicismos innecesarios.
- Seguro, pero sin exagerar: se muestran los trabajos, no se promete lo imposible.

| Sí | No |
|---|---|
| "Contanos qué ambiente querés renovar." | "Solicite su cotización mediante el formulario." |
| "Trabajamos con prolijidad y cumplimos los plazos." | "¡Somos los mejores del mundo!" |

## Variables para el código

Copiar tal cual en `app/globals.css`. La IA usa SIEMPRE estas variables, nunca colores escritos a mano.

| Variable | Valor |
|---|---|
| `--color-fondo` | `#FFFFFF` |
| `--color-principal` | `#1A1A1A` |
| `--color-acento` | `#815922` |
| `--color-secundario` | `#6C6D6F` |
| `--color-acento-suave` | `rgba(129, 89, 34, 0.10)` |

```css
/* app/globals.css */
:root {
  --color-fondo: #FFFFFF;
  --color-principal: #1A1A1A;
  --color-acento: #815922;
  --color-secundario: #6C6D6F;
  --color-acento-suave: rgba(129, 89, 34, 0.10);
  --fuente-titulos: "Cinzel", serif;
  --fuente-texto: "Lato", sans-serif;
  --radio-borde: 4px;
}

h1 {
  font-family: var(--fuente-titulos);
  color: var(--color-principal);
}
```