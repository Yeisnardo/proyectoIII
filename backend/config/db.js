const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // Cambia esto por tu usuario de PostgreSQL
    host: 'localhost',
    database: 'bdifemi', // Cambia esto por el nombre de tu base de datos
    password: 'Dios0618*', // Cambia esto por tu contraseña de PostgreSQL
    port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;