import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { EnReparacionType, EnReparacionGetType } from "../types/enReparacionType";
import type { repuestoReparacionType } from "../types/repuestoReparacionType";

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

const getEnReparacion = async (id:number): Promise<EnReparacionGetType> => {
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

const putEnReparacionSalida = async (id: number, payload: Partial<EnReparacionType>) => {
  try {
    // Si hay firmaSalida (base64 o File), usar FormData
    let dataToSend: any = payload;
    console.log("Payload before submission:", payload);
    let config = {};
    if (payload.firmaSalida) {
      const formData = new FormData();
      // Si es base64, convertir a File
      if (typeof payload.firmaSalida === "string" && payload.firmaSalida.startsWith("data:image")) {
        const arr = payload.firmaSalida.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const file = new File([u8arr], "firmaSalida.jpg", { type: mime });
        formData.append("firmaSalida", file);
      } else if (payload.firmaSalida instanceof File) {
        formData.append("firmaSalida", payload.firmaSalida);
      }
      // Agregar el resto de los campos
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "firmaSalida" && value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      dataToSend = formData;
      config = { headers: { "Content-Type": "multipart/form-data" } };
    }
    const response = await api.put<apiResponse<EnReparacionGetType>>(
      `${API_ENREPARACION}/salida/${id}`,
      dataToSend,
      config
    );
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


// PUT /:id/repuestos para actualizar lista de repuestos de una reparación
const putRepuestosReparacion = async (
  id: number | string,
  repuestos: Omit<repuestoReparacionType, 'imagen'>[]
) => {
  try {
    const response = await api.put<apiResponse<any>>(
      `${API_ENREPARACION}/${id}/repuestos`,
      repuestos,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.data;
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


const putEnReparacion = async (id: number, payload: Partial<EnReparacionType>) => {
  try {
    const response = await api.put<apiResponse<EnReparacionGetType>>(`${API_ENREPARACION}/${id}`, payload);
    if (!response.data.data) throw new Error("DATA_NOT_FOUND");
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


export { getEnReparaciones, getEnReparacion, postEnReparacion, putEnReparacionSalida, putRepuestosReparacion, putEnReparacion };