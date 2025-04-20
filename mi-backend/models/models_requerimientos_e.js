const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequerimientosE = sequelize.define('requerimientos_e', {
    cedula_requerimientos_e: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'personas',
            key: 'cedula',
        },
    },
    solicitud_credito: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postulacion_ubch: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    inspeccion_emprendimiento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    carta_residencia: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    copia_cedula: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rif_personal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foto_e: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rif_e: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    referencia_bancaria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'requerimientos_e',
    timestamps: false,
});

module.exports = RequerimientosE;