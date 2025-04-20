// controllers/Usuariocontroller.js
const Usuario = require('../models/models_usuario');

const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

const createUsuario = async (req, res) => {
    console.log("Datos recibidos para crear usuario:", req.body);
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

const updateUsuario = async (req, res) => {
    const { cedula_usuario } = req.params;
    try {
        const [updated] = await Usuario.update(req.body, { where: { cedula_usuario } });
        if (updated) {
            const updatedUsuario = await Usuario.findOne({ where: { cedula_usuario } });
            res.json(updatedUsuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

const deleteUsuario = async (req, res) => {
    const { cedula_usuario } = req.params;
    try {
        const deleted = await Usuario.destroy({ where: { cedula_usuario } });
        if (deleted) {
            res.status(204).json({ message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

module.exports = {
    getAllUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
};