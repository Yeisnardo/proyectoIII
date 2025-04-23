// controllers/personaController.js
const situacionOperativa = require('./models/models_SituacionOperativa');

// Obtener todos los registros
const obtenersituacionOperativa = async (req, res) => {
    try {
        const situacionOperativa = await situacionOperativa.findAll();
        res.json(situacionOperativa);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
};

// Crear un nuevo registro
const crearsituacionOperativa = async (req, res) => {
    try {
        const nuevasituacionOperativa = await situacionOperativa.create(req.body);
        res.status(201).json(nuevasituacionOperativa);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
};

// Actualizar un registro
const actualizarsituacionOperativa = async (req, res) => {
    try {
        const [updated] = await situacionOperativa.update(req.body, {
            where: { cedula: req.params.cedula }
        });
        if (updated) {
            const updatedsituacionOperativa = await situacionOperativa.findOne({ where: { cedula: req.params.cedula } });
            res.json(updatedsituacionOperativa);
        } else {
            res.status(404).json({ error: 'situacionOperativa no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
};

// Eliminar un registro
const eliminarsituacionOperativa = async (req, res) => {
    try {
        const deleted = await situacionOperativa.destroy({
            where: { cedula: req.params.cedula }
        });
        if (deleted) {
            res.status(204).json({ message: 'situacionOperativa eliminada' });
        } else {
            res.status(404).json({ error: 'situacionOperativa no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
};

module.exports = {
    obtenersituacionOperativa,
    crearsituacionOperativa,
    actualizarsituacionOperativa,
    eliminarsituacionOperativa,
};

