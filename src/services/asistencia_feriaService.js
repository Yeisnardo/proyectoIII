import axios from "axios";

const API_URL = "http://localhost:5000/api/asistencia_feria";

export const fetchRecords = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRecord = async (newRecord) => {
  const response = await axios.post(API_URL, newRecord);
  return response.data;
};

export const updateRecord = async (cedula_asistencia_feria, updatedRecord) => {
  const response = await axios.put(`${API_URL}/${cedula_asistencia_feria}`, updatedRecord);
  return response.data;
};

export const deleteRecord = async (cedula_asistencia_feria) => {
  await axios.delete(`${API_URL}/${cedula_asistencia_feria}`);
};