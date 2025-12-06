import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { ProductoGetType, ProductoType } from "../types/productoType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_PRODUCTOS = API_URL + "productos";

const getProductos = async (): Promise<ProductoGetType[]> => {
    try {
        const response = await api.get<apiResponse<ProductoGetType[]>>(API_PRODUCTOS);
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

const getProducto = async (id: ProductoType["id"]): Promise<ProductoGetType> => {
    try {
        const response = await api.get<apiResponse<ProductoGetType>>(`${API_PRODUCTOS}/${id}`);
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

const postProducto = async (producto: ProductoType) => {
    try {
        // If imagen is a File (user changed image), send multipart/form-data
        if ((producto as any).imagen instanceof File) {
            const form = new FormData();
            Object.entries(producto as any).forEach(([k, v]) => {
                if (v === undefined || v === null) return;
                if (k === 'imagen' && v instanceof File) {
                    form.append('imagen', v);
                    return;
                }
                if (Array.isArray(v) || typeof v === 'object') {
                    form.append(k, JSON.stringify(v));
                } else {
                    form.append(k, String(v));
                }
            });

            const response = await api.post<apiResponse<any>>(API_PRODUCTOS, form, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data.data ?? "";
        }

        const response = await api.post<apiResponse<any>>(API_PRODUCTOS, producto);
        return response.data.data ?? "";
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

const putProducto = async (id: ProductoType["id"], producto: ProductoType) => {
    try {
        // If imagen is a File (user changed image), send multipart/form-data
        if ((producto as any).imagen instanceof File) {
            const form = new FormData();
            Object.entries(producto as any).forEach(([k, v]) => {
                if (v === undefined || v === null) return;
                if (k === 'imagen' && v instanceof File) {
                    form.append('imagen', v);
                    return;
                }
                if (Array.isArray(v) || typeof v === 'object') {
                    form.append(k, JSON.stringify(v));
                } else {
                    form.append(k, String(v));
                }
            });

            const response = await api.put<apiResponse<any>>(`${API_PRODUCTOS}/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data.data ?? "";
        }

        const response = await api.put<apiResponse<any>>(`${API_PRODUCTOS}/${id}`, producto);
        return response.data.data ?? "";
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

const deleteProducto = async (id: ProductoType["id"] | undefined) => {
    try {
        const response = await api.delete<apiResponse<ProductoType>>(`${API_PRODUCTOS}/${id}`);
        return response.data.data ?? "";
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

export { getProductos, getProducto, postProducto, putProducto, deleteProducto };
