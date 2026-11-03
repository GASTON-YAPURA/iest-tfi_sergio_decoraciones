-- Tablas de Sergio Decoraciones.
CREATE TABLE IF NOT EXISTS trabajos (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(120) NOT NULL,
  servicio    VARCHAR(20)  NOT NULL,
  descripcion TEXT,
  visible     BOOLEAN DEFAULT TRUE
);

-- Las fotos viven en la base, no en una carpeta del codigo.
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

CREATE INDEX IF NOT EXISTS trabajo_fotos_trabajo_idx
  ON trabajo_fotos (trabajo_id, orden);

CREATE TABLE IF NOT EXISTS servicios_adicionales (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS servicios_adicionales_nombre_idx
  ON servicios_adicionales (LOWER(nombre));

CREATE TABLE IF NOT EXISTS consultas (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(80) NOT NULL,
  telefono  VARCHAR(30) NOT NULL,
  mensaje   TEXT NOT NULL,
  creada_en TIMESTAMP DEFAULT NOW(),
  atendida  BOOLEAN DEFAULT FALSE,
  archivada BOOLEAN DEFAULT FALSE
);

-- Actualizaciones para bases creadas antes de la Etapa 9.
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS archivada BOOLEAN DEFAULT FALSE;

-- La foto y el texto alternativo pasaron a trabajo_fotos.
ALTER TABLE trabajos DROP COLUMN IF EXISTS foto;
ALTER TABLE trabajos DROP COLUMN IF EXISTS texto_alt;
