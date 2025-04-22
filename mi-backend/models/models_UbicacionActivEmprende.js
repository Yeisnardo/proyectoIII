const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UbicacionActividad = sequelize.define('ubicacion_actividad_e', {
    cedula_ubicacion_actividad_e: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'datos_financieros', // The name of the referenced table
            key: 'cedula_datos_financieros', // The key in the referenced table
        },
    },
    donde_actividad_e: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    espacio: {
        type: DataTypes.STRING,
        allowNull: true,
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
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'ubicacion_actividad_e', // Ensure the name matches your existing table
    timestamps: false, // If your table does not have createdAt or updatedAt columns
});

// Export the model
module.exports = UbicacionActividad;