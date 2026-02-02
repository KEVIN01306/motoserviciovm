import axios from 'axios';
import { api } from "../axios/axios";
import type { apiResponse } from '../types/apiResponse';
import type { TextoType } from '../types/textoType';

const API_URL = `${import.meta.env.VITE_DOMAIN}textos`;

export const getTextos = async (): Promise<TextoType[]> => {
  try {
    const response = await axios.get<apiResponse<TextoType[]>>(`${API_URL}`);
    return response.data?.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching textos:', error.response?.data);
    }
    throw error;
  }
};

export const postTexto = async (texto: TextoType): Promise<TextoType> => {
  try {
    const response = await api.post<apiResponse<TextoType>>(`${API_URL}/`, texto);
    return response.data?.data || texto;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating texto:', error.response?.data);
    }
    throw error;
  }
};

export const putTexto = async (id: number, texto: TextoType): Promise<TextoType> => {
  try {
    const response = await api.put<apiResponse<TextoType>>(`${API_URL}/${id}`, texto);
    return response.data?.data || texto;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating texto:', error.response?.data);
    }
    throw error;
  }
};

export const deleteTexto = async (id: number): Promise<void> => {
  try {
    await api.delete<apiResponse<void>>(`${API_URL}/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting texto:', error.response?.data);
    }
    throw error;
  }
};
