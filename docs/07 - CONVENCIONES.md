# 07-CONVENCIONES: cómo escribimos el código de Sergio Decoraciones

## Idioma

- Los nombres del código (archivos, variables, funciones, tablas) van en **español**, sin tildes ni la letra ñ.
- Los comentarios del código van en español.
- Los textos que ve el cliente van en español, con tildes y con el tono de voz de IDENTIDAD-MARCA.md.

## Nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Carpetas | Minúsculas, sin espacios ni tildes | `components/`, `trabajos/` |
| Componentes | PascalCase, un componente por archivo | `TarjetaTrabajo.js` |
| Páginas | Archivo `page.js` dentro de una carpeta en minúsculas | `app/trabajos/page.js` |
| Funciones y variables | camelCase, en español | `filtrarPorServicio()`, `listaTrabajos` |
| Constantes | MAYÚSCULAS con guion bajo | `NUMERO_WHATSAPP` |
| Variables CSS | Minúsculas con guiones, empiezan con `--` | `--color-acento` |
| Clases CSS | Minúsculas con guiones | `boton-principal` |
| Tablas y campos de la base | Minúsculas con guion bajo, tablas en plural | `trabajos`, `texto_alt` |
| Imágenes | Minúsculas con guiones, sin espacios | `living-empapelado.jpg` |

## Formato del código

- Sangría de 2 espacios.
- Comillas dobles y punto y coma al final de cada línea.
- `const` y `let`; nunca `var`.
- Colores y tipografías siempre con las variables de IDENTIDAD-MARCA.md, nunca escritos a mano.
- El número de WhatsApp y de teléfono solo se leen de `lib/contacto.js`.

## Ejemplo de componente

```js
// components/BotonWhatsApp.js
import { NUMERO_WHATSAPP } from "../lib/contacto";

export default function BotonWhatsApp({ mensaje }) {
  const enlace = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a className="boton-principal" href={enlace}>
      Consultar por WhatsApp
    </a>
  );
}
```

## Commits

Cada commit empieza con un verbo en presente, va en minúsculas, sin punto final y describe un solo cambio.

```text
agrega filtro por servicio en trabajos
corrige el texto alternativo de las fotos
actualiza los colores en globals.css
```

## Ramas

| Rama | Uso |
|---|---|
| `main` | Versión publicada en Vercel |
| `feature/nombre` | Una funcionalidad nueva, por ejemplo `feature/trabajos` |

Cada rama `feature/` se prueba en la vista previa que genera Vercel antes de pasar a `main`.
