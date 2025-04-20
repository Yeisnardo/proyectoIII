// routes/requerimientos.js
const express = require('express');
const RequerimientosE = require('../models/models_requerimientos_e');
const router = express.Router();

// Obtener todos los registros de requerimientos
router.get('/', async (req, res) => {
    try {
        const requerimientos = await RequerimientosE.findAll();
        res.json(requerimientos);
    } catch (error) {
        console.error('Error al obtener los requerimientos:', error);
        res.status(500).json({ error: 'Error al obtener los requerimientos' });
    }
});

// Crear un nuevo registro de requerimiento
router.post('/', async (req, res) => {
    try {
        const nuevoRequerimiento = await RequerimientosE.create(req.body);
        res.status(201).json(nuevoRequerimiento);
    } catch (error) {
        console.error('Error al crear el requerimiento:', error);
        res.status(500).json({ error: 'Error al crear el requerimiento' });
    }
});

// Actualizar un registro de requerimiento
router.put('/:cedula_requerimientos_e', async (req, res) => {
    try {
        const [updated] = await RequerimientosE.update(req.body, {
            where: { cedula_requerimientos_e: req.params.cedula_requerimientos_e }
        });
        if (updated) {
            const updatedRequerimiento = await RequerimientosE.findOne({ where: { cedula_requerimientos_e: req.params.cedula_requerimientos_e } });
            res.json(updatedRequerimiento);
        } else {
            res.status(404).json({ error: 'Requerimiento no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el requerimiento:', error);
        res.status(500).json({ error: 'Error al actualizar el requerimiento' });
    }
});

// Eliminar un registro de requerimiento
router.delete('/:cedula_requerimientos_e', async (req, res) => {
    try {
        const deleted = await RequerimientosE.destroy({
            where: { cedula_requerimientos_e: req.params.cedula_requerimientos_e }
        });
        if (deleted) {
            res.status(204).json({ message: 'Requerimiento eliminado' });
        } else {
            res.status(404).json({ error: 'Requerimiento no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el requerimiento:', error);
        res.status(500).json({ error: 'Error al eliminar el requerimiento' });
    }
});

module.exports = router;