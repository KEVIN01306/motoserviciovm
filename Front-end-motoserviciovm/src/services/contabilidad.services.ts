import { api } from '../axios/axios';
import axios from 'axios';
import type { apiResponse } from '../types/apiResponse';
import type { contabilidadTotalesType } from '../types/contabilidad';

interface ContabilidadParams {
  fechaInicio: string;
  fechaFin: string;
  sucursalIds: number[];
}

const API_URL = import.meta.env.VITE_DOMAIN;
const API_CONTABILIDAD = API_URL + 'contabilidad/totales';

export const getContabilidad = async (params: ContabilidadParams): Promise<contabilidadTotalesType> => {
  try {
    const response = await api.get<apiResponse<contabilidadTotalesType>>(API_CONTABILIDAD, {
      params: {
        fechaInicio: params.fechaInicio,
        fechaFin: params.fechaFin,
        sucursalIds: params.sucursalIds.join(','),
      },
    });

    const data = response.data.data;

    if (!data) {
      throw new Error('DATA_NOT_FOUND');
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 500) {
        throw new Error('INTERNAL_SERVER_ERROR');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION_ERROR');
    }

    throw new Error((error as Error).message);
  }
};