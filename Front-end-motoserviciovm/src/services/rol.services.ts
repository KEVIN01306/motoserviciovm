import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { RolType } from "../types/rolType";
const API_URL = import.meta.env.VITE_DOMAIN
const API_ROLES = API_URL + "roles"

const getRoles = async (): Promise<RolType[]> => {
    try {
        const response = await api.get<apiResponse<RolType[]>>(API_ROLES)
        const roles = response.data.data
        if (!Array.isArray(roles)) {
            throw new Error("INVALID_API_RESPONSE_FORMAT");
        }
        return roles;
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
    getRoles
}