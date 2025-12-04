import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { CategoriaProductoType } from "../types/categoriaProductoType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_CATEGORIAS = API_URL + "categoriasproducto";

const getCategorias = async (): Promise<CategoriaProductoType[]> => {
    try {
        const response = await api.get<apiResponse<CategoriaProductoType[]>>(API_CATEGORIAS);
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

const getCategoria = async (id: CategoriaProductoType["id"]): Promise<CategoriaProductoType> => {
    try {
        const response = await api.get<apiResponse<CategoriaProductoType>>(`${API_CATEGORIAS}/${id}`);
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

const postCategoria = async (categoria: CategoriaProductoType) => {
    try {
        const response = await api.post<apiResponse<CategoriaProductoType>>(API_CATEGORIAS, categoria);
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

const putCategoria = async (id: CategoriaProductoType["id"], categoria: Partial<CategoriaProductoType>) => {
    try {
        const response = await api.put<apiResponse<CategoriaProductoType>>(`${API_CATEGORIAS}/${id}`, categoria);
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

const deleteCategoria = async (id: CategoriaProductoType["id"] | undefined) => {
    try {
        const response = await api.delete<apiResponse<CategoriaProductoType>>(`${API_CATEGORIAS}/${id}`);
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

export { getCategorias, getCategoria, postCategoria, putCategoria, deleteCategoria };
