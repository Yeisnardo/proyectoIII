// routes/feria.js
const express = require('express');
const feria = require('../models/models_feria'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const feria = await feria.findAll();
        res.json(feria);
    } catch (error) {
        console.error('Error al obtener las feria:', error);
        res.status(500).json({ error: 'Error al obtener las feria' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaferia = await feria.create(req.body);
        res.status(201).json(nuevaferia);
    } catch (error) {
        console.error('Error al crear la feria:', error);
        res.status(500).json({ error: 'Error al crear la feria' });
    }
});

// Actualizar un registro
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await feria.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPersona = await feria.findOne({ where: { id: req.params.id } });
            res.json(updatedPersona);
        } else {
            res.status(404).json({ error: 'feria no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la feria:', error);
        res.status(500).json({ error: 'Error al actualizar la feria' });
    }
});

// Eliminar un registro
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await feria.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'feria eliminada' });
        } else {
            res.status(404).json({ error: 'feria no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la feria:', error);
        res.status(500).json({ error: 'Error al eliminar la feria' });
    }
});

module.exports = router;