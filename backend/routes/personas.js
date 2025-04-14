const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ensure the database connection is correctly configured

// Middleware for input validation
const validatePersonaInput = (req, res, next) => {
  const { cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo } = req.body;
  if (!cedula || !nombres || !apellidos || !estado || !municipio || !parroquia || !direccion || !telefono1 || !telefono2 || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
  next();
};

// Route to get all personas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personas');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    res.status(500).json({ error: 'Error al obtener personas' });
  }
});

// Route to register a new persona
router.post('/', validatePersonaInput, async (req, res) => {
  const { cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo } = req.body;

  try {
    await pool.query(
      'INSERT INTO personas (cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [cedula, nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo]
    );
    res.status(201).send(); // Send a 201 status without a message
  } catch (error) {
    console.error('Error al registrar la persona:', error);
    res.status(500).json({ error: 'Error al registrar la persona' });
  }
});

// Update a persona
router.put('/:cedula', validatePersonaInput, async (req, res) => {
  const { cedula: cedulaParam } = req.params;
  const { nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo } = req.body;

  try {
    const result = await pool.query(
      'UPDATE personas SET nombres = $1, apellidos = $2, estado = $3, municipio = $4, parroquia = $5, direccion = $6, telefono1 = $7, telefono2 = $8, tipo = $9 WHERE cedula = $10 RETURNING *',
      [nombres, apellidos, estado, municipio, parroquia, direccion, telefono1, telefono2, tipo, cedulaParam]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the updated record
    } else {
      res.status(404).json({ error: 'Persona no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar la persona:', error);
    res.status(500).json({ error: 'Error al actualizar la persona' });
  }
});

// Route to delete a persona
router.delete('/:cedula', async (req, res) => {
  const { cedula } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM personas WHERE cedula = $1 RETURNING *',
      [cedula]
    );

    if (result.rowCount > 0) {
      res.status(204).send(); // Send a 204 No Content status
    } else {
      res.status(404).json({ error: 'Persona no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    res.status(500).json({ error: 'Error al eliminar la persona' });
  }
});

module.exports = router;