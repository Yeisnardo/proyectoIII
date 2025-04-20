const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DatosFinancieros = sequelize.define('datos_financieros', {
    cedula_datos_financieros: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'requerimientos_e', // Referencia al modelo RequerimientosE
            key: 'cedula_requerimientos_e',
        },
    },
    cuenta_bancaria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    banco_seleccionado: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    metodo_pago: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    emprendimiento_credito: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    numero_clientes_semanal: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    declara_iva: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    declara_islr: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    compra_contrato_o_credito: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    mes_ventas: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
    exiges_ventas: {
        type: DataTypes.STRING,
        allowNull: true, // Suponiendo que puede ser nulo
    },
}, {
    tableName: 'datos_financieros',
    timestamps: false,
});

module.exports = DatosFinancieros; // Esta debería ser la última línea en tu archivo de modelo