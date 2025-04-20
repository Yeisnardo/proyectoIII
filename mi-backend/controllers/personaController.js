// controllers/personaController.js
const Persona = require('../models/models_persona');

// Obtener todos los registros
const obtenerPersonas = async (req, res) => {
    try {
        const personas = await Persona.findAll();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
};

// Crear un nuevo registro
const crearPersona = async (req, res) => {
    try {
        const nuevaPersona = await Persona.create(req.body);
        res.status(201).json(nuevaPersona);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
};

// Actualizar un registro
const actualizarPersona = async (req, res) => {
    try {
        const [updated] = await Persona.update(req.body, {
            where: { cedula: req.params.cedula }
        });
        if (updated) {
            const updatedPersona = await Persona.findOne({ where: { cedula: req.params.cedula } });
            res.json(updatedPersona);
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
};

// Eliminar un registro
const eliminarPersona = async (req, res) => {
    try {
        const deleted = await Persona.destroy({
            where: { cedula: req.params.cedula }
        });
        if (deleted) {
            res.status(204).json({ message: 'Persona eliminada' });
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
};

module.exports = {
    obtenerPersonas,
    crearPersona,
    actualizarPersona,
    eliminarPersona,
};