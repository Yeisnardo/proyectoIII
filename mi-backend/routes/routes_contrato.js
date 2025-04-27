// routes/personas.js
const express = require('express');
const Contrato = require('../models/models_contrato'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const personas = await Contrato.findAll();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaContrato = await Contrato.create(req.body);
        res.status(201).json(nuevaContrato);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar un registro
router.put('/:cedula_contrato', async (req, res) => {
    try {
        const [updated] = await Contrato.update(req.body, {
            where: { cedula_contrato: req.params.cedula_contrato }
        });
        if (updated) {
            const updatedContrato = await Contrato.findOne({ where: { cedula_contrato: req.params.cedula_contrato } });
            res.json(updatedContrato);
        } else {
            res.status(404).json({ error: 'Contrato no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar un registro
router.delete('/:cedula_contrato', async (req, res) => {
    try {
        const deleted = await Contrato.destroy({
            where: { cedula_contrato: req.params.cedula_contrato }
        });
        if (deleted) {
            res.status(204).json({ message: 'Contrato eliminada' });
        } else {
            res.status(404).json({ error: 'Contrato no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;