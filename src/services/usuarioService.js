import axios from "axios";

// URL de la API
const API_URL = "http://localhost:5000/api/usuario";

// Función para obtener todos los usuarios
export const getAllUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Función para crear un nuevo usuario
export const createUsuario = async (newRecord) => {
  try {
    const response = await axios.post(API_URL, newRecord);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Función para actualizar un usuario existente
export const updateUsuario = async (cedula_usuario, updatedRecord) => {
  try {
    const response = await axios.put(`${API_URL}/${cedula_usuario}`, updatedRecord);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Función para eliminar un usuario
export const deleteUsuario = async (cedula_usuario) => {
  try {
    await axios.delete(`${API_URL}/${cedula_usuario}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};