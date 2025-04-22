// routes/personas.js
const express = require('express');
const cadenaProductiva = require('../models/models_cadenaProductiva'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const personas = await cadenaProductiva.findAll();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevacadenaProductiva = await cadenaProductiva.create(req.body);
        res.status(201).json(nuevacadenaProductiva);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar un registro
router.put('/:cedula_datos_cadena_p', async (req, res) => {
    try {
        const [updated] = await cadenaProductiva.update(req.body, {
            where: { cedula_datos_cadena_p: req.params.cedula_datos_cadena_p }
        });
        if (updated) {
            const updatedcadenaProductiva = await cadenaProductiva.findOne({ where: { cedula_datos_cadena_p: req.params.cedula_datos_cadena_p } });
            res.json(updatedcadenaProductiva);
        } else {
            res.status(404).json({ error: 'cadenaProductiva no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar un registro
router.delete('/:cedula_datos_cadena_p', async (req, res) => {
    try {
        const deleted = await cadenaProductiva.destroy({
            where: { cedula_datos_cadena_p: req.params.cedula_datos_cadena_p }
        });
        if (deleted) {
            res.status(204).json({ message: 'cadenaProductiva eliminada' });
        } else {
            res.status(404).json({ error: 'cadenaProductiva no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;