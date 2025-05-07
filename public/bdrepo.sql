-- Tabla de personas
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

-- Tabla de usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cedula_usuario VARCHAR(20) NOT NULL,
    usuario VARCHAR(20) NOT NULL,
    contrasena VARCHAR(50) NOT NULL, 
    estatus VARCHAR(15) NOT NULL,
    FOREIGN KEY (cedula_usuario) REFERENCES personas(cedula)
);

-- Requerimientos
CREATE TABLE requerimientos_e (
    cedula_requerimientos_e VARCHAR(20) NOT NULL PRIMARY KEY,
    solicitud_credito VARCHAR(2) NOT NULL,
    postulacion_ubch VARCHAR(2) NOT NULL,
    inspeccion_emprendimiento VARCHAR(2) NOT NULL,
    carta_residencia VARCHAR(2) NOT NULL, 
    copia_cedula VARCHAR(2) NOT NULL,    
    rif_personal VARCHAR(2) NOT NULL,
    foto_e VARCHAR(2) NOT NULL,
    rif_e VARCHAR(2) NOT NULL,
    certificado_ej VARCHAR(2),
    referencia_bancaria VARCHAR(2) NOT NULL,
    FOREIGN KEY (cedula_requerimientos_e) REFERENCES personas(cedula)
);

-- Datos financieros
CREATE TABLE datos_financieros (
    cedula_datos_financieros VARCHAR(20) NOT NULL PRIMARY KEY,
    cuenta_bancaria VARCHAR(20) NOT NULL,
    banco_seleccionado VARCHAR(200),
    metodo_pago VARCHAR(100),
    emprendimiento_credito VARCHAR(15),
    numero_clientes_semanal VARCHAR(15),
    declara_iva VARCHAR(15),
    declara_islr VARCHAR(15),
    compra_contrato_o_credito VARCHAR(15),
    mes_ventas VARCHAR(15),
    exiges_ventas VARCHAR(15),
    FOREIGN KEY (cedula_datos_financieros) REFERENCES requerimientos_e(cedula_requerimientos_e)
);

-- Ubicación actividad
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

-- Datos cadena productiva
CREATE TABLE datos_cadena_p (
    cedula_datos_cadena_p VARCHAR(20) NOT NULL PRIMARY KEY,
    actividad_e VARCHAR(100),
    division_actividad_e VARCHAR(100),
    grupo_e VARCHAR(100),
    clase_actividad_e VARCHAR(100),
    forma_vender_p VARCHAR(15),
    procedencia_materiales VARCHAR(15),
    FOREIGN KEY (cedula_datos_cadena_p) REFERENCES ubicacion_actividad_e(cedula_ubicacion_actividad_e)
);

-- Datos situación operativa
CREATE TABLE datos_situacion_operativa (
    cedula_datos_situacion_operativa VARCHAR(20) NOT NULL PRIMARY KEY,
    operativo_e VARCHAR(20),
    n_trabajadores VARCHAR(20),
    tiempo_operacional_e VARCHAR(50),
    muestra_producto_f VARCHAR(15),
    FOREIGN KEY (cedula_datos_situacion_operativa) REFERENCES datos_cadena_p(cedula_datos_cadena_p)
);

-- Feria
CREATE TABLE feria (  
    id VARCHAR(20) NOT NULL PRIMARY KEY,
    nombre_f VARCHAR(20),
    fecha_r DATE
);

-- Asistencia feria
CREATE TABLE asistencia_feria (
    cedula_asistencia_feria VARCHAR(20) PRIMARY KEY,
    codigo_f VARCHAR(20),
    descripcion TEXT,
    FOREIGN KEY (cedula_asistencia_feria) REFERENCES feria(id),
    FOREIGN KEY (codigo_f) REFERENCES personas(cedula)
);

-- Aprobacion
CREATE TABLE aprobacion (
    cedula_emprendedor VARCHAR(20) NOT NULL PRIMARY KEY,
    condicion VARCHAR(20),
    FOREIGN KEY (cedula_emprendedor) REFERENCES requerimientos_e(cedula_requerimientos_e)
);

-- Contrato
CREATE TABLE contrato (
    contrato VARCHAR(20) NOT NULL PRIMARY KEY,
    cedula_contrato VARCHAR(20) NOT NULL,
    fecha_apertura VARCHAR(20),
    estatus VARCHAR(20),
    FOREIGN KEY (cedula_contrato) REFERENCES aprobacion(cedula_emprendedor)
);

-- Crédito
CREATE TABLE credito (
    id VARCHAR PRIMARY KEY,
    n_contrato VARCHAR(20),
    metodo_pago VARCHAR(20),
    euro VARCHAR(20),
    bolivares VARCHAR(20),
    cincoflax VARCHAR(20),
    diezinteres VARCHAR(20),
    interes_semanal VARCHAR(20),
    semanal_sin_interes VARCHAR(20),
    couta VARCHAR(20),
    desde VARCHAR(20),
    hasta VARCHAR(20),
    estado VARCHAR(20),
    FOREIGN KEY (n_contrato) REFERENCES contrato(contrato)
);

-- Pago
CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    contrato_e VARCHAR(20) NOT NULL,
    referencia VARCHAR(20),
    fecha VARCHAR(20),
    monto VARCHAR(20),
    dueda VARCHAR(20),
    estatus VARCHAR(20),
    FOREIGN KEY (contrato_e) REFERENCES credito(id)
);

-- Cuentas bancarias
CREATE TABLE cuenta_bancaria (
    cedula_emprendedor VARCHAR(20) NOT NULL PRIMARY KEY,
    Banco VARCHAR (20),
    numero_cuenta VARCHAR(20),
    FOREIGN KEY (cedula_emprendedor) REFERENCES personas(cedula)
);