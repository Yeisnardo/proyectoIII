// routes/pago.js
const express = require('express');
const pago = require('../models/models_pago'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const pago = await pago.findAll();
        res.json(pago);
    } catch (error) {
        console.error('Error al obtener los pago:', error);
        res.status(500).json({ error: 'Error al obtener los pago' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevopago = await pago.create(req.body);
        res.status(201).json(nuevopago);
    } catch (error) {
        console.error('Error al crear el pago:', error);
        res.status(500).json({ error: 'Error al crear el pago' });
    }
});

// Actualizar un registro
router.put('/:contrato_e', async (req, res) => {
    try {
        const [updated] = await pago.update(req.body, {
            where: { contrato_e: req.params.contrato_e }
        });
        if (updated) {
            const updatedpago = await pago.findOne({ where: { contrato_e: req.params.contrato_e } });
            res.json(updatedpago);
        } else {
            res.status(404).json({ error: 'pago no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la pago:', error);
        res.status(500).json({ error: 'Error al actualizar la pago' });
    }
});

// Eliminar un registro
router.delete('/:contrato_e', async (req, res) => {
    try {
        const deleted = await pago.destroy({
            where: { contrato_e: req.params.contrato_e }
        });
        if (deleted) {
            res.status(204).json({ message: 'pago eliminado' });
        } else {
            res.status(404).json({ error: 'pago no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar la pago:', error);
        res.status(500).json({ error: 'Error al eliminar la pago' });
    }
});

module.exports = router;