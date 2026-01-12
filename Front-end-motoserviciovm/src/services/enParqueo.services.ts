import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { EnParqueoType, EnParqueoGetType } from "../types/enParqueoType";


const API_URL = import.meta.env.VITE_DOMAIN;
const API_ENPARQUEO = API_URL + "enParqueo";

const getEnParqueos = async (): Promise<EnParqueoGetType[]> => {
  try {
    const response = await api.get<apiResponse<EnParqueoGetType[]>>(API_ENPARQUEO);
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

const getEnParqueo = async (id: EnParqueoType["id"]): Promise<EnParqueoGetType> => {
  try {
    const response = await api.get<apiResponse<EnParqueoGetType>>(`${API_ENPARQUEO}/${id}`);
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

const postEnParqueo = async (payload: EnParqueoType) => {
  try {
    const response = await api.post<apiResponse<EnParqueoGetType>>(API_ENPARQUEO, payload);
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

const putEnParqueoSalida = async (id: EnParqueoType["id"], payload: Partial<EnParqueoType>) => {
  try {
    let dataToSend: any = payload;
    console.log("Payload before submission:", payload);
    let config = {};
    if (payload.firmaSalida) {
      const formData = new FormData();
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
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== "firmaSalida" && value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      dataToSend = formData;
      config = { headers: { "Content-Type": "multipart/form-data" } };
    }
    const response = await api.put<apiResponse<EnParqueoGetType>>(
      `${API_ENPARQUEO}/salida/${id}`,
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

export { getEnParqueos, getEnParqueo, postEnParqueo, putEnParqueoSalida };