import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { DiaDisponible } from '../types/diaDisponibleType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_DIAS_DISPONIBLES = `${API_URL}diasDisponibles`;

// GET todos los días disponibles
const getDiasDisponibles = async (): Promise<DiaDisponible[]> => {
  try {
    const response = await api.get<apiResponse<DiaDisponible[]>>(API_DIAS_DISPONIBLES);
    const items = response.data.data;
    if (!Array.isArray(items)) throw new Error('INVALID_API_RESPONSE_FORMAT');
    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
    }
    throw error;
  }
};

// GET día disponible por ID
const getDiaDisponible = async (id: number): Promise<DiaDisponible> => {
  try {
    const response = await api.get<apiResponse<DiaDisponible>>(`${API_DIAS_DISPONIBLES}/${id}`);
    if (!response.data.data) throw new Error('INVALID_API_RESPONSE_FORMAT');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
    }
    throw error;
  }
};

export const diaDisponibleServices = {
  getDiasDisponibles,
  getDiaDisponible,
};
