// routes/DatosFinancieros .js
const express = require('express');
const DatosFinancieros  = require('../models/models_perfil_financiero'); // Asegúrate de que la ruta esté correcta
const router = express.Router();

// Obtener todos los registros
router.get('/', async (req, res) => {
    try {
        const perfil_financiero = await DatosFinancieros.findAll(); // Asegúrate de que esto sea correcto
        res.json(perfil_financiero);
    } catch (error) {
        console.error('Error al obtener los Datos_financieros:', error);
        res.status(500).json({ error: 'Error al obtener los Datos_financieros' });
    }
});

// Crear un nuevo registro
router.post('/', async (req, res) => {
    try {
        const nuevaDatos_financieros = await DatosFinancieros.create(req.body);
        res.status(201).json(nuevaDatos_financieros);
    } catch (error) {
        console.error('Error al crear la Datos_financieros:', error);
        res.status(500).json({ error: 'Error al crear la Datos_financieros' });
    }
});

// Actualizar un registro
router.put('/:cedula_datos_financieros', async (req, res) => {
    try {
        const [updated] = await DatosFinancieros.update(req.body, {
            where: { cedula_datos_financieros: req.params.cedula_datos_financieros }
        });
        if (updated) {
            const updatedDatos_financieros = await DatosFinancieros.findOne({ where: { cedula_datos_financieros: req.params.cedula_datos_financieros } });
            res.json(updatedDatos_financieros);
        } else {
            res.status(404).json({ error: 'Datos_financieros no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la Datos_financieros:', error);
        res.status(500).json({ error: 'Error al actualizar la Datos_financieros' });
    }
});

// Eliminar un registro
router.delete('/:cedula_datos_financieros', async (req, res) => {
    try {
        const deleted = await DatosFinancieros.destroy({
            where: { cedula_datos_financieros: req.params.cedula_datos_financieros }
        });
        if (deleted) {
            res.status(204).json({ message: 'Datos_financieros eliminada' });
        } else {
            res.status(404).json({ error: 'Datos_financieros no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la Datos_financieros:', error);
        res.status(500).json({ error: 'Error al eliminar la Datos_financieros' });
    }
});

module.exports = router;