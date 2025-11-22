import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { CilindradaType } from "../types/cilindradaType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_CILINDRADAS = API_URL + "cilindradas";

const getCilindradas = async (): Promise<CilindradaType[]> => {
    try {
        const response = await api.get<apiResponse<CilindradaType[]>>(API_CILINDRADAS);
        const cilindradas = response.data.data;
        if (!Array.isArray(cilindradas)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }
        return cilindradas;
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

const getCilindrada = async (id: CilindradaType["id"]): Promise<CilindradaType> => {
    try {
        const response = await api.get<apiResponse<CilindradaType>>(`${API_CILINDRADAS}/${id}`);
        const cilindrada = response.data.data;
        if (!cilindrada) throw new Error("DATA_NOT_FOUND");
        return cilindrada;
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

const postCilindrada = async (cilindrada: CilindradaType) => {
    try {
        const response = await api.post<apiResponse<CilindradaType>>(API_CILINDRADAS, cilindrada);
        return response.data.data?.cilindrada;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            if (status === 500) throw new Error("INTERNAL ERROR SERVER");
            const serverMessage = error.response?.data?.message;
            if (status === 400 && serverMessage === "CONFLICT") throw new Error("ALREADY EXISTS THIS CILINDRADA");
            if (serverMessage) throw new Error(serverMessage);
            throw new Error("CONNECTION ERROR");
        }
        throw new Error((error as Error).message);
    }
};

const putCilindrada = async (id: CilindradaType["id"], cilindrada: CilindradaType) => {
    try {
        const response = await api.put<apiResponse<CilindradaType>>(`${API_CILINDRADAS}/${id}`, cilindrada);
        return String(response.data.data?.cilindrada);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 404) throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            if (status === 500) throw new Error("INTERNAL ERROR SERVER");
            const serverMessage = error.response?.data?.message;
            if (status === 400 && serverMessage === "CONFLICT") throw new Error("ALREADY EXISTS THIS CILINDRADA");
            if (serverMessage) throw new Error(serverMessage);
            throw new Error("CONNECTION ERROR");
        }
        throw new Error((error as Error).message);
    }
};

const deleteCilindrada = async (id: CilindradaType["id"]) => {
    try {
        const response = await api.delete<apiResponse<CilindradaType>>(`${API_CILINDRADAS}/${id}`);
        return response.data.data?.cilindrada;
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

export { getCilindradas, getCilindrada, postCilindrada, putCilindrada, deleteCilindrada };
