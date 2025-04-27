const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contrato = sequelize.define('contrato', {
    cedula_contrato: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'requerimientos_e', // Ensure this model is defined elsewhere
            key: 'cedula_requerimientos_e',
        },
    },
    contrato: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    fecha_apertura: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    estatus: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
}, {
    tableName: 'contrato',
    timestamps: false,
});

module.exports = Contrato;