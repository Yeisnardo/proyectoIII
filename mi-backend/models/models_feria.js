// models/feria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feria = sequelize.define('feria', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
    },
    nombre_f: {
        type: DataTypes.STRING(20),
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
    fecha_r: {
        type: DataTypes.DATE, // Use DATE type for date fields
        allowNull: true, // Assuming this can be null based on the SQL definition
    },
}, {
    tableName: 'feria', // Ensure this matches your existing table name
    timestamps: false, // If your table does not have createdAt or updatedAt columns
});

module.exports = Feria;