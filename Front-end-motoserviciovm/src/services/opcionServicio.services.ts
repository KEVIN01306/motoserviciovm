import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { OpcionServicioType } from "../types/opcionServicioType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_OPCIONES = API_URL + "opcionservicio";

const getOpciones = async (): Promise<OpcionServicioType[]> => {
    try {
        const response = await api.get<apiResponse<OpcionServicioType[]>>(API_OPCIONES);
        const opciones = response.data.data;
        if (!Array.isArray(opciones)) throw new Error("INVALID_API_RESPONSE_FORMAT");
        return opciones;
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

const getOpcion = async (id: OpcionServicioType["id"]): Promise<OpcionServicioType> => {
    try {
        const response = await api.get<apiResponse<OpcionServicioType>>(`${API_OPCIONES}/${id}`);
        const opcion = response.data.data;
        if (!opcion) throw new Error("DATA_NOT_FOUND");
        return opcion;
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

const postOpcion = async (opcion: OpcionServicioType) => {
    try {
        const response = await api.post<apiResponse<OpcionServicioType>>(API_OPCIONES, opcion);
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

const putOpcion = async (id: OpcionServicioType["id"], opcion: Partial<OpcionServicioType>) => {
    try {
        const response = await api.put<apiResponse<OpcionServicioType>>(`${API_OPCIONES}/${id}`, opcion);
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

const deleteOpcion = async (id: OpcionServicioType["id"]) => {
    try {
        const response = await api.delete<apiResponse<OpcionServicioType>>(`${API_OPCIONES}/${id}`);
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

export { getOpciones, getOpcion, postOpcion, putOpcion, deleteOpcion };
