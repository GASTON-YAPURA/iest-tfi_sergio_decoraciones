# 10-SEGURIDAD: cómo protegemos los datos y el sistema

El sitio de Sergio Decoraciones no tiene cuentas de clientes ni pagos, así que no guarda datos de tarjetas. Lo que sí guarda son las consultas del formulario (nombre, teléfono y mensaje), que son datos personales y se tratan con cuidado. Solo hay un acceso privado, el de Sergio al panel de consultas, y su contraseña nunca se guarda en texto: solo cifrada.

## Datos sensibles

| Dato | Dónde está | Cómo se protege |
|---|---|---|
| `DATABASE_URL` (conexión a la base) | `.env.local` y variables de entorno de Vercel | Nunca se sube a GitHub y nunca lleva el prefijo `NEXT_PUBLIC_` |
| Nombre, teléfono y mensaje de quien consulta | Tabla `consultas` | Solo se escriben desde el servidor y nunca se muestran en el sitio |
| Número de WhatsApp y teléfono de Sergio | `lib/contacto.js` | Es información pública, no es un secreto |
| Usuario y contraseña de Sergio para el panel | `ADMIN_USUARIO` y `ADMIN_CLAVE_HASH` en `.env.local` y en Vercel | La contraseña se guarda solo como hash (bcrypt), nunca en texto ni en el código |

## Variables de entorno

- `DATABASE_URL`, `ADMIN_USUARIO`, `ADMIN_CLAVE_HASH` y `SESION_SECRETA` viven solo en `.env.local` y en la configuración de Vercel.
- `.env.local` está en `.gitignore`.
- En `.env.local`, los `$` del hash bcrypt se escriben escapados (`\$`) porque Next expande las variables al leer el archivo; en Vercel el valor se carga tal cual, con sus `$`.
- Si la dirección de la base llegara a mostrarse por error, se cambia la contraseña en Neon y se actualiza la variable.

```text
# .gitignore
.env.local
.env*.local
node_modules/
```

## Validaciones en la API

El navegador se puede manipular, por eso toda validación se repite en `app/api/consultas/route.js`:

- Nombre: obligatorio, hasta 80 caracteres.
- Teléfono: obligatorio, hasta 30 caracteres, solo números, espacios y los símbolos `+ - ( )`.
- Mensaje: obligatorio, con un máximo de 1000 caracteres.
- Se quitan los espacios sobrantes antes de guardar.
- Se limita la cantidad de consultas por minuto desde la misma conexión para evitar el envío masivo.
- Si algo es inválido, la API responde con un error claro y no guarda nada.

## Panel de administración

El panel permite a Sergio ver las consultas desde un enlace (`/admin`). Como esas consultas tienen datos personales, el enlace solo muestra un ingreso y sin contraseña no devuelve nada:

- Hay un único usuario: Sergio. Su usuario y la contraseña cifrada (hash bcrypt) están en variables de entorno.
- La contraseña nunca se escribe en el código, en GitHub ni en los mensajes de error.
- Al ingresar se crea una sesión en una cookie `httpOnly`, `secure` y `sameSite: strict`, firmada con `SESION_SECRETA`, que vence a las 8 horas.
- Se permiten como máximo 5 intentos fallidos cada 15 minutos desde la misma conexión.
- El error de ingreso es siempre el mismo ("Usuario o contraseña incorrectos"), sin decir cuál de los dos falló.
- Cada página y cada ruta de `admin/` verifica la sesión en el servidor antes de mostrar o devolver datos.
- La lista y el alta de servicios adicionales se protegen con sesión en `/api/admin/servicios`, desde la sección privada `/admin/servicios`. El nombre, el detalle y la descripción se validan en el servidor; se limitan a 80, 120 y 600 caracteres respectivamente, y se impiden nombres duplicados sin distinguir mayúsculas y minúsculas.
- El menú público consulta una ruta que solo informa si la sesión es válida; no devuelve el usuario ni datos del panel. Sin sesión, el enlace «Panel admin» no se muestra.
- Para marcar una consulta como atendida, el `id` se valida como número y se usa como parámetro SQL.
- El botón "Salir" borra la cookie de sesión.
- Si hay que cambiar la contraseña, se ejecuta `cambiar-clave.bat` (o `node scripts/cambiar-clave.mjs`): pide la clave nueva sin mostrarla, actualiza `ADMIN_CLAVE_HASH` en `.env.local` y al final muestra el mismo hash sin escapar para pegarlo en Vercel.

```js
// lib/sesion.js (idea)
export async function exigirSesion() {
  const sesion = await leerSesion();
  if (!sesion) redirect("/admin");
  return sesion;
}
```

## Base de datos

Los valores viajan como parámetros y nunca se pegan dentro del texto SQL:

```js
// MAL: pega el texto del usuario en el SQL
"...WHERE servicio = '" + servicio + "'"

// BIEN: el valor viaja como parámetro
sql`...WHERE servicio = ${servicio}`
```

Reglas:

- La base solo se usa desde `lib/db.js`.
- La ruta pública `/api/consultas` solo escribe; las consultas solo las devuelve `/api/admin/consultas`, que exige sesión.
- Los errores de la base no se muestran al visitante; se muestra un mensaje general.

## Qué nunca debe llegar al navegador

| Nunca llega al navegador | Motivo |
|---|---|
| `DATABASE_URL`, `ADMIN_CLAVE_HASH`, `SESION_SECRETA` y cualquier dato de `.env.local` | Permitirían entrar a la base de datos o al panel |
| Las consultas guardadas | Son datos personales de otras personas; solo las ve Sergio con la sesión iniciada |
| Mensajes de error con detalles internos | Ayudan a quien quiera atacar el sistema |

## Fotos de trabajos

Las fotos se guardan en la base y se suben solo desde el panel con sesión iniciada.

- El formulario acepta únicamente imágenes JPG, PNG o WebP.
- Antes de subir, el navegador achica y comprime la foto (máximo 1600 px por lado y 1,5 MB) con un canvas, bajando la calidad si hace falta, para que la base no crezca de más.
- El servidor vuelve a comprobar el tipo real del archivo (no solo la extensión), el peso máximo y las medidas, y rechaza cualquier otro archivo.
- El texto alternativo es obligatorio y tiene un máximo de 200 caracteres.
- Cada trabajo admite hasta 12 fotos y siempre conserva al menos una; el servidor lo comprueba antes de aceptar la subida o el borrado.
- Las fotos se entregan con `Content-Type` correcto y caché; nunca se muestra el contenido binario en la página.
- Para borrar un trabajo o una foto se exige sesión y confirmación en el panel.
- `public/img/trabajos/` ya no se usa: las fotos no forman parte del código ni del repositorio público.

## Exportación de consultas

- El PDF solo se genera con sesión iniciada y con los mismos filtros que la persona ve en pantalla.
- Se descarga con `Content-Disposition: attachment`; el texto se limpia y se escribe con una fuente estándar, sin contenido externo.
- El archivo no queda guardado en el servidor: se arma en el momento y se envía.

## Otras reglas

- React ya escapa el texto que se muestra; nunca se usa `dangerouslySetInnerHTML`.
- El sitio se publica solo con HTTPS (Vercel).
- Antes de publicar se revisan las dependencias con `npm audit`.
- El formulario avisa para qué se usan el nombre y el teléfono: solo para responder la consulta.

## Lista de control

- [x] `.env.local` está en `.gitignore`
- [x] No hay ninguna variable con `NEXT_PUBLIC_` que contenga datos secretos
- [x] Todas las consultas SQL usan parámetros
- [x] La API valida nombre, teléfono y mensaje
- [x] El formulario muestra el aviso sobre el uso de los datos
- [x] Ningún error interno se muestra en pantalla
- [x] `npm audit` sin problemas graves
- [x] Sin sesión iniciada, `/admin/consultas` y `/api/admin/consultas` no devuelven datos
- [x] La contraseña de Sergio se guarda solo como hash y los intentos de ingreso están limitados
- [x] La cookie de sesión es `httpOnly`, `secure` y `sameSite: strict`