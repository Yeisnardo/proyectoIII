// src/index.js (o donde esté tu archivo principal)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const personaRoutes = require('./routes/routes_personas');
const usuarioRoutes = require('./routes/usuarioRoutes');
const requerimientosRoutes = require('./routes/routes_requerimientos'); // Nueva línea para requerimientos

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/personas', personaRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/requerimientos', requerimientosRoutes); // Nueva línea

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Base de datos sincronizada.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('No se puede conectar a la base de datos:', error);
    }
};

// Comenzar el servidor
startServer();