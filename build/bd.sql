CREATE TABLE personas (
  cedula VARCHAR(20) NOT NULL PRIMARY KEY,
  nombres VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  estado VARCHAR(10),
  municipio VARCHAR(50), 
  parroquia VARCHAR(15),
  direccion VARCHAR(100),  
  telefono1 VARCHAR(15),
  telefono2 VARCHAR(15),
  tipo VARCHAR(50)
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cedula_usuario VARCHAR(20) NOT NULL,
    usuario VARCHAR(20) NOT NULL,
    contrasena VARCHAR(50) NOT NULL, 
    estatus VARCHAR(15) NOT NULL,
    FOREIGN KEY (cedula_usuario) REFERENCES personas(cedula)
);

CREATE TABLE requerimientos_e (
    
    cedula_requerimientos_e VARCHAR(20) NOT NULL PRIMARY KEY,
    solicitud_credito VARCHAR(1) NOT NULL,
    postulacion_ubch VARCHAR(1) NOT NULL,
    inspeccion_emprendimiento VARCHAR(1) NOT NULL,
    carta_residencia VARCHAR(1) NOT NULL,  
    copia_cedula VARCHAR(1) NOT NULL,    
    RIF_Personal VARCHAR(1) NOT NULL,
    foto_e VARCHAR(1) NOT NULL,
    RIF_e VARCHAR(1) NOT NULL,
    referencia_bancaria VARCHAR(1) NOT NULL,
    FOREIGN KEY (cedula_requerimientos_e) REFERENCES personas(cedula)
);

CREATE TABLE datos_financieros (
   
    cedula_datos_financieros VARCHAR(20) NOT NULL PRIMARY KEY,
    cuenta_bancaria VARCHAR(20) NOT NULL,
    banco_seleccionado VARCHAR(20),
    metodo_pago VARCHAR(15),
    emprendimiento_credito VARCHAR(15),
    numero_clientes_semanal VARCHAR(15),
    declara_iva VARCHAR(15),
    declara_islr VARCHAR(15),
    compra_contrato_o_credito VARCHAR(15),
    mes_ventas VARCHAR(15),
    exiges_ventas VARCHAR(15),
    FOREIGN KEY (cedula_datos_financieros) REFERENCES requerimientos_e(cedula_requerimientos_e)
);

CREATE TABLE ubicacion_actividad_e (
    cedula_ubicacion_actividad_e VARCHAR(20) NOT NULL PRIMARY KEY,
    donde_actividad_e VARCHAR(20),
    espacio VARCHAR(20),
    estado VARCHAR(15),
    municipio VARCHAR(15),
    parroquia VARCHAR(15),
    ubicacion VARCHAR(15),
    FOREIGN KEY (cedula_ubicacion_actividad_e) REFERENCES datos_financieros(cedula_datos_financieros)
);

CREATE TABLE datos_cadena_p (
    
    cedula_datos_cadena_p VARCHAR(20) NOT NULL PRIMARY KEY,
    actividad_e VARCHAR(20),
    division_actividad_e VARCHAR(20),
    grupo_e VARCHAR(15),
    clase_actividad_e VARCHAR(15),
    forma_vender_p VARCHAR(15),
    procedencia_materiales VARCHAR(15),
    FOREIGN KEY (cedula_datos_cadena_p) REFERENCES ubicacion_actividad_e(cedula_ubicacion_actividad_e)
);

CREATE TABLE datos_situacion_operativa (
    cedula_datos_situacion_operativa VARCHAR(20) NOT NULL PRIMARY KEY,
    operativo_e VARCHAR(20),
    n_trabajadores VARCHAR(20),
    tiempo_opercional_e VARCHAR(15),
    muestra_producto_f VARCHAR(15),
    FOREIGN KEY (cedula_datos_situacion_operativa) REFERENCES datos_cadena_p(cedula_datos_cadena_p)
);

CREATE TABLE feria (  
    codigo_i VARCHAR(20) NOT NULL PRIMARY KEY,
    nombre_f VARCHAR(20),
    fecha_r DATE
);

CREATE TABLE asistencia_feria (
    cedula_datos_situacion_operativa VARCHAR(20) NOT NULL  PRIMARY KEY,
    codigo_asistencia_feria VARCHAR(20),
    descripcion TEXT,
    FOREIGN KEY (cedula_datos_situacion_operativa) REFERENCES datos_situacion_operativa(cedula_datos_situacion_operativa),
    FOREIGN KEY (codigo_asistencia_feria) REFERENCES feria(codigo_i)
);