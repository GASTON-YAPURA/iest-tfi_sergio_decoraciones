# 09-SEO: cómo nos encuentran en Google

Sergio trabaja sobre todo en Tinogasta, Catamarca, así que el SEO apunta a quien busca estos servicios en la zona. Cada página tiene su propio título y descripción, y todo el contenido está en español.

## Título y descripción de cada página

| Página | Título (hasta 60 caracteres) | Descripción (hasta 155 caracteres) |
|---|---|---|
| `/` | Sergio Decoraciones \| Decoración en Tinogasta | Pintura, durlock, enduido, empapelado, machimbre y molduras en Tinogasta, Catamarca. Mirá nuestros trabajos y consultá por WhatsApp. |
| `/servicios` | Servicios \| Sergio Decoraciones | Durlock, pintura, enduido, empapelado, alfombra, machimbre y molduras para interiores y exteriores. Consultá por WhatsApp. |
| `/trabajos` | Trabajos terminados \| Sergio Decoraciones | Mirá trabajos de pintura, durlock, enduido, machimbre y molduras realizados por Sergio Decoraciones en Tinogasta. |
| `/nosotros` | Nosotros \| Sergio Decoraciones | Conocé a Sergio y cómo trabaja: prolijidad, detalle y buen oficio en cada ambiente. |
| `/contacto` | Contacto \| Sergio Decoraciones | Escribinos por WhatsApp, llamanos o dejá tu consulta para un trabajo de decoración en Tinogasta. |

## Palabras clave

| Página | Palabras clave |
|---|---|
| `/` | decoraciones en Tinogasta, decoración de interiores Catamarca |
| `/servicios` | durlock en Tinogasta, pintura de interiores y exteriores, enduido, empapelado |
| `/trabajos` | trabajos de pintura, trabajos de durlock, colocación de machimbre, colocación de molduras |
| `/nosotros` | Sergio Decoraciones, decoradores en Tinogasta |
| `/contacto` | presupuesto de decoración, contacto Sergio Decoraciones |

Las palabras clave se usan de forma natural en títulos, subtítulos y textos; no se repiten en exceso.

## Texto alternativo de las imágenes (ejemplos)

Cada imagen lleva un `alt` que describe qué se ve: el ambiente, el servicio y el resultado. En la base de datos se guarda en el campo `texto_alt` de cada trabajo.

| Imagen | Texto alternativo |
|---|---|
| Logo del encabezado | Logo de Sergio Decoraciones |
| Monograma (celular y favicon) | Monograma SD de Sergio Decoraciones |
| Trabajo de empapelado | Living con una pared empapelada y molduras blancas |
| Trabajo de pintura | Dormitorio pintado en tonos claros con terminación prolija |
| Trabajo de durlock | Cielorraso de durlock con iluminación embutida |

## Ejemplo en código

```js
// app/trabajos/page.js
export const metadata = {
  title: "Trabajos terminados | Sergio Decoraciones",
  description:
    "Mirá trabajos de pintura, durlock, enduido, machimbre y molduras realizados por Sergio Decoraciones en Tinogasta.",
  openGraph: {
    images: ["/img/marca/logo-horizontal-principal.png"],
  },
};
```

```js
// app/layout.js
<html lang="es">
```

## Páginas que Google no debe mostrar

El panel privado de Sergio (`/admin` y `/admin/consultas`) no debe aparecer en los buscadores.

```js
// app/admin/layout.js
export const metadata = {
  robots: { index: false, follow: false },
};
```

## Lista de control

- [ ] Cada página tiene su propio título y descripción
- [ ] Un solo `<h1>` por página
- [ ] Todas las imágenes tienen texto alternativo descriptivo
- [ ] Se usan etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] `<html lang="es">` en `app/layout.js`
- [ ] Direcciones en minúsculas y sin tildes: `/trabajos`, `/servicios`
- [ ] El logo y la imagen para compartir se ven al compartir un enlace
- [ ] PageSpeed Insights de 90 o más
- [ ] Las páginas de `/admin` tienen `noindex` y no están en el menú
