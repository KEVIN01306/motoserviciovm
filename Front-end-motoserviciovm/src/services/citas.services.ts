import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { CitaType, CitaGetType } from '../types/citaType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_CITAS = `${API_URL}citas`;

const getCitas = async (params?: { sucursalId?: number; tipoServicioId?: number; tipoHorarioId?: number; fechaCita?: string; placa?: string; estadoId?: number }): Promise<CitaGetType[]> => {
  try {
    let url = API_CITAS;
    if (params) {
      const search = new URLSearchParams();
      if (params.sucursalId !== undefined && params.sucursalId !== null) search.append('sucursalId', String(params.sucursalId));
      if (params.tipoServicioId !== undefined && params.tipoServicioId !== null) search.append('tipoServicioId', String(params.tipoServicioId));
      if (params.tipoHorarioId !== undefined && params.tipoHorarioId !== null) search.append('tipoHorarioId', String(params.tipoHorarioId));
      if (params.fechaCita) search.append('fechaCita', params.fechaCita);
      if (params.placa) search.append('placa', params.placa);
      if (params.estadoId !== undefined && params.estadoId !== null) search.append('estadoId', String(params.estadoId));
      url += `?${search.toString()}`;
    }
    const response = await api.get<apiResponse<CitaGetType[]>>(url);
    const items = response.data.data;
    if (!items) return [];
    if (!Array.isArray(items)) throw new Error('INVALID_API_RESPONSE_FORMAT');
    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) throw new Error('No se pudo conectar con el servidor (timeout o red).');
      const status = error.response.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

const getCita = async (id: string | number): Promise<CitaGetType> => {
  try {
    const response = await api.get<apiResponse<CitaGetType>>(`${API_CITAS}/${id}`);
    const item = response.data.data;
    if (!item) throw new Error('DATA_NOT_FOUND');
    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) throw new Error('No se pudo conectar con el servidor (timeout o red).');
      const status = error.response.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

const postCita = async (payload: Partial<CitaType>) => {
  try {
    const response = await api.post<apiResponse<CitaGetType>>(API_CITAS, payload);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('POST /citas error response:', error.response?.data);
      if (!error.response) throw new Error('No se pudo conectar con el servidor (timeout o red).');
      const status = error.response.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

const putCita = async (id: string | number, payload: Partial<CitaType>) => {
  try {
    const response = await api.put<apiResponse<CitaGetType>>(`${API_CITAS}/${id}`, payload);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) throw new Error('No se pudo conectar con el servidor (timeout o red).');
      const status = error.response.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

const deleteCita = async (id: string | number) => {
  try {
    const response = await api.delete<apiResponse<any>>(`${API_CITAS}/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) throw new Error('No se pudo conectar con el servidor (timeout o red).');
      const status = error.response.status;
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

export { getCitas, getCita, postCita, putCita, deleteCita };
