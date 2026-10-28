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
| Código del sitio | Etapa 7 completa: panel privado `/admin`, ingreso con sesión firmada, listado protegido `/admin/consultas`, marcar consultas como atendidas y salir |
| Informe escrito del TP | Pendiente |

**Próximo paso:** Etapa 8 de `08-TAREAS.md` (Calidad y publicación): cargar las variables en Vercel, revisar SEO y seguridad, probar en celular y publicar.

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
| Acceso a la base | `@neondatabase/serverless` | Driver oficial de Neon, compatible con Vercel y con consultas parametrizadas |
| Carga de trabajos | Directamente en la base de datos, sin panel de carga | El panel solo muestra consultas |
| Nombres | La galería se llama "Trabajos" en el menú (TRABAJOS), en la dirección (`/trabajos`), en el código y en la base de datos | Un solo nombre en todo el proyecto, sin confusiones |
| Idioma del código | Español, sin tildes ni ñ | Definido en `07-CONVENCIONES.md` |
| Tipografías | Cinzel Bold para títulos, Lato Regular para textos | Cinzel es la tipografía del logo |
| Tono de voz | Cercano y respetuoso, se trata de "usted" al cliente | Definido en `IDENTIDAD-MARCA.md` |
| Texto de portada | "Decoraciones que transforman tus espacios" | El texto de ejemplo del mockup original no se usa |
| Consultas del formulario | Se validan en el navegador y otra vez en `app/api/consultas/route.js`; se guardan con SQL parametrizado y un máximo de 5 envíos por minuto por conexión | El navegador se puede manipular y hay que evitar envíos masivos |
| Hash del panel en `.env.local` | Los `$` del hash bcrypt se guardan escapados (`\$`) solo en `.env.local`; en Vercel se cargan tal cual | Next expande las variables al leer `.env.local` y, sin escapar, el hash llega incompleto |
| Prueba en el celular con `next dev` | La IP de la computadora se carga en `ORIGENES_DESARROLLO` dentro de `.env.local` y `next.config.mjs` la pasa a `allowedDevOrigins` | Next bloquea los archivos de desarrollo pedidos desde otro origen, y sin eso el menú y los demás botones no responden en el celular |

## Fuera de alcance (por ahora)

Pago online, cuentas de clientes, tienda, precios publicados, redes sociales integradas y panel para cargar trabajos.

## Pendientes

- **Datos reales:** reemplazar el teléfono de muestra, cargar los trabajos reales de Sergio con sus fotos y reemplazar las imágenes de muestra.
- **Prueba en el celular:** si cambia la red, actualizar la IP en `ORIGENES_DESARROLLO` dentro de `.env.local` y reiniciar `npm run dev`.
- **Variables en Vercel:** cargar `DATABASE_URL`, `ADMIN_USUARIO`, `ADMIN_CLAVE_HASH` y `SESION_SECRETA` al publicar (Etapa 8).
- **Contraseña del panel:** cambiar la clave temporal antes de publicar y actualizar `ADMIN_CLAVE_HASH`.

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
| 28/10/2026 | Menú del celular: `allowedDevOrigins` desde `ORIGENES_DESARROLLO`, cierre con Escape, al tocar fuera, al cambiar de ruta y al pasar a escritorio; bloqueo del scroll del fondo, cruz animada en el botón y `prefers-reduced-motion` |
| 28/10/2026 | Documentación: `docs/11 - RECORRIDO DEL PROYECTO.md` con el paso a paso de las ocho etapas, el arreglo del menú y un glosario |
| 28/10/2026 | Lanzador local `ver-sitio-local.bat` + `scripts/ver-local.mjs` (ambos en `.gitignore`): doble clic para abrir el sitio, espera la respuesta del servidor, abre el navegador solo y cierra el proceso al salir; `normalizarOrigen` en `next.config.mjs` para aceptar el host con puerto o esquema |
| 28/10/2026 | Etapa 7: panel `/admin` con ingreso, `lib/acceso.js` (firma de sesión y bcrypt), `lib/sesion.js`, límite de 5 intentos cada 15 minutos, API protegida de consultas, tabla con marca de atendida, salida y pruebas |
| 28/10/2026 | Etapa 6: página `/nosotros`, formulario en `/contacto`, `lib/validacion.js`, `lib/limite.js`, `lib/consultas.js`, API `/api/consultas`, confirmación de envío y pruebas |
| 28/10/2026 | Etapa 5: API de trabajos, galería `/trabajos`, filtro por servicio, visor accesible, `GaleriaTrabajos` y pruebas del filtro |
| 27/10/2026 | Etapa 4: inicio con portada, trabajos destacados desde la base, resumen de servicios, página `/servicios`, `TarjetaTrabajo` y pruebas de servicios |
| 27/10/2026 | Etapa 3: `lib/contacto.js`, encabezado con logo, menú responsive con página activa, pie oscuro, botones de WhatsApp y llamada, botón flotante y pruebas de contacto |
| 25/10/2026 | Etapa 2: proyecto en Neon, `lib/db.js`, tablas `trabajos` y `consultas`, 6 trabajos de muestra con fotos placeholder y pruebas de base de datos |
| 25/10/2026 | Se publicó el repositorio en GitHub (`iest-tfi_sergio_decoraciones`) y se subió `main`; Etapa 1 completa |
| 24/10/2026 | Etapa 1: proyecto Next.js con App Router, variables de marca en `app/globals.css`, tipografías Cinzel y Lato con `next/font`, logos en `public/img/marca/` y primer commit local `ceb1867`; se agregó `node:test` a `03 - TECNOLOGÍAS.md` |
| 09/10/2026 | Kit de especificaciones completo y creación de `Legends.md`, `Memory.md` y `Commits.md` |
| 09/10/2026 | Se unificó el nombre "Trabajos" (menú, ruta `/trabajos`, código y base de datos); se quitó de `08-TAREAS.md` la tarea duplicada del campo `atendida` y se aclaró el comentario de `.env.local` en `04-ARQUITECTURA.md` |
