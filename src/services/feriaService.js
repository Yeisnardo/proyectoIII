import axios from "axios";

const API_URL = "http://localhost:5000/api/ferias";

export const fetchFerias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createFeria = async (feria) => {
  const response = await axios.post(API_URL, feria);
  return response.data;
};