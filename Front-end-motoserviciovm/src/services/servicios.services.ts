import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { ServicioType, ServicioGetType } from '../types/servicioType';
import type { ServicioSalidaPayloadType } from '../types/servicioType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_SERVICIOS = `${API_URL}servicios`;


// Comprime imágenes grandes antes de subirlas (máx 2MB, calidad 0.7)
const compressImage = async (file: File, maxSizeMB = 2, quality = 0.7): Promise<File> => {
  if (file.size / 1024 / 1024 <= maxSizeMB) return file;
  return new Promise<File>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.sqrt((maxSizeMB * 1024 * 1024) / file.size);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No se pudo crear el contexto de canvas');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          // Forzar extensión .jpg
          const originalName = file.name.replace(/\.[^.]+$/, '');
          const newName = originalName + '.jpg';
          resolve(new File([blob], newName, { type: 'image/jpeg' }));
        } else {
          reject('No se pudo comprimir la imagen');
        }
      }, 'image/jpeg', quality);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const getServicios = async (): Promise<ServicioGetType[]> => {
  try {
    const response = await api.get<apiResponse<ServicioGetType[]>>(API_SERVICIOS, { timeout: 20000 });
    const items = response.data.data;
    if (!items) return [];
    if (!Array.isArray(items)) throw new Error('INVALID_API_RESPONSE_FORMAT');
    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
      if (error.response) {
        const status = error.response.status;
        if (status === 500) throw new Error('INTERNAL ERROR SERVER');
        const serverMessage = error.response.data?.message;
        if (serverMessage) throw new Error(serverMessage);
        throw new Error('CONNECTION ERROR');
      } else {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
    }
    throw new Error((error as Error).message);
  }
};

const getServicio = async (id: string): Promise<ServicioGetType> => {
  try {
    const response = await api.get<apiResponse<ServicioGetType>>(`${API_SERVICIOS}/${id}`, { timeout: 20000 });
    const item = response.data.data;
    if (!item) throw new Error('DATA_NOT_FOUND');
    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
      if (error.response) {
        const status = error.response.status;
        if (status === 500) throw new Error('INTERNAL ERROR SERVER');
        const serverMessage = error.response.data?.message;
        if (serverMessage) throw new Error(serverMessage);
        throw new Error('CONNECTION ERROR');
      } else {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
    }
    throw new Error((error as Error).message);
  }
};

// payload may contain files in `imagenesFiles: File[]` and other fields
const postServicio = async (payload: Partial<ServicioType> & { imagenesFiles?: File[], firmaEntradaFile?: File }) => {
  console.log('Posting servicio with payload:', payload);
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === 'imagenesFiles' || key === 'firmaEntradaFile') return;
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
        return;
      }
      form.append(key, String(value));
    });
    if (payload.imagenesFiles && Array.isArray(payload.imagenesFiles)) {
      for (const f of payload.imagenesFiles) {
        const compressed = await compressImage(f);
        form.append('imagenes', compressed);
      }
    }
    if (payload.firmaEntradaFile) {
      const compressedFirma = await compressImage(payload.firmaEntradaFile);
      form.append('firmaEntrada', compressedFirma);
    }
    const response = await api.post<apiResponse<ServicioGetType>>(API_SERVICIOS, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 20000,
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('El servidor no devolvió los datos del registro creado.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
      if (error.response) {
        const status = error.response.status;
        if (status === 404) throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
        if (status === 500) throw new Error('INTERNAL ERROR SERVER');
        const serverMessage = error.response.data?.message;
        if (serverMessage) throw new Error(serverMessage);
        throw new Error('CONNECTION ERROR');
      } else {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
    }
    throw new Error((error as Error).message);
  }
};

export const putFirmaSalida = async (
  id: string | number,
  data: ServicioSalidaPayloadType
) => {
  console.log('Submitting firma de salida with data:', data);
  const form = new FormData();
  form.append('total', String(data.total));
  if (data.observaciones) form.append('observaciones', data.observaciones);
  if (data.proximaFechaServicio) form.append('proximaFechaServicio', typeof data.proximaFechaServicio === 'string' ? data.proximaFechaServicio : data.proximaFechaServicio.toISOString());
  if (data.descripcionProximoServicio) form.append('descripcionProximoServicio', data.descripcionProximoServicio);
  if (data.kilometrajeProximoServicio !== undefined) form.append('kilometrajeProximoServicio', String(data.kilometrajeProximoServicio));
  form.append('firmaSalida', data.firmaSalida);
  // Enviar la lista como proximoServicioItems
  if (data.proximoServicioItems && Array.isArray(data.proximoServicioItems) && data.proximoServicioItems.length > 0) {
    form.append('proximoServicioItems', JSON.stringify(data.proximoServicioItems));
  }
  const response = await api.put(`/servicios/salida/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

const putServicio = async (id: string, payload: Partial<ServicioType> & { imagenesFiles?: File[], firmaEntradaFile?: File}) => {
  console.log('Submitting servicio edit with payload:', payload, 'id: ', id);
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === 'imagenesFiles' || key === 'firmaEntradaFile') return;
      
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
        return;
      }
      form.append(key, String(value));
    });
    if (payload.imagenesFiles && Array.isArray(payload.imagenesFiles)) {
      for (const f of payload.imagenesFiles) {
        const compressed = await compressImage(f);
        form.append('imagenes', compressed);
      }
    }
    if (payload.firmaEntradaFile) {
      const compressedFirma = await compressImage(payload.firmaEntradaFile);
      form.append('firmaEntrada', compressedFirma);
    }

    const response = await api.put<apiResponse<ServicioGetType>>(`${API_SERVICIOS}/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 20000,
    });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('El servidor no devolvió los datos del registro actualizado.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
      if (error.response) {
        const status = error.response.status;
        if (status === 404) throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
        if (status === 500) throw new Error('INTERNAL ERROR SERVER');
        const serverMessage = error.response.data?.message;
        if (serverMessage) throw new Error(serverMessage);
        throw new Error('CONNECTION ERROR');
      } else {
        throw new Error('No se pudo conectar con el servidor (timeout o red).');
      }
    }
    throw new Error((error as Error).message);
  }
};



import type { ProgresoItemType } from '../types/servicioType';

// PUT /servicios/progreso/:id para actualizar progresoItems
const putServicioOpcionesTipoServicio = async (
  id: string | number,
  progresoItems: ProgresoItemType[]
) => {
  // Enviar como JSON simple
  const response = await api.put<apiResponse<any>>(
    `${API_SERVICIOS}/progreso/${id}`,
    { progresoItems },
  );
  return response.data.data;
};

import type { servicioProductoProximoType } from '../types/servicioType';
// PUT /proximosServiciosItems/:id para actualizar proximoServicioItems
export const putProximoServicioItems = async (
  id: string | number,
  proximoServicioItems: servicioProductoProximoType[]
) => {
  // El backend espera un array como body, no un objeto
  const response = await api.put<apiResponse<any>>(
    `${API_SERVICIOS}/proximosServiciosItems/${id}`,
    proximoServicioItems,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data.data;
};


export { getServicios, getServicio, postServicio, putServicio, putServicioOpcionesTipoServicio };
