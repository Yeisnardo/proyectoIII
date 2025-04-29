// routes/personas.js
const express = require('express');
const aprobacion = require('../models/models_aprobacion'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const aprobaciones = await aprobacion.findAll(); // Asegúrate de que 'aprobacion' esté definido
        res.json(aprobaciones);
    } catch (error) {
        console.error('Error al obtener las aprobaciones:', error);
        res.status(500).json({ error: 'Error al obtener las aprobaciones' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaaprobacion = await aprobacion.create(req.body);
        res.status(201).json(nuevaaprobacion);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar un registro
router.put('/:cedula_emprendedor', async (req, res) => {
    try {
        const [updated] = await aprobacion.update(req.body, {
            where: { cedula_emprendedor: req.params.cedula_emprendedor }
        });
        if (updated) {
            const updatedaprobacion = await aprobacion.findOne({ where: { cedula_emprendedor: req.params.cedula_emprendedor } });
            res.json(updatedaprobacion);
        } else {
            res.status(404).json({ error: 'aprobacion no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar un registro
router.delete('/:cedula_emprendedor', async (req, res) => {
    try {
        const deleted = await aprobacion.destroy({
            where: { cedula_emprendedor: req.params.cedula_emprendedor }
        });
        if (deleted) {
            res.status(204).json({ message: 'aprobacion eliminada' });
        } else {
            res.status(404).json({ error: 'aprobacion no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;