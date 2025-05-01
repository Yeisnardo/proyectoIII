// routes/asistencia_feria.js
const express = require('express');
const asistencia = require('../models/models_asistencia_feria'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const asistencia = await asistencia.findAll();
        res.json(asistencia);
    } catch (error) {
        console.error('Error al obtener las asistencia:', error);
        res.status(500).json({ error: 'Error al obtener las asistencia' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaasistencia = await asistencia.create(req.body);
        res.status(201).json(nuevaasistencia);
    } catch (error) {
        console.error('Error al crear la asistencia:', error);
        res.status(500).json({ error: 'Error al crear la asistencia' });
    }
});

// Actualizar un registro
router.put('/:cedula_asistencia', async (req, res) => {
    try {
        const [updated] = await asistencia.update(req.body, {
            where: { cedula_asistencia: req.params.cedula_asistencia }
        });
        if (updated) {
            const updatedasistencia = await asistencia.findOne({ where: { cedula_asistencia: req.params.cedula_asistencia } });
            res.json(updatedasistencia);
        } else {
            res.status(404).json({ error: 'asistencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la asistencia:', error);
        res.status(500).json({ error: 'Error al actualizar la asistencia' });
    }
});

// Eliminar un registro
router.delete('/:cedula_asistencia', async (req, res) => {
    try {
        const deleted = await asistencia.destroy({
            where: { cedula_asistencia: req.params.cedula_asistencia }
        });
        if (deleted) {
            res.status(204).json({ message: 'asistencia eliminada' });
        } else {
            res.status(404).json({ error: 'asistencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la asistencia:', error);
        res.status(500).json({ error: 'Error al eliminar la asistencia' });
    }
});

module.exports = router;