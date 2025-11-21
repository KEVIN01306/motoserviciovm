import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { MarcaType } from "../types/marcaType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_MARCAS = API_URL + "marcas";

const getMarcas = async (): Promise<MarcaType[]> => {
    try {
        const response = await api.get<apiResponse<MarcaType[]>>(API_MARCAS);
        const marcas = response.data.data;

        if (!Array.isArray(marcas)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }

        return marcas;
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

const getMarca = async (id: MarcaType["id"]): Promise<MarcaType> => {
    try {
        const response = await api.get<apiResponse<MarcaType>>(`${API_MARCAS}/${id}`);
        const marca = response.data.data;

        if (!marca) {
            throw new Error("DATA_NOT_FOUND");
        }

        return marca;
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

const postMarca = async (marca: MarcaType) => {
    try {
        const response = await api.post<apiResponse<MarcaType>>(API_MARCAS, marca);
        return response.data.data?.marca ?? "";
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
                throw new Error("ALREADY EXISTS THIS MARCA");
            }

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const putMarca = async (id: MarcaType["id"], marca: MarcaType) => {
    try {
        const response = await api.put<apiResponse<MarcaType>>(`${API_MARCAS}/${id}`, marca);
        return response.data.data?.marca ?? "";
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
                throw new Error("ALREADY EXISTS THIS MARCA");
            }

            if (serverMessage) {
                throw new Error(serverMessage);
            }

            throw new Error("CONNECTION ERROR");
        }

        throw new Error((error as Error).message);
    }
};

const deleteMarca = async (id: MarcaType["id"]) => {
    try {
        const response = await api.delete<apiResponse<MarcaType>>(`${API_MARCAS}/${id}`);
        return response.data.data?.marca ?? "";
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

export { getMarcas, getMarca, postMarca, putMarca, deleteMarca };

