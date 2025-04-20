// controllers/perfil_financieroController.js
const DatosFinancieros = require('../models/models_perfil_financieros'); // Asegúrate de que la ruta sea correcta

// Obtener todos los registros
const obtenerDatosFinancieros = async (req, res) => {
    try {
        const perfil_financiero = await perfil_financiero.findAll();
        res.json(perfil_financiero);
    } catch (error) {
        console.error('Error al obtener los datos financieros:', error);
        res.status(500).json({ error: 'Error al obtener los datos financieros', details: error.message });
    }
};

// Crear un nuevo registro
const crearDatosFinancieros = async (req, res) => {
    try {
        const nuevoDatoFinanciero = await DatosFinancieros.create(req.body);
        res.status(201).json(nuevoDatoFinanciero);
    } catch (error) {
        console.error('Error al crear los datos financieros:', error);
        res.status(500).json({ error: 'Error al crear los datos financieros' });
    }
};

// Actualizar un registro
const actualizarDatosFinancieros = async (req, res) => {
    try {
        const [updated] = await DatosFinancieros.update(req.body, {
            where: { cedula_datos_financieros: req.params.cedula }
        });
        if (updated) {
            const updatedDatosFinancieros = await DatosFinancieros.findOne({ where: { cedula_datos_financieros: req.params.cedula } });
            res.json(updatedDatosFinancieros);
        } else {
            res.status(404).json({ error: 'Datos financieros no encontrados' });
        }
    } catch (error) {
        console.error('Error al actualizar los datos financieros:', error);
        res.status(500).json({ error: 'Error al actualizar los datos financieros' });
    }
};

// Eliminar un registro
const eliminarDatosFinancieros = async (req, res) => {
    try {
        const deleted = await DatosFinancieros.destroy({
            where: { cedula_datos_financieros: req.params.cedula }
        });
        if (deleted) {
            res.status(204).json({ message: 'Datos financieros eliminados' });
        } else {
            res.status(404).json({ error: 'Datos financieros no encontrados' });
        }
    } catch (error) {
        console.error('Error al eliminar los datos financieros:', error);
        res.status(500).json({ error: 'Error al eliminar los datos financieros' });
    }
};

module.exports = {
    obtenerDatosFinancieros,
    crearDatosFinancieros,
    actualizarDatosFinancieros,
    eliminarDatosFinancieros,
};