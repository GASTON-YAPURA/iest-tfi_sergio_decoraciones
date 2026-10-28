-- Tablas de Sergio Decoraciones.
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
