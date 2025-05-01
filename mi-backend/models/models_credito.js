const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Credito = sequelize.define('credito', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    n_contrato: {
        type: DataTypes.STRING(20),
        allowNull: true, // Set to true if the database allows nulls; adjust as needed
        references: {
            model: 'contrato', // Ensure this model is defined elsewhere
            key: 'contrato',   // Adjust key if different
        },
    },
    metodo_pago: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    euro: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    bolivares: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    cincoflax: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    diezinteres: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    interes_semanal: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    semanal_sin_interes: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    couta: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    desde: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    hasta: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    tableName: 'credito', // Match your existing table name
    timestamps: false, // Adjust if your table has timestamp columns
});

module.exports = Credito;