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
- Para marcar una consulta como atendida, el `id` se valida como número y se usa como parámetro SQL.
- El botón "Salir" borra la cookie de sesión.
- Si hay que cambiar la contraseña, se genera un hash nuevo y se actualiza `ADMIN_CLAVE_HASH`.

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

## Otras reglas

- React ya escapa el texto que se muestra; nunca se usa `dangerouslySetInnerHTML`.
- El sitio se publica solo con HTTPS (Vercel).
- Antes de publicar se revisan las dependencias con `npm audit`.
- El formulario avisa para qué se usan el nombre y el teléfono: solo para responder la consulta.

## Lista de control

- [ ] `.env.local` está en `.gitignore`
- [ ] No hay ninguna variable con `NEXT_PUBLIC_` que contenga datos secretos
- [ ] Todas las consultas SQL usan parámetros
- [ ] La API valida nombre, teléfono y mensaje
- [ ] El formulario muestra el aviso sobre el uso de los datos
- [ ] Ningún error interno se muestra en pantalla
- [ ] `npm audit` sin problemas graves
- [ ] Sin sesión iniciada, `/admin/consultas` y `/api/admin/consultas` no devuelven datos
- [ ] La contraseña de Sergio se guarda solo como hash y los intentos de ingreso están limitados
- [ ] La cookie de sesión es `httpOnly`, `secure` y `sameSite: strict`