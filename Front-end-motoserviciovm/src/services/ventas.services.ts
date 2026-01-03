import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { VentaType, VentaGetType } from "../types/ventaType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_VENTAS = API_URL + "ventas";

const getVentas = async (): Promise<VentaGetType[]> => {
  try {
    const response = await api.get<apiResponse<VentaGetType[]>>(API_VENTAS);
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

const getVenta = async (id: number): Promise<VentaGetType> => {
  try {
    const response = await api.get<apiResponse<VentaGetType>>(`${API_VENTAS}/${id}`);
    const item = response.data.data;
    console.log(item);
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

const postVenta = async (payload: VentaType) => {
  try {
    const response = await api.post<apiResponse<VentaGetType>>(API_VENTAS, payload);
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

const putVenta = async (id: number, payload: VentaType) => {
  try {
    const response = await api.put<apiResponse<VentaGetType>>(`${API_VENTAS}/${id}`, payload);

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

const cancelarVenta = async (id: number) => {
  try {
    const response = await api.patch<apiResponse<VentaGetType>>(`${API_VENTAS}/${id}/cancelar`);
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

const finalizarVenta = async (id: number) => {
  try {
    const response = await api.patch<apiResponse<VentaGetType>>(`${API_VENTAS}/${id}/finalizar`);
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

export { getVentas, getVenta, postVenta, putVenta, cancelarVenta, finalizarVenta };
