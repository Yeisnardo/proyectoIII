const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DatosCadenaP = sequelize.define('datos_cadena_p', {
    cedula_datos_cadena_p: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'ubicacion_actividad_e', // Name of the referenced model
            key: 'cedula_ubicacion_actividad_e', // Key in the referenced model
        },
    },
    actividad_e: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null
    },
    division_actividad_e: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null
    },
    clase_actividad_e: {
        type: DataTypes.STRING(15),
        allowNull: true, // Assuming this can be null
    },
}, {
    tableName: 'datos_cadena_p',
    timestamps: false,
});

module.exports = DatosCadenaP;