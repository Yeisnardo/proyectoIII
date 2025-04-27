// routes/personas.js
const express = require('express');
const Persona = require('../models/models_usuario'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const personas = await Persona.findAll();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaPersona = await Persona.create(req.body);
        res.status(201).json(nuevaPersona);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar un registro
router.put('/:cedula_contrato', async (req, res) => {
    try {
        const [updated] = await Persona.update(req.body, {
            where: { cedula_contrato: req.params.cedula_contrato }
        });
        if (updated) {
            const updatedPersona = await Persona.findOne({ where: { cedula_contrato: req.params.cedula_contrato } });
            res.json(updatedPersona);
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar un registro
router.delete('/:cedula_contrato', async (req, res) => {
    try {
        const deleted = await Persona.destroy({
            where: { cedula_contrato: req.params.cedula_contrato }
        });
        if (deleted) {
            res.status(204).json({ message: 'Persona eliminada' });
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;