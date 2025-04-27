// routes/asistencia_feria.js
const express = require('express');
const asistencia_feria = require('../models/models_persona'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const asistencia_feria = await asistencia_feria.findAll();
        res.json(asistencia_feria);
    } catch (error) {
        console.error('Error al obtener las asistencia_feria:', error);
        res.status(500).json({ error: 'Error al obtener las asistencia_feria' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaasistencia_feria = await asistencia_feria.create(req.body);
        res.status(201).json(nuevaasistencia_feria);
    } catch (error) {
        console.error('Error al crear la asistencia_feria:', error);
        res.status(500).json({ error: 'Error al crear la asistencia_feria' });
    }
});

// Actualizar un registro
router.put('/:cedula_asistencia', async (req, res) => {
    try {
        const [updated] = await asistencia_feria.update(req.body, {
            where: { cedula_asistencia: req.params.cedula_asistencia }
        });
        if (updated) {
            const updatedasistencia_feria = await asistencia_feria.findOne({ where: { cedula_asistencia: req.params.cedula_asistencia } });
            res.json(updatedasistencia_feria);
        } else {
            res.status(404).json({ error: 'asistencia_feria no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la asistencia_feria:', error);
        res.status(500).json({ error: 'Error al actualizar la asistencia_feria' });
    }
});

// Eliminar un registro
router.delete('/:cedula_asistencia', async (req, res) => {
    try {
        const deleted = await asistencia_feria.destroy({
            where: { cedula_asistencia: req.params.cedula_asistencia }
        });
        if (deleted) {
            res.status(204).json({ message: 'asistencia_feria eliminada' });
        } else {
            res.status(404).json({ error: 'asistencia_feria no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la asistencia_feria:', error);
        res.status(500).json({ error: 'Error al eliminar la asistencia_feria' });
    }
});

module.exports = router;