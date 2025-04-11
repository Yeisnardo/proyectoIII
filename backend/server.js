const express = require('express');
const cors = require('cors');
const personasRoutes = require('./routes/personas'); // Importar las rutas de personas

const app = express();
const port = 5000; // Puedes cambiar el puerto si es necesario

// Middleware
app.use(cors());
app.use(express.json());

// Usar las rutas de personas
app.use('/api/personas', personasRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});