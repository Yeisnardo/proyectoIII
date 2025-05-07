// models/cuenta_bancaria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const banco = sequelize.define('banco', {
    cedula_emprendedor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'personas', // Asegúrate que la tabla 'personas' exista
            key: 'cedula',
        },
    },
    banco: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    numero_cuenta: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    tableName: 'cuenta_bancaria',
    timestamps: false,
});

module.exports = banco;