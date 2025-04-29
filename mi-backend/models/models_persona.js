const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Persona = sequelize.define('persona', {
    cedula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
    },
    nombres: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(10),
    },
    municipio: {
        type: DataTypes.STRING(50),
    },
    parroquia: {
        type: DataTypes.STRING(15),
    },
    direccion: {
        type: DataTypes.STRING(100),
    },
    telefono1: {
        type: DataTypes.STRING(15),
    },
    telefono2: {
        type: DataTypes.STRING(15),
    },
    tipo: {
        type: DataTypes.STRING(50),
    },
}, {
    tableName: 'personas', // Asegúrate de que coincida con el nombre de tu tabla
    timestamps: false,
});

module.exports = Persona;