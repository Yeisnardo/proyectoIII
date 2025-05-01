const express = require('express');
const FeriaModel = require('../models/models_ferias'); // Usa un nombre distinto
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const ferias = await FeriaModel.findAll();
        res.json(ferias);
    } catch (error) {
        console.error('Error al obtener las feria:', error);
        res.status(500).json({ error: 'Error al obtener la feria' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaFeria = await FeriaModel.create(req.body);
        res.status(201).json(nuevaFeria);
    } catch (error) {
        console.error('Error al crear la feria:', error);
        res.status(500).json({ error: 'Error al crear la feria' });
    }
});

module.exports = router;