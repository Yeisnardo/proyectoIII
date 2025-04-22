const UbicacionActividad = require('../models/models_UbicacionActivEmprende'); // Ensure the path is correct

// Obtener todos los registros
const obtenerUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await UbicacionActividad.findAll();
        res.json(ubicaciones);
    } catch (error) {
        console.error('Error al obtener las ubicaciones:', error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones' });
    }
};

// Crear un nuevo registro
const crearUbicacion = async (req, res) => {
    try {
        const nuevaUbicacion = await UbicacionActividad.create(req.body);
        res.status(201).json(nuevaUbicacion);
    } catch (error) {
        console.error('Error al crear la ubicación:', error);
        res.status(500).json({ error: 'Error al crear la ubicación' });
    }
};

// Actualizar un registro
const actualizarUbicacion = async (req, res) => {
    try {
        const [updated] = await UbicacionActividad.update(req.body, {
            where: { cedula_ubicacion_actividad_e: req.params.cedula_ubicacion_actividad_e }
        });
        if (updated) {
            const updatedUbicacion = await UbicacionActividad.findOne({ where: { cedula_ubicacion_actividad_e: req.params.cedula_ubicacion_actividad_e } });
            res.json(updatedUbicacion);
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la ubicación:', error);
        res.status(500).json({ error: 'Error al actualizar la ubicación' });
    }
};

// Eliminar un registro
const eliminarUbicacion = async (req, res) => {
    try {
        const deleted = await UbicacionActividad.destroy({
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
};

module.exports = {
    obtenerUbicaciones,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion,
};