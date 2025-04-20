// models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta sea correcta

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cedula_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegúrate de que este campo sea único si es necesario
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
// Exportamos el modelo
module.exports = Usuario;