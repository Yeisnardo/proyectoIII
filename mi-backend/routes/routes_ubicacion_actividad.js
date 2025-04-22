const express = require('express');
const UbicacionActivEmprende = require('../models/models_UbicacionActivEmprende'); // Ensure the path is correct
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const ubicaciones = await UbicacionActivEmprende.findAll();
        res.json(ubicaciones);
    } catch (error) {
        console.error('Error al obtener las ubicaciones:', error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaUbicacion = await UbicacionActivEmprende.create(req.body);
        res.status(201).json(nuevaUbicacion);
    } catch (error) {
        console.error('Error al crear la ubicación:', error);
        res.status(500).json({ error: 'Error al crear la ubicación' });
    }
});

// Actualizar un registro
router.put('/:cedula_ubicacion_actividad_e', async (req, res) => {
    try {
        const [updated] = await UbicacionActivEmprende.update(req.body, {
            where: { cedula_ubicacion_actividad_e: req.params.cedula_ubicacion_actividad_e }
        });
        if (updated) {
            const updatedUbicacion = await UbicacionActivEmprende.findOne({ where: { cedula_ubicacion_actividad_e: req.params.cedula_ubicacion_actividad_e } });
            res.json(updatedUbicacion);
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la ubicación:', error);
        res.status(500).json({ error: 'Error al actualizar la ubicación' });
    }
});

// Eliminar un registro
router.delete('/:cedula_ubicacion_actividad_e', async (req, res) => {
    try {
        const deleted = await UbicacionActivEmprende.destroy({
            where: { cedula_ubicacion_actividad_e: req.params.cedula_ubicacion_actividad_e }
        });
        if (deleted) {
            res.status(204).json({ message: 'Ubicación eliminada' });
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la ubicación:', error);
        res.status(500).json({ error: 'Error al eliminar la ubicación' });
    }
});

module.exports = router;