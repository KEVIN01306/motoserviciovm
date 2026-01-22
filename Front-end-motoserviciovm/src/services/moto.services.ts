import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { motoGetType, motoType } from "../types/motoType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_MOTOS = API_URL + "motos";

const getMotos = async (): Promise<motoGetType[]> => {
    try {
        const response = await api.get<apiResponse<motoGetType[]>>(API_MOTOS);
        const motos = response.data.data;

        if (!Array.isArray(motos)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }

        return motos;
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

const getMoto = async (id: motoType["id"]): Promise<motoGetType> => {
    try {
        const response = await api.get<apiResponse<motoGetType>>(`${API_MOTOS}/${id}`);
        const moto = response.data.data;

        if (!moto) {
            throw new Error("DATA_NOT_FOUND");
        }

        return moto;
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

const postMoto = async (moto: motoType) => {
    try {

        // If avatar or calcomania is a File (user changed image/pdf), send multipart/form-data
        if ((moto as any).avatar instanceof File || (moto as any).calcomania instanceof File) {
            const form = new FormData();
            Object.entries(moto as any).forEach(([k, v]) => {
                if (v === undefined || v === null) return;
                if ((k === 'avatar' || k === 'calcomania') && v instanceof File) {
                    form.append(k, v);
                    return;
                }
                if (Array.isArray(v) || typeof v === 'object') {
                    form.append(k, JSON.stringify(v));
                } else {
                    form.append(k, String(v));
                }
            });
            const response = await api.post<apiResponse<any>>(API_MOTOS, form, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data.data ?? "";
        }

        const response = await api.post<apiResponse<any>>(API_MOTOS, moto);
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

const putMoto = async (id: motoType["id"], moto: motoType) => {
    console.log(moto);
    try {

        // If avatar or calcomania is a File (user changed image/pdf), send multipart/form-data
        if ((moto as any).avatar instanceof File || (moto as any).calcomania instanceof File) {
            const form = new FormData();
            Object.entries(moto as any).forEach(([k, v]) => {
                if (v === undefined || v === null) return;
                if ((k === 'avatar' || k === 'calcomania') && v instanceof File) {
                    form.append(k, v);
                    return;
                }
                if (Array.isArray(v) || typeof v === 'object') {
                    form.append(k, JSON.stringify(v));
                } else {
                    form.append(k, String(v));
                }
            });
            const response = await api.put<apiResponse<any>>(`${API_MOTOS}/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data.data ?? "";
        }

        const response = await api.put<apiResponse<any>>(`${API_MOTOS}/${id}`, moto);
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

const deleteMoto = async (id: motoType["id"]) => {
    try {
        const response = await api.delete<apiResponse<any>>(`${API_MOTOS}/${id}`);
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

const getMotoByPlaca = async (placa: string): Promise<motoGetType> => {
    try {
        const response = await api.get<apiResponse<motoGetType>>(`${API_MOTOS}/placa/${encodeURIComponent(placa)}`);
        const moto = response.data.data;

        if (!moto) {
            throw new Error("DATA_NOT_FOUND");
        }

        return moto;
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

export { getMotos, getMoto, getMotoByPlaca, postMoto, putMoto, deleteMoto };
