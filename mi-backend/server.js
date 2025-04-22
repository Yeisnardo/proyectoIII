const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const personaRoutes = require('./routes/routes_personas');
const usuarioRoutes = require('./routes/usuarioRoutes');
const requerimientosRoutes = require('./routes/routes_requerimientos'); // Nueva línea para requerimientos
const perfilFinancieroRoutes = require('./routes/routes_perfil_financiero'); // Nueva línea para perfil financiero
const UbicacionActivEmprende = require('./routes/routes_ubicacion_actividad'); // Nueva línea para ubicacion actividad
const cadenaProductiva = require('./routes/routes_cadena_productiva')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/personas', personaRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/requerimientos', requerimientosRoutes); // Nueva línea para requerimientos
app.use('/api/perfil_financiero', perfilFinancieroRoutes); // Nueva línea para perfil financiero
app.use('/api/UbicacionActivEmprende', UbicacionActivEmprende); // Nueva línea para ubicacion actividad
app.use('/api/CadenaProductiva', cadenaProductiva)

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Sincronizar la base de datos y comenzar el servidor
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