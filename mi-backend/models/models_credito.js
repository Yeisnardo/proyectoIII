// models/credito.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Credito = sequelize.define('credito', {
    n_contrato: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'contrato', // Ensure this model is defined elsewhere
            key: 'cedula_contrato',
        },
    },
    euro: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    bolivares: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    cincoflax: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    diezinteres: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    interes_semanal: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    semanal_sin_interes: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    couta: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    desde: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    hasta: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
}, {
    tableName: 'credito', // Ensure this matches your existing table name
    timestamps: false, // If your table does not have createdAt or updatedAt columns
});

module.exports = Credito;