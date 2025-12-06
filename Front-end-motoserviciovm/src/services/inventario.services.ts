import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { InventarioType } from "../types/inventarioType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_INVENTARIOS = API_URL + "inventarios";

const getInventarios = async (): Promise<InventarioType[]> => {
    try {
        const response = await api.get<apiResponse<InventarioType[]>>(API_INVENTARIOS);
        const items = response.data.data;

        if (!Array.isArray(items)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }

        return items;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }

            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                throw new Error(serverMessage);
            }
            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const getInventario = async (id: InventarioType["id"]): Promise<InventarioType> => {
    try {
        const response = await api.get<apiResponse<InventarioType>>(`${API_INVENTARIOS}/${id}`);
        const item = response.data.data;

        if (!item) {
            throw new Error("DATA_NOT_FOUND");
        }

        return item;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }

            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                throw new Error(serverMessage);
            }
            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const postInventario = async (data: InventarioType) => {
    try {
        const response = await api.post<apiResponse<InventarioType>>(API_INVENTARIOS, data);
        return response.data.data ?? "";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            }

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }
            const serverMessage = error.response?.data?.message;

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const putInventario = async (id: InventarioType["id"], data: Partial<InventarioType>) => {
    try {
        const response = await api.put<apiResponse<InventarioType>>(`${API_INVENTARIOS}/${id}`, data);
        return response.data.data ?? "";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            }

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }
            const serverMessage = error.response?.data?.message;

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const deleteInventario = async (id: InventarioType["id"] | undefined) => {
    try {
        const response = await api.delete<apiResponse<InventarioType>>(`${API_INVENTARIOS}/${id}`);
        return response.data.data ?? "";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            }

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }
            const serverMessage = error.response?.data?.message;

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

export { getInventarios, getInventario, postInventario, putInventario, deleteInventario };
