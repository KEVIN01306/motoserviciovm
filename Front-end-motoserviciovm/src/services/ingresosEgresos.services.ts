import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { IngresosEgresosType, IngresosEgresosGetType } from "../types/ingresosEgresos.Type";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_BASE = API_URL + "ingresos-egresos";

const getIngresosEgresos = async (): Promise<IngresosEgresosGetType[]> => {
  try {
    const response = await api.get<apiResponse<IngresosEgresosGetType[]>>(API_BASE);
    const items = response.data.data;
    if (!items) return [];
    if (!Array.isArray(items)) throw new Error("INVALID_API_RESPONSE_FORMAT");
    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

const getIngresoEgreso = async (id: number): Promise<IngresosEgresosGetType> => {
  try {
    const response = await api.get<apiResponse<IngresosEgresosGetType>>(`${API_BASE}/${id}`);
    const item = response.data.data;
    if (!item) throw new Error("DATA_NOT_FOUND");
    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

const postIngresoEgreso = async (payload: IngresosEgresosType) => {
  console.log(payload)
  try {
    const response = await api.post<apiResponse<IngresosEgresosGetType>>(API_BASE, payload);

    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error("El servidor no devolvió los datos del registro creado.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

const putIngresoEgreso = async (id: number, payload: IngresosEgresosType) => {
  try {
    const response = await api.put<apiResponse<IngresosEgresosGetType>>(`${API_BASE}/${id}`, payload);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }

    throw new Error("El servidor no devolvió los datos del registro actualizado.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

const deleteIngresoEgreso = async (id: number | undefined) => {
  try {
    const response = await api.delete<apiResponse<IngresosEgresosGetType>>(`${API_BASE}/${id}`);
    return response.data.data ?? "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

const finalizarIngresoEgreso = async (id: number) => {
  try {
    const response = await api.patch<apiResponse<IngresosEgresosGetType>>(`${API_BASE}/${id}/finalizar`);
    return response.data.data ?? "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

const cancelarIngresoEgreso = async (id: number) => {
  try {
    const response = await api.patch<apiResponse<IngresosEgresosGetType>>(`${API_BASE}/${id}/cancelar`);
    return response.data.data ?? "";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
      if (status === 500) throw new Error("INTERNAL ERROR SERVER");
      const serverMessage = error.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);
      throw new Error("CONNECTION ERROR");
    }
    throw new Error((error as Error).message);
  }
};

export {
  getIngresosEgresos,
  getIngresoEgreso,
  postIngresoEgreso,
  putIngresoEgreso,
  deleteIngresoEgreso,
  finalizarIngresoEgreso,
  cancelarIngresoEgreso,
};
