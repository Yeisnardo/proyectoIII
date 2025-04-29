// models/aprobacion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta sea correcta

const aprobacion = sequelize.define('aprobacion', { // Cambié 'aprobacion' a 'aprobacion' para seguir la convención de nombres
    cedula_emprendedor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        primaryKey: true, // Set as primary key
        references: {
            model: 'requerimientos_e',
            key: 'cedula_requerimientos_e',
        },
    },
    condicion: {
        type: DataTypes.STRING(20), // Definido como STRING(20) para coincidir con la definición SQL
        allowNull: false,
    },
}, {
    tableName: 'aprobacion', // Asegúrate de que coincida con el nombre de tu tabla existente
    timestamps: false, // Si tu tabla no tiene columnas createdAt o updatedAt
});

// Exportamos el modelo
module.exports = aprobacion;