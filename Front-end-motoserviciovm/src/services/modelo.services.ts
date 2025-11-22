import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { modeloGetType, modeloType } from "../types/modeloType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_MODELOS = API_URL + "modelos";

const getModelos = async (): Promise<modeloGetType[]> => {
    try {
        const response = await api.get<apiResponse<modeloGetType[]>>(API_MODELOS);
        const modelos = response.data.data;

        if (!Array.isArray(modelos)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }

        return modelos;
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

const getModelo = async (id: modeloType["id"]): Promise<modeloGetType> => {
    try {
        const response = await api.get<apiResponse<modeloGetType>>(`${API_MODELOS}/${id}`);
        const modelo = response.data.data;

        if (!modelo) {
            throw new Error("DATA_NOT_FOUND");
        }

        return modelo;
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

const postModelo = async (modelo: modeloType) => {
    try {
        const response = await api.post<apiResponse<any>>(API_MODELOS, modelo);
        return response.data.data?.modelo ?? "";
    } catch (error) {
        console.log(error);
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

const putModelo = async (id: modeloType["id"], modelo: modeloType) => {
    try {
        const response = await api.put<apiResponse<any>>(`${API_MODELOS}/${id}`, modelo);
        return response.data.data?.modelo ?? "";
    } catch (error) {
        console.log(error);
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

const deleteModelo = async (id: modeloType["id"]) => {
    try {
        const response = await api.delete<apiResponse<any>>(`${API_MODELOS}/${id}`);
        return response.data.data?.modelo ?? "";
    } catch (error) {
        console.log(error);
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

export { getModelos, getModelo, postModelo, putModelo, deleteModelo };
