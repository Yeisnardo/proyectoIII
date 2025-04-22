// controllers/personaController.js
const CadenaProductiva = require('../models/models_cadenaProductiva');

// Obtener todos los registros
const obtenerCadenaProductivas = async (req, res) => {
    try {
        const personas = await CadenaProductiva.findAll();
        res.json(personas);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
};

// Crear un nuevo registro
const crearCadenaProductiva = async (req, res) => {
    try {
        const nuevaCadenaProductiva = await CadenaProductiva.create(req.body);
        res.status(201).json(nuevaCadenaProductiva);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
};

// Actualizar un registro
const actualizarCadenaProductiva = async (req, res) => {
    try {
        const [updated] = await CadenaProductiva.update(req.body, {
            where: { cedula: req.params.cedula }
        });
        if (updated) {
            const updatedCadenaProductiva = await CadenaProductiva.findOne({ where: { cedula: req.params.cedula } });
            res.json(updatedCadenaProductiva);
        } else {
            res.status(404).json({ error: 'CadenaProductiva no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
};

// Eliminar un registro
const eliminarCadenaProductiva = async (req, res) => {
    try {
        const deleted = await CadenaProductiva.destroy({
            where: { cedula: req.params.cedula }
        });
        if (deleted) {
            res.status(204).json({ message: 'CadenaProductiva eliminada' });
        } else {
            res.status(404).json({ error: 'CadenaProductiva no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
};

module.exports = {
    obtenerCadenaProductivas,
    crearCadenaProductiva,
    actualizarCadenaProductiva,
    eliminarCadenaProductiva,
};