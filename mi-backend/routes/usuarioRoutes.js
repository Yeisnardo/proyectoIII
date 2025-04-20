const express = require('express');
const usuarioController = require('../controllers/Usuariocontroller'); // Importar controlador
const router = express.Router();

// Obtener todos los registros
router.get('/', usuarioController.getAllUsuarios);

// Crear un nuevo registro
router.post('/', usuarioController.createUsuario);

// Actualizar un registro
router.put('/:cedula_usuario', usuarioController.updateUsuario); // Asegúrate de que el nombre del parámetro sea correcto

// Eliminar un registro
router.delete('/:cedula_usuario', usuarioController.deleteUsuario);

module.exports = router;