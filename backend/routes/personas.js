// personas.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Asegúrate de que la conexión a la base de datos esté configurada correctamente

// Ruta para obtener todos los registros
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personas');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Ruta para registrar un nuevo registro
router.post('/', async (req, res) => {
  const { cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO personas (cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la persona' });
  }
});

module.exports = router;