import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { repuestoReparacionType } from "../types/repuestoReparacionType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_REPUESTO = API_URL + "repuestosReparacion";

const getRepuestosByReparacion = async (reparacionId: number): Promise<repuestoReparacionType[]> => {
  try {
    const response = await api.get<apiResponse<repuestoReparacionType[]>>(`${API_REPUESTO}?reparacionId=${reparacionId}`);
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

const postRepuestoReparacion = async (payload: repuestoReparacionType) => {
  try {
    // If imagen is a File, send multipart/form-data
    if ((payload as any).imagen instanceof File) {
      const form = new FormData();
      Object.entries(payload as any).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (k === "imagen" && v instanceof File) {
          form.append("imagen", v);
          return;
        }
        if (Array.isArray(v) || typeof v === "object") {
          form.append(k, JSON.stringify(v));
        } else {
          form.append(k, String(v));
        }
      });

      console.log("Posting repuestoReparacion with form data:", form);

      const response = await api.post<apiResponse<repuestoReparacionType>>(API_REPUESTO, form, { headers: { "Content-Type": "multipart/form-data" } });
      return response.data.data ?? "";
    }

    const response = await api.post<apiResponse<repuestoReparacionType>>(API_REPUESTO, payload);
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

const putRepuestoReparacion = async (id: repuestoReparacionType["id"], payload: repuestoReparacionType) => {
  try {
    if ((payload as any).imagen instanceof File) {
      const form = new FormData();
      Object.entries(payload as any).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (k === "imagen" && v instanceof File) {
          form.append("imagen", v);
          return;
        }
        if (Array.isArray(v) || typeof v === "object") {
          form.append(k, JSON.stringify(v));
        } else {
          form.append(k, String(v));
        }
      });

      const response = await api.put<apiResponse<repuestoReparacionType>>(`${API_REPUESTO}/${id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      return response.data.data ?? "";
    }

    const response = await api.put<apiResponse<repuestoReparacionType>>(`${API_REPUESTO}/${id}`, payload);
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

const deleteRepuestoReparacion = async (id: repuestoReparacionType["id"]) => {
  try {
    const response = await api.delete<apiResponse<null>>(`${API_REPUESTO}/${id}`);
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

const setCheckedRepuestoReparacion = async (id: repuestoReparacionType["id"], checked: boolean) => {
  try {
    const response = await api.patch<apiResponse<repuestoReparacionType>>(`${API_REPUESTO}/${id}/checked`, { checked });
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

export { getRepuestosByReparacion, postRepuestoReparacion, putRepuestoReparacion, deleteRepuestoReparacion, setCheckedRepuestoReparacion };
