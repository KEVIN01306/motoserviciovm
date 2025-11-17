import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { RolGetType, RolType } from "../types/rolType";
const API_URL = import.meta.env.VITE_DOMAIN
const API_ROLES = API_URL + "roles"

const getRoles = async (): Promise<RolGetType[]> => {
    try {
        const response = await api.get<apiResponse<RolGetType[]>>(API_ROLES)
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

const postRol = async (rol: RolType) => {
    try {
        const response = await api.post<apiResponse<RolType>>(API_ROLES, rol)
        return response.data.data?.rol
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
                throw new Error("AL READY EXIST THIS ROL")
            }

            if (serverMessage) {
                throw new Error(serverMessage)
            }

            throw new Error("CONNECTION ERROR")

        }

        throw new Error((error as Error).message)

    }
}

const getRol = async (id: RolType['id']): Promise<RolGetType> => {
    try {
        const response = await api.get<apiResponse<RolGetType>>(API_ROLES + "/" + id)
        const rol = response.data.data

        if (!rol) {
            throw new Error("DATA_NOT_FOUND")
        }

        console.log(rol)

        return rol;

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

const putRol = async (id: RolType['id'], rol: RolType) => {
    try {

        const response = await api.put<apiResponse<RolType>>(API_ROLES + "/" + id, rol)

        return String(response.data.data?.rol)

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
                throw new Error("AL READY EXIST THIS ROL")
            }

            if (serverMessage) {
                throw new Error(serverMessage)
            }

            throw new Error("CONNECTION ERROR")

        }

        throw new Error((error as Error).message)

    }
}

export {
    getRoles,
    postRol,
    getRol,
    putRol
}