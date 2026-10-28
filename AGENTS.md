# Sergio Decoraciones: Instrucciones para la IA

## Descripción del proyecto

Sitio web de **Sergio Decoraciones**, un emprendimiento de decoración y terminaciones de interiores y exteriores (durlock, pintura, enduido, empapelado, alfombra, machimbre y molduras) que trabaja sobre todo en Tinogasta, Catamarca.

El sitio muestra los trabajos terminados y los servicios, y lleva a la persona a consultar por WhatsApp, por llamada o con un formulario. Además tiene un panel privado donde Sergio ve las consultas que recibió.

Stack: Next.js (React) + PostgreSQL (Neon) + GitHub + Vercel.

## Antes de escribir código, leé

| Archivo | Para qué sirve |
|---|---|
| `docs/IDENTIDAD-MARCA.md` | Nombre, logo, colores, tipografías, tono de voz y variables CSS |
| `docs/01-CONTEXTO.md` | Por qué existe el sitio, para quién es y qué no incluye |
| `docs/02-REQUERIMIENTOS.md` | Qué tiene que hacer: requerimientos funcionales (RF) y no funcionales (RNF) |
| `docs/03-TECNOLOGIAS.md` | Con qué se construye y qué tecnologías no usar |
| `docs/04-ARQUITECTURA.md` | Árbol de carpetas y función de cada parte |
| `docs/05-DATOS.md` | Tablas de la base de datos, campos y ejemplos |
| `docs/06-DISENO-UI.md` | Pantallas y cómo se aplica la identidad en botones, tarjetas y formularios |
| `docs/07-CONVENCIONES.md` | Nombres, idioma, formato del código y de los commits |
| `docs/08-TAREAS.md` | Etapas de trabajo con casillas para tildar |
| `docs/09-SEO.md` | Título, descripción, palabras clave y texto alternativo de cada página |
| `docs/10-SEGURIDAD.md` | Datos sensibles, variables de entorno, validaciones y panel privado |

## Reglas obligatorias

- **Leer la Constitución:** Antes de iniciar cualquier tarea, spec o plan, lee íntegramente `docs/CONSTITUCION.md`.
- Trabajar **una tarea de `docs/08-TAREAS.md` por vez**, en orden, y marcarla con `[x]` al terminar.
- Usar siempre las variables CSS de `IDENTIDAD-MARCA.md` para colores y tipografías.
- Usar el logo desde `public/img/marca/`, sin modificarlo; las versiones blancas solo sobre Negro Carbón `#1A1A1A`.
- Conectarse a la base de datos solo desde `lib/db.js` y escribir el SQL siempre con parámetros: sql`...`.
- Leer el número de WhatsApp y de teléfono solo de `lib/contacto.js`.
- Verificar la sesión con `lib/sesion.js` en toda página y ruta de `admin/`.
- Escribir los nombres del código en español, según `docs/07-CONVENCIONES.md`.
- Ponerle texto alternativo descriptivo a cada imagen.
- Escribir los textos del sitio en español, con el tono de voz de la marca.
- Usar siempre la palabra "trabajos" (menú, direcciones, código y base de datos), nunca "proyectos".
- **Ciclo SDD:** Respeta estrictamente el flujo de especificación, clarificación, plan, tareas, implementación y validación.
- **Memoria:** Lo que deba persistir entre conversaciones se guarda en `memory.md`, no en el historial del chat.
- **Idioma:** Código y nombres de variables en español sin tildes; commits en imperativo o presente según las convenciones

## Qué no hacer

- No usar Tailwind, Bootstrap, Vue, Angular, jQuery, MongoDB, Firebase, Prisma ni TypeScript.
- No agregar pagos online, tienda, cuentas de clientes ni precios publicados.
- No deformar, rotar, recolorear ni agregarle efectos al logo.
- No escribir colores ni tipografías a mano en el código.
- No mostrar, subir a GitHub ni exponer en el navegador `DATABASE_URL`, `ADMIN_CLAVE_HASH` ni `SESION_SECRETA`, y no ponerles el prefijo `NEXT_PUBLIC_`.
- No usar `dangerouslySetInnerHTML`.
- No mostrar las consultas guardadas fuera del panel privado.
- No inventar datos: los precios quedan en `$ 0` y el teléfono como marcador `+54 9 3837 000000`.
- No cambiar el stack sin editar antes `docs/03-TECNOLOGIAS.md`.

## Si algo no está claro

Preguntar antes de inventar. Si el código y un archivo de `docs/` no coinciden, primero se edita el archivo `.md` y después el código.
