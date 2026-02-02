import axios from 'axios';
import { api } from "../axios/axios";
import type { apiResponse } from '../types/apiResponse';
import type { ContactoType } from '../types/contactoType';

const API_URL = `${import.meta.env.VITE_DOMAIN}contactos`;

export const getContactos = async (): Promise<ContactoType[]> => {
  try {
    const response = await axios.get<apiResponse<ContactoType[]>>(`${API_URL}`);
    return response.data?.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching contacto:', error.response?.data);
    }
    throw error;
  }
};

export const postContacto = async (contacto: ContactoType): Promise<ContactoType> => {
  try {
    const response = await api.post<apiResponse<ContactoType>>(`${API_URL}/`, contacto);
    return response.data?.data || contacto;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating contacto:', error.response?.data);
    }
    throw error;
  }
};

export const putContacto = async (id: number, contacto: ContactoType): Promise<ContactoType> => {
  try {
    const response = await api.put<apiResponse<ContactoType>>(`${API_URL}/${id}`, contacto);
    return response.data?.data || contacto;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating contacto:', error.response?.data);
    }
    throw error;
  }
};

export const deleteContacto = async (id: number): Promise<void> => {
  try {
    await api.delete<apiResponse<void>>(`${API_URL}/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting contacto:', error.response?.data);
    }
    throw error;
  }
};
