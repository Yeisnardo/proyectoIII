// src/services/pagosService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/pago";

export const fetchRecords = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRecord = async (newRecord) => {
  const response = await axios.post(API_URL, newRecord);
  return response.data;
};

export const deleteRecord = async (contrato_e) => {
  await axios.delete(`${API_URL}/${contrato_e}`);
};