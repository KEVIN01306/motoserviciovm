import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { PermisoType } from "../types/permisoType";

const API_URL = import.meta.env.VITE_DOMAIN
const API_PERMISOS = API_URL + "permisos"

const getPermisos = async (): Promise<PermisoType[]> => {
    try {
        const response = await api.get<apiResponse<PermisoType[]>>(API_PERMISOS)
        const permisos = response.data.data
        if (!Array.isArray(permisos)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }
        return permisos;
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

export {
    getPermisos
}
