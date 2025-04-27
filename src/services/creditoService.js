// src/services/personaService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/Credito";

export const fetchRecords = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRecord = async (newRecord) => {
  const response = await axios.post(API_URL, newRecord);
  return response.data;
};

export const updateRecord = async (n_contrato, updatedRecord) => {
  const response = await axios.put(`${API_URL}/${n_contrato}`, updatedRecord);
  return response.data;
};

export const deleteRecord = async (n_contrato) => {
  await axios.delete(`${API_URL}/${n_contrato}`);
};