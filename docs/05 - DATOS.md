# 05-DATOS: qué información guarda Sergio Decoraciones

La base de datos es PostgreSQL (Neon) y tiene cuatro tablas: `trabajos` (la galería), `trabajo_fotos` (las fotos de cada trabajo), `servicios_adicionales` (categorías creadas desde el panel) y `consultas` (lo que envía el formulario). Los seis servicios principales siguen definidos en `lib/servicios.js`; los adicionales se guardan en la base y se muestran como filtros en Trabajos y como fichas descriptivas en `/servicios`. No guarda precios ni datos de pago. El usuario y la contraseña de Sergio para el panel no están en la base: van en variables de entorno (ver 03-TECNOLOGIAS.md y 10-SEGURIDAD.md).

## Tabla `trabajos`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` (clave primaria) | Número único del trabajo |
| `titulo` | `VARCHAR(120)`, obligatorio | Nombre corto del trabajo |
| `servicio` | `VARCHAR(20)`, obligatorio | Tipo de servicio (ver tabla de valores) |
| `descripcion` | `TEXT` | Detalle del trabajo realizado |
| `visible` | `BOOLEAN`, por defecto `TRUE` | Si se muestra o no en el sitio |

### Valores de `servicio`

| Valor | Servicio |
|---|---|
| `interiores` | Trabajos de interiores (empapelado y alfombra) |
| `durlock` | Durlock, interior y exterior |
| `pintura` | Pintura en general, interior y exterior |
| `enduido` | Enduido, interior y exterior |
| `machimbre` | Colocación de machimbre |
| `molduras` | Colocación de molduras |
| `extra-<id>` | Servicio adicional guardado en `servicios_adicionales`; `<id>` es el identificador generado por la base |

`servicio` conserva hasta 20 caracteres. Los identificadores adicionales tienen el prefijo `extra-` y un número generado; el nombre visible se obtiene de `servicios_adicionales`.

## Tabla `servicios_adicionales`

Guarda servicios que Sergio crea desde la sección Servicios del panel. Se reutilizan como categorías seleccionables en el formulario de trabajos, en los filtros/etiquetas de la galería y como fichas de `/servicios`. Crear un servicio no crea un trabajo y borrar un trabajo no elimina su servicio. Los servicios ocultos no aparecen en `/servicios`, pero permanecen en el panel y disponibles como categoría. No se puede borrar un servicio que esté asignado a algún trabajo.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` (clave primaria) | Número único del servicio adicional |
| `nombre` | `VARCHAR(80)`, obligatorio | Nombre visible, único sin distinguir mayúsculas y minúsculas |
| `detalle` | `VARCHAR(120)`, opcional para filas creadas antes de esta etapa | Texto breve que acompaña el nombre en `/servicios` |
| `descripcion` | `TEXT`, opcional para filas creadas antes de esta etapa | Descripción del servicio en `/servicios` |
| `visible` | `BOOLEAN`, obligatorio, por defecto `TRUE` | Si se muestra como ficha en `/servicios`; el panel incluye también los ocultos |

## Tabla `trabajo_fotos`

Cada trabajo puede tener **varias fotos**. La imagen se guarda en la base, no en una carpeta del código.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` (clave primaria) | Número único de la foto |
| `trabajo_id` | `INTEGER`, obligatorio | Trabajo al que pertenece; si se borra el trabajo, se borran sus fotos |
| `datos` | `BYTEA`, obligatorio | La imagen comprimida (JPG, PNG o WebP) |
| `tipo` | `VARCHAR(50)`, obligatorio | Tipo de archivo (`image/jpeg`, `image/png` o `image/webp`) |
| `ancho` | `INTEGER`, obligatorio | Ancho en píxeles, para reservar el espacio y evitar saltos |
| `alto` | `INTEGER`, obligatorio | Alto en píxeles |
| `texto_alt` | `VARCHAR(200)`, obligatorio | Descripción de la foto para accesibilidad y SEO |
| `orden` | `INTEGER`, por defecto `1` | Orden en que se muestran las fotos del trabajo |

La primera foto (el `orden` más bajo) es la que aparece en la tarjeta de la galería. Las demás se ven al abrir el trabajo en grande.

## Tabla `consultas`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` (clave primaria) | Número único de la consulta |
| `nombre` | `VARCHAR(80)`, obligatorio | Nombre de quien consulta |
| `telefono` | `VARCHAR(30)`, obligatorio | Teléfono para responder |
| `mensaje` | `TEXT`, obligatorio | Qué trabajo necesita |
| `creada_en` | `TIMESTAMP`, por defecto la hora actual | Cuándo se envió |
| `atendida` | `BOOLEAN`, por defecto `FALSE` | Si Sergio ya respondió la consulta |
| `archivada` | `BOOLEAN`, por defecto `FALSE` | Si Sergio la guardó fuera de la lista principal. No se borra: se puede restaurar |

## Esquema SQL

```sql
-- db/esquema.sql
CREATE TABLE IF NOT EXISTS trabajos (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(120) NOT NULL,
  servicio    VARCHAR(20)  NOT NULL,
  descripcion TEXT,
  visible     BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS trabajo_fotos (
  id         SERIAL PRIMARY KEY,
  trabajo_id INTEGER NOT NULL REFERENCES trabajos (id) ON DELETE CASCADE,
  datos      BYTEA   NOT NULL,
  tipo       VARCHAR(50) NOT NULL,
  ancho      INTEGER NOT NULL,
  alto       INTEGER NOT NULL,
  texto_alt  VARCHAR(200) NOT NULL,
  orden      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS servicios_adicionales (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(80) NOT NULL,
  detalle     VARCHAR(120),
  descripcion TEXT,
  visible     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS servicios_adicionales_nombre_idx
  ON servicios_adicionales (LOWER(nombre));

ALTER TABLE servicios_adicionales
  ADD COLUMN IF NOT EXISTS detalle VARCHAR(120);
ALTER TABLE servicios_adicionales
  ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE servicios_adicionales
  ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS consultas (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(80) NOT NULL,
  telefono  VARCHAR(30) NOT NULL,
  mensaje   TEXT NOT NULL,
  creada_en TIMESTAMP DEFAULT NOW(),
  atendida  BOOLEAN DEFAULT FALSE,
  archivada BOOLEAN DEFAULT FALSE
);
```

`db/esquema.sql` también trae las sentencias `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para actualizar una base que ya existía (por ejemplo, la que tenía la columna `foto` con la ruta de la imagen) sin perder datos.

## Datos de muestra

Los trabajos de muestra se cargan con `db/datos.sql` (título, servicio, descripción y visibilidad). Las fotos **no** se cargan con ese archivo: se importan a la base con `npm run db:fotos`, que lee los originales de `multimedia/trabajos/` y los guarda en `trabajo_fotos`. Después de la importación, `public/img/trabajos/` queda vacío: el sitio pide las fotos a `/api/trabajos/[id]/foto`.

Ejemplo de un trabajo (datos de muestra):

```sql
INSERT INTO trabajos (titulo, servicio, descripcion, visible)
VALUES (
  'Living con alfombrado y empapelado',
  'interiores',
  'Alfombrado y empapelado de una pared del living.',
  TRUE
);
```

Ejemplo de una foto (la carga el script de importación):

| trabajo | tipo | ancho | alto | texto_alt | orden |
|---|---|---|---|---|---|
| Living con alfombrado y empapelado | `image/jpeg` | 1376 | 768 | Living con alfombra y una pared empapelada | 1 |

Ejemplo de una consulta (datos de muestra):

| nombre | telefono | mensaje | atendida | archivada |
|---|---|---|---|---|
| María Pérez | +54 9 3837 000000 | Quiero consultar por pintura de un dormitorio | no | no |
