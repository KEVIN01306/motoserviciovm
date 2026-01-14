import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { TipoHorarioType } from '../types/tipoHorario';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_TIPOS_HORARIO = `${API_URL}tipoHorario`;

const getTiposHorario = async (): Promise<TipoHorarioType[]> => {
  try {
    const response = await api.get<apiResponse<TipoHorarioType[]>>(API_TIPOS_HORARIO);
    const items = response.data.data;
    if (!Array.isArray(items)) throw new Error('INVALID_API_RESPONSE_FORMAT');
    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

const getTipoHorario = async (id: TipoHorarioType['id']): Promise<TipoHorarioType> => {
  try {
    const response = await api.get<apiResponse<TipoHorarioType>>(`${API_TIPOS_HORARIO}/${id}`);
    const item = response.data.data;
    if (!item) throw new Error('DATA_NOT_FOUND');
    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

export { getTiposHorario, getTipoHorario };
