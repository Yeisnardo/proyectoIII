// models/persona.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta sea correcta

const Persona = sequelize.define('persona', { // Cambié 'personas' a 'persona' para seguir la convención singular
    cedula: {
        type: DataTypes.STRING(20), // Especificar la longitud para coincidir con la definición SQL
        primaryKey: true,
        allowNull: false,
    },
    nombres: {
        type: DataTypes.STRING(50), // Especificar la longitud para coincidir con la definición SQL
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING(50), // Especificar la longitud para coincidir con la definición SQL
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(10), // Especificar la longitud para coincidir con la definición SQL
        allowNull: true,
    },
    municipio: {
        type: DataTypes.STRING(50), // Especificar la longitud para coincidir con la definición SQL
        allowNull: true,
    },
    parroquia: {
        type: DataTypes.STRING(15), // Especificar la longitud para coincidir con la definición SQL
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING(100), // Especificar la longitud para coincidir con la definición SQL
        allowNull: false,
    },
    telefono1: {
        type: DataTypes.STRING(15), // Especificar la longitud para coincidir con la definición SQL
        allowNull: false,
    },
    telefono2: {
        type: DataTypes.STRING(15), // Especificar la longitud para coincidir con la definición SQL
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING(50), // Especificar la longitud para coincidir con la definición SQL
        allowNull: false,
    },
}, {
    tableName: 'personas', // Asegúrate de que el nombre coincida con el de tu tabla existente
    timestamps: false, // Si tu tabla no tiene columnas createdAt o updatedAt
});

// Exportamos el modelo
module.exports = Persona;