import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';

/**
 * Envía la firma de salida y los campos requeridos al endpoint dedicado
 * @param id ID del servicio
 * @param data Campos: total, observaciones, proximaFechaServicio, descripcionProximoServicio, firmaSalida (File)
 */
export const postFirmaSalida = async (
  id: string | number,
  data: {
    total: number;
    observaciones?: string;
    proximaFechaServicio?: string | null;
    descripcionProximoServicio?: string | null;
    firmaSalida: File;
  }
) => {
  const form = new FormData();
  form.append('total', String(data.total));
  if (data.observaciones) form.append('observaciones', data.observaciones);
  if (data.proximaFechaServicio) form.append('proximaFechaServicio', data.proximaFechaServicio);
  if (data.descripcionProximoServicio) form.append('descripcionProximoServicio', data.descripcionProximoServicio);
  form.append('firmaSalida', data.firmaSalida);
  const response = await api.post<apiResponse<any>>(`/servicios/salida/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};