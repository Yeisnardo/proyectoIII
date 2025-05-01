const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const personaRoutes = require('./routes/routes_personas');
const usuarioRoutes = require('./routes/usuarioRoutes');
const requerimientosRoutes = require('./routes/routes_requerimientos'); // Nueva línea para requerimientos
const perfilFinancieroRoutes = require('./routes/routes_perfil_financiero'); // Nueva línea para perfil financiero
const UbicacionActivEmprende = require('./routes/routes_ubicacion_actividad'); // Nueva línea para ubicacion actividad
const cadenaProductiva = require('./routes/routes_cadena_productiva');
const situacionOperativa = require('./routes/routes_situacionOperativa');
const ferias = require('./routes/routes_ferias');
const aprobacion = require('./routes/routes_aprobacion');
const asistencia = require('./routes/routes_asistencia_feria');
const contrato = require('./routes/routes_contrato');
const Credito = require('./routes/routes_credito');
const pago = require('./routes/routes_pago');

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
app.use('/api/CadenaProductiva', cadenaProductiva);
app.use('/api/situacionOperativa', situacionOperativa);
app.use('/api/contrato', contrato);
app.use('/api/ferias', ferias);
app.use('/api/aprobacion', aprobacion);
app.use('/api/asistencia', asistencia);
app.use('/api/Credito', Credito);
app.use('/api/pago', pago);

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