// models/persona.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Persona = sequelize.define('personas', {
    cedula: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    municipio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    parroquia: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'personas', // Asegúrate de que el nombre coincida con el de tu tabla existente
    timestamps: false, // Si tu tabla no tiene columnas createdAt o updatedAt
});

module.exports = Persona;