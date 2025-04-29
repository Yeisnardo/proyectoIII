const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequerimientosE = sequelize.define('requerimientos_e', {
    cedula_requerimientos_e: {
        type: DataTypes.STRING(20), // Asegúrate de que la longitud coincida con la tabla
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'personas',
            key: 'cedula',
        },
    },
    solicitud_credito: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    postulacion_ubch: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    inspeccion_emprendimiento: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    carta_residencia: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    copia_cedula: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    rif_personal: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    foto_e: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    rif_e: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
    certificado_ej: {
        type: DataTypes.STRING(2), // Agregado para coincidir con la tabla
        allowNull: true, // Puede ser nulo si no es obligatorio
    },
    referencia_bancaria: {
        type: DataTypes.STRING(2), // Cambiado para coincidir con la tabla
        allowNull: false,
    },
}, {
    tableName: 'requerimientos_e',
    timestamps: false,
});

module.exports = RequerimientosE;