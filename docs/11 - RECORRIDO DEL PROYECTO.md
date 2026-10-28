# 11 - RECORRIDO DEL PROYECTO: qué se hizo, etapa por etapa

Este documento cuenta **cómo se construyó** el sitio de Sergio Decoraciones: qué se hizo en cada etapa, en qué orden, por qué se tomó cada decisión y cómo se comprobó que funcionaba. Está pensado para leer de corrido y entender el proyecto sin abrir el código.

- Para el detalle técnico de cada tema están los otros archivos de `docs/` (por ejemplo `04 - ARQUITECTURA.md` y `10 - SEGURIDAD.md`).
- Para el estado resumido está `memory.md`.
- Para el registro de commits está `Commits.md`.

---

## 1. Qué es el proyecto, en una carátula

| Tema | Respuesta |
|---|---|
| Cliente | Sergio Decoraciones, emprendimiento de decoración y terminaciones en Tinogasta, Catamarca |
| Problema | Sergio consigue clientes solo por WhatsApp y llamadas; no tiene sitio ni redes |
| Solución | Una vidriera web con los trabajos y los servicios, botones de contacto y un panel privado de consultas |
| Stack | Next.js 16 (App Router) + React 19, PostgreSQL en Neon, GitHub y Vercel |
| Estilos | CSS propio con variables de marca (sin Tailwind ni Bootstrap) |
| Idioma | Todo el sitio en español; el código también, sin tildes ni ñ |
| Palabra clave | Siempre "trabajos", nunca "proyectos" |

### Las páginas que existen

| Ruta | Qué hace | Tipo |
|---|---|---|
| `/` | Portada, tres trabajos destacados y resumen de servicios | Estática, se regenera cada hora |
| `/servicios` | Los seis servicios con su detalle | Estática |
| `/trabajos` | Galería completa con filtro y visor de fotos | Estática, se regenera cada hora |
| `/nosotros` | Quién es Sergio y cómo trabaja | Estática |
| `/contacto` | WhatsApp, llamada y formulario de consulta | Estática |
| `/admin` | Ingreso con usuario y contraseña | Dinámica, fuera del menú |
| `/admin/consultas` | Listado privado de consultas | Dinámica, protegida |

### Las APIs

| Ruta | Método | Para qué |
|---|---|---|
| `/api/trabajos` | GET | Devuelve los trabajos visibles |
| `/api/consultas` | POST | Valida y guarda una consulta del formulario |
| `/api/admin/ingresar` | POST | Verifica credenciales y crea la sesión |
| `/api/admin/consultas` | GET / PATCH | Lista las consultas y marca una como atendida |
| `/api/admin/salir` | POST | Borra la cookie de sesión |

---

## 2. Cómo se trabajó (el método)

El proyecto no se hizo "de una sola vez". Se siguió un ciclo de trabajo escrito en `AGENTS.md` y en `CONSTITUCIÓN.md`:

1. **Especificar**: leer los documentos de `docs/` que corresponden a la etapa.
2. **Planificar**: decidir qué archivos se van a tocar y cómo.
3. **Implementar**: escribir el código respetando las convenciones.
4. **Probar**: ejecutar `npm test` y `npm run build`.
5. **Registrar**: marcar la tarea con `[x]` en `08 - TAREAS.md`, anotar el commit y actualizar `memory.md`.

Las ocho etapas están en `08 - TAREAS.md`. Cada una tiene sus tareas con casillas y los requerimientos que cubre (RF = funcional, RNF = no funcional, definidos en `02 - REQUERIMIENTOS.md`).

### Línea de tiempo real (commits)

| Fecha | Commit | Etapa |
|---|---|---|
| 28/10/2026 | `ceb1867 crea el proyecto next.js con la identidad de marca` | 1 |
| 28/10/2026 | `8866eba actualiza el estado de la etapa 1` | 1 |
| 28/10/2026 | `40eae56 completa la etapa 1 y registra el repositorio` | 1 |
| 28/10/2026 | `d487482 crea las tablas y carga los trabajos de muestra` | 2 |
| 28/10/2026 | `7736166 agrega la estructura comun y los botones de contacto` | 3 |
| 28/10/2026 | `4b1df96 maqueta el inicio y la pagina de servicios` | 4 |
| 28/10/2026 | `80f0ab5 agrega la galeria de trabajos con filtro y visor` | 5 |
| 28/10/2026 | `401b25d valida y guarda las consultas del formulario` | 6 |
| 28/10/2026 | `520fab7 protege el panel de consultas con sesion` | 7 |
| 28/10/2026 | `8877162 arregla el menu hamburguesa en el celular` | 8 (en curso) |

---

## 3. Etapa 1: Preparación

**Objetivo:** tener un proyecto que arranque, con la marca ya aplicada.
**Requerimientos:** RNF06 (fidelidad a la marca).

### Paso a paso

1. **Se creó el proyecto Next.js** `sergio-decoraciones` con App Router y JavaScript puro (sin TypeScript, que el proyecto no usa).
2. **Se copiaron los colores y tipografías** de `00 - IDENTIDAD-MARCA.md` a `app/globals.css`, dentro de `:root`, como variables CSS:

   ```css
   --color-fondo: #fff;
   --color-principal: #1a1a1a;   /* Negro Carbón */
   --color-acento: #815922;      /* Dorado */
   --color-secundario: #6c6d6f;
   --fuente-titulos, --fuente-texto, --radio-borde
   ```

   La regla del proyecto es que **ningún color ni tipografía se escribe a mano en otro archivo**: siempre se usa `var(--...)`.

3. **Se cargaron las tipografías** Cinzel (solo títulos, peso 700) y Lato (textos, 400 y 700) con `next/font/google` en `app/layout.js`. Next las descarga en el build y las sirve desde el propio dominio, así que no hay pedidos a Google en el navegador del cliente.
4. **Se copiaron los logos** a `public/img/marca/`: versión horizontal para escritorio y monograma SD para celular, más la versión blanca para el pie.
5. **Se creó el repositorio en GitHub** y se subió `main`.
6. **Se agregó `.gitignore`** para que `.env.local`, `node_modules` y `.next` no lleguen nunca al repositorio.

### Por qué así

- **Variables CSS**: cambiar la marca en el futuro es editar un solo bloque.
- **`next/font`**: mejor rendimiento y sin parpadeo de tipografía.
- **Logos sin modificar**: el manual de marca prohíbe deformarlos o recolorearlos.

**Resultado:** proyecto que compila, con la identidad visual aplicada.

---

## 4. Etapa 2: Base de datos

**Objetivo:** tener dónde guardar los trabajos y las consultas.
**Requerimientos:** RF01 (galería), RF07 (formulario).

### Paso a paso

1. **Se creó el proyecto en Neon** (PostgreSQL en la nube) y se guardó la cadena de conexión en `DATABASE_URL`, dentro de `.env.local`.
2. **Se ignoró `.env.local` en git.** Esa cadena incluye la contraseña de la base: si se sube, cualquiera puede leer y borrar todo.
3. **Se escribió `lib/db.js`**, la **única** conexión del proyecto:

   ```js
   const cadenaConexion = process.env.DATABASE_URL;
   if (!cadenaConexion) throw new Error("Falta la variable de entorno DATABASE_URL");
   export const sql = neon(cadenaConexion);
   ```

   Si falta la variable, falla al arrancar en vez de fallar raro más tarde.

4. **Se definieron las dos tablas** en `db/esquema.sql`:

   | `trabajos` | Tipo | Para qué |
   |---|---|---|
   | `id` | SERIAL PK | Identificador |
   | `titulo` | VARCHAR(120) | Nombre del trabajo |
   | `servicio` | VARCHAR(20) | Uno de los seis identificadores (`pintura`, `durlock`, …) |
   | `descripcion` | TEXT | Texto corto del trabajo |
   | `foto` | VARCHAR(200) | Ruta de la imagen en `public/` |
   | `texto_alt` | VARCHAR(200) | Texto alternativo para accesibilidad |
   | `visible` | BOOLEAN | Permite ocultar un trabajo sin borrarlo |

   | `consultas` | Tipo | Para qué |
   |---|---|---|
   | `id` | SERIAL PK | Identificador |
   | `nombre` | VARCHAR(80) | Quien consulta |
   | `telefono` | VARCHAR(30) | Cómo responderle |
   | `mensaje` | TEXT | Qué necesita |
   | `creada_en` | TIMESTAMP | Fecha automática (`NOW()`) |
   | `atendida` | BOOLEAN | Estado que Sergio actualiza |

5. **Se cargaron seis trabajos de muestra** con `db/datos.sql`, uno por servicio, con fotos y texto alternativo. El `INSERT` está armado para no duplicar si se ejecuta dos veces.
6. **Se creó `db/ejecutar-sql.js`**, un script chico que lee un archivo `.sql` y lo ejecuta contra Neon, más dos atajos en `package.json`:

   ```text
   npm run db:esquema
   npm run db:datos
   ```

### Por qué así

- **Una sola conexión** (`lib/db.js`): evita tener credenciales y conexiones repartidas por el código.
- **SQL con parámetros**: los valores viajan aparte de la consulta, así un texto con comillas no puede romper ni inyectar SQL.
- **`visible`**: Sergio puede sacar un trabajo de la galería sin perder la foto ni el registro.
- **Datos de muestra**: permiten construir y probar todo el sitio antes de tener las fotos reales.

**Resultado:** base lista, con datos de prueba realistas.

---

## 5. Etapa 3: Estructura común y contacto

**Objetivo:** que todas las páginas tengan encabezado, menú, pie y botones de contacto.
**Requerimientos:** RF05 (WhatsApp) y RF06 (llamada).

### Paso a paso

1. **Se centralizaron los números** en `lib/contacto.js`. Hoy son marcadores (`+54 9 3837 000000`) porque el dato real no se inventa. Ese archivo arma:
   - el enlace de WhatsApp: `https://wa.me/<digitos>?text=<mensaje>` con el mensaje ya escrito y codificado con `encodeURIComponent`;
   - el enlace de llamada: `tel:+<numero>`.

2. **Se armó `app/layout.js`** con la estructura que envuelve a todas las páginas:

   ```text
   <html lang="es"> (con las variables de las tipografías)
     <body>
       enlace "Saltar al contenido"     ← accesibilidad con teclado
       <header> logo + menú
       <main id="contenido"> …página…
       <footer> logo blanco + ubicación + WhatsApp + teléfono
       botón flotante de WhatsApp
   ```

3. **Se crearon los dos botones reutilizables**:
   - `BotonWhatsApp`: enlace a `wa.me` con el mensaje prellenado.
   - `BotonLlamar`: enlace `tel:` que abre el marcador del celular.
   Ambos reciben una clase para poder usarse en el pie, en Contacto o flotando.

4. **Se hizo el menú responsive** en `components/MenuPrincipal.js`:
   - En escritorio (900 px o más): enlaces en fila.
   - En celular: botón de tres rayas y panel desplegable.
   - Marca la página activa con `usePathname` y `aria-current="page"`.
   - El enlace a `/admin` **no** está en el menú (es privado).

5. **Se escribió el CSS base**: contenedor centrado de 1120 px, encabezado pegajoso (`sticky`), pie oscuro, botones primario y secundario, foco visible para teclado.

### Por qué así

- **Números en un solo archivo**: cuando Sergio pase el número real, se cambia una línea.
- **Mensaje prellenado**: el cliente no tiene que pensar qué escribir; baja la barrera para consultar.
- **Botones visibles en todas las páginas**: el objetivo del sitio es que la consulta esté siempre a un toque.

**Resultado:** esqueleto navegable y contactable, con pruebas de estructura y de enlaces.

---

## 6. Etapa 4: Inicio y servicios

**Objetivo:** que la primera pantalla explique qué hace Sergio y muestre trabajos.
**Requerimientos:** RF04 (página de servicios).

### Paso a paso

1. **Se maquetó la portada** en `app/page.js`: etiqueta "Tinogasta, Catamarca", título "Decoraciones que transforman tus espacios", bajada y botón "Ver trabajos".
2. **Se trajeron los trabajos destacados desde la base**, con una función que pide solo tres:

   ```js
   SELECT … FROM trabajos WHERE visible = TRUE ORDER BY id LIMIT $1
   ```

   El límite viaja como parámetro y se valida antes de usarlo.

3. **Se reutilizó `TarjetaTrabajo`** para mostrar cada trabajo con su foto, su servicio y su texto alternativo.
4. **Se agregó el resumen de servicios**, numerado 01 a 06, con enlace a la página completa.
5. **Se creó `app/servicios/page.js`** con los seis servicios, su descripción y las tareas que incluye cada uno. La lista vive en `lib/servicios.js`, que es la **fuente única**: la usan el inicio, la página de servicios, la galería y el panel.
6. **Se fijó `revalidate = 3600`** en el inicio: la página se regenera cada hora. Si Sergio carga un trabajo nuevo, no hace falta volver a publicar.

### Por qué así

- **Servicios en código y trabajos en base**: los servicios son un catálogo fijo de seis; los trabajos cambian seguido y tienen fotos.
- **Un solo archivo de servicios**: evita que el nombre de un servicio diga una cosa en el menú y otra en la galería.
- **Texto alternativo obligatorio**: cada foto lo tiene en la base, así la accesibilidad no depende de acordarse.

**Resultado:** inicio con contenido real de la base y página de servicios completa.

---

## 7. Etapa 5: Trabajos

**Objetivo:** la galería, el filtro y el visor de fotos.
**Requerimientos:** RF01, RF02 y RF03.

### Paso a paso

1. **Se creó `GET /api/trabajos`**: devuelve `{ trabajos }` o un error 500 controlado si la base falla.
2. **Se armó `app/trabajos/page.js`**: pide todos los trabajos visibles y se los pasa a la galería.
3. **Se separó lo interactivo en un componente cliente** (`GaleriaTrabajos`), porque el filtro y el visor necesitan estado en el navegador:
   - `servicioActivo`: qué filtro está elegido;
   - `trabajoAbierto`: qué foto se está viendo en grande.
4. **Se creó `FiltroServicios`**: botones para "Todos" y cada servicio. El filtro se resuelve en memoria con `filtrarTrabajosPorServicio`, sin pedir de nuevo a la base.
5. **Se agregó un contador accesible** (`aria-live="polite"`): al filtrar, el lector de pantalla anuncia "3 trabajos".
6. **Se construyó `VisorFoto`**, que es la parte más delicada:
   - se abre al tocar una tarjeta;
   - tiene `role="dialog"` y `aria-modal="true"`;
   - mueve el foco al botón de cerrar;
   - cierra con `Escape`, con el botón × o tocando el fondo;
   - encierra el `Tab` para que el foco no se escape;
   - bloquea el scroll del fondo;
   - al cerrar, devuelve el foco a la tarjeta de donde salió.

### Por qué así

- **Filtro en el navegador**: los trabajos ya están cargados; filtrar en memoria es instantáneo y no gasta datos del celular.
- **Visor accesible**: un modal mal hecho deja a la gente con teclado atrapada o desorientada.

**Resultado:** galería completa, con filtro y visor probados.

---

## 8. Etapa 6: Nosotros y consulta

**Objetivo:** contar quién es Sergio y recibir consultas sin depender de WhatsApp.
**Requerimientos:** RF07 (formulario) y RF08 (Nosotros).

### Paso a paso

1. **Se creó `/nosotros`** con la historia y la forma de trabajo, en el tono cercano y respetuoso de la marca (se trata de "usted").
2. **Se creó `/contacto`** con tres caminos: WhatsApp, llamada y formulario.
3. **Se escribió `lib/validacion.js`**, que se usa **en los dos lados**: en el navegador (para avisar rápido) y en el servidor (porque el navegador se puede manipular). Reglas:
   - nombre obligatorio, hasta 80 caracteres;
   - teléfono obligatorio, hasta 30, solo números y `+ - ( )` y espacios, con al menos un dígito;
   - mensaje obligatorio, hasta 1000 caracteres;
   - devuelve los datos ya recortados (`trim`) y un objeto de errores por campo.
4. **Se armó `FormularioConsulta`** con cuatro estados: inicial, enviando, éxito y error. Incluye `aria-invalid`, `aria-describedby`, botón deshabilitado mientras envía y una tarjeta de confirmación.
5. **Se creó `lib/limite.js`**: máximo 5 consultas por minuto por conexión. Usa un `Map` en memoria y la IP que llega en `x-forwarded-for`. En Vercel cada instancia tiene su propio contador; para este sitio alcanza.
6. **Se creó `POST /api/consultas`** con este orden:
   1. revisa el límite (si se pasó, **429**);
   2. lee el JSON con manejo de error (**400**);
   3. valida los datos (**400** con errores por campo);
   4. guarda con SQL parametrizado;
   5. responde **201** con un mensaje de agradecimiento.
7. **Se guardó en `lib/consultas.js`** con `INSERT … RETURNING id`, sin armar el SQL pegando texto.

### Por qué así

- **Validar dos veces**: la del navegador es comodidad; la del servidor es seguridad.
- **Límite de envíos**: evita que alguien llene la base con consultas basura.
- **Mensajes de error en castellano y por campo**: el usuario sabe qué corregir.

**Resultado:** formulario funcionando de punta a punta y consultas guardadas en Neon.

---

## 9. Etapa 7: Panel privado de consultas

**Objetivo:** que Sergio vea sus consultas desde el celular, sin tocar la base.
**Requerimientos:** RF09, RF10, RF11 y RNF07.

Es la etapa con más cuidado, porque acá hay datos de terceros.

### Paso a paso

1. **Se definieron tres secretos en `.env.local`**:
   - `ADMIN_USUARIO`;
   - `ADMIN_CLAVE_HASH`: la contraseña **nunca** se guarda en texto plano, se guarda su hash bcrypt;
   - `SESION_SECRETA`: la clave con la que se firma la cookie.

   Detalle importante: en `.env.local` los `$` del hash van escapados (`\$`) porque Next expande variables al leer el archivo. En Vercel se cargan tal cual, y `lib/acceso.js` contempla las dos formas.

2. **Se escribió `lib/acceso.js`** con dos responsabilidades:
   - **Verificar credenciales**: compara el usuario y usa `compare` de bcrypt contra el hash.
   - **Firmar la sesión**: arma un JSON `{ usuario, exp }`, lo pasa a base64url y le agrega una firma **HMAC-SHA256**. Para leerlo, vuelve a calcular la firma y la compara con `timingSafeEqual`, que tarda lo mismo acierte o falle (así no se puede adivinar por tiempo). También controla el vencimiento.

3. **Se escribió `lib/sesion.js`**, que envuelve la cookie:
   - nombre: `sesion_sergio`;
   - `httpOnly`: el JavaScript de la página no puede leerla;
   - `secure` solo en producción (en desarrollo viaja por HTTP);
   - `sameSite: "strict"`: no viaja desde otros sitios;
   - duración: 8 horas;
   - funciones: `crearSesion`, `leerSesion`, `borrarSesion` y `exigirSesion` (si no hay sesión, redirige a `/admin`).

4. **Se creó `POST /api/admin/ingresar`**:
   - primero revisa si la conexión está bloqueada: **5 intentos fallidos en 15 minutos** → **429**;
   - si las credenciales están mal, responde **401** con un mensaje genérico: "Usuario o contraseña incorrectos" (no dice cuál de los dos falló);
   - si están bien, limpia los intentos y crea la cookie.

5. **Se creó `/admin`**: si ya hay sesión, redirige a las consultas; si no, muestra el formulario. La página es dinámica (`force-dynamic`) porque depende de la cookie.
6. **Se creó `/admin/consultas`**:
   - `exigirSesion()` se ejecuta **antes** de tocar la base;
   - muestra un resumen ("2 consultas pendientes de 5 recibidas");
   - las más recientes aparecen primero (`ORDER BY creada_en DESC, id DESC`);
   - la tabla muestra fecha, nombre, teléfono, mensaje y estado.
7. **Se agregó marcar como atendida**: `PATCH /api/admin/consultas` valida la sesión, actualiza solo ese `id` y devuelve la fila. Si la sesión venció (**401**), la tabla redirige al ingreso.
8. **Se agregó el botón "Salir"**: `POST /api/admin/salir` borra la cookie y vuelve al ingreso.
9. **Se bloquearon los buscadores** en `app/admin/layout.js` con `robots: { index: false, follow: false }`.
10. **Se formatearon las fechas** en `lib/fechas.js` con `Intl` en español y zona horaria de Catamarca, para que no se vean corridas.
11. **Se verificó el circuito completo** con el servidor de producción: ingreso, respuestas 401 y 429, banderas de la cookie, acceso sin sesión, marcar atendida y salir.

### Por qué así

- **Sin tabla de usuarios ni librería de autenticación**: hay un solo usuario; una cookie firmada alcanza y no agrega dependencias.
- **Contraseña como hash**: si alguien ve la variable de entorno, no obtiene la clave.
- **Sesión firmada, no "un texto cualquiera"**: si alguien edita la cookie, la firma deja de coincidir y se rechaza.
- **Mensaje de error genérico**: no le confirma a un atacante qué parte adivinó.
- **Límite de intentos**: frena la fuerza bruta.

**Resultado:** panel privado completo y probado, sin exponer datos fuera de `/admin`.

---

## 10. Etapa 8: Calidad y publicación (en curso)

**Objetivo:** dejar el sitio publicado, rápido, accesible y seguro.
**Requerimientos:** RNF01 a RNF05 y RNF07.

### Lo que ya se hizo en esta etapa

1. **Arreglo del menú del celular** (ver sección 11).
2. **Nota de entorno** en `08 - TAREAS.md` para poder probar desde el teléfono.

### Lo que falta

| Pendiente | Qué implica |
|---|---|
| Variables en Vercel | Cargar `DATABASE_URL`, `ADMIN_USUARIO`, `ADMIN_CLAVE_HASH` y `SESION_SECRETA` |
| SEO | Revisar títulos, descripciones y textos alternativos según `09 - SEO.md` |
| Seguridad | Recorrer la lista de control de `10 - SEGURIDAD.md` |
| Privacidad | Confirmar que `/admin` no aparece en el menú ni en Google |
| Pruebas de dispositivo | Celular, tablet y computadora |
| Velocidad | PageSpeed Insights por debajo de 3 segundos |
| Contraste | Revisar contraste y textos alternativos de las fotos |
| Publicación | Deploy en Vercel con HTTPS |
| Contacto real | Probar WhatsApp y llamada desde un celular real |

Además hay dos pendientes de datos, anotados en `memory.md`:

- reemplazar el teléfono de muestra y las fotos de muestra por los datos reales de Sergio;
- cambiar la contraseña temporal del panel antes de publicar.

---

## 11. El arreglo del menú del celular (caso de estudio)

Vale la pena contarlo completo porque fue un problema que **no era de CSS**.

### El síntoma

En el celular, al tocar el botón de tres rayas, no pasaba nada. En la computadora se veía todo bien.

### La investigación

1. Se revisó el HTML generado: `<meta name="viewport" content="width=device-width, initial-scale=1">` estaba bien.
2. Se revisó el CSS compilado: la regla `.menu-navegacion.menu-abierto` existía y era correcta.
3. Se revisó el componente: `useState`, `onClick`, `aria-expanded`, todo correcto.
4. Se revisó `next.config.mjs`: estaba vacío.
5. Se revisó el código de Next instalado y se encontró `block-cross-site-dev.js`: Next 16 **bloquea los archivos de desarrollo** (`/_next/*`) cuando se piden desde otro origen.

### La causa

Al abrir `http://192.168.1.14:3000` desde el teléfono, el navegador pedía los archivos JavaScript con origen `192.168.1.14`, y Next respondía **403**. La página se veía porque el HTML ya venía del servidor, pero React nunca se activaba: ningún botón funcionaba. En producción esto no pasa; era un problema exclusivo de la prueba local.

### La solución

1. `next.config.mjs` ahora lee una variable y la pasa a Next:

   ```js
   allowedDevOrigins: (process.env.ORIGENES_DESARROLLO ?? "")
     .split(",").map((origen) => origen.trim()).filter(Boolean)
   ```

2. En `.env.local` se agregó `ORIGENES_DESARROLLO=192.168.1.14`. Va en el archivo ignorado para no dejar una IP fija en el repositorio (y porque cambia si cambia la red).
3. Se detuvo el servidor viejo y se reinició: la configuración solo se lee al arrancar.

### Mejoras que se agregaron de paso

- El menú se cierra con `Escape`, al tocar fuera y al cambiar de página.
- El fondo no se desplaza mientras el menú está abierto.
- Las tres rayas se transforman en una cruz cuando el menú está abierto.
- El panel tiene altura máxima y scroll propio, para celulares en horizontal.
- Se respeta `prefers-reduced-motion`.

### Cómo se comprobó

Con un navegador real (Chrome sin ventana) emulando un celular de 390×844:

| Comprobación | Resultado |
|---|---|
| Ancho del viewport | 390 px |
| Menú cerrado | `display: none`, `aria-expanded="false"` |
| Al tocar el botón | `aria-expanded="true"`, panel visible, 323 px de alto, justo debajo del encabezado |
| Fondo bloqueado | `overflow: hidden` en el `body` |
| Cruz | transformación aplicada |
| `Escape` | cierra |
| Tocar fuera | cierra |
| Errores de consola o hidratación | ninguno |
| Escritorio (1440 px) | sin hamburguesa, enlaces en fila |
| Origen permitido / origen ajeno | 200 / 403 |

---

## 12. Cómo se prueba el proyecto

### Comandos

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm test` | Las 57 pruebas automáticas |
| `npm run build` | Build de producción (falla si algo está roto) |
| `npm start` | Sirve el build de producción |
| `npm run db:esquema` | Crea las tablas |
| `npm run db:datos` | Carga los trabajos de muestra |

### Qué cubre cada archivo de pruebas

| Archivo | Qué verifica |
|---|---|
| `test/base-datos.test.js` | Que el esquema y las consultas usen parámetros y la conexión sea única |
| `test/servicios.test.js` | Los seis servicios, sus identificadores y la página de servicios |
| `test/contacto.test.js` | Los enlaces de WhatsApp y llamada, y que los números salgan de `lib/contacto.js` |
| `test/estructura.test.js` | Encabezado, menú, pie, botón flotante y metadatos |
| `test/galeria.test.js` | El filtro por servicio y el visor de fotos |
| `test/consultas.test.js` | Validación, límite de envíos y respuestas de la API |
| `test/panel.test.js` | Sesión firmada, vencimiento, credenciales, límite de intentos, rutas protegidas y tabla |
| `test/menu.test.js` | Estado del botón, cierres del menú, bloqueo del scroll y origen de desarrollo |

### Variables de entorno necesarias

| Variable | Dónde se usa |
|---|---|
| `DATABASE_URL` | `lib/db.js` |
| `ADMIN_USUARIO` | `lib/acceso.js` y `lib/sesion.js` |
| `ADMIN_CLAVE_HASH` | `lib/acceso.js` (bcrypt) |
| `SESION_SECRETA` | `lib/acceso.js` (firma HMAC) |
| `ORIGENES_DESARROLLO` | `next.config.mjs` (solo para probar desde el celular) |

Ninguna lleva el prefijo `NEXT_PUBLIC_`: ese prefijo haría que la variable llegue al navegador.

---

## 13. Mapa de archivos: dónde está cada cosa

```text
app/
  layout.js                 estructura común: encabezado, menú, pie, botón flotante
  page.js                   inicio (portada, destacados, servicios)
  globals.css               todos los estilos y las variables de marca
  servicios/page.js         los seis servicios
  trabajos/page.js          galería
  nosotros/page.js          quién es Sergio
  contacto/page.js          WhatsApp, llamada y formulario
  admin/
    layout.js               noindex para todo el panel
    page.js                 ingreso
    consultas/page.js       listado protegido
  api/
    trabajos/route.js       GET trabajos
    consultas/route.js      POST consulta
    admin/ingresar/route.js POST ingreso
    admin/consultas/route.js GET y PATCH consultas (protegido)
    admin/salir/route.js    POST salir

components/
  MenuPrincipal.js          menú responsive con estado
  TarjetaTrabajo.js         tarjeta reutilizable de trabajo
  GaleriaTrabajos.js        filtro + visor
  FiltroServicios.js        botones de filtro
  VisorFoto.js              ventana de foto grande y accesible
  FormularioConsulta.js     formulario con validación
  FormularioIngreso.js      ingreso del panel
  TablaConsultas.js         tabla y marcar atendida
  BotonWhatsApp.js          enlace wa.me
  BotonLlamar.js            enlace tel:

lib/
  db.js                     única conexión a Neon
  trabajos.js               consultas de trabajos
  consultas.js              guardar y listar consultas
  validacion.js             reglas del formulario (cliente y servidor)
  limite.js                 límites de envíos e intentos
  contacto.js               números y enlaces de contacto
  servicios.js              catálogo de servicios
  acceso.js                 firma de sesión y verificación de clave
  sesion.js                 cookie de sesión
  fechas.js                 fechas en hora de Catamarca

db/
  esquema.sql               tablas
  datos.sql                 trabajos de muestra
  ejecutar-sql.js           ejecutor de los .sql

test/                       pruebas con node:test
docs/                       especificaciones del proyecto
```

---

## 14. Glosario para leer el código

| Término | Qué significa acá |
|---|---|
| **Componente de servidor** | Se ejecuta en el servidor; puede leer la base sin exponer credenciales |
| **Componente cliente** (`"use client"`) | Se ejecuta en el navegador; se usa cuando hay estado, clics o filtros |
| **Hidratación** | El proceso por el que React "despierta" el HTML y conecta los eventos |
| **API route** | Archivo en `app/api/...` que responde pedidos HTTP |
| **SQL parametrizado** | La consulta y los valores viajan separados (`$1`, `$2`), así no hay inyección |
| **Hash bcrypt** | Huella irreversible de la contraseña; se compara, no se descifra |
| **HMAC** | Firma con una clave secreta; si cambia un solo carácter, la firma no coincide |
| **Cookie `httpOnly`** | Cookie que el JavaScript de la página no puede leer |
| **`sameSite: strict`** | La cookie no se envía desde otros sitios |
| **Rate limit** | Límite de pedidos por conexión y por tiempo |
| **`revalidate`** | Cada cuánto se regenera una página estática |
| **`force-dynamic`** | La página se genera en cada pedido (necesario con cookies) |
| **`noindex`** | Le dice a Google que no muestre esa página |

---

## 15. Decisiones que explican el resto

| Decisión | Por qué |
|---|---|
| Sin Tailwind ni Bootstrap | Un solo archivo de estilos con variables de marca; menos dependencias |
| Sin TypeScript | El proyecto se definió en JavaScript; se compensa con pruebas |
| Sin Prisma ni ORM | SQL directo y parametrizado, más simple de leer y auditar |
| Trabajos en la base, servicios en código | Los servicios son un catálogo fijo; los trabajos cambian y tienen fotos |
| Sin panel para cargar trabajos | Fuera de alcance: Sergio los carga en la base |
| Sin precios publicados | Se consultan por WhatsApp o llamada |
| Sin cuentas de clientes ni pagos | No forman parte del objetivo del sitio |
| `/admin` fuera del menú y con `noindex` | Solo Sergio debe llegar ahí |
| Un usuario y una contraseña | No hace falta una tabla de usuarios para una sola persona |
| Pruebas con `node:test` | Viene con Node, sin instalar nada extra |

---

## 16. Resumen para contar el proyecto

Si hay que explicarlo en un minuto:

> Es un sitio en Next.js para un emprendimiento de decoración. Muestra los trabajos terminados que están cargados en PostgreSQL (Neon), permite filtrarlos por servicio y verlos en grande, presenta los seis servicios y lleva al cliente a consultar por WhatsApp, por llamada o con un formulario que guarda la consulta en la base. Tiene un panel privado, protegido con contraseña hasheada y una sesión firmada de 8 horas, donde Sergio ve las consultas y las marca como atendidas. Todo se construyó en ocho etapas, cada una con sus pruebas automáticas, y se publica en Vercel.

Y si preguntan por las decisiones técnicas:

> Se priorizó **poco y bien**: una sola conexión a la base, SQL parametrizado, validación en cliente y servidor, límites de envío e intentos, y una cookie `httpOnly` firmada con HMAC. Sin dependencias que no hicieran falta y con la marca aplicada desde variables CSS.
