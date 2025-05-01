import axios from "axios";

const API_URL = "http://localhost:5000/api/asistencia";

export const fetchAsistencias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAsistencia = async (asistencia) => {
  const response = await axios.post(API_URL, asistencia);
  return response.data;
};