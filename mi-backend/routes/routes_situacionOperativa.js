// routes/SituacionOperativa.js
const express = require('express');
const SituacionOperativa = require('../models/models_SituacionOperativa'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const SituacionOperativa = await SituacionOperativa.findAll(); // This line causes the error
        res.json(SituacionOperativa);
    } catch (error) {
        console.error('Error al obtener las SituacionOperativa:', error);
        res.status(500).json({ error: 'Error al obtener las SituacionOperativa' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaPersona = await SituacionOperativa.create(req.body);
        res.status(201).json(nuevaPersona);
    } catch (error) {
        console.error('Error al crear la SituacionOperativa:', error);
        res.status(500).json({ error: 'Error al crear la SituacionOperativa' });
    }
});

// Actualizar un registro
router.put('/:cedula_datos_situacion_operativa', async (req, res) => {
    try {
        const [updated] = await SituacionOperativa.update(req.body, {
            where: { cedula_datos_situacion_operativa: req.params.cedula_datos_situacion_operativa }
        });
        if (updated) {
            const updatedPersona = await SituacionOperativa.findOne({ where: { cedula_datos_situacion_operativa: req.params.cedula_datos_situacion_operativa } });
            res.json(updatedPersona);
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la SituacionOperativa:', error);
        res.status(500).json({ error: 'Error al actualizar la SituacionOperativa' });
    }
});

// Eliminar un registro
router.delete('/:cedula_datos_situacion_operativa', async (req, res) => {
    try {
        const deleted = await SituacionOperativa.destroy({
            where: { cedula_datos_situacion_operativa: req.params.cedula_datos_situacion_operativa }
        });
        if (deleted) {
            res.status(204).json({ message: 'Persona eliminada' });
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la SituacionOperativa:', error);
        res.status(500).json({ error: 'Error al eliminar la SituacionOperativa' });
    }
});

module.exports = router;