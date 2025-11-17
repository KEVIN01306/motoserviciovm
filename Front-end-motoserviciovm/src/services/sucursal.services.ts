import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { SucursalType } from "../types/sucursalType";

const API_URL = import.meta.env.VITE_DOMAIN
const API_SUCURSALES = API_URL + "sucursales"

const getSucursales = async (): Promise<SucursalType[]> => {
    try {
        const response = await api.get<apiResponse<SucursalType[]>>(API_SUCURSALES)
        const sucursales = response.data.data
        if (!Array.isArray(sucursales)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }
        return sucursales;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER")
            }

            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                throw new Error(serverMessage)
            }
            throw new Error("CONNECTION ERROR")
        }

        throw new Error((error as Error).message)
    }
}

const postSucursal = async (sucursal: SucursalType) => {
    try {
        const response = await api.post<apiResponse<SucursalType>>(API_SUCURSALES, sucursal)
        return String(response.data.data)
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER")
            }

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER")
            }
            const serverMessage = error.response?.data?.message;

            if (status == 400 && serverMessage == "CONFLICT") {
                throw new Error("AL READY EXIST THIS SUCURSAL")
            }

            if (serverMessage) {
                throw new Error(serverMessage)
            }

            throw new Error("CONNECTION ERROR")
        }

        throw new Error((error as Error).message)
    }
}

const getSucursal = async (id: SucursalType['id']): Promise<SucursalType> => {
    try {
        const response = await api.get<apiResponse<SucursalType>>(API_SUCURSALES + "/" + id)
        const sucursal = response.data.data

        if (!sucursal) {
            throw new Error("DATA_NOT_FOUND")
        }

        console.log(sucursal)

        return sucursal;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER")
            }

            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                throw new Error(serverMessage)
            }
            throw new Error("CONNECTION ERROR")
        }

        throw new Error((error as Error).message)
    }
}

const putSucursal = async (id: SucursalType['id'], sucursal: SucursalType) => {
    try {
        const response = await api.put<apiResponse<SucursalType>>(API_SUCURSALES + "/" + id, sucursal)
        return String(response.data.data)
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER")
            }

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER")
            }
            const serverMessage = error.response?.data?.message;

            if (status == 400 && serverMessage == "CONFLICT") {
                throw new Error("AL READY EXIST THIS SUCURSAL")
            }

            if (serverMessage) {
                throw new Error(serverMessage)
            }

            throw new Error("CONNECTION ERROR")
        }

        throw new Error((error as Error).message)
    }
}

const deleteSucursal = async (id: SucursalType['id']) => {
    try {
        const response = await api.delete<apiResponse<SucursalType>>(API_SUCURSALES + "/" + id)
        return String(response.data.data)
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                throw new Error("NOT FOUND API OR NOT EXISTED IN THE SERVER")
            }

            if (status == 500) {
                throw new Error("INTERNAL ERROR SERVER")
            }
            const serverMessage = error.response?.data?.message;

            if (serverMessage) {
                throw new Error(serverMessage)
            }

            throw new Error("CONNECTION ERROR")
        }

        throw new Error((error as Error).message)
    }
}

export {
    getSucursales,
    postSucursal,
    getSucursal,
    putSucursal,
    deleteSucursal
}
