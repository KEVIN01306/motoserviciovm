import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { ServicioType, ServicioGetType } from '../types/servicioType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_SERVICIOS = `${API_URL}servicios`;

const getServicios = async (): Promise<ServicioGetType[]> => {
  try {
    const response = await api.get<apiResponse<ServicioGetType[]>>(API_SERVICIOS);
    const items = response.data.data;
    if (!items) return [];
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

const getServicio = async (id: string): Promise<ServicioGetType> => {
  try {
    const response = await api.get<apiResponse<ServicioGetType>>(`${API_SERVICIOS}/${id}`);
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

// payload may contain files in `imagenesFiles: File[]` and other fields
const postServicio = async (payload: Partial<ServicioType> & { imagenesFiles?: File[] }) => {
    console.log('Posting servicio with payload:', payload);
  try {
    const form = new FormData();
    // simple scalar fields
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === 'imagenesFiles') return;
      // arrays (servicioItems, productosCliente, imagenesMeta) should be sent as JSON strings
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
        return;
      }
      form.append(key, String(value));
    });

    // append files in order
    if (payload.imagenesFiles && Array.isArray(payload.imagenesFiles)) {
      payload.imagenesFiles.forEach((f) => form.append('imagenes', f));
    }

    const response = await api.post<apiResponse<ServicioGetType>>(API_SERVICIOS, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data ?? '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

const putServicio = async (id: string, payload: Partial<ServicioType> & { imagenesFiles?: File[] }) => {
    console.log('Submitting servicio edit with payload:', payload, 'id: ', id);
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === 'imagenesFiles') return;
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
        return;
      }
      form.append(key, String(value));
    });
    if (payload.imagenesFiles && Array.isArray(payload.imagenesFiles)) {
      payload.imagenesFiles.forEach((f) => form.append('imagenes', f));
    }

    const response = await api.put<apiResponse<ServicioGetType>>(`${API_SERVICIOS}/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data ?? '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      if (status === 500) throw new Error('INTERNAL ERROR SERVER');
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error('CONNECTION ERROR');
    }
    throw new Error((error as Error).message);
  }
};

export { getServicios, getServicio, postServicio, putServicio };
