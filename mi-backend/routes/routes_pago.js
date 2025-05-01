// routes/pago.js
const express = require('express');
const Pago = require('../models/models_pago'); // Asegúrate que la ruta sea correcta
const router = express.Router();

// Obtener todos los pagos
router.get('/', async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
});

// Crear un pago
router.post('/', async (req, res) => {
  try {
    const nuevoPago = await Pago.create(req.body);
    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(500).json({ error: 'Error al crear el pago' });
  }
});

// Actualizar un pago
router.put('/:contrato_e', async (req, res) => {
  try {
    const [updated] = await Pago.update(req.body, {
      where: { contrato_e: req.params.contrato_e },
    });
    if (updated) {
      const updatedPago = await Pago.findOne({ where: { contrato_e: req.params.contrato_e } });
      res.json(updatedPago);
    } else {
      res.status(404).json({ error: 'Pago no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el pago:', error);
    res.status(500).json({ error: 'Error al actualizar el pago' });
  }
});

// Eliminar un pago
router.delete('/:contrato_e', async (req, res) => {
  try {
    const deleted = await Pago.destroy({ where: { contrato_e: req.params.contrato_e } });
    if (deleted) {
      res.status(204).json({ message: 'Pago eliminado' });
    } else {
      res.status(404).json({ error: 'Pago no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
    res.status(500).json({ error: 'Error al eliminar el pago' });
  }
});

module.exports = router;