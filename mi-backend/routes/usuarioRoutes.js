const express = require('express');
const Usuario = require('../models/models_usuario'); // Asegúrate de que la ruta sea correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const personas = await Usuario.findAll();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
});

// Buscar una persona por cédula
router.get('/:cedula_usuario', async (req, res) => {
    try {
        const persona = await Usuario.findOne({
            where: { cedula_usuario: req.params.cedula_usuario }
        });
        if (persona) {
            res.json(persona);
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al buscar la persona:', error);
        res.status(500).json({ error: 'Error al buscar la persona' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaUsuario = await Usuario.create(req.body);
        res.status(201).json(nuevaUsuario);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
});

// Actualizar un registro
router.put('/:cedula_usuario', async (req, res) => {
    try {
        const [updated] = await Usuario.update(req.body, {
            where: { cedula_usuario: req.params.cedula_usuario }
        });
        if (updated) {
            const updatedUsuario = await Usuario.findOne({ where: { cedula_usuario: req.params.cedula_usuario } });
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
});

// Eliminar un registro
router.delete('/:cedula_usuario', async (req, res) => {
    try {
        const deleted = await Usuario.destroy({
            where: { cedula_usuario: req.params.cedula_usuario }
        });
        if (deleted) {
            res.status(204).json({ message: 'Usuario eliminada' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
});

module.exports = router;