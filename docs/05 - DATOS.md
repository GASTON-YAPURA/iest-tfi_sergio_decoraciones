# 05-DATOS: qué información guarda Sergio Decoraciones

La base de datos es PostgreSQL (Neon) y tiene dos tablas: `trabajos` (la galería) y `consultas` (lo que envía el formulario). No guarda precios ni datos de pago. El usuario y la contraseña de Sergio para el panel no están en la base: van en variables de entorno (ver 03-TECNOLOGIAS.md y 10-SEGURIDAD.md).

## Tabla `trabajos`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` (clave primaria) | Número único del trabajo |
| `titulo` | `VARCHAR(120)`, obligatorio | Nombre corto del trabajo |
| `servicio` | `VARCHAR(20)`, obligatorio | Tipo de servicio (ver tabla de valores) |
| `descripcion` | `TEXT` | Detalle del trabajo realizado |
| `foto` | `VARCHAR(200)`, obligatorio | Ruta de la imagen dentro de `public/img/trabajos/` |
| `texto_alt` | `VARCHAR(200)`, obligatorio | Descripción de la foto para accesibilidad y SEO |
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

## Tabla `consultas`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` (clave primaria) | Número único de la consulta |
| `nombre` | `VARCHAR(80)`, obligatorio | Nombre de quien consulta |
| `telefono` | `VARCHAR(30)`, obligatorio | Teléfono para responder |
| `mensaje` | `TEXT`, obligatorio | Qué trabajo necesita |
| `creada_en` | `TIMESTAMP`, por defecto la hora actual | Cuándo se envió |
| `atendida` | `BOOLEAN`, por defecto `FALSE` | Si Sergio ya respondió la consulta |

## Esquema SQL

```sql
-- db/esquema.sql
CREATE TABLE IF NOT EXISTS trabajos (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(120) NOT NULL,
  servicio    VARCHAR(20)  NOT NULL,
  descripcion TEXT,
  foto        VARCHAR(200) NOT NULL,
  texto_alt   VARCHAR(200) NOT NULL,
  visible     BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS consultas (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(80) NOT NULL,
  telefono  VARCHAR(30) NOT NULL,
  mensaje   TEXT NOT NULL,
  creada_en TIMESTAMP DEFAULT NOW(),
  atendida  BOOLEAN DEFAULT FALSE
);
```

## Datos de muestra

Los trabajos de muestra se cargan con `db/datos.sql` y usan las fotos de `public/img/trabajos/`. Los datos de abajo son un ejemplo del contenido.

Ejemplo de un trabajo (datos de muestra):

```sql
INSERT INTO trabajos (titulo, servicio, descripcion, foto, texto_alt)
VALUES (
  'Living con empapelado',
  'interiores',
  'Empapelado de una pared del living.',
  '/img/trabajos/living-empapelado.jpg',
  'Living con una pared empapelada y molduras blancas'
);
```

Ejemplo de una consulta (datos de muestra):

| nombre | telefono | mensaje | atendida |
|---|---|---|---|
| María Pérez | +54 9 3837 000000 | Quiero consultar por pintura de un dormitorio | no |
