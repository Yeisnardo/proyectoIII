// config/database.js
const { Sequelize } = require('sequelize');

// Configura la conexión a tu base de datos
const sequelize = new Sequelize('bdifemi', 'postgres', 'Dios0618*', {
    host: 'localhost',
    dialect: 'postgres', // Cambiar si usas otra base de datos (mysql, sqlite, etc.)
    logging: false, // Cambia a console.log si necesitas ver las consultas SQL
});

// Probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida con éxito.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;