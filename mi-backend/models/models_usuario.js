// models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta sea correcta

const Usuario = sequelize.define('usuario', { // Cambié 'Usuario' a 'usuario' para seguir la convención de nombres
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cedula_usuario: {
        type: DataTypes.STRING(20), // Definido como STRING(20) para coincidir con la definición SQL
        allowNull: false,
        unique: true, // Asegúrate de que este campo sea único si es necesario
        references: {
            model: 'personas', // Asegúrate de que este modelo esté definido
            key: 'cedula',
        },
    },
    usuario: {
        type: DataTypes.STRING(20), // Definido como STRING(20) para coincidir con la definición SQL
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING(50), // Definido como STRING(50) para coincidir con la definición SQL
        allowNull: false,
    },
    estatus: {
        type: DataTypes.STRING(15), // Definido como STRING(15) para coincidir con la definición SQL
        allowNull: false,
    },
}, {
    tableName: 'usuario', // Asegúrate de que coincida con el nombre de tu tabla existente
    timestamps: false, // Si tu tabla no tiene columnas createdAt o updatedAt
});

// Exportamos el modelo
module.exports = Usuario;