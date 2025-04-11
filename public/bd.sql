CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(20) NOT NULL,
  nombres VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  estado VARCHAR(10),
  municipio VARCHAR(50),  -- Cambiado a VARCHAR
  parroquia VARCHAR(15),
  direccion VARCHAR(100),  -- Corregido el error tipográfico
  telefono1 VARCHAR(15),
  telefono2 VARCHAR(15),
  tipo VARCHAR(50)
);