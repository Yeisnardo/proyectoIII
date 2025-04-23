const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DatossituacionOperativa = sequelize.define('datos_situacion_operativa', {
    cedula_datos_situacion_operativa: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'datos_cadena_p', // Ensure this model is defined elsewhere
            key: 'cedula_datos_cadena_p',
        },
    },
    operativo_e: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    n_trabajadores: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    tiempo_opercional_e: {
        type: DataTypes.STRING(15),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    muestra_producto_f: {
        type: DataTypes.STRING(15),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
}, {
    tableName: 'datos_situacion_operativa',
    timestamps: false,
});

module.exports = DatossituacionOperativa;