// src/services/personaService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/UbicacionActivEmprende";

export const fetchRecords = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRecord = async (newRecord) => {
  const response = await axios.post(API_URL, newRecord);
  return response.data;
};

export const updateRecord = async (cedula_ubicacion_actividad_e, updatedRecord) => {
  const response = await axios.put(`${API_URL}/${cedula_ubicacion_actividad_e}`, updatedRecord);
  return response.data;
};

export const deleteRecord = async (cedula_ubicacion_actividad_e) => {
  await axios.delete(`${API_URL}/${cedula_ubicacion_actividad_e}`);
};