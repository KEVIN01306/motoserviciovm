import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { TipoServicioType, TipoServicioGetType } from "../types/tipoServicioType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_TIPOS = API_URL + "tiposervicio";

const getTipos = async (): Promise<TipoServicioGetType[]> => {
    try {
        const response = await api.get<apiResponse<TipoServicioGetType[]>>(API_TIPOS);
        const items = response.data.data;
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

const getTipo = async (id: TipoServicioType["id"]): Promise<TipoServicioGetType> => {
    try {
        const response = await api.get<apiResponse<TipoServicioGetType>>(`${API_TIPOS}/${id}`);
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

const postTipo = async (tipo: TipoServicioType) => {
    try {
        const response = await api.post<apiResponse<TipoServicioType>>(API_TIPOS, tipo);
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

const putTipo = async (id: TipoServicioType["id"], tipo: Partial<TipoServicioType>) => {
    try {
        const response = await api.put<apiResponse<TipoServicioType>>(`${API_TIPOS}/${id}`, tipo);
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

const deleteTipo = async (id: TipoServicioType["id"] | undefined) => {
    try {
        const response = await api.delete<apiResponse<TipoServicioType>>(`${API_TIPOS}/${id}`);
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

export { getTipos, getTipo, postTipo, putTipo, deleteTipo };
