# MEMORY: estado y decisiones de Sergio Decoraciones

Este archivo es la memoria del proyecto. La IA (o quien retome el trabajo) lo lee al empezar una sesión para saber en qué punto está todo y qué se decidió, sin tener que repetirlo. Se actualiza cada vez que se termina una etapa o se toma una decisión nueva.

## Resumen

Sitio web para **Sergio Decoraciones**, emprendimiento de decoración y terminaciones de interiores y exteriores en Tinogasta, Catamarca. Hoy Sergio consigue clientes solo por WhatsApp y llamadas, y no tiene redes sociales ni sitio. El sitio funciona como vidriera: muestra trabajos terminados y servicios, y lleva a consultar por WhatsApp, por llamada o con un formulario. Incluye un panel privado donde Sergio ve las consultas recibidas.

Stack: Next.js (React) + PostgreSQL (Neon) + GitHub + Vercel.

## Estado actual

| Parte | Estado |
|---|---|
| Identidad de marca (logo, paleta, tipografías) | Hecha: `IDENTIDAD-MARCA.md` |
| Especificaciones (`01` a `10` y `AGENTS.md`) | Hechas |
| `Legends.md`, `Memory.md` y `Commits.md` | Hechos |
| Código del sitio | Etapa 1 completa: proyecto Next.js, variables de marca, tipografías y logos listos, y repositorio publicado en GitHub |
| Informe escrito del TP | Pendiente |

**Próximo paso:** Etapa 2 de `08-TAREAS.md` (Base de datos): crear el proyecto en Neon, guardar `DATABASE_URL`, escribir `lib/db.js` y ejecutar el esquema.

## Decisiones tomadas

| Tema | Decisión | Motivo |
|---|---|---|
| Stack | React con Next.js, PostgreSQL en Neon, GitHub y Vercel | Se mantiene el stack del emprendimiento modelo (Ursus), que ya se tenía planeado usar |
| Estilos | CSS con variables, sin Tailwind ni Bootstrap | Colores y tipografías se escriben una sola vez en `globals.css` |
| Contacto | WhatsApp con mensaje prellenado, botón de llamada y formulario | Es como los clientes llegan hoy a Sergio |
| Precios | No se publican; marcador `$ 0` | Se consultan por WhatsApp o llamada |
| Número de WhatsApp y teléfono | Marcador `+54 9 3837 000000` en `lib/contacto.js` | Lo cambia Sergio si hace falta |
| Panel privado | Entrada por `/admin`, sin aparecer en el menú ni en Google | Sergio ve las consultas sin tocar la base de datos |
| Acceso al panel | Un solo usuario; contraseña como hash bcrypt en variables de entorno; sesión de 8 horas; 5 intentos fallidos cada 15 minutos | No hace falta una tabla de usuarios |
| Carga de trabajos | Directamente en la base de datos, sin panel de carga | El panel solo muestra consultas |
| Nombres | La galería se llama "Trabajos" en el menú (TRABAJOS), en la dirección (`/trabajos`), en el código y en la base de datos | Un solo nombre en todo el proyecto, sin confusiones |
| Idioma del código | Español, sin tildes ni ñ | Definido en `07-CONVENCIONES.md` |
| Tipografías | Cinzel Bold para títulos, Lato Regular para textos | Cinzel es la tipografía del logo |
| Tono de voz | Cercano y respetuoso, se trata de "usted" al cliente | Definido en `IDENTIDAD-MARCA.md` |
| Texto de portada | "Decoraciones que transforman tus espacios" | El texto de ejemplo del mockup original no se usa |

## Fuera de alcance (por ahora)

Pago online, cuentas de clientes, tienda, precios publicados, redes sociales integradas y panel para cargar trabajos.

## Pendientes

- **Datos reales:** reemplazar el teléfono de muestra y cargar los trabajos reales de Sergio con sus fotos.

## Reglas que no se rompen

- Una tarea de `08-TAREAS.md` por vez, en orden, y se marca con `[x]` al terminar.
- Colores y tipografías siempre con variables CSS, nunca escritos a mano.
- El logo se usa desde `public/img/marca/`, sin modificarlo.
- La base de datos se usa solo desde `lib/db.js` y con parámetros SQL.
- La sesión se verifica con `lib/sesion.js` en toda página y ruta de `admin/`.
- Si el código y un `.md` no coinciden, primero se edita el `.md`.

## Historial de cambios

| Fecha | Cambio |
|---|---|
| 28/10/2026 | Se publicó el repositorio en GitHub (`iest-tfi_sergio_decoraciones`) y se subió `main`; Etapa 1 completa |
| 28/10/2026 | Etapa 1: proyecto Next.js con App Router, variables de marca en `app/globals.css`, tipografías Cinzel y Lato con `next/font`, logos en `public/img/marca/` y primer commit local `ceb1867`; se agregó `node:test` a `03 - TECNOLOGÍAS.md` |
| 09/10/2026 | Kit de especificaciones completo y creación de `Legends.md`, `Memory.md` y `Commits.md` |
| 09/10/2026 | Se unificó el nombre "Trabajos" (menú, ruta `/trabajos`, código y base de datos); se quitó de `08-TAREAS.md` la tarea duplicada del campo `atendida` y se aclaró el comentario de `.env.local` en `04-ARQUITECTURA.md` |
