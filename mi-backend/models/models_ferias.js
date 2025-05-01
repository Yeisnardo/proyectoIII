const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feria = sequelize.define('Feria', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
    },
    nombre_f: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    fecha_r: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'feria',
    timestamps: false,
});

module.exports = Feria;