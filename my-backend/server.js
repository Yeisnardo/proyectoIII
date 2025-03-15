const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000; // Puedes cambiar el puerto si es necesario

// Configuración de CORS
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'tu_usuario', // Cambia esto por tu usuario de PostgreSQL
  host: 'localhost',
  database: 'tu_base_de_datos', // Cambia esto por tu base de datos
  password: 'tu_contraseña', // Cambia esto por tu contraseña
  port: 5432, // Puerto por defecto de PostgreSQL
});

// Endpoint para registrar una nueva persona
app.post('/api/personas', async (req, res) => {
  const { cedula, nombre, apellido, sexo, f_nacimiento, telefono, correo, tipo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO personas (cedula, nombre, apellido, sexo, f_nacimiento, telefono, correo, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [cedula, nombre, apellido, sexo, f_nacimiento, telefono, correo, tipo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la persona' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});