import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { ValorType } from '../types/valorType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_VALORES = API_URL + 'valores';

const getValores = async (): Promise<ValorType[]> => {
  try {
    const response = await api.get<apiResponse<ValorType[]>>(API_VALORES);
    const items = response.data.data;

    if (!Array.isArray(items)) {
      throw new Error('INVALID_API_RESPONSE_FORMAT');
    }

    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const getValor = async (id: ValorType['id']): Promise<ValorType> => {
  try {
    const response = await api.get<apiResponse<ValorType>>(`${API_VALORES}/${id}`);
    const item = response.data.data;

    if (!item) {
      throw new Error('DATA_NOT_FOUND');
    }

    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const postValor = async (valor: ValorType): Promise<ValorType> => {
  try {
    const response = await api.post<apiResponse<ValorType>>(API_VALORES, valor);
    return response.data.data ?? ({} as ValorType);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      }

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const putValor = async (id: ValorType['id'], valor: ValorType): Promise<ValorType> => {
  try {
    const response = await api.put<apiResponse<ValorType>>(`${API_VALORES}/${id}`, valor);
    return response.data.data ?? ({} as ValorType);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      }

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const deleteValor = async (id: ValorType['id'] | undefined): Promise<ValorType> => {
  try {
    const response = await api.delete<apiResponse<ValorType>>(`${API_VALORES}/${id}`);
    return response.data.data ?? ({} as ValorType);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      }

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

export { getValores, getValor, postValor, putValor, deleteValor };
