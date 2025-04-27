// models/pago.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('pago', {
    id: {
        type: DataTypes.INTEGER, // Usar INTEGER para el campo SERIAL
        primaryKey: true,
        autoIncrement: true, // Para que se incremente automáticamente
    },
    contrato_e: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'credito', // Asegúrate de que este modelo esté definido
            key: 'n_contrato',
        },
    },
    referencia: {
        type: DataTypes.STRING(20),
        allowNull: true, // Suponiendo que puede ser nulo según la definición SQL
    },
    fecha: {
        type: DataTypes.STRING(20), // Puedes cambiar a DATE si prefieres manejar fechas
        allowNull: true, // Suponiendo que puede ser nulo según la definición SQL
    },
    monto: {
        type: DataTypes.STRING(20), // Puedes cambiar a DECIMAL o FLOAT si prefieres manejar montos
        allowNull: true, // Suponiendo que puede ser nulo según la definición SQL
    },
}, {
    tableName: 'pago', // Asegúrate de que coincida con el nombre de tu tabla existente
    timestamps: false, // Si tu tabla no tiene columnas createdAt o updatedAt
});

module.exports = Pago;