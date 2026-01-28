import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { 
  TipoServicioHorario, 
  CreateTipoServicioHorario, 
  TipoServicioHorarioFilters,
  UpsertTipoServicioHorarioDia
} from '../types/tipoServicioHorarioType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_TIPO_SERVICIO_HORARIO = `${API_URL}tipoServicioHorario`;

// GET con filtros
const getTiposServicioHorario = async (filters: TipoServicioHorarioFilters): Promise<TipoServicioHorario[]> => {
  try { 
    const params = new URLSearchParams({
      tipoHorarioId: filters.tipoHorarioId.toString(),
      sucursalId: filters.sucursalId.toString(),
    });
    
    const response = await api.get<apiResponse<TipoServicioHorario[]>>(`${API_TIPO_SERVICIO_HORARIO}?${params}`);
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

// GET por ID
const getTipoServicioHorario = async (id: number): Promise<TipoServicioHorario> => {
  try {
    const response = await api.get<apiResponse<TipoServicioHorario>>(`${API_TIPO_SERVICIO_HORARIO}/${id}`);
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

// POST - Crear
const createTipoServicioHorario = async (data: CreateTipoServicioHorario): Promise<TipoServicioHorario> => {
  try {
    const response = await api.post<apiResponse<TipoServicioHorario>>(API_TIPO_SERVICIO_HORARIO, data);
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

// PUT - Actualizar
const updateTipoServicioHorario = async (id: number, data: CreateTipoServicioHorario): Promise<TipoServicioHorario> => {
  try {
    const response = await api.put<apiResponse<TipoServicioHorario>>(`${API_TIPO_SERVICIO_HORARIO}/${id}`, data);
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

// DELETE
const deleteTipoServicioHorario = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_TIPO_SERVICIO_HORARIO}/${id}`);
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

// POST - Upsert día específico
const upsertTipoServicioHorarioDia = async (
  tipoServicioHorarioId: number, 
  data: UpsertTipoServicioHorarioDia
): Promise<any> => {
  try {
    const response = await api.post<apiResponse<any>>(
      `${API_TIPO_SERVICIO_HORARIO}/${tipoServicioHorarioId}/dias`, 
      data
    );
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

export const tipoServicioHorarioServices = {
  getTiposServicioHorario,
  getTipoServicioHorario,
  createTipoServicioHorario,
  updateTipoServicioHorario,
  deleteTipoServicioHorario,
  upsertTipoServicioHorarioDia,
};
