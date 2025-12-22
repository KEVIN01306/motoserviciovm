import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_MOTOS = `${API_URL}motos`;

const getMotos = async () => {
  try {
    const response = await api.get<apiResponse<any[]>>(API_MOTOS);
    return response.data.data ?? [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

export { getMotos };
