// models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la ruta sea correcta

const aprobacion = sequelize.define('aprobacion', { // Cambié 'aprobacion' a 'usuario' para seguir la convención de nombres
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cedula_emprendedor: {
        type: DataTypes.STRING(20), // Definido como STRING(20) para coincidir con la definición SQL
        allowNull: false,
        unique: true, // Asegúrate de que este campo sea único si es necesario
        references: {
            model: 'requerimientos_e', // Asegúrate de que este modelo esté definido
            key: 'cedula_requerimientos_e',
        },
    },
    estatus: {
        type: DataTypes.STRING(20), // Definido como STRING(15) para coincidir con la definición SQL
        allowNull: false,
    },
}, {
    tableName: 'aprobacion', // Asegúrate de que coincida con el nombre de tu tabla existente
    timestamps: false, // Si tu tabla no tiene columnas createdAt o updatedAt
});

// Exportamos el modelo
module.exports = aprobacion;