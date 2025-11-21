import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { LineaType } from "../types/lineaType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_LINEAS = API_URL + "lineas";

const getLineas = async (): Promise<LineaType[]> => {
    try {
        const response = await api.get<apiResponse<LineaType[]>>(API_LINEAS);
        const lineas = response.data.data;

        if (!Array.isArray(lineas)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }

        return lineas;
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

const getLinea = async (id: LineaType["id"]): Promise<LineaType> => {
    try {
        const response = await api.get<apiResponse<LineaType>>(`${API_LINEAS}/${id}`);
        const linea = response.data.data;

        if (!linea) {
            throw new Error("DATA_NOT_FOUND");
        }

        return linea;
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

const postLinea = async (linea: LineaType) => {
    try {
        const response = await api.post<apiResponse<LineaType>>(API_LINEAS, linea);
        return response.data.data?.linea ?? "";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            }

            if (status === 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }

            const serverMessage = error.response?.data?.message;

            if (status === 400 && serverMessage === "CONFLICT") {
                throw new Error("ALREADY EXISTS THIS LINEA");
            }

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const putLinea = async (id: LineaType["id"], linea: LineaType) => {
    try {
        const response = await api.put<apiResponse<LineaType>>(`${API_LINEAS}/${id}`, linea);
        return response.data.data?.linea ?? "";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            }

            if (status === 500) {
                throw new Error("INTERNAL ERROR SERVER");
            }

            const serverMessage = error.response?.data?.message;

            if (status === 400 && serverMessage === "CONFLICT") {
                throw new Error("ALREADY EXISTS THIS LINEA");
            }

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const deleteLinea = async (id: LineaType["id"]) => {
    try {
        const response = await api.delete<apiResponse<LineaType>>(`${API_LINEAS}/${id}`);
        return response.data.data?.linea ?? "";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER");
            }

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

export { getLineas, getLinea, postLinea, putLinea, deleteLinea };

