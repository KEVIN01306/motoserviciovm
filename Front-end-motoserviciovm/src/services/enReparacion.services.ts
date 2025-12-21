import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { EnReparacionType, EnReparacionGetType } from "../types/enReparacionType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_ENREPARACION = API_URL + "enReparacion";

const getEnReparaciones = async (): Promise<EnReparacionGetType[]> => {
  try {
    const response = await api.get<apiResponse<EnReparacionGetType[]>>(API_ENREPARACION);
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

const getEnReparacion = async (id: EnReparacionType["id"]): Promise<EnReparacionGetType> => {
  try {
    const response = await api.get<apiResponse<EnReparacionGetType>>(`${API_ENREPARACION}/${id}`);
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

const postEnReparacion = async (payload: EnReparacionType) => {
  try {
    const response = await api.post<apiResponse<EnReparacionGetType>>(API_ENREPARACION, payload);
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

const putEnReparacionSalida = async (id: EnReparacionType["id"], payload: Partial<EnReparacionType>) => {
  try {
    const response = await api.put<apiResponse<EnReparacionGetType>>(`${API_ENREPARACION}/salida/${id}`, payload);
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

export { getEnReparaciones, getEnReparacion, postEnReparacion, putEnReparacionSalida };
