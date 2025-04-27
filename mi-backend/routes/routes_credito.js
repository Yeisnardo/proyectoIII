// routes/Credito.js
const express = require('express');
const Credito = require('../models/models_credito'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const Creditos = await Credito.findAll(); // Use the renamed variable
        res.json(Creditos);
    } catch (error) {
        console.error('Error al obtener las Credito:', error);
        res.status(500).json({ error: 'Error al obtener las Credito' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaCredito = await Credito.create(req.body);
        res.status(201).json(nuevaCredito);
    } catch (error) {
        console.error('Error al crear la Credito:', error);
        res.status(500).json({ error: 'Error al crear la Credito' });
    }
});

// Actualizar un registro
router.put('/:n_contrato', async (req, res) => {
    try {
        const [updated] = await Credito.update(req.body, {
            where: { n_contrato: req.params.n_contrato }
        });
        if (updated) {
            const updatedCredito = await Credito.findOne({ where: { n_contrato: req.params.n_contrato } });
            res.json(updatedCredito);
        } else {
            res.status(404).json({ error: 'Credito no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la Credito:', error);
        res.status(500).json({ error: 'Error al actualizar la Credito' });
    }
});

// Eliminar un registro
router.delete('/:n_contrato', async (req, res) => {
    try {
        const deleted = await Credito.destroy({
            where: { n_contrato: req.params.n_contrato }
        });
        if (deleted) {
            res.status(204).json({ message: 'Credito eliminada' });
        } else {
            res.status(404).json({ error: 'Credito no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la Credito:', error);
        res.status(500).json({ error: 'Error al eliminar la Credito' });
    }
});

module.exports = router;