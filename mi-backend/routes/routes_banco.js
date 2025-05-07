// routes/banco.js
const express = require('express');
const Banco = require('../models/models_banco'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const banco = await Banco.findAll();
        res.json(banco);
    } catch (error) {
        console.error('Error al obtener las banco:', error);
        res.status(500).json({ error: 'Error al obtener las banco' });
    }
});

// Buscar una persona por cédula
router.get('/:cedula_emprendedor', async (req, res) => {
    try {
        const persona = await Banco.findOne({
            where: { cedula_emprendedor: req.params.cedula_emprendedor } // Asegúrate de que el campo sea 'cedula_emprendedor'
        });
        if (persona) {
            res.json(persona);
        } else {
            res.status(404).json({ error: 'Banco no encontrada' });
        }
    } catch (error) {
        console.error('Error al buscar la persona:', error);
        res.status(500).json({ error: 'Error al buscar la persona' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaBanco = await Banco.create(req.body);
        res.status(201).json(nuevaBanco);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar un registro
router.put('/:cedula_emprendedor', async (req, res) => {
    try {
        const [updated] = await Banco.update(req.body, {
            where: { cedula_emprendedor: req.params.cedula_emprendedor }
        });
        if (updated) {
            const updatedBanco = await Banco.findOne({ where: { cedula_emprendedor: req.params.cedula_emprendedor } });
            res.json(updatedBanco);
        } else {
            res.status(404).json({ error: 'Banco no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar un registro
router.delete('/:cedula_emprendedor', async (req, res) => {
    try {
        const deleted = await Banco.destroy({
            where: { cedula_emprendedor: req.params.cedula_emprendedor }
        });
        if (deleted) {
            res.status(204).json({ message: 'Banco eliminada' });
        } else {
            res.status(404).json({ error: 'Banco no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;