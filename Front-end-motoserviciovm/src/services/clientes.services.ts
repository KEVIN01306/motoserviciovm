import axios from "axios";
import { api } from "../axios/axios";
import type { apiResponse } from "../types/apiResponse";
import type { UserGetType } from "../types/userType";

const API_URL = import.meta.env.VITE_DOMAIN;
const API_CLIENTES = API_URL + "clientes";

const getClienteByDocumento = async (documento: string): Promise<UserGetType> => {
  try {
    const response = await api.get<apiResponse<UserGetType>>(`${API_CLIENTES}/${documento}`);
    const cliente = response.data.data;
    if (!cliente) throw new Error("DATA_NOT_FOUND");
    return cliente;
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

export { getClienteByDocumento };