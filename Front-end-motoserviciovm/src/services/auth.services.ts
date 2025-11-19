import axios from "axios";
import type { AuthResponse, AuthType } from "../types/authType";
import type { apiResponse } from "../types/apiResponse";
import { api } from "../axios/axios";

const API_URL = import.meta.env.VITE_DOMAIN
const API_AUTH = API_URL + "auth"

const postLogin = async (auth: AuthType): Promise<AuthResponse> => {
    try {
        const response = await axios.post<apiResponse<AuthResponse>>(API_AUTH, auth)

        if (!response.data.data) {
            throw new Error("INVALID RESPONSE FROM THE API");
        }
        const { user, token } = response.data.data

        return { user, token }

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


            if (status == 400 && serverMessage == "AUTH_ERROR") {
                throw new Error("THE EMAIL OR PASSWORD NOT IS CORRECT ")
            }

            if (status == 423) {
                throw new Error("TU USUARIO ESTA BLOQUEADO")
            }

            if (serverMessage) {
                throw new Error(serverMessage)
            }

            throw new Error("CONNECTION ERROR")

        }

        throw new Error((error as Error).message)

    }
}

const getMe = async () => {
    try {
        const response = await api.get<apiResponse<{ user: AuthResponse['user'] }>>(API_AUTH + "/me")

        if (!response.data.data || !response.data.data.user) {
            throw new Error("INVALID RESPONSE FROM THE API");
        }

        const user = response.data.data.user
        
        return { user, token: null }
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

            if (status == 400 && serverMessage == "AUTH_ERROR") {
                throw new Error("TU CONTRASEÑA O USUARIO SON INCORRECTOS")
            }

            if (status == 423) {
                throw new Error("TU USUARIO SE HA BLOQUEADO")
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
    postLogin,
    getMe
}