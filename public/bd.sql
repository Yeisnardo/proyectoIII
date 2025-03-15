CREATE TABLE personas (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(20) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  sexo CHAR(1),
  f_nacimiento DATE,
  telefono VARCHAR(15),
  correo VARCHAR(100),
  tipo VARCHAR(20)
);