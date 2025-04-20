// controllers/personaController.js
const { RequerimientosE, Persona }  = require('../models/models_requerimientos_e');

// ====== Controlador para Requerimientos ======

// Obtener todos los registros de requerimientos
const obtenerRequerimientos = async (req, res) => {
    try {
        const requerimientos = await RequerimientosE.findAll({
            include: [{
                model: Persona,
                required: true, // Solo incluir requerimientos que tienen una persona asociada
            }]
        });

        res.status(200).json(requerimientos);
    } catch (error) {
        console.error("Error al obtener requerimientos:", error);
        res.status(500).json({ error: "Error al obtener los requerimientos" });
    }
};

// Crear un nuevo registro de requerimiento
const crearRequerimiento = async (req, res) => {
    try {
        const nuevoRequerimiento = await RequerimientosE.create(req.body);
        res.status(201).json(nuevoRequerimiento);
    } catch (error) {
        handleError(res, error, 'Error al crear el requerimiento');
    }
};

// Actualizar un registro de requerimiento
const actualizarRequerimiento = async (req, res) => {
    try {
        const [updated] = await RequerimientosE.update(req.body, {
            where: { cedula_requerimientos_e: req.params.cedula_requerimientos_e },
        });

        if (updated) {
            const updatedRequerimiento = await RequerimientosE.findOne({ where: { cedula_requerimientos_e: req.params.cedula_requerimientos_e } });
            res.status(200).json(updatedRequerimiento);
        } else {
            res.status(404).json({ error: 'Requerimiento no encontrado' });
        }
    } catch (error) {
        handleError(res, error, 'Error al actualizar el requerimiento');
    }
};

// Eliminar un registro de requerimiento
const eliminarRequerimiento = async (req, res) => {
    try {
        const deleted = await RequerimientosE.destroy({
            where: { cedula_requerimientos_e: req.params.cedula_requerimientos_e },
        });

        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Requerimiento no encontrado' });
        }
    } catch (error) {
        handleError(res, error, 'Error al eliminar el requerimiento');
    }
};

// Función para manejar errores de manera centralizada
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

module.exports = {
    obtenerRequerimientos,
    crearRequerimiento,
    actualizarRequerimiento,
    eliminarRequerimiento,
};