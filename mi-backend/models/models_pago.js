// models/pago.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contrato_e: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'credito', // Nombre de la tabla relacionada
      key: 'n_contrato', // Clave foránea en la tabla credito
    },
  },
  referencia: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  fecha: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  monto: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  dueda: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  estatus: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'pago', // Nombre exacto de la tabla en la BD
  timestamps: false,
});

module.exports = Pago;